export const emergencyContent = {
  title: "Du bist nicht allein",

  instructions:
    "Biite suche dir einen ruhigen, sicheren Ort. Wenn möglich, hole eine vertraute Person dazu. Trink etwas, iss eine Kleinigkeit und halte dich warm. Es ist völlig in Ordnung, sich so viel Zeit zu nehmen, wie man braucht.",

  contactsTitle: "Wichtige Kontakte",

  contacts: [
    {
      name: "Notruf",
      description: "Bei akuter Gefahr oder medizinischen Notfällen",
      number: "112",
      href: "tel:112",
    },
    {
      name: "TelefonSeelsorge",
      description: "Vertrauliche Gespräche",
      number: "0800 111 0 111",
      href: "tel:08001110111",
    },
    {
      name: "Netzwerk PSNV",
      description: "Psychosoziale Unterstützung",
      number: "0800 58 92 272",
      href: "tel:08005892272",
    },
  ],
} as const;
