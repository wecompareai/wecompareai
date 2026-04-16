"use client";

import dynamic from "next/dynamic";

const ProfessionPicker   = dynamic(() => import("./ProfessionPicker"),   { ssr: false });
const AlternativesPicker = dynamic(() => import("./AlternativesPicker"), { ssr: false });
const CountryPicker      = dynamic(() => import("./CountryPicker"),      { ssr: false });
const BestForPicker      = dynamic(() => import("./BestForPicker"),      { ssr: false });
const RankingsPicker     = dynamic(() => import("./RankingsPicker"),     { ssr: false });

export default function QuickFinders() {
  return (
    <>
      <BestForPicker />
      <ProfessionPicker />
      <AlternativesPicker />
      <CountryPicker />
      <RankingsPicker />
    </>
  );
}
