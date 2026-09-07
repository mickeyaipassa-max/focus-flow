const imgPortrait = "/elise/assets/portrait-large.png";

export default function ImageText() {
  return (
    <div className="mt-[163px] flex w-full items-end justify-between" data-node-id="5:48">
      <div className="relative h-[1167px] w-[807px]" data-node-id="5:21">
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <img
            alt=""
            src={imgPortrait}
            className="absolute left-[-7.42%] top-0 h-full w-[114.37%] max-w-none"
          />
        </div>
      </div>
      <div className="flex w-[511px] flex-col items-start bg-black p-[24px]" data-node-id="5:63">
        <div className="flex w-full flex-col items-start font-light text-[#ECEBE5]" data-node-id="5:44">
          <p className="w-full text-[50px] leading-[1.2] tracking-[9px]" data-node-id="5:45">
            BY ELISE
          </p>
          <p className="w-[367px] text-[18px] leading-[1.5]" data-node-id="5:46">
            is about letting go of expectations and revealing what lies beneath the surface. By slowing down and being present, we create space for authenticity, curiosity, and creative freedom.
          </p>
        </div>
      </div>
    </div>
  );
}
