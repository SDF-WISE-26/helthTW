import { Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { emergencyContent } from "@/content/emergency";

export function EmergencyScreen() {
  return (
    <main className="mx-auto flex w-full max-w-md flex-col gap-4 p-4">
      <header>
        <h1 className="text-2xl font-bold">{emergencyContent.title}</h1>
      </header>

      <Card size="sm" className="bg-muted">
        <CardHeader>
          <CardDescription className="leading-relaxed">
            {emergencyContent.instructions}
          </CardDescription>
        </CardHeader>
      </Card>

      <section aria-labelledby="contacts-title" className="space-y-3">
        <h2 id="contacts-title" className="text-lg font-semibold">
          {emergencyContent.contactsTitle}
        </h2>

        {emergencyContent.contacts.map((contact) => (
          <Card key={contact.name} size="sm">
            <CardHeader className="grid-cols-[minmax(0,1fr)_auto] items-center gap-x-2">
              <div className="min-w-0">
                <CardTitle>{contact.name}</CardTitle>
                <CardDescription>{contact.description}</CardDescription>
              </div>

              <Button asChild variant="outline" size="sm" className="min-h-11 shrink-0">
                <a
                  href={contact.href}
                  aria-label={`${contact.name} unter ${contact.number} anrufen`}
                >
                  <Phone aria-hidden="true" />
                  <span className="sr-only">{contact.number}</span>
                  Anrufen
                </a>
              </Button>
            </CardHeader>
          </Card>
        ))}
      </section>
    </main>
  );
}
