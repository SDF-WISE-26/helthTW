# Deployment

Setup and operation of the two HTW VMs. Why it is built this way is in decisions 0010 to 0012 in [`decisions.md`](decisions.md).

## Overview

```
GitHub: release published (rollback manually) → .github/workflows/deploy.yml
  ├─ ci      on GitHub's runners: vp run ready, gitleaks
  └─ deploy  on the ops-vm runner (label htw-ops):
             docker build → docker save | ssh prod deploy <sha> → health check from outside

ops-vm   user github-runner: runner service, Docker for building, SSH key only for deploy.sh
prod-vm  user deploy, folder /srv/helthtw (compose.yml, deploy.sh, .env, tls/):
         web (Caddy, HTTPS on 443, 80 redirects) → backend (Node) → postgres (volume), migrate runs before every start
```

- The runner connects to GitHub itself through the proxy. No VM is reachable from outside HTW, that is intended.
- A deploy takes about 1.5 minutes, of which around 25 s on the prod-vm. The site is down for a few seconds during it.
- Tested with Debian 13, Docker 29.9 and Compose 5.6. Both VMs have 4 CPUs, 7.8 GB RAM and 15 GB disk (until November 2026: 2 CPUs, 1.9 GB RAM).

## Values

Hostnames and networks are not in the repo because it is public. The commands below use placeholders instead:

| Placeholder                 | What                                                      | Where from                                     |
| --------------------------- | --------------------------------------------------------- | ---------------------------------------------- |
| `<admin>`                   | your own user with sudo on both VMs                       | HTW IT                                         |
| `<prod-host>`, `<ops-host>` | hostnames of the VMs                                      | HTW IT                                         |
| `<prod-ip>`, `<ops-ip>`     | IPv4 address of the VM                                    | `hostname -I` on the VM, first address         |
| `<proxy>`                   | HTW web proxy as `http://<host>:<port>`                   | `/etc/environment` on the VM                   |
| `<htw-nets>`                | networks from which HTW allows SSH, e.g. `{ a/16, b/16 }` | SSH rule in the `input` chain, see below       |
| `<proxy-net>`               | network of the proxy                                      | rule with `dport 3128` in the `OUTPUT` chain   |
| `<dns-nets>`                | networks of the DNS servers                               | rule with `udp dport 53` in the `OUTPUT` chain |
| `<cert>`, `<key>`           | files of the HTTPS certificate, `.pem` and `.key`         | from HTW in `/home/local` on the VM            |

The chains are in HTW's `/etc/nftables.conf` on each VM: `sudo cat /etc/nftables.conf`.

## Operations

### Deploy and rollback

- Only a release is deployed: Releases → Draft a new release. Under "Choose a tag", type the next version as a new tag, e.g. `v0.2.0` (scheme in decision 0012), target `main`, "Generate release notes", Publish release. The notes list the PRs since the last release with their title. In the terminal: `gh release create v0.2.0 --target main --generate-notes`.
- A pre-release does not deploy. If the release points to a commit that is not on `main`, the deploy aborts.
- Rollback: Actions → Deploy → Run workflow with a commit hash. The workflow starts that version without a build. It must be one of the last 5 that `status` shows.
- Without GitHub, on the prod-vm: `sudo -u deploy -H /srv/helthtw/deploy.sh rollback <sha>`.
- If a new version does not come up healthy, `deploy.sh` starts the previous one and the job turns red.
- A rollback only restores the code, migrations stay. What that means for migrations is in [`workflow.md`](workflow.md).

### Inspecting

```bash
# ops-vm
sudo -iu github-runner ssh prod status           # running version, last 5, checksums of the installed files
systemctl status 'actions.runner.*' --no-pager   # runner service
sudo -iu github-runner docker system df          # build cache, the pipeline limits it to 5 GB

# prod-vm
sudo docker ps --format '{{.Names}}: {{.Status}}'
sudo docker logs --tail 100 helthtw-prod-backend-1
sudo docker exec -it helthtw-prod-postgres-1 psql -U helthtw -d helthtw
# if the site does not respond from outside: ask the backend from the web container, bypassing the network
sudo docker exec helthtw-prod-web-1 wget -qO- -T 5 http://backend:3000/api/alive_ping

# own machine in the VPN: the certificate the site serves
echo | openssl s_client -connect <prod-host>:443 -servername <prod-host> 2>/dev/null | openssl x509 -noout -issuer -dates
```

