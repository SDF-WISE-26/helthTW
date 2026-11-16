import { ExternalLink, Mail, Phone } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { Contact } from "./content";

type Channel = Contact["channels"][number];

// Stored as +49… without spaces, the space after the country code only helps reading.
const formatPhone = (value: string) => value.replace(/^\+49/, "+49 ");

// First letter of the first two words, e.g. "Berliner Krisendienst" → "BK".
const initials = (name: string) =>
  (name.match(/\p{L}+/gu) ?? [])
    .slice(0, 2)
    .map((word) => word[0].toUpperCase())
    .join("");

export function ContactCard({ contact }: { contact: Contact }) {
  return (
    <Card size="sm">
      <CardHeader className="flex items-center gap-3">
        {/* Initials until the contacts get logos. */}
        <Avatar size="lg" aria-hidden="true">
          <AvatarFallback>{initials(contact.name)}</AvatarFallback>
        </Avatar>
        <div className="flex min-w-0 flex-col gap-1">
          <CardTitle>{contact.name}</CardTitle>
        </div>
      </CardHeader>
      <CardContent className="flex flex-col gap-2">
        {contact.description && <p>{contact.description}</p>}
        {contact.channels.length > 0 && (
          <ul className="flex flex-col gap-2">
            {contact.channels.map((channel) => (
              <li key={channel.value}>
                <ChannelLink channel={channel} />
              </li>
            ))}
          </ul>
        )}
        {contact.website && (
          <a
            href={contact.website}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex min-h-11 items-center gap-1.5 self-start text-primary underline-offset-4 hover:underline"
          >
            <ExternalLink aria-hidden="true" className="size-4" />
            Website
          </a>
        )}
      </CardContent>
    </Card>
  );
}

function ChannelLink({ channel }: { channel: Channel }) {
  const phone = channel.type === "phone";
  const Icon = phone ? Phone : Mail;
  const details = [channel.label, channel.person, channel.availability].filter(Boolean).join(" · ");

  return (
    <Button
      asChild
      variant="outline"
      className="h-auto min-h-11 w-full justify-start gap-3 py-2 text-left whitespace-normal"
    >
      <a href={`${phone ? "tel" : "mailto"}:${channel.value}`}>
        <Icon aria-hidden="true" />
        <span className="flex min-w-0 flex-col">
          <span className="break-all">{phone ? formatPhone(channel.value) : channel.value}</span>
          {details && <span className="text-xs font-normal text-muted-foreground">{details}</span>}
        </span>
      </a>
    </Button>
  );
}
