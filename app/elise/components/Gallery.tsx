const imgGallery1 = "/elise/assets/gallery-1.png";
const imgGallery2 = "/elise/assets/gallery-2.png";
const imgGallery3 = "/elise/assets/gallery-3.png";

export default function Gallery() {
  return (
    <div className="flex w-full items-end" data-node-id="5:36" data-name="Frame 3">
      <div className="flex flex-1 flex-col items-start font-light text-black" data-node-id="5:35">
        <p className="mb-0 w-full text-[50px] uppercase leading-[1.2] tracking-[9px]" data-node-id="5:30">
          Behind the Surface
        </p>
        <p className="w-[367px] text-[18px] leading-[1.5]" data-node-id="5:33">
          Letting go of expectations to make space for authenticity, presence, and creative freedom.
        </p>
      </div>
      <div className="flex h-[465px] w-[1161px] items-center justify-center gap-[24px]" data-node-id="5:16">
        <div className="relative aspect-[416/517] min-w-px flex-1" data-node-id="5:9">
          <img alt="" src={imgGallery1} className="pointer-events-none absolute inset-0 size-full object-cover" />
        </div>
        <div className="relative aspect-[416/517] min-w-px flex-1" data-node-id="5:10">
          <img alt="" src={imgGallery2} className="pointer-events-none absolute inset-0 size-full object-cover" />
        </div>
        <div className="relative aspect-[416/517] min-w-px flex-1" data-node-id="5:12">
          <img alt="" src={imgGallery3} className="pointer-events-none absolute inset-0 size-full object-cover object-bottom" />
        </div>
      </div>
    </div>
  );
}
