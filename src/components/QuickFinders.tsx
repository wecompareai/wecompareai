"use client";

import dynamic from "next/dynamic";

const ProfessionPicker   = dynamic(() => import("./ProfessionPicker"),   { ssr: false });
const AlternativesPicker = dynamic(() => import("./AlternativesPicker"), { ssr: false });
const CountryPicker      = dynamic(() => import("./CountryPicker"),      { ssr: false });

export default function QuickFinders() {
  return (
    <>
      <ProfessionPicker />
      <AlternativesPicker />
      <CountryPicker />
    </>
  );
}
