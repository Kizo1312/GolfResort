import React from "react";
import BookingsOverTimeChart from "@/components/Admin/charts/BookingsOverTimeChart";
import TereniAnalitika from "@/components/Admin/charts/TereniAnalitika";
import RezervacijeVremenskaAnalitika from "@/components/Admin/charts/RezervacijeVremenskaAnalitika";



const Analitika = () => {
  return (
    <>
    <h1 className="text-2xl font-bold">Analitika</h1>
    <TereniAnalitika/>
    <RezervacijeVremenskaAnalitika/>
    <div className="space-y-6">
      <BookingsOverTimeChart />
      {/* Ovdje kasnije dodaj ostale grafove */}
    </div>
    </>
  );
};

export default Analitika;
