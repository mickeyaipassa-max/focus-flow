"use client";

import { useState } from "react";
import { ProductSelectCard } from "./ProductSelectCard";

/** Losse client-wrapper voor de verificatieharness — zelfde reden als DialogDemo.tsx/ReceiptDemo.tsx: app/page.tsx is een Server Component en kan zelf geen event handlers (dus ook geen no-op-functies) aan Client Components doorgeven. */
export function ProductSelectCardDemo() {
  const [selected, setSelected] = useState(false);

  return (
    <ProductSelectCard
      icon={<img src="/icons/pictogram-house.svg" alt="" className="size-8" />}
      title="Opstal"
      description={
        <>
          Dekt schade aan je huis.
          <br />
          Vanaf € 4,82 p/m
        </>
      }
      selected={selected}
      onSelectedChange={setSelected}
      onMoreInfoClick={() => console.log("meer informatie geklikt")}
    />
  );
}
