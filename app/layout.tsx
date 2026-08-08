import type { ReactNode } from "react";
import "./globals.css";
import { avenirHeavy, avenirMedium, avenirBook, avenirLight, memphisBold, memphisMedium, memphisLight } from "./fonts";

const fontVariables = [
  avenirHeavy.variable,
  avenirMedium.variable,
  avenirBook.variable,
  avenirLight.variable,
  memphisBold.variable,
  memphisMedium.variable,
  memphisLight.variable,
].join(" ");

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="nl" className={fontVariables}>
      <body>{children}</body>
    </html>
  );
}
