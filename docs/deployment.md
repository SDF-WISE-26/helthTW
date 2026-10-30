# Deployment

Einrichtung und Betrieb der beiden HTW-VMs. Warum es so gebaut ist, steht in den Entscheidungen 0010 bis 0012 in [`decisions.md`](decisions.md).

## Überblick

```
GitHub: Release veröffentlicht (Rollback von Hand) → .github/workflows/deploy.yml
  ├─ ci      auf GitHubs Runnern: vp run ready, gitleaks
  └─ deploy  auf dem Runner der ops-vm (Label htw-ops):
             docker build → docker save | ssh prod deploy <sha> → Health-Check von außen

ops-vm   Nutzer github-runner: Runner-Dienst, Docker zum Bauen, SSH-Schlüssel nur für deploy.sh
prod-vm  Nutzer deploy, Ordner /srv/helthtw (compose.yml, deploy.sh, .env):
         web (Caddy, Port 80) → backend (Node) → postgres (Volume), migrate läuft vor jedem Start
```

- Der Runner verbindet sich selbst über den Proxy zu GitHub. Von außerhalb der HTW ist keine VM erreichbar, das ist gewollt.
- Ein Deploy dauert etwa 1,5 Minuten, davon rund 25 s auf der prod-vm. Die Seite ist dabei wenige Sekunden weg.
- Getestet mit Debian 13, Docker 29.9 und Compose 5.6 auf VMs mit 2 CPUs, 1,9 GB RAM und 15 GB Platte.

## Werte

Hostnamen und Netze stehen nicht im Repo, weil es öffentlich ist. In den Befehlen unten stehen dafür Platzhalter:

| Platzhalter                 | Was                                                      | Woher                                          |
| --------------------------- | -------------------------------------------------------- | ---------------------------------------------- |
| `<admin>`                   | eigener Nutzer mit sudo auf beiden VMs                   | HTW-IT                                         |
| `<prod-host>`, `<ops-host>` | Hostnamen der VMs                                        | HTW-IT                                         |
| `<prod-ip>`, `<ops-ip>`     | IPv4-Adresse der VM                                      | `hostname -I` auf der VM, erste Adresse        |
| `<proxy>`                   | HTW-Webproxy als `http://<host>:<port>`                  | `/etc/environment` auf der VM                  |
| `<htw-netze>`               | Netze, aus denen HTW SSH erlaubt, z. B. `{ a/16, b/16 }` | SSH-Regel in der `input`-Chain, siehe unten    |
| `<proxy-netz>`              | Netz des Proxys                                          | Regel mit `dport 3128` in der `OUTPUT`-Chain   |
| `<dns-netze>`               | Netze der DNS-Server                                     | Regel mit `udp dport 53` in der `OUTPUT`-Chain |

Die Chains stehen in HTWs `/etc/nftables.conf` auf jeder VM: `sudo cat /etc/nftables.conf`.

## Betrieb

### Deploy und Rollback

- Deployt wird nur ein Release: Releases → Draft a new release. Unter „Choose a tag“ die nächste Version als neuen Tag eintippen, z. B. `v0.2.0` (Schema in Entscheidung 0012), Target `main`, „Generate release notes“, Publish release. Die Notizen listen die PRs seit dem letzten Release mit ihrem Titel. Im Terminal: `gh release create v0.2.0 --target main --generate-notes`.
- Ein Pre-Release deployt nicht. Zeigt das Release auf einen Commit, der nicht auf `main` liegt, bricht der Deploy ab.
- Rollback: Actions → Deploy → Run workflow mit einem Commit-Hash. Der Workflow startet diese Version ohne Build. Sie muss eine der letzten 5 sein, die `status` zeigt.
- Ohne GitHub, auf der prod-vm: `sudo -u deploy -H /srv/helthtw/deploy.sh rollback <sha>`.
- Kommt eine neue Version nicht gesund hoch, startet `deploy.sh` die vorige und der Job wird rot.
- Ein Rollback holt nur den Code zurück, Migrationen bleiben. Was das für Migrationen heißt, steht in [`workflow.md`](workflow.md).

