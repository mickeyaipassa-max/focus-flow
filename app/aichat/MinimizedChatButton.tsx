"use client";

import { useState } from "react";

type MinimizedChatButtonProps = {
  onClick: () => void;
  btnRef?: React.RefObject<HTMLButtonElement | null>;
};

/**
 * Zwevende "launcher"-knop die verschijnt zodra er een gesprek loopt maar het
 * venster geminimaliseerd is — bevestigd via Figma ("Component 1", node
 * 41:1721, state=Default/Hover) en de Figma Make-broncode: 72px cirkel,
 * a.s.r.-spraakbelletje-pictogram, groen "online"-stipje rechtsboven.
 * Zelfde positie als het chatvenster (`bottom-20 right-[120px]`, fixed).
 */
export function MinimizedChatButton({ onClick, btnRef }: MinimizedChatButtonProps) {
  const [hovered, setHovered] = useState(false);

  return (
    <button
      ref={btnRef}
      type="button"
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      aria-label="Chat openen"
      className="fixed right-[120px] bottom-20 z-50 rounded-full transition-transform duration-200"
      style={{
        width: 72,
        height: 72,
        filter: "drop-shadow(0px 4px 12px rgba(0,0,0,0.32))",
        transform: hovered ? "scale(1.08)" : "scale(1)",
      }}
    >
      <span
        className="relative flex size-full items-center justify-center rounded-full transition-colors duration-150"
        style={{ backgroundColor: hovered ? "#f0b335" : "#eda50f" }}
      >
        <img src="/icons/pictogram-chat-assistent.svg" alt="" className="size-12" />
        <span className="absolute top-[4px] right-[3px] size-4 rounded-full border-2 border-white bg-[#0f865d]" />
      </span>
    </button>
  );
}
