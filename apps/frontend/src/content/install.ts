export const installContent = {
  title: "Installieren",
  description: "Füge helthTW deinem Startbildschirm hinzu, damit du die App schnell wiederfindest.",
  alreadyInstalled: "Die App ist bereits installiert.",
  unsupportedPlatform: "Die Installation ist nur für Android und iOS möglich.",
  card: {
    label: "helthTW installieren",
    dismissLabel: "Installationshinweis ausblenden",
  },
  actions: {
    openGuide: "App installieren",
    install: "App installieren",
    installing: "Bitte warten …",
    close: "Schließen",
  },
  android: {
    description: "Installiere helthTW über deinen Browser.",
    manualInstall:
      "Falls kein Installationsbutton erscheint, öffne das Menü deines Browsers. Wähle dort „App installieren“ oder „Zum Startbildschirm hinzufügen“.",
    accepted: "Die Installation wurde bestätigt. Öffne helthTW anschließend über das App-Symbol.",
    dismissed: "Du hast die Installation abgebrochen. Du kannst helthTW weiter im Browser nutzen.",
    error: "Die Installation konnte nicht gestartet werden. Versuche es über das Browsermenü.",
  },
  ios: {
    description: "Auf iPhone und iPad:",
    steps: [
      "Öffne die Seite in Safari und tippe auf „Teilen“.",
      "Wähle „Zum Home-Bildschirm“, aktiviere „Als Web-App öffnen“, falls angezeigt, und tippe auf „Hinzufügen“.",
      "Starte helthTW über das neue Symbol.",
    ],
    pushHint:
      "Push-Benachrichtigungen benötigen die Installation auf dem Home-Bildschirm und deine Zustimmung.",
  },
} as const;