### Nachsehen

```bash
# ops-vm
sudo -iu github-runner ssh prod status           # laufende Version, letzte 5, Prüfsummen der installierten Dateien
systemctl status 'actions.runner.*' --no-pager   # Runner-Dienst
sudo -iu github-runner docker system df          # Build-Cache, die Pipeline begrenzt ihn auf 5 GB

# prod-vm
sudo docker ps --format '{{.Names}}: {{.Status}}'
sudo docker logs --tail 100 helthtw-prod-backend-1
sudo docker exec -it helthtw-prod-postgres-1 psql -U helthtw -d helthtw
# antwortet die Seite von außen nicht: von innen prüfen, am Netz vorbei
sudo docker exec helthtw-prod-web-1 wget -qO- -T 5 http://localhost:8080/api/alive_ping
```

### compose.yml oder deploy.sh geändert

Beim nächsten Release bricht der Deploy bei „Installed files match the repo“ ab. Neu installieren wie in [prod-vm, Schritt 3](#3-nutzer-deploy-und-srvhelthtw), mit dem Tag des Release als `<commit>`. Danach den Lauf unter Actions erneut starten.

- Vorher die alte Datei sichern: `sudo cp -a /srv/helthtw/compose.yml /srv/helthtw/compose.yml.alt`. Der automatische Rollback nutzt immer die installierte `compose.yml`. Ist die neue kaputt, hilft er nicht, nur die gesicherte.
- Ein Rollback auf ältere Images läuft mit der neuen `compose.yml`. Die muss also auch zu ihnen passen.

### .env und Passwort

- `POSTGRES_PASSWORD` wirkt nur beim ersten Anlegen des Volumes. Wer es später ändert, muss es vorher in Postgres ändern (`ALTER USER helthtw PASSWORD '…'`), sonst scheitern migrate und backend mit „password authentication failed“.
- Nach einer Änderung an `.env` erstellt der nächste Deploy den Postgres-Container neu. Das Backend verbindet sich danach selbst wieder.

### Updates

- `unattended-upgrades` spielt täglich Sicherheitsupdates von Debian ein und startet bei Bedarf um 04:00 neu. Container und Runner kommen von selbst wieder.
- Docker kommt aus Dockers eigenem Repository und wird nicht automatisch aktualisiert: ab und zu `sudo apt update && sudo apt upgrade`.
- Der Runner aktualisiert sich selbst.

## Einrichtung prod-vm

Alle Befehle als `<admin>`. Eine zweite SSH-Sitzung offen halten, solange an der Firewall gearbeitet wird.

### 1. Updates

```bash
apt-config dump | grep -i proxy   # HTW setzt nur Acquire::http::Proxy
echo 'Acquire::https::Proxy "<proxy>";' | sudo tee /etc/apt/apt.conf.d/95https-proxy
sudo apt update && sudo apt full-upgrade
sudo tee /etc/apt/apt.conf.d/52unattended-upgrades-local >/dev/null <<'EOF'
// Neu starten, wenn ein Update es braucht (z. B. neuer Kernel).
Unattended-Upgrade::Automatic-Reboot "true";
Unattended-Upgrade::Automatic-Reboot-Time "04:00";
EOF
apt-config dump | grep -E 'APT::Periodic::(Update-Package-Lists|Unattended-Upgrade) |Automatic-Reboot "'   # "1", "1", "true"
ls /var/run/reboot-required 2>/dev/null && sudo reboot
```

- Der https-Proxy ist nötig, weil HTW nur den für http setzt und Dockers Repository https nutzt. Die Variablen aus `/etc/environment` sieht apt bei automatischen Updates nicht.
- `debconf: unable to initialize frontend: Dialog` heißt nur, dass das Terminal für Dialogfenster zu klein war.

### 2. Docker

```bash
sudo apt install ca-certificates curl gnupg
sudo install -m 0755 -d /etc/apt/keyrings
curl -fsSL https://download.docker.com/linux/debian/gpg | sudo tee /etc/apt/keyrings/docker.asc >/dev/null
sudo chmod a+r /etc/apt/keyrings/docker.asc
gpg --show-keys /etc/apt/keyrings/docker.asc   # muss 9DC858229FC7DD38854AE2D88D81803C0EBFCD88 sein
sudo tee /etc/apt/sources.list.d/docker.sources >/dev/null <<EOF
Types: deb
URIs: https://download.docker.com/linux/debian
Suites: $(. /etc/os-release && echo "$VERSION_CODENAME")
Components: stable
Architectures: $(dpkg --print-architecture)
Signed-By: /etc/apt/keyrings/docker.asc
EOF
sudo apt update
sudo apt install docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin

# Der Docker-Dienst ignoriert die Proxy-Variablen der Shell. Log-Rotation gilt dann für jeden Container.
[ -e /etc/docker/daemon.json ] && echo "daemon.json gibt es schon, hier aufhören" || sudo tee /etc/docker/daemon.json >/dev/null <<'EOF'
{
  "proxies": {
    "http-proxy": "<proxy>",
    "https-proxy": "<proxy>",
    "no-proxy": "localhost,127.0.0.1"
  },
  "log-driver": "json-file",
  "log-opts": {
    "max-size": "10m",
    "max-file": "3"
  }
}
EOF
sudo dockerd --validate --config-file /etc/docker/daemon.json   # configuration OK
sudo systemctl restart docker
sudo docker pull postgres:17-alpine                             # prüft den Proxy
```

- `<admin>` kommt absichtlich nicht in die Gruppe `docker`, die ist praktisch root. Stattdessen `sudo docker`.
- `toomanyrequests` beim Pull ist das Limit von Docker Hub für anonyme Downloads. Die ganze HTW teilt sich die Adresse des Proxys, später noch einmal versuchen.

### 3. Nutzer deploy und /srv/helthtw

```bash
# bash als Shell: sshd startet den erzwungenen Befehl über die Login-Shell, mit nologin scheitert jeder Deploy
sudo adduser --disabled-password --comment "helthTW deploys" --shell /bin/bash deploy
sudo usermod -aG docker deploy

# deploy.sh und compose.yml von einem geprüften Commit holen und gegen Prüfsummen vergleichen.
# Prüfsummen auf dem eigenen Rechner im Repo: git show <commit>:deploy/deploy.sh | shasum -a 256 (ebenso compose.yml)
sudo install -d -o root -g root -m 755 /srv/helthtw
cd /tmp
c=<commit>
curl -fsSLO "https://raw.githubusercontent.com/SDF-WISE-26/helthTW/$c/deploy/deploy.sh"
curl -fsSLO "https://raw.githubusercontent.com/SDF-WISE-26/helthTW/$c/deploy/compose.yml"
printf '%s  %s\n' <prüfsumme-deploy.sh> deploy.sh <prüfsumme-compose.yml> compose.yml | sha256sum -c \
  && sudo install -o root -g root -m 755 deploy.sh /srv/helthtw/deploy.sh \
  && sudo install -o root -g root -m 644 compose.yml /srv/helthtw/compose.yml
rm -f deploy.sh compose.yml
cd

# .env erst mit den richtigen Rechten anlegen, dann befüllen. Hex, weil / + = die Datenbank-URL zerbrechen würden.
sudo install -o root -g deploy -m 640 /dev/null /srv/helthtw/.env
printf 'POSTGRES_PASSWORD=%s\n' "$(openssl rand -hex 32)" | sudo tee /srv/helthtw/.env >/dev/null

ls -la /srv/helthtw   # deploy.sh root:root 755, compose.yml root:root 644, .env root:deploy 640
sudo -u deploy -H /srv/helthtw/deploy.sh status
```

- Alles in `/srv/helthtw` gehört root. `deploy` darf die Dateien lesen und ausführen, aber nicht ändern.
- `deploy.sh` von Hand immer mit `sudo -u deploy -H` starten, damit die Versionsliste im Home von `deploy` landet.

### 4. Firewall

HTWs `/etc/nftables.conf` enthält `table inet firewall`. Darin erlaubt `input` nur SSH, Ping und den Nessus-Scanner aus dem HTW-Netz, `OUTPUT` nur Proxy, 80/443, DNS und NTP. `FORWARD` steht auf `policy drop` ohne Regeln und blockiert damit jeden Container. Außerdem beginnt die Datei mit `flush ruleset`, das bei jedem Neuladen auch die Regeln von Docker löscht.

```bash
sudo cp -a /etc/nftables.conf /etc/nftables.conf.orig
sudo cat /etc/nftables.conf > /tmp/nft.conf
sed -i 's/^flush ruleset$/table inet firewall\ndelete table inet firewall/' /tmp/nft.conf
sed -i 's/^# Flush existing rules$/# Nur diese Tabelle ersetzen, die von Docker bleiben/' /tmp/nft.conf
# in dieser Reihenfolge: jede Zeile landet direkt unter dem Kopf der Chain
sed -i '/hook forward/a\        ip saddr <htw-netze> ct status dnat accept' /tmp/nft.conf
sed -i '/hook forward/a\        iifname "br-*" oifname "br-*" accept' /tmp/nft.conf
sed -i '/hook forward/a\        ct state established,related accept' /tmp/nft.conf
sed -i '/hook forward/a\        # Docker: Antworten, Container untereinander, Ports aus dem HTW-Netz' /tmp/nft.conf
diff /etc/nftables.conf /tmp/nft.conf            # nur der Anfang und die 4 Zeilen unter hook forward
sudo nft -c -f /tmp/nft.conf && echo "syntax OK"

sudo cp /tmp/nft.conf /etc/nftables.conf
sudo systemctl reload nftables
sudo nft list tables                             # inet firewall und Dockers ip/ip6 nat/filter
```

Danach in einem neuen Terminal ein zweites Mal per SSH anmelden. Klappt das nicht, aus der offenen Sitzung zurück:
`sudo cp -a /etc/nftables.conf.orig /etc/nftables.conf && sudo systemctl reload nftables && sudo systemctl restart docker`

- Port 80 ist nur aus dem HTW-Netz erreichbar. Welche Ports es überhaupt gibt, legt `compose.yml` fest, das ist nur 80.
- Ab jetzt nftables nur noch mit `reload` neu laden, nie mit `restart` oder `stop`. Das Stoppen des Dienstes führt `nft flush ruleset` aus, danach braucht Docker ein `systemctl restart docker`.
- Von der prod-vm selbst geht `localhost:80` nicht, weil HTWs `OUTPUT` den Weg vom Host zum Container sperrt. Stattdessen im Container prüfen, siehe [Nachsehen](#nachsehen).

## Einrichtung ops-vm

Alle Befehle als `<admin>`, außer wo `sudo -iu github-runner` steht.

### 1. Updates und Swap

Erst [Schritt 1 der prod-vm](#1-updates). Dazu 2 GB Swap, weil Builds mit 1,9 GB RAM knapp sind:

```bash
findmnt -no FSTYPE /                   # ext4, dann braucht eine Swap-Datei nichts Besonderes
sudo fallocate -l 2G /swapfile
sudo chmod 600 /swapfile               # Swap kann alles enthalten, was im Speicher war
sudo mkswap /swapfile
sudo swapon /swapfile
echo '/swapfile none swap sw 0 0' | sudo tee -a /etc/fstab
sudo swapon --show                     # /swapfile 2G, auch nach einem Neustart
```

`swapon` liegt in `/usr/sbin` und fehlt im Suchpfad normaler Nutzer, deshalb immer mit `sudo`.

### 2. Docker und Firewall

Docker wie in [Schritt 2 der prod-vm](#2-docker), mit derselben `daemon.json`. Zum Testen `sudo docker pull debian:trixie-slim`, den Build braucht es ohnehin.

Die ops-vm veröffentlicht keine Ports. Nur die Build-Container (`docker build` lässt jeden Schritt auf `docker0` laufen) brauchen etwas: den Proxy und DNS, aber kein direktes Internet. Dazu kommt SSH nach außen, aber nur zur prod-vm.

```bash
sudo cp -a /etc/nftables.conf /etc/nftables.conf.orig
sudo cat /etc/nftables.conf > /tmp/nft.conf
sed -i 's/^flush ruleset$/table inet firewall\ndelete table inet firewall/' /tmp/nft.conf
sed -i 's/^# Flush existing rules$/# Nur diese Tabelle ersetzen, die von Docker bleiben/' /tmp/nft.conf
# in dieser Reihenfolge: jede Zeile landet direkt unter dem Kopf der Chain
sed -i '/hook forward/a\        iifname "docker0" ip daddr <dns-netze> udp dport 53 accept' /tmp/nft.conf
sed -i '/hook forward/a\        iifname "docker0" ip daddr <proxy-netz> tcp dport 3128 accept' /tmp/nft.conf
sed -i '/hook forward/a\        ct state established,related accept' /tmp/nft.conf
sed -i '/hook forward/a\        # Docker-Builds: Antworten, Proxy und DNS im HTW-Netz, sonst nichts' /tmp/nft.conf
sed -i '/hook output/a\        ip daddr <prod-ip> tcp dport 22 accept' /tmp/nft.conf
sed -i '/hook output/a\        # Deploys: SSH nur zur prod-vm' /tmp/nft.conf
diff /etc/nftables.conf /tmp/nft.conf            # der Anfang, 4 Zeilen unter hook forward, 2 unter hook output
sudo nft -c -f /tmp/nft.conf && echo "syntax OK"

sudo cp /tmp/nft.conf /etc/nftables.conf
sudo systemctl reload nftables
sudo nft list tables

# Tests: DNS, Downloads über den Proxy, kein direkter Weg, SSH zur prod-vm
sudo docker run --rm debian:trixie-slim getent hosts <proxy-host>
sudo docker run --rm -e http_proxy=<proxy> debian:trixie-slim sh -c 'apt-get update -qq && echo "Proxy erreichbar"'
sudo docker run --rm debian:trixie-slim timeout 5 bash -c 'echo > /dev/tcp/deb.debian.org/80' && echo "direkt: offen" || echo "direkt: gesperrt"
timeout 5 bash -c 'echo > /dev/tcp/<prod-host>/22' && echo "SSH: offen" || echo "SSH: gesperrt"
```

Danach ein zweites Mal anmelden wie bei der prod-vm, die Wiederherstellung geht genauso. Erwartet: die Adresse des Proxys, „Proxy erreichbar“, „direkt: gesperrt“, „SSH: offen“. `<proxy-host>` ist der Host aus `<proxy>`.

### 3. Nutzer github-runner

Ohne Passwort und ohne sudo. Die Gruppe `docker` ist praktisch root auf der ops-vm, das ist in Ordnung, weil die VM nichts anderes macht.

```bash
sudo adduser --disabled-password --comment "GitHub Actions runner" github-runner
sudo usermod -aG docker github-runner
sudo apt install git libicu76          # git für actions/checkout, ICU braucht der Runner (.NET)
ls -ld /home/github-runner             # drwx------, Debian 13 legt Homes so an

# Proxy für Builds: docker reicht ihn als Build-Argument an RUN-Schritte weiter, ins Image kommt er nicht
sudo -u github-runner mkdir -p -m 700 /home/github-runner/.docker
sudo -u github-runner tee /home/github-runner/.docker/config.json >/dev/null <<'EOF'
{
  "proxies": {
    "default": {
      "httpProxy": "<proxy>",
      "httpsProxy": "<proxy>",
      "noProxy": "localhost,127.0.0.1"
    }
  }
}
EOF
sudo -iu github-runner docker run --rm debian:trixie-slim sh -c 'env | grep -i proxy'   # 6 Zeilen, ohne sudo
```

Proxy gibt es damit auf drei Ebenen: apt (Schritt 1), der Docker-Dienst für Pulls (`daemon.json`) und die Builds (`config.json`).

### 4. SSH zur prod-vm

Der Schlüssel darf auf der prod-vm nur `deploy.sh` starten und nur von der ops-vm aus.

```bash
# ops-vm: Schlüssel ohne Passphrase, beim Job tippt sie niemand. Geschützt durch den Ordner (700) und die Grenzen auf der prod-vm.
sudo -u github-runner mkdir -p -m 700 /home/github-runner/.ssh
sudo -u github-runner ssh-keygen -t ed25519 -N "" -C "github-runner@<ops-host> deploy" -f /home/github-runner/.ssh/id_ed25519_deploy
sudo cat /home/github-runner/.ssh/id_ed25519_deploy.pub   # öffentlicher Schlüssel, für die prod-vm kopieren
ssh-keyscan -t ed25519 <prod-host> 2>/dev/null > /tmp/prod-hostkey
ssh-keygen -lf /tmp/prod-hostkey
```

```bash
# prod-vm: der Fingerabdruck muss genau dem von oben entsprechen, sonst aufhören
ssh-keygen -lf /etc/ssh/ssh_host_ed25519_key.pub
# authorized_keys gehört root, damit deploy keine eigenen Schlüssel ergänzen kann
sudo install -d -o root -g root -m 755 /home/deploy/.ssh
key='<die .pub-Zeile von der ops-vm>'
printf 'restrict,from="<ops-ip>",command="/srv/helthtw/deploy.sh" %s\n' "$key" | sudo tee /home/deploy/.ssh/authorized_keys >/dev/null
sudo chmod 644 /home/deploy/.ssh/authorized_keys
```

```bash
# ops-vm: Host-Schlüssel festschreiben und Alias "prod", damit der Hostname nicht im Workflow steht
sudo -u github-runner tee /home/github-runner/.ssh/known_hosts < /tmp/prod-hostkey >/dev/null
rm /tmp/prod-hostkey
sudo -u github-runner tee /home/github-runner/.ssh/config >/dev/null <<'EOF'
# Die prod-vm. Deren authorized_keys lässt diesen Schlüssel nur deploy.sh starten.
Host prod
  HostName <prod-host>
  User deploy
  IdentityFile ~/.ssh/id_ed25519_deploy
  IdentitiesOnly yes
  StrictHostKeyChecking yes
  BatchMode yes
  ConnectTimeout 10
EOF

sudo -iu github-runner ssh prod status         # Version, Liste, Prüfsummen
sudo -iu github-runner ssh prod bash           # deploy: usage: ... (keine Shell)
sudo -iu github-runner ssh prod 'status; id'   # deploy: usage: ... (das ; ist nur Text)
```

- `restrict` verbietet Shell, Terminal und Weiterleitungen. `from=` lässt den Schlüssel nur von der ops-vm zu. `command=` startet immer `deploy.sh`, der Wunsch des Aufrufers kommt nur als Text in `SSH_ORIGINAL_COMMAND` an.
- `BatchMode yes` lässt SSH nie nachfragen, ein Job wartet sonst ewig. Ändert sich der Host-Schlüssel der prod-vm, verweigert `StrictHostKeyChecking yes` die Verbindung.

### 5. GitHub und Runner

In GitHub unter Settings des Repos:

- Actions → General → „Approval for running fork pull request workflows from contributors“: **Require approval for all external contributors**. Sonst könnte ein Fork-PR einen eigenen Workflow auf unserem Runner starten.
- Environments → New environment **`production`**, „Deployment branches and tags“: Selected, Branch **`main`** (Rollback) und Tag **`v0.*.*`** (Releases, siehe Entscheidung 0012), keine Reviewer.
- Keine Variable für die URL anlegen: Die Logs öffentlicher Repos sind öffentlich, Variablen erscheinen darin im Klartext. Die URL steht in der `.env` des Runners.

Unter Actions → Runners → New self-hosted runner → Linux x64 stehen Download-Link, Prüfsumme und ein Token, das eine Stunde gilt.

```bash
sudo -iu github-runner
export https_proxy=<proxy>             # sudo -i lädt /etc/environment nicht
# die 4 Befehle aus „Download“ auf der GitHub-Seite: mkdir/cd actions-runner, curl, Prüfsumme (muss OK sagen), tar
read -rsp "Token: " token; echo        # nicht sichtbar, nicht in der History
./config.sh --unattended --url https://github.com/SDF-WISE-26/helthTW --token "$token" --name helthtw-ops --labels htw-ops
unset token
# config.sh hat .env schon angelegt, deshalb anhängen
cat >> .env <<'EOF'
http_proxy=<proxy>
https_proxy=<proxy>
no_proxy=localhost,127.0.0.1,.htw-berlin.de
PROD_URL=http://<prod-host>
EOF
exit

# als <admin>: svc.sh muss im Runner-Ordner laufen, in den <admin> nicht hineinkommt
sudo bash -c 'cd /home/github-runner/actions-runner && ./svc.sh install github-runner && ./svc.sh start'
ps -o user=,comm= -C Runner.Listener   # github-runner, nicht root
```

In GitHub steht der Runner danach auf **Idle**, mit den Labels `self-hosted`, `Linux`, `X64` und `htw-ops`.

## Erster Deploy und Abschluss

1. Ein Release anlegen wie unter [Deploy und Rollback](#deploy-und-rollback). Danach zeigt `http://<prod-host>` die Seite, „Ping API“ antwortet.
2. Beide VMs mit `sudo reboot` neu starten. Danach sind alle Container healthy, der Runner steht wieder auf Idle und `sudo nft list tables` zeigt alle fünf Tabellen.
3. Testdaten, falls gewünscht. In der Produktion gibt es keinen Seed, `db:seed` braucht die Dev-Werkzeuge und leert vorher die Tabelle.
   ```bash
   sudo docker exec helthtw-prod-postgres-1 psql -U helthtw -d helthtw -c "insert into users (name) values ('User1'), ('User2')"
   ```

Wird nur eine VM ersetzt, ändern sich deren Adresse und Schlüssel:

- Neue ops-vm: `from=` in `authorized_keys` der prod-vm anpassen. In GitHub den alten Runner unter Actions → Runners entfernen.
- Neue prod-vm: die `OUTPUT`-Regel der ops-vm, `known_hosts`, `~/.ssh/config` und `PROD_URL` in der `.env` des Runners anpassen. Danach `sudo systemctl restart 'actions.runner.*'`.

## Stolperfallen

- HTWs Netz verwirft Anfragen aus dem VPN an genau `/api/ping`, die Anfrage hängt dann ohne Antwort. Deshalb heißt der Endpunkt `/api/alive_ping`.
- Die Proxy-Meldung des Runners („Runner is running behind proxy server …“) steht in jedem öffentlichen Log und lässt sich nicht verstecken. Die URL der prod-vm versteckt der Workflow mit `add-mask`.
- Ein Release, das ein Workflow mit `GITHUB_TOKEN` anlegt, startet keinen Deploy. So verhindert GitHub Schleifen.
- Ein abgeschnittener Deploy-Log heißt nicht, dass nichts passiert ist. Verlässlich ist `sudo docker ps --format '{{.Names}}: {{.CreatedAt}}'` auf der prod-vm.