### compose.yml or deploy.sh changed

At the next release, the deploy aborts at "Installed files match the repo". Reinstall as in [prod-vm, step 3](#3-user-deploy-and-srvhelthtw), with the release tag as `<commit>`. Then re-run the job under Actions.

- Back up the old file first: `sudo cp -a /srv/helthtw/compose.yml /srv/helthtw/compose.yml.alt`. The automatic rollback always uses the installed `compose.yml`. If the new one is broken, it does not help, only the backup does.
- A rollback to older images runs with the new `compose.yml`. So it must fit them too.

### .env and password

- `POSTGRES_PASSWORD` only takes effect when the volume is first created. Whoever changes it later must first change it in Postgres (`ALTER USER helthtw PASSWORD '…'`), otherwise migrate and backend fail with "password authentication failed".
- After a change to `.env`, the next deploy recreates the Postgres container. The backend reconnects by itself afterwards.

### HTTPS certificate

- Caddy in the `web` container serves the site over HTTPS with HTW's certificate, port 80 only redirects. Certificate and key are in `/srv/helthtw/tls`, never in the repo.
- The certificate does not renew itself and nothing warns before it expires. Its expiry date is shown by the last command under [Inspecting](#inspecting). Install a new one as in [prod-vm, step 5](#5-https-certificate), then `sudo docker restart helthtw-prod-web-1`, because Caddy only reads the files at startup.
- If Caddy cannot read the files, `web` does not start and the site is down. `sudo docker logs helthtw-prod-web-1` shows why.

### Updates

- `unattended-upgrades` installs Debian security updates daily and reboots at 04:00 if needed. Containers and runner come back by themselves.
- Docker comes from Docker's own repository and is not updated automatically: run `sudo apt update && sudo apt upgrade` from time to time.
- The runner updates itself.

## prod-vm setup

All commands as `<admin>`. Keep a second SSH session open while working on the firewall.

### 1. Updates

```bash
apt-config dump | grep -i proxy   # HTW only sets Acquire::http::Proxy
echo 'Acquire::https::Proxy "<proxy>";' | sudo tee /etc/apt/apt.conf.d/95https-proxy
sudo apt update && sudo apt full-upgrade
sudo tee /etc/apt/apt.conf.d/52unattended-upgrades-local >/dev/null <<'EOF'
// Reboot when an update requires it (e.g. new kernel).
Unattended-Upgrade::Automatic-Reboot "true";
Unattended-Upgrade::Automatic-Reboot-Time "04:00";
EOF
apt-config dump | grep -E 'APT::Periodic::(Update-Package-Lists|Unattended-Upgrade) |Automatic-Reboot "'   # "1", "1", "true"
ls /var/run/reboot-required 2>/dev/null && sudo reboot
```

- The https proxy is needed because HTW only sets the one for http and Docker's repository uses https. apt does not see the variables from `/etc/environment` during automatic updates.
- `debconf: unable to initialize frontend: Dialog` only means the terminal was too small for dialog windows.

### 2. Docker

```bash
sudo apt install ca-certificates curl gnupg
sudo install -m 0755 -d /etc/apt/keyrings
curl -fsSL https://download.docker.com/linux/debian/gpg | sudo tee /etc/apt/keyrings/docker.asc >/dev/null
sudo chmod a+r /etc/apt/keyrings/docker.asc
gpg --show-keys /etc/apt/keyrings/docker.asc   # must be 9DC858229FC7DD38854AE2D88D81803C0EBFCD88
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

# The Docker daemon ignores the shell's proxy variables. Log rotation then applies to every container.
[ -e /etc/docker/daemon.json ] && echo "daemon.json already exists, stop here" || sudo tee /etc/docker/daemon.json >/dev/null <<'EOF'
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
sudo docker pull postgres:17-alpine                             # tests the proxy
```

- `<admin>` is deliberately not added to the `docker` group, it is effectively root. Use `sudo docker` instead.
- `toomanyrequests` on pull is Docker Hub's limit for anonymous downloads. All of HTW shares the proxy's address, try again later.

### 3. User deploy and /srv/helthtw

```bash
# bash as shell: sshd starts the forced command through the login shell, with nologin every deploy fails
sudo adduser --disabled-password --comment "helthTW deploys" --shell /bin/bash deploy
sudo usermod -aG docker deploy

# Fetch deploy.sh and compose.yml from a reviewed commit and compare against checksums.
# Checksums on your own machine in the repo: git show <commit>:deploy/deploy.sh | shasum -a 256 (same for compose.yml)
sudo install -d -o root -g root -m 755 /srv/helthtw
cd /tmp
c=<commit>
curl -fsSLO "https://raw.githubusercontent.com/SDF-WISE-26/helthTW/$c/deploy/deploy.sh"
curl -fsSLO "https://raw.githubusercontent.com/SDF-WISE-26/helthTW/$c/deploy/compose.yml"
printf '%s  %s\n' <checksum-deploy.sh> deploy.sh <checksum-compose.yml> compose.yml | sha256sum -c \
  && sudo install -o root -g root -m 755 deploy.sh /srv/helthtw/deploy.sh \
  && sudo install -o root -g root -m 644 compose.yml /srv/helthtw/compose.yml
rm -f deploy.sh compose.yml
cd

# Create .env with the right permissions first, then fill it. Hex, because / + = would break the database URL.
sudo install -o root -g deploy -m 640 /dev/null /srv/helthtw/.env
printf 'POSTGRES_PASSWORD=%s\n' "$(openssl rand -hex 32)" | sudo tee /srv/helthtw/.env >/dev/null

ls -la /srv/helthtw   # deploy.sh root:root 755, compose.yml root:root 644, .env root:deploy 640
sudo -u deploy -H /srv/helthtw/deploy.sh status
```

- Everything in `/srv/helthtw` belongs to root. `deploy` may read and execute the files, but not change them.
- Always start `deploy.sh` manually with `sudo -u deploy -H`, so the version list ends up in `deploy`'s home.

### 4. Firewall

HTW's `/etc/nftables.conf` contains `table inet firewall`. In it, `input` only allows SSH, ping and the Nessus scanner from the HTW network, `OUTPUT` only proxy, 80/443, DNS and NTP. `FORWARD` is set to `policy drop` without rules and thus blocks every container. The file also starts with `flush ruleset`, which deletes Docker's rules on every reload too.

```bash
sudo cp -a /etc/nftables.conf /etc/nftables.conf.orig
sudo cat /etc/nftables.conf > /tmp/nft.conf
sed -i 's/^flush ruleset$/table inet firewall\ndelete table inet firewall/' /tmp/nft.conf
sed -i 's/^# Flush existing rules$/# Only replace this table, Docker'\''s stay/' /tmp/nft.conf
# in this order: each line lands directly below the chain header
sed -i '/hook forward/a\        ip saddr <htw-nets> ct status dnat accept' /tmp/nft.conf
sed -i '/hook forward/a\        iifname "br-*" oifname "br-*" accept' /tmp/nft.conf
sed -i '/hook forward/a\        ct state established,related accept' /tmp/nft.conf
sed -i '/hook forward/a\        # Docker: replies, containers among each other, ports from the HTW network' /tmp/nft.conf
diff /etc/nftables.conf /tmp/nft.conf            # only the start and the 4 lines below hook forward
sudo nft -c -f /tmp/nft.conf && echo "syntax OK"

sudo cp /tmp/nft.conf /etc/nftables.conf
sudo systemctl reload nftables
sudo nft list tables                             # inet firewall and Docker's ip/ip6 nat/filter
```

Then log in via SSH a second time in a new terminal. If that does not work, revert from the open session:
`sudo cp -a /etc/nftables.conf.orig /etc/nftables.conf && sudo systemctl reload nftables && sudo systemctl restart docker`

- Ports 80 and 443 are only reachable from the HTW network. Which ports exist at all is defined by `compose.yml`.
- From now on, only reload nftables with `reload`, never with `restart` or `stop`. Stopping the service runs `nft flush ruleset`, after which Docker needs a `systemctl restart docker`.
- From the prod-vm itself, `localhost:80` and `:443` do not work, because HTW's `OUTPUT` blocks the path from host to container. Check inside the container instead, see [Inspecting](#inspecting).

### 5. HTTPS certificate

HTW puts two files in `/home/local`: `<cert>` (`.pem`, the VM's certificate followed by the chain) and `<key>` (`.key`). It is valid for 200 days.

```bash
# All certificates in the file, the VM's first. Never look at more than the first line of the key.
sudo openssl crl2pkcs7 -nocrl -certfile /home/local/<cert> | openssl pkcs7 -print_certs -noout
sudo openssl x509 -in /home/local/<cert> -noout -subject -dates -ext subjectAltName   # name: <prod-host>
# does the key match the certificate: both lines equal
sudo openssl x509 -in /home/local/<cert> -noout -pubkey | sha256sum
sudo openssl pkey -in /home/local/<key> -pubout | sha256sum
# HTW leaves the key readable for everyone
sudo chmod 600 /home/local/<key>

# Only root and nobody (65534), the user Caddy runs as in the container, can read the key.
sudo install -d -o root -g root -m 755 /srv/helthtw/tls
sudo install -o root -g root -m 644 /home/local/<cert> /srv/helthtw/tls/fullchain.pem
sudo install -o root -g 65534 -m 640 /home/local/<key> /srv/helthtw/tls/key.pem
openssl verify -untrusted /srv/helthtw/tls/fullchain.pem /srv/helthtw/tls/fullchain.pem   # OK: Debian and browsers trust it
ls -la /srv/helthtw/tls   # fullchain.pem root:root 644, key.pem root:nogroup 640
```

If the chain ever comes as a separate file, it goes after the certificate: `sudo cat <cert> <chain> | sudo install -o root -g root -m 644 /dev/stdin /srv/helthtw/tls/fullchain.pem`.

## ops-vm setup

All commands as `<admin>`, except where `sudo -iu github-runner` is written.

### 1. Updates and swap

First [step 1 of the prod-vm](#1-updates). Plus 2 GB swap. It dates from when the VM had 1.9 GB RAM and is now only a reserve for builds:

```bash
findmnt -no FSTYPE /                   # ext4, then a swap file needs nothing special
sudo fallocate -l 2G /swapfile
sudo chmod 600 /swapfile               # swap can contain anything that was in memory
sudo mkswap /swapfile
sudo swapon /swapfile
echo '/swapfile none swap sw 0 0' | sudo tee -a /etc/fstab
sudo swapon --show                     # /swapfile 2G, also after a reboot
```

`swapon` is in `/usr/sbin` and missing from normal users' search path, so always use `sudo`.

### 2. Docker and firewall

Docker as in [step 2 of the prod-vm](#2-docker), with the same `daemon.json`. To test, `sudo docker pull debian:trixie-slim`, the build needs it anyway.

The ops-vm publishes no ports. Only the build containers (`docker build` runs every step on `docker0`) need something: the proxy and DNS, but no direct internet. Plus outgoing SSH, but only to the prod-vm.

```bash
sudo cp -a /etc/nftables.conf /etc/nftables.conf.orig
sudo cat /etc/nftables.conf > /tmp/nft.conf
sed -i 's/^flush ruleset$/table inet firewall\ndelete table inet firewall/' /tmp/nft.conf
sed -i 's/^# Flush existing rules$/# Only replace this table, Docker'\''s stay/' /tmp/nft.conf
# in this order: each line lands directly below the chain header
sed -i '/hook forward/a\        iifname "docker0" ip daddr <dns-nets> udp dport 53 accept' /tmp/nft.conf
sed -i '/hook forward/a\        iifname "docker0" ip daddr <proxy-net> tcp dport 3128 accept' /tmp/nft.conf
sed -i '/hook forward/a\        ct state established,related accept' /tmp/nft.conf
sed -i '/hook forward/a\        # Docker builds: replies, proxy and DNS in the HTW network, nothing else' /tmp/nft.conf
sed -i '/hook output/a\        ip daddr <prod-ip> tcp dport 22 accept' /tmp/nft.conf
sed -i '/hook output/a\        # Deploys: SSH only to the prod-vm' /tmp/nft.conf
diff /etc/nftables.conf /tmp/nft.conf            # the start, 4 lines below hook forward, 2 below hook output
sudo nft -c -f /tmp/nft.conf && echo "syntax OK"

sudo cp /tmp/nft.conf /etc/nftables.conf
sudo systemctl reload nftables
sudo nft list tables

# Tests: DNS, downloads through the proxy, no direct route, SSH to the prod-vm
sudo docker run --rm debian:trixie-slim getent hosts <proxy-host>
sudo docker run --rm -e http_proxy=<proxy> debian:trixie-slim sh -c 'apt-get update -qq && echo "proxy reachable"'
sudo docker run --rm debian:trixie-slim timeout 5 bash -c 'echo > /dev/tcp/deb.debian.org/80' && echo "direct: open" || echo "direct: blocked"
timeout 5 bash -c 'echo > /dev/tcp/<prod-host>/22' && echo "SSH: open" || echo "SSH: blocked"
```

Then log in a second time as with the prod-vm, recovery works the same way. Expected: the proxy's address, "proxy reachable", "direct: blocked", "SSH: open". `<proxy-host>` is the host from `<proxy>`.

### 3. User github-runner

Without password and without sudo. The `docker` group is effectively root on the ops-vm, which is fine because the VM does nothing else.

```bash
sudo adduser --disabled-password --comment "GitHub Actions runner" github-runner
sudo usermod -aG docker github-runner
sudo apt install git libicu76          # git for actions/checkout, the runner (.NET) needs ICU
ls -ld /home/github-runner             # drwx------, Debian 13 creates homes like this

# Proxy for builds: docker passes it as a build argument to RUN steps, it does not end up in the image
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
sudo -iu github-runner docker run --rm debian:trixie-slim sh -c 'env | grep -i proxy'   # 6 lines, without sudo
```

This gives a proxy on three levels: apt (step 1), the Docker daemon for pulls (`daemon.json`) and the builds (`config.json`).

### 4. SSH to the prod-vm

On the prod-vm, the key may only start `deploy.sh` and only from the ops-vm.

```bash
# ops-vm: key without passphrase, nobody types it during the job. Protected by the folder (700) and the limits on the prod-vm.
sudo -u github-runner mkdir -p -m 700 /home/github-runner/.ssh
sudo -u github-runner ssh-keygen -t ed25519 -N "" -C "github-runner@<ops-host> deploy" -f /home/github-runner/.ssh/id_ed25519_deploy
sudo cat /home/github-runner/.ssh/id_ed25519_deploy.pub   # public key, copy it for the prod-vm
ssh-keyscan -t ed25519 <prod-host> 2>/dev/null > /tmp/prod-hostkey
ssh-keygen -lf /tmp/prod-hostkey
```

```bash
# prod-vm: the fingerprint must match the one above exactly, otherwise stop
ssh-keygen -lf /etc/ssh/ssh_host_ed25519_key.pub
# authorized_keys belongs to root, so deploy cannot add its own keys
sudo install -d -o root -g root -m 755 /home/deploy/.ssh
key='<the .pub line from the ops-vm>'
printf 'restrict,from="<ops-ip>",command="/srv/helthtw/deploy.sh" %s\n' "$key" | sudo tee /home/deploy/.ssh/authorized_keys >/dev/null
sudo chmod 644 /home/deploy/.ssh/authorized_keys
```

```bash
# ops-vm: pin the host key and alias "prod", so the hostname is not in the workflow
sudo -u github-runner tee /home/github-runner/.ssh/known_hosts < /tmp/prod-hostkey >/dev/null
rm /tmp/prod-hostkey
sudo -u github-runner tee /home/github-runner/.ssh/config >/dev/null <<'EOF'
# The prod-vm. Its authorized_keys only lets this key start deploy.sh.
Host prod
  HostName <prod-host>
  User deploy
  IdentityFile ~/.ssh/id_ed25519_deploy
  IdentitiesOnly yes
  StrictHostKeyChecking yes
  BatchMode yes
  ConnectTimeout 10
EOF

sudo -iu github-runner ssh prod status         # version, list, checksums
sudo -iu github-runner ssh prod bash           # deploy: usage: ... (no shell)
sudo -iu github-runner ssh prod 'status; id'   # deploy: usage: ... (the ; is just text)
```

- `restrict` forbids shell, terminal and forwarding. `from=` only allows the key from the ops-vm. `command=` always starts `deploy.sh`, the caller's request only arrives as text in `SSH_ORIGINAL_COMMAND`.
- `BatchMode yes` makes SSH never prompt, otherwise a job waits forever. If the prod-vm's host key changes, `StrictHostKeyChecking yes` refuses the connection.

### 5. GitHub and runner

In GitHub under the repo's Settings:

- Actions → General → "Approval for running fork pull request workflows from contributors": **Require approval for all external contributors**. Otherwise a fork PR could start its own workflow on our runner.
- Environments → New environment **`production`**, "Deployment branches and tags": Selected, branch **`main`** (rollback) and tag **`v0.*.*`** (releases, see decision 0012), no reviewers.
- Do not create a variable for the URL: logs of public repos are public, variables appear in them in plain text. The URL is in the runner's `.env`.

Actions → Runners → New self-hosted runner → Linux x64 shows the download link, checksum and a token valid for one hour.

```bash
sudo -iu github-runner
export https_proxy=<proxy>             # sudo -i does not load /etc/environment
# the 4 commands from "Download" on the GitHub page: mkdir/cd actions-runner, curl, checksum (must say OK), tar
read -rsp "Token: " token; echo        # not visible, not in the history
./config.sh --unattended --url https://github.com/SDF-WISE-26/helthTW --token "$token" --name helthtw-ops --labels htw-ops
unset token
# config.sh already created .env, so append
cat >> .env <<'EOF'
http_proxy=<proxy>
https_proxy=<proxy>
no_proxy=localhost,127.0.0.1,.htw-berlin.de
PROD_URL=https://<prod-host>
EOF
exit

# as <admin>: svc.sh must run in the runner folder, which <admin> cannot enter
sudo bash -c 'cd /home/github-runner/actions-runner && ./svc.sh install github-runner && ./svc.sh start'
ps -o user=,comm= -C Runner.Listener   # github-runner, not root
```

In GitHub, the runner then shows as **Idle**, with the labels `self-hosted`, `Linux`, `X64` and `htw-ops`.

## First deploy and wrap-up

1. Create a release as under [Deploy and rollback](#deploy-and-rollback). Afterwards `https://<prod-host>` shows the site with a padlock, `http://` redirects there and `/api/alive_ping` responds.
2. Reboot both VMs with `sudo reboot`. Afterwards all containers are healthy, the runner is back on Idle and `sudo nft list tables` shows all five tables.
3. Test data, if wanted. Production has no seed, `db:seed` needs the dev tools and empties the table first.
   ```bash
   sudo docker exec helthtw-prod-postgres-1 psql -U helthtw -d helthtw -c "insert into users (name) values ('User1'), ('User2')"
   ```

If only one VM is replaced, its address and keys change:

- New ops-vm: adjust `from=` in the prod-vm's `authorized_keys`. In GitHub, remove the old runner under Actions → Runners.
- New prod-vm: adjust the ops-vm's `OUTPUT` rule, `known_hosts`, `~/.ssh/config` and `PROD_URL` in the runner's `.env`. Then `sudo systemctl restart 'actions.runner.*'`.

## Pitfalls

- HTW's network drops requests from the VPN to exactly `/api/ping`, the request then hangs without a response. That is why the endpoint is called `/api/alive_ping`.
- The runner's proxy message ("Runner is running behind proxy server …") appears in every public log and cannot be hidden. The workflow hides the prod-vm's URL with `add-mask`.
- A release created by a workflow with `GITHUB_TOKEN` does not trigger a deploy. This is how GitHub prevents loops.
- Without the chain in `fullchain.pem`, some browsers still show the site, but `curl` in the deploy and many phones do not.
- A rollback to a version from before HTTPS turns red at "App answers", because it only speaks HTTP. The site then runs under `http://`.
- A truncated deploy log does not mean nothing happened. The reliable check is `sudo docker ps --format '{{.Names}}: {{.CreatedAt}}'` on the prod-vm.
