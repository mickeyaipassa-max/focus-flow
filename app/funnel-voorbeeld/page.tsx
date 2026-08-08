import { FunnelPageTemplate } from "@/components/FunnelPageTemplate";
import { FunnelSection } from "@/components/FunnelSection";
import { FormNavigation } from "@/components/FormNavigation";
import { Select } from "@/components/Select";
import { RadioGroup } from "@/components/RadioGroup";
import { Receipt } from "@/components/Receipt";

const VERZUIM_STEPS = ["Jouw bedrijf", "Jouw dekking", "Aanvullende gegevens", "Laatste vragen", "Samenvatting"];

const VERZEKERING_OPTIES = [
  { value: "aov", label: "Arbeidsongeschiktheidsverzekering" },
  { value: "verzuim", label: "Verzuimverzekering" },
  { value: "wga", label: "WGA-eigenrisicodragersverzekering" },
];

const CONTACT_OPTIES = [
  { value: "email", label: "E-mail" },
  { value: "telefoon", label: "Telefoon" },
  { value: "post", label: "Post" },
];

/**
 * Voorbeeldscherm dat aantoont hoe een funnelstap wordt samengesteld op
 * `FunnelPageTemplate`: alleen de content binnen de kaart (`FunnelSection`s
 * met echte, al bestaande componenten) en de sidebar/navigatie zijn
 * funnel-specifiek — de rest (Header, StepIndicator, kaartomlijsting,
 * Footer) komt uit de template zelf. Losse route i.p.v. een blok op de
 * showcase-pagina: `FunnelPageTemplate` rendert zijn eigen Header/Footer,
 * dus nesten binnen de showcase-pagina (die al een eigen Header/Footer
 * heeft) zou die dubbel op de pagina zetten.
 */
export default function FunnelVoorbeeldPage() {
  return (
    <FunnelPageTemplate
      headerTitle="Verzuimverzekering"
      steps={VERZUIM_STEPS}
      activeStep={2}
      sidebar={<Receipt title="Verzuimverzekering" summaryAmount="€ 89,50" sections={[]} />}
      navigation={<FormNavigation previousStep nextStep />}
    >
      <FunnelSection intro title="Jouw dekking" description="Kies de dekking die past bij jouw bedrijf." showRequiredFieldsNote>
        <Select labelText="Soort verzekering" options={VERZEKERING_OPTIES} />
      </FunnelSection>
      <FunnelSection title="Contactvoorkeur" showDividerAbove>
        <RadioGroup labelText="Contactvoorkeur" options={CONTACT_OPTIES} />
      </FunnelSection>
    </FunnelPageTemplate>
  );
}
