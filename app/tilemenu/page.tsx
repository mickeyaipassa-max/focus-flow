import { TileMenu, type TileMenuItem } from "@/components/TileMenu";

/**
 * Demo van de Tile Menu (Figma 1cHiSmdMZQsfivYMqhPfyq, node 13889:10) met de teksten uit de Figma-voorbeelden ("Item").
 * Drie niveaus van zeven items; vanaf 1024px de desktopversie met kolommen, daaronder de mobiele kaart.
 */

const niveau3: TileMenuItem[] = Array.from({ length: 7 }, () => ({ label: "Item", href: "#" }));
const niveau2: TileMenuItem[] = Array.from({ length: 7 }, () => ({ label: "Item", children: niveau3 }));
const niveau1: TileMenuItem[] = Array.from({ length: 7 }, () => ({ label: "Item", children: niveau2 }));

export default function TileMenuPage() {
  return (
    <main className="min-h-screen bg-white px-4 py-16">
      <div className="mx-auto max-w-[1182px]">
        <TileMenu label="Tile Menu" items={niveau1} className="mx-auto w-full max-w-[394px] lg:max-w-none" />
      </div>
    </main>
  );
}
