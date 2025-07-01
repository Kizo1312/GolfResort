import React, { useState, useEffect } from "react";
import { useFetchData } from "@/hooks/useFetchData";
import { useReservation } from "@/components/Context/ReservationContext";
import { useNavigate } from "react-router-dom";
import { useTerrains } from "@/components/Context/TerrainsContext";

type Terrain = {
  id: number;
  name: string;
  description: string;
  price: string;
};

const ReservationCategory = () => {
  const navigate = useNavigate();
  const { reservation, setReservationData, goToStep } = useReservation();
  const [category, setCategory] = useState<"golf" | "wellness" | null>("golf");
  const { getById } = useTerrains();

  const [selectedWellness, setSelectedWellness] = useState<Terrain | null>(null);

  // ► Na ulazu: postavi currentStep = "category"
  useEffect(() => {
    goToStep("category");
    if (reservation.category) {
      setCategory(reservation.category);
    } else {
      setReservationData({ category: "golf" });
      setCategory("golf");
    }
  }, []);

  const { data: tereni } = useFetchData<Terrain[]>("/services/golf%20teren");
  const { data: wellnessUsluge } = useFetchData<Terrain[]>("/services/wellness");
  const { data: dodatneUsluge } = useFetchData<Terrain[]>("/services/dodatna%20usluga");

  const selectedTerrain = reservation.reservation_items?.[0]
    ? getById(reservation.reservation_items[0].service_id)
    : null;

  const handleOdaberiTeren = (t: Terrain) => {
    setReservationData({
      category: "golf",
      reservation_items: [{ service_id: t.id, quantity: 1 }],
    });
  };

  const handleOdaberiWellness = (w: Terrain) => {
    setSelectedWellness(w);
    setReservationData({
      category: "wellness",
      reservation_items: [{ service_id: w.id, quantity: 1 }],
    });
  };

  return (
    <div className="space-y-8 max-w-4xl mx-auto p-6">
      <h2 className="text-3xl font-bold">Odaberite kategoriju</h2>

      {/* Kategorije */}
      <div className="flex flex-col md:flex-row gap-6">
        {[
          {
            key: "golf",
            title: "Golf Courses",
            desc: "Rezervirajte vrhunske golf terene.",
            img: "https://source.unsplash.com/400x300/?golf",
          },
          {
            key: "wellness",
            title: "Wellness",
            desc: "Opustite se u wellness oazi.",
            img: "https://source.unsplash.com/400x300/?spa",
          },
        ].map((c) => (
          <button
            key={c.key}
            onClick={() => {
              setCategory(c.key as "golf" | "wellness");
              setReservationData({
                category: c.key as "golf" | "wellness",
                reservation_items: [],
              });
              setSelectedWellness(null);
            }}
            className={`flex w-full md:w-1/2 rounded-xl overflow-hidden shadow transition ${
              category === c.key
                ? "ring-2 ring-green-600"
                : "opacity-60 hover:opacity-100"
            }`}
          >
            <div className="w-36 h-28 md:w-48 md:h-36 flex-shrink-0">
              <img src={c.img} alt={c.title} className="w-full h-full object-cover" />
            </div>
            <div className="flex-1 p-4 text-left">
              <h3 className="text-lg font-semibold">{c.title}</h3>
              <p className="text-sm text-gray-600">{c.desc}</p>
            </div>
          </button>
        ))}
      </div>

      {/* Golf tereni */}
      {category === "golf" && !selectedTerrain && (
        <>
          <h3 className="text-xl font-medium mt-4">Odaberi teren</h3>
          <ul className="space-y-4">
            {tereni?.map((t) => (
              <li key={t.id} className="flex bg-white shadow rounded-xl overflow-hidden hover:ring-2 hover:ring-green-500 transition">
                <div className="w-32 h-24 bg-gray-200 flex-shrink-0">
                  <img src="https://source.unsplash.com/128x96/?golfcourse" alt={t.name} className="w-full h-full object-cover" />
                </div>
                <div className="flex-1 p-4 flex flex-col justify-between">
                  <div>
                    <h4 className="font-semibold">{t.name}</h4>
                    <p className="text-sm text-gray-600">{t.description}</p>
                    <p className="text-sm text-green-700 font-medium mt-1">{t.price} €</p>
                  </div>
                  <button onClick={() => handleOdaberiTeren(t)} className="mt-2 bg-green-600 text-white px-4 py-1 rounded text-sm self-start">
                    Odaberi
                  </button>
                </div>
              </li>
            ))}
          </ul>
        </>
      )}

      {/* Prikaz već izabranog terena */}
      {category === "golf" && selectedTerrain && (
        <>
          <h3 className="text-xl font-medium mt-4">Odabrani teren</h3>
          <div className="p-4 border rounded bg-white shadow">
            <p><strong>{selectedTerrain.name}</strong></p>
            <p className="text-gray-600">{selectedTerrain.description}</p>
            <p className="text-green-600 font-semibold">{selectedTerrain.price} €</p>
          </div>

          <h3 className="text-xl font-medium mt-4">Dodatne usluge</h3>
          {dodatneUsluge?.map((u) => (
            <ExtraRow key={u.id} label={u.name} id={u.id} />
          ))}

          <button
            onClick={() => {
              goToStep("termin");
              navigate("/rezervacija/termin");
            }}
            className="mt-6 bg-green-600 text-white px-6 py-2 rounded"
          >
            Nastavi
          </button>
        </>
      )}

      {/* Wellness usluge */}
      {category === "wellness" && !selectedWellness && (
        <>
          <h3 className="text-xl font-medium mt-4">Odaberi wellness uslugu</h3>
          <ul className="space-y-4">
            {wellnessUsluge?.map((w) => (
              <li key={w.id} className="flex bg-white shadow rounded-xl overflow-hidden hover:ring-2 hover:ring-green-500 transition">
                <div className="w-32 h-24 bg-gray-200 flex-shrink-0">
                  <img src="https://source.unsplash.com/128x96/?spa" alt={w.name} className="w-full h-full object-cover" />
                </div>
                <div className="flex-1 p-4 flex flex-col justify-between">
                  <div>
                    <h4 className="font-semibold">{w.name}</h4>
                    <p className="text-sm text-gray-600">{w.description}</p>
                    <p className="text-sm text-green-700 font-medium mt-1">{w.price} €</p>
                  </div>
                  <button onClick={() => handleOdaberiWellness(w)} className="mt-2 bg-green-600 text-white px-4 py-1 rounded text-sm self-start">
                    Odaberi
                  </button>
                </div>
              </li>
            ))}
          </ul>
        </>
      )}

      {/* Potvrda wellness usluge */}
      {category === "wellness" && selectedWellness && (
        <>
          <h3 className="text-xl font-medium">Odabrali ste: {selectedWellness.name}</h3>
          <p className="text-gray-700">{selectedWellness.description}</p>
          <p className="text-green-700 font-semibold pt-1">{selectedWellness.price} €</p>
          <button
            onClick={() => {
              goToStep("termin");
              navigate("/rezervacija/termin");
            }}
            className="mt-6 bg-green-600 text-white px-6 py-2 rounded"
          >
            Nastavi
          </button>
        </>
      )}
    </div>
  );
};

/* ────────────────────────────────────────────────────────── */
/* Dodatne golf-usluge (brojač)                              */
const ExtraRow = ({ label, id }: { label: string; id: number }) => {
  const [q, setQ] = useState(0);
  const { setReservationData, reservation } = useReservation();

  useEffect(() => {
    const filtered = reservation.reservation_items?.filter((item) => item.service_id !== id) || [];
    const updated = q > 0 ? [...filtered, { service_id: id, quantity: q }] : filtered;
    setReservationData({ reservation_items: updated });
  }, [q]);

  return (
    <div className="flex justify-between items-center border-b py-2">
      <span>{label}</span>
      <div className="flex items-center gap-2">
        <button onClick={() => setQ(Math.max(0, q - 1))} className="px-2 bg-gray-300 rounded">−</button>
        <span>{q}</span>
        <button onClick={() => setQ(q + 1)} className="px-2 bg-gray-300 rounded">+</button>
      </div>
    </div>
  );
};

export default ReservationCategory;
