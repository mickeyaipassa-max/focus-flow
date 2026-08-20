import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { FormNavigation } from "@/components/FormNavigation";
import { FunnelBox } from "@/components/FunnelBox";
import { StepIndicator } from "@/components/StepIndicator";
import { Alert } from "@/components/Alert";
import { CardDetails } from "@/components/CardDetails";
import { Select } from "@/components/Select";
import { RadioGroup } from "@/components/RadioGroup";
import { CheckboxGroup } from "@/components/CheckboxGroup";
import { CheckboxCardControlLeftGroup } from "@/components/CheckboxCardControlLeft";
import { InputPhone } from "@/components/InputPhone";
import { InputEmail } from "@/components/InputEmail";
import { InputLicensePlate } from "@/components/InputLicensePlate";
import { Rating } from "@/components/Rating";
import { InputDate } from "@/components/InputDate";
import { FieldsetName } from "@/components/FieldsetName";
import { Label } from "@/components/Label";
import { Popover } from "@/components/Popover";
import { DialogDemo } from "@/components/DialogDemo";
import { Receipt } from "@/components/Receipt";
import { ReceiptDemo } from "@/components/ReceiptDemo";
import { Spinner } from "@/components/Spinner";

const DEKKING_OPTIES = [
  { value: "aov", label: "Arbeidsongeschiktheid" },
  { value: "verzuim", label: "Verzuim" },
  { value: "wga", label: "WGA-eigenrisico" },
];

const AANVULLENDE_DEKKINGEN = [
  { value: "rechtsbijstand", title: "Rechtsbijstand", description: "Juridische hulp bij geschillen.", price: "8,50" },
  { value: "reisverzekering", title: "Reisverzekering", description: "Dekking tijdens zakenreizen.", price: "12,00" },
];

const CONTACT_OPTIES = [
  { value: "email", label: "E-mail" },
  { value: "telefoon", label: "Telefoon" },
  { value: "post", label: "Post" },
];

const JA_NEE_OPTIES = [
  { value: "ja", label: "Ja" },
  { value: "nee", label: "Nee" },
];

const VERZEKERING_OPTIES = [
  { value: "aov", label: "Arbeidsongeschiktheidsverzekering" },
  { value: "verzuim", label: "Verzuimverzekering" },
  { value: "wga", label: "WGA-eigenrisicodragersverzekering" },
];

const VERZUIM_STEPS = ["Jouw bedrijf", "Jouw dekking", "Aanvullende gegevens", "Laatste vragen", "Samenvatting"];

