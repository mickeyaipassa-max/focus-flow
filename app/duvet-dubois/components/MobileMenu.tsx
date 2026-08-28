"use client";

import { useState } from "react";
import Link from "next/link";

const imgMenuIcon = "/duvet-dubois/mobile-assets/menu-hamburger-icon.svg";
const imgCloseIcon = "/duvet-dubois/mobile-assets/menu-close-icon.svg";
const imgChevronRight = "/duvet-dubois/mobile-assets/menu-chevron-right.svg";
const imgDivider = "/duvet-dubois/mobile-assets/menu-divider.svg";
const imgPhone = "/duvet-dubois/mobile-assets/home-icon-phone.svg";
const imgMail = "/duvet-dubois/mobile-assets/home-icon-mail.svg";
const imgEllipseBas = "/duvet-dubois/mobile-assets/home-avatar-bas.png";
const imgEllipseFrans = "/duvet-dubois/mobile-assets/home-avatar-frans.svg";

function NavRow({ label, href }: { label: string; href?: string }) {
  const content = (
    <div className="content-stretch flex items-center justify-between relative shrink-0 w-full h-[48px]">
      <p className="[word-break:break-word] font-medium leading-[normal] not-italic relative shrink-0 text-[14px] text-black whitespace-nowrap">
        {label}
      </p>
      <div className="relative shrink-0 size-[24px]">
        <img alt="" className="absolute block inset-0 max-w-none size-full" src={imgChevronRight} />
      </div>
    </div>
  );

  if (!href) {
    return <div className="w-full">{content}</div>;
  }

  return (
    <Link href={href} className="w-full">
      {content}
    </Link>
  );
}

function ContactCard({
  avatar,
  name,
  phone,
  email,
}: {
  avatar: string;
  name: string;
  phone: string;
  email: string;
}) {
  return (
    <div className="bg-white content-stretch flex gap-[24px] items-center p-[24px] relative rounded-[8px] shrink-0 w-full">
      <div className="relative shrink-0 size-[80px] rounded-full overflow-hidden">
        <img alt="" className="absolute block inset-0 max-w-none size-full object-cover" src={avatar} />
      </div>
      <div className="content-stretch flex flex-col gap-[8px] items-start justify-center relative shrink-0">
        <p className="[word-break:break-word] font-semibold leading-[1.4] not-italic relative shrink-0 text-[14px] text-black whitespace-nowrap">
          {name}
        </p>
        <div className="content-stretch flex gap-[8px] items-center relative shrink-0">
          <div className="relative shrink-0 size-[24px]">
            <img alt="" className="absolute block inset-0 max-w-none size-full" src={imgPhone} />
          </div>
          <p className="[word-break:break-word] font-medium leading-[1.4] not-italic relative shrink-0 text-[14px] text-black whitespace-nowrap">
            {phone}
          </p>
        </div>
        <div className="content-stretch flex gap-[8px] items-center relative shrink-0">
          <div className="relative shrink-0 size-[24px]">
            <img alt="" className="absolute block inset-0 max-w-none size-full" src={imgMail} />
          </div>
          <p className="[word-break:break-word] font-medium leading-[1.4] not-italic relative shrink-0 text-[14px] text-black whitespace-nowrap">
            {email}
          </p>
        </div>
      </div>
    </div>
  );
}

export default function MobileMenu() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        type="button"
        aria-label="Menu openen"
        aria-expanded={open}
        onClick={() => setOpen(true)}
        className="relative shrink-0 size-[24px]"
      >
        <img alt="" className="absolute block inset-0 max-w-none size-full" src={imgMenuIcon} />
      </button>

      <div
        className={`fixed inset-0 z-50 transition-opacity duration-300 ${
          open ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
        aria-hidden={!open}
      >
        <div
          className={`bg-[#fdf8f1] shadow-[0px_8px_24px_0px_rgba(0,0,0,0.16)] content-stretch flex flex-col gap-[18px] items-start absolute right-0 top-0 h-full w-[362px] px-[24px] py-[40px] transition-transform duration-300 ease-out ${
            open ? "translate-x-0" : "translate-x-full"
          }`}
        >
          <div className="content-stretch flex gap-[18px] items-center justify-between relative shrink-0 w-full">
            <p className="[word-break:break-word] font-medium leading-[normal] not-italic relative shrink-0 text-[18px] text-black whitespace-nowrap">
              Menu
            </p>
            <button type="button" aria-label="Menu sluiten" onClick={() => setOpen(false)} className="relative shrink-0 size-[24px]">
              <img alt="" className="absolute block inset-0 max-w-none size-full" src={imgCloseIcon} />
            </button>
          </div>

          <div className="h-0 relative shrink-0 w-full">
            <img alt="" className="absolute block inset-0 max-w-none size-full" src={imgDivider} />
          </div>

          <NavRow label="Home" href="/duvet-dubois" />
          <NavRow label="Diensten" />
          <NavRow label="Over ons" href="/duvet-dubois/over-ons" />
          <NavRow label="Nieuws" href="/duvet-dubois/nieuws" />
          <NavRow label="Contact" />

          <div className="content-stretch flex flex-col gap-[16px] items-center justify-end relative w-full flex-1">
            <ContactCard avatar={imgEllipseBas} name="Bas Neijenhuis" phone="+31 (0)6 24 835 810" email="bas@ddad.nl" />
            <ContactCard avatar={imgEllipseFrans} name="Frans van den Bosch" phone="+31 (0)6 24 835 810" email="bas@ddad.nl" />
          </div>
        </div>
      </div>
    </>
  );
}
