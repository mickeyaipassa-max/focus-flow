import type { ReactNode } from "react";
import { Header } from "./Header";
import { Footer } from "./Footer";
import { StepIndicator } from "./StepIndicator";
import { FunnelBox } from "./FunnelBox";

type FunnelPageTemplateProps = {
  headerTitle: string;
  chatButton?: boolean;
  /** Doorgegeven aan `Header`; toont een telefoonnummer i.p.v. de Chat-knop (bevestigd op "Jouw bedrijf 1/3"). */
  phoneNumber?: string;
  /** Doorgegeven aan `Header`; toont "Annuleren" i.p.v. Chat/telefoonnummer (bevestigd op de mutatie-funnel). */
  cancelButton?: boolean;
  onCancel?: () => void;
  /** Doorgegeven aan `Header`; toont de "ik kies zelf"-sticker (bevestigd nodig voor de Autoverzekering-funnel, niet voor Verzuim). */
  ikzSticker?: boolean;
  steps: string[];
  activeStep: number;
  /**
   * De formulierkaart-content — normaliter een of meer `FunnelSection`s.
   * Komt overeen met Figma's "Form sections"-slot binnen "Funnel Template".
   */
  children: ReactNode;
  /**
   * Vult de rechtersidebar (Figma's `sidebar=true/false`-variant op "Form
   * Template + Grid", node 1286:11276). Geen sidebar meegeven = geen
   * tweede kolom, exact zoals `sidebar=false` in Figma — geen lege kolom
   * op de pagina.
   */
  sidebar?: ReactNode;
  /** De navigatieknoppenrij onderaan de kaart — typisch een `<FormNavigation .../>`. Losse slot i.p.v. doorgeefprops, zodat de afnemer dat component zelf blijft aansturen. */
  navigation: ReactNode;
  className?: string;
};

/**
 * Gebaseerd op Figma's "Form Template + Grid" (node 1286:11276,
 * viewport=1440px, layout variant=A, sidebar=true — uit het aparte
 * "Templates"-bestand, niet het Verzuim-bestand). Dat bestand bevat een
 * volledig abstract funnel-templatesysteem: elke formulierpositie is een
 * roze "component slot"-placeholder ("Swap me with a real component"),
 * bedoeld om per funnel met echte componenten gevuld te worden.
 *
 * Dit component is de codekant van die template-shell: Header,
 * StepIndicator, kaart + optionele sidebar, en een navigatie-slot — allemaal
 * samengesteld uit al bestaande componenten (Header, Footer, StepIndicator,
 * FunnelBox). Er is bewust niets herbouwd dat al bestond; alleen de shell
 * die deze losse stukken tot nu toe nog niet samenvoegde, ontbrak.
 *
 * Kleur (`#fff8e3`) en schaduw (`0px_4px_8px_rgba(0,0,0,0.12)`) zijn
 * letterlijk overgenomen uit Figma's `color/yellow-100`- en
 * `Shadow/SM`-tokens — geen nieuwe waarden buiten het designsysteem.
 * Kaart-schaduw en -radius zijn identiek aan wat FunnelBox al gebruikt.
 */
export function FunnelPageTemplate({
  headerTitle,
  chatButton,
  phoneNumber,
  cancelButton,
  onCancel,
  ikzSticker,
  steps,
  activeStep,
  children,
  sidebar,
  navigation,
  className,
}: FunnelPageTemplateProps) {
  return (
    <div className="flex min-h-screen w-full flex-col">
      <Header
        title={headerTitle}
        chatButton={chatButton}
        phoneNumber={phoneNumber}
        cancelButton={cancelButton}
        onCancel={onCancel}
        ikzSticker={ikzSticker}
      />

      <main className={className ?? "flex w-full flex-1 justify-center bg-[#fff8e3] py-10"}>
        {/*
          Marge-gedrag geverifieerd tegen de officiële viewport-varianten
          (node 11256:32902, 1440/1200/900/375px): 128px marge blijft
          onveranderd van 1200px tot en met 1440px — vandaar de `max-w-[1440px]`
          hieronder, zodat de body vanaf 1440px niet verder uitrekt op bredere
          schermen. Bij 900px is de marge 64px, bij 375px 24px — dat zijn de
          stapsgewijze `px-6 / min-[900px]:px-16 / min-[1200px]:px-32`-waarden,
          exact dezelfde schaal en dezelfde waarden als Header.tsx al gebruikt.
          De crème achtergrond zelf blijft bewust full-bleed (zoals Header's
          eigen witte balk) — alleen de content erbinnen is breedte-begrensd.
        */}
        <div className="flex w-full max-w-[1440px] flex-col items-center gap-10 min-[600px]:px-12 min-[900px]:px-16 min-[1200px]:px-32">
          {/*
            Marge-schaal geverifieerd tegen dezelfde 5 officiële viewport-
            instances als Header.tsx gebruikt (node 11256:32902, resp.
            11256:22093/22227/27665/29538/31131 op 1440/1200/900/600/375px):
            48px bij 600px, 64px bij 900px, 128px vanaf 1200px — dus dezelfde
            4-traps schaal als Header, niet de eerdere 3-traps versie die de
            48px-stap bij 600px miste.

            Onder 600px is er bovendien geen uniforme marge: alleen de
            StepIndicator en de sidebar houden 24px, de kaart zelf (het witte
            formulierblok) is edge-to-edge (0 marge) — vandaar dat de
            buitenste wrapper hierboven GEEN basis-`px` heeft, en de 24px
            i.p.v. dat losstaand op StepIndicator en de sidebar-wrapper staat.
          */}
          {/*
            Breakpoint gecorrigeerd van 600px naar 900px: rechtstreeks
            uitgelezen op de 600px-instance zelf (11256:29538) staan daar
            GEEN "Step text"-labelnodes — alleen de kale cijfers — identiek
            aan de 375px-instance. Pas de 900px-instance (11256:27665) bevat
            weer de labelteksten. De eerdere 600px-grens was dus fout; de
            gelabelde variant loopt pas vanaf 900px.
          */}
          <StepIndicator steps={steps} activeStep={activeStep} mobile className="flex w-full items-start justify-center px-6 min-[900px]:hidden" />
          <StepIndicator steps={steps} activeStep={activeStep} className="hidden w-full items-start justify-center min-[900px]:flex min-[1200px]:pl-10" />

          <div className="flex w-full flex-col items-start gap-6 min-[1200px]:flex-row">
            <div className="flex min-w-px flex-1 flex-col items-start overflow-hidden rounded-md bg-white shadow-[0px_4px_8px_rgba(0,0,0,0.12)]">
              <div className="flex w-full flex-col items-start gap-10 p-6 min-[1200px]:p-10">{children}</div>
              <div className="h-px w-full shrink-0 bg-[rgba(0,0,0,0.08)]" />
              {navigation}
            </div>

            {sidebar && (
              <div className="w-full shrink-0 px-6 min-[600px]:px-0 min-[1200px]:w-[397px]">
                <FunnelBox>{sidebar}</FunnelBox>
              </div>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