export default function Home() {
  return (
    <>
      <Header title="Verzuimverzekering" />
      <div className="flex flex-col gap-6 p-6">
        <StepIndicator steps={VERZUIM_STEPS} activeStep={3} overflowLeft overflowRight dropdownButton />
        <StepIndicator steps={VERZUIM_STEPS} activeStep={3} showLabels={false} />
        <StepIndicator steps={VERZUIM_STEPS} activeStep={5} completed dropdownButton />
        <div className="w-[375px]">
          <StepIndicator steps={VERZUIM_STEPS} activeStep={2} mobile />
        </div>
        <FormNavigation nextStep />
        <FormNavigation previousStep nextStep />
        <FormNavigation previousStep submit />
        <div className="w-[320px]">
          <FormNavigation previousStep nextStep stacked />
        </div>
        <div className="w-[397px]">
          <FunnelBox>
            <p style={{ fontFamily: "var(--font-avenir)" }}>Voorbeeldinhoud (children)</p>
          </FunnelBox>
        </div>
        <div className="flex flex-col gap-3">
          <Alert type="info" title="Alert title" description="You can use a description to better explain the alert." />
          <Alert type="warning" title="Alert title" description="You can use a description to better explain the alert." />
          <Alert type="success" title="Alert title" description="You can use a description to better explain the alert." />
          <Alert type="error" title="Alert title" description="You can use a description to better explain the alert." />
          <Alert type="info" title="Alert title" description="You can use a description to better explain the alert." action />
          <Alert type="warning" showTitle={false} description="You can use a description to better explain the alert." closable={false} />
        </div>
        <CardDetails
          title="Bedrijfsgegevens"
          description="Dit zijn de gegevens die wij van je hebben ontvangen."
          rows={[
            { label: "Bedrijfsnaam", value: "Bakkerij De Vries B.V." },
            { label: "KvK-nummer", value: "12345678" },
            { label: "Aantal medewerkers", value: "24" },
            { label: "Jaaromzet", value: "€ 1.250.000" },
          ]}
        />
        <CardDetails
          title="Contactgegevens"
          rows={[
            { label: "Naam", value: "J. de Vries", editable: true },
            { label: "E-mailadres", value: "j.devries@voorbeeld.nl", editable: true, removable: true },
            { label: "Telefoonnummer", value: "06-12345678", removable: true },
          ]}
        />
        <CardDetails
          title="Dekking"
          labelWidth="md"
          cardActionRemove
          alert={<Alert type="info" description="You can use a description to better explain the alert." showTitle={false} closable={false} />}
          rows={[
            { label: "Verzekerde som", value: "€ 500.000" },
            { label: "Eigen risico", value: "€ 250" },
          ]}
        />
        <div className="w-[320px]">
          <CardDetails
            title="Samenvatting"
            bordered={false}
            cardActionEdit={false}
            rows={[
              { label: "Startdatum", value: "1 januari 2026" },
              { label: "Premie per maand", value: "€ 89,50" },
            ]}
          />
        </div>
        <div className="flex flex-col items-start gap-6">
          <Select labelText="Soort verzekering" options={VERZEKERING_OPTIES} />
          <Select labelText="Soort verzekering" options={VERZEKERING_OPTIES} value="verzuim" />
          <Select
            labelText="Soort verzekering"
            options={VERZEKERING_OPTIES}
            optional
            required={false}
            description="Kies de verzekering die je wilt aanvragen."
            showInfo
          />
          <Select labelText="Soort verzekering" options={VERZEKERING_OPTIES} error="Dit veld is verplicht" />
          <Select labelText="Soort verzekering" options={VERZEKERING_OPTIES} disabled value="aov" />
          <Select labelText="Soort verzekering" options={VERZEKERING_OPTIES} compact />
          <div className="flex flex-wrap items-start gap-4">
            <Select labelText="XS" options={VERZEKERING_OPTIES} fieldWidth="xs" />
            <Select labelText="SM" options={VERZEKERING_OPTIES} fieldWidth="sm" />
            <Select labelText="LG" options={VERZEKERING_OPTIES} fieldWidth="lg" />
          </div>
        </div>
        <div className="flex flex-col items-start gap-6">
          <RadioGroup labelText="Contactvoorkeur" options={CONTACT_OPTIES} />
          <RadioGroup labelText="Contactvoorkeur" options={CONTACT_OPTIES} value="telefoon" />
          <RadioGroup labelText="Contactvoorkeur" options={CONTACT_OPTIES} error="Maak een keuze" />
          <RadioGroup labelText="Ontvang je een uitkering?" options={JA_NEE_OPTIES} horizontal />
          <RadioGroup labelText="Ontvang je een uitkering?" options={JA_NEE_OPTIES} horizontal value="ja" />
          <RadioGroup labelText="Ontvang je een uitkering?" options={JA_NEE_OPTIES} horizontal error="Maak een keuze" />
        </div>
        <div className="flex flex-col items-start gap-6">
          <CheckboxGroup labelText="Gewenste dekking" options={DEKKING_OPTIES} values={[]} />
          <CheckboxGroup labelText="Gewenste dekking" options={DEKKING_OPTIES} values={["verzuim", "wga"]} />
          <CheckboxGroup labelText="Gewenste dekking" options={DEKKING_OPTIES} values={[]} error="Kies minimaal één optie" />
          <div className="w-[420px]">
            <CheckboxCardControlLeftGroup
              labelText="Aanvullende dekkingen"
              description="Kies de aanvullende dekkingen die je wilt toevoegen."
              options={AANVULLENDE_DEKKINGEN}
              values={["rechtsbijstand"]}
            />
          </div>
        </div>
        <div className="flex flex-col items-start gap-6">
          <InputPhone />
          <InputPhone value="612345678" />
          <InputPhone nlOnly />
          <InputPhone error="Vul een geldig telefoonnummer in" />
        </div>
        <div className="flex flex-col items-start gap-6">
          <InputEmail />
          <InputEmail value="naam@voorbeeld.nl" />
          <InputEmail optional required={false} description="Zodat we contact kunnen opnemen." showInfo />
          <InputEmail error="Vul een geldig e-mailadres in" />
        </div>
        <div className="flex flex-wrap items-start gap-6">
          <InputLicensePlate />
          <InputLicensePlate value="K - 24 - ASR" state="loading" />
          <InputLicensePlate
            value="K - 24 - ASR"
            state="succes"
            vehicle={{ makeModel: "Ford Focus", type: "1.0 EcoBoost Titanium", year: "2019", fuel: "Benzine" }}
          />
          <InputLicensePlate state="error" errorMessage="Je hebt geen voertuig gevonden met dit kenteken. Controleer of je kenteken goed hebt ingevuld." />
        </div>
        <div className="flex flex-wrap items-start gap-6">
          <InputDate />
          <InputDate labelText="Geboortedatum (dd-mm-jjjj)" showPickerButton value={new Date(2019, 4, 12)} />
          <InputDate labelText="Geboortedatum (dd-mm-jjjj)" showPickerButton error="Vul een geldige geboortedatum in" />
          <InputDate labelText="Periode" showPickerButton range showTodayButton showClearButton rangeValue={{ start: new Date(2026, 9, 5), end: new Date(2026, 9, 12) }} />
        </div>
        <div className="flex flex-col items-start gap-6">
          <Rating score={4.5} ratingNumber="8,1" reviewCount={671} reviewsHref="#" />
          <Rating score={2.5} ratingNumber="5,4" reviewCount={102} reviewsHref="#" />
          <Rating score={5} ratingNumber="9,7" reviewCount={38} reviewLink={false} />
          <Rating score={4.5} ratingNumber="8,1" reviewCount={671} reviewsHref="#" compact />
        </div>
        <div className="flex flex-col items-start gap-6">
          <div className="w-[400px]">
            <FieldsetName />
          </div>
          <div className="w-[400px]">
            <FieldsetName value={{ initials: "J.", infix: "van der", lastName: "Berg" }} />
          </div>
          <div className="w-[400px]">
            <FieldsetName errors={{ lastName: "Vul een achternaam in" }} />
          </div>
        </div>
        <div className="flex flex-col items-start gap-4">
          <Label labelText="Label" />
          <Label labelText="Label" required={false} optional />
          <Label labelText="Label" description="Extra toelichting bij dit veld." />
          <Label labelText="Label" popoverButton />
          <Label labelText="Label" optional required={false} description="Combinatie van alle opties." popoverButton />
        </div>
        <div className="flex flex-col items-start gap-10 pt-32 pb-20">
          <div className="flex items-center gap-2">
            <span style={{ fontFamily: "var(--font-avenir)" }}>Bottom center (klik om te openen)</span>
            <Popover title="Voorletters" position="bottom center">
              Vul je voorletters in zoals ze op je identiteitsbewijs staan, bijvoorbeeld "J.P."
            </Popover>
          </div>
          <div className="flex items-center gap-2">
            <span style={{ fontFamily: "var(--font-avenir)" }}>Bottom left, met link</span>
            <Popover title="BSN" position="bottom left" linkHref="https://www.rijksoverheid.nl">
              Je burgerservicenummer staat op je paspoort, ID-kaart of rijbewijs.
            </Popover>
          </div>
          <div className="flex items-center gap-2">
            <span style={{ fontFamily: "var(--font-avenir)" }}>Top right, zonder titel</span>
            <Popover position="top right">
              Deze popover heeft geen titel, alleen deze toelichting.
            </Popover>
          </div>
        </div>
        <DialogDemo />
        <div className="flex flex-wrap items-start gap-6">
          <div className="w-[400px]">
            <ReceiptDemo />
          </div>
          <div className="w-[400px]">
            <Receipt title="Verzuimverzekering" summaryAmount="€ -,-" sections={[]} />
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-10">
          <Spinner size="sm" />
          <Spinner size="md" />
          <Spinner size="lg" />
          <Spinner size="sm" label="Loading..." />
          <Spinner size="md" label="Loading..." />
          <Spinner size="lg" label="Loading..." />
          <Spinner size="lg" label="Loading..." labelPosition="horizontal" />
        </div>
      </div>
      <Footer />
    </>
  );
}
