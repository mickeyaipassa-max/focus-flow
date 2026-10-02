import { Icon } from "./Icon";

export type FileListItem = {
  title: string;
  description: string;
  href: string;
};

type FileListProps = {
  items: FileListItem[];
  className?: string;
};

/**
 * Gebaseerd op Figma's "File"/"File List"-componenten (node 2002:10244 /
 * 2002:10249, beta): een downloadbaar bestand als kaart — grijze
 * pictogram-cirkel (lichtgroen `#EEF4E3`, bevestigd uit Figma's cirkel-SVG;
 * eerder grijs `#f6f6f7` — als CSS-kleur i.p.v. los asset) + titel/beschrijving + een "PDF"-badge +
 * download-icoon. Volgens Figma's eigen componentbeschrijving is "de hele
 * kaart standaard klikbaar" — daarom de hele rij als `<a>` i.p.v. alleen het
 * download-icoon, met `download` zodat de browser het bestand opslaat i.p.v.
 * ernaartoe te navigeren.
 *
 * Nieuw gedownloade assets: `file.svg` (16×16, document-icoon) en
 * `download-file.svg` — bewust een apart bestand van het al bestaande
 * `download.svg`: de paden verschillen net genoeg (andere pijl-verhouding)
 * om niet zonder meer als hetzelfde asset te hergebruiken.
 */
export function FileList({ items, className }: FileListProps) {
  return (
    <div className={className ?? "flex w-full flex-col items-start gap-2"}>
      {items.map((item) => (
        <a
          key={item.href + item.title}
          href={item.href}
          download
          className="flex w-full items-center gap-3 overflow-hidden rounded-md border border-[rgba(0,0,0,0.12)] bg-white py-3 pr-6 pl-4 hover:bg-[#fafafa]"
        >
          <span className="flex shrink-0 items-center justify-center rounded-full bg-[#eef4e3] p-3">
            <Icon name="file" size="md" />
          </span>
          <div className="flex min-w-0 flex-1 flex-wrap items-center gap-x-4 gap-y-2 pr-2">
            <div className="flex min-w-[128px] flex-1 flex-col items-start">
              <p className="w-full text-black text-lg leading-[1.5]" style={{ fontFamily: "var(--font-avenir-medium)" }}>
                {item.title}
              </p>
              <p className="w-full text-[#565656] text-base leading-[1.5]" style={{ fontFamily: "var(--font-avenir-book)" }}>
                {item.description}
              </p>
            </div>
            <span
              className="flex h-8 shrink-0 items-center justify-center rounded-full bg-[rgba(0,0,0,0.08)] px-3 text-black text-sm leading-[1.5]"
              style={{ fontFamily: "var(--font-avenir-medium)" }}
            >
              PDF
            </span>
          </div>
          <span className="shrink-0">
            <Icon name="download-file" size="md" />
          </span>
        </a>
      ))}
    </div>
  );
}
