import type { ReactNode } from "react";

type FunnelBoxProps = {
  /**
   * Figma modelleert dit component zelf als een leeg "component slot"
   * ("swap this") — de daadwerkelijke inhoud (bv. een producttegel of de
   * Receipt-sidebar) verschilt per funnel-scherm en is dus geen vaste
   * content van dit component, maar children.
   */
  children: ReactNode;
  className?: string;
};

export function FunnelBox({ children, className }: FunnelBoxProps) {
  return (
    <div
      className={
        className ??
        "flex flex-col items-start gap-10 rounded-md bg-white p-6 shadow-[0px_4px_8px_rgba(0,0,0,0.12)]"
      }
    >
      {children}
    </div>
  );
}
