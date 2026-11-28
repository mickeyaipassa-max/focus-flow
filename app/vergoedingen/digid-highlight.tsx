import { Button } from "@/components/Button";

const AVENIR = { fontFamily: "var(--font-avenir-book)" } as const;

/**
 * Figma "Highlight" (blauw, 384 px breed): verwijst naar inloggen met DigiD. Alleen op de desktopframes; de mobiele
 * frames van /vergoedingen en van de uitkomstpagina hebben hem niet, dus onder 900 px verborgen.
 */
export function DigidHighlight({ className = "" }: { className?: string }) {
  return (
    <div className={`hidden w-[384px] shrink-0 items-start rounded-[3px] bg-[#d7e9f5] px-3 py-2 min-[900px]:flex ${className}`}>
      <div className="flex flex-1 flex-col items-start gap-2 p-2">
        <div className="flex w-full flex-col gap-1 text-black">
          <p className="text-lg leading-[1.5]" style={{ fontFamily: "var(--font-avenir-bold)" }}>
            Wil je weten wat je vergoed krijgt?
          </p>
          <p className="text-base leading-[1.5]" style={AVENIR}>
            Log in met DigiD om jouw persoonlijke vergoedingen te zien
          </p>
        </div>
        <Button type="brand" iconAppend="logo-digid">
          Inloggen met DigiD
        </Button>
      </div>
    </div>
  );
}
