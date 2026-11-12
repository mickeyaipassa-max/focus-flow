"use client";

import { RadioCardBottomGroup, type RadioCardBottomOption } from "@/components/RadioCardBottom";
import { RadioCardBottomCarousel, type CarouselCardOption } from "@/components/RadioCardBottomCarousel";

type DekkingKiezerProps = {
  options: RadioCardBottomOption[];
  value: string;
  onChange: (value: string) => void;
  onMoreInfoClick: (value: string) => void;
  error?: string;
};

/**
 * De basisdekking-kaarten: onder 600px de horizontale slider (`RadioCardBottomCarousel`, zelfde opzet als
 * /autonew), vanaf 600px de kaarten naast elkaar. Beide staan in de DOM en delen dezelfde state, zodat een
 * keuze blijft staan als het scherm van grootte verandert.
 */
export function DekkingKiezer({ options, value, onChange, onMoreInfoClick, error }: DekkingKiezerProps) {
  const carouselOptions: CarouselCardOption[] = options.map(({ value, title, price, features, highlightLines }) => ({
    value,
    title,
    price: price ?? "",
    features: features ?? [],
    highlightLines,
  }));

  return (
    <>
      {/* `-mx-6` heft de 24px kaartpadding op, zodat de buurkaarten van de slider in beeld blijven (zie /autonew). */}
      <div className="-mx-6 w-[calc(100%+48px)] min-[600px]:hidden">
        <RadioCardBottomCarousel
          labelText="Kies je basisdekking"
          options={carouselOptions}
          value={value}
          onChange={onChange}
          onMoreInfoClick={onMoreInfoClick}
          error={error}
          contentTopClassName="mt-2"
        />
      </div>
      <div className="hidden w-full min-[600px]:block">
        <RadioCardBottomGroup
          labelText="Kies je basisdekking"
          options={options}
          contentTopClassName="mt-2"
          value={value}
          onChange={onChange}
          onMoreInfoClick={onMoreInfoClick}
          error={error}
        />
      </div>
    </>
  );
}
