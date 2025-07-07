import React, { useState, useEffect } from "react";
import { useFetchData } from "@/hooks/useFetchData";
import { useReservation } from "@/components/Context/ReservationContext";
import { useNavigate } from "react-router-dom";
import { useTerrains } from "@/components/Context/TerrainsContext";
import map1 from "../../assets/tereni/1-map.svg";
import map2 from "../../assets/tereni/2-map.svg";
import map3 from "../../assets/tereni/3-map.svg";
import map4 from "../../assets/tereni/4-map.svg";
import map5 from "../../assets/tereni/5-map.svg";
import map6 from "../../assets/tereni/6-map.svg";
import map7 from "../../assets/tereni/7-map.svg";
import map8 from "../../assets/tereni/8-map.svg";
import wellness1 from "../../assets/wellness/ilustracija_aromaterapija.webp";
import wellness2 from "../../assets/wellness/ilustracija_masaza.webp";
import wellness3 from "../../assets/wellness/ilustracija_sauna.webp";
import golfkategorija from "../../assets/hero/HeroImage.webp";
import wellnesskategorija from "../../assets/hero/HeroImage3.webp";

const terrainImages: Record<number, string> = {
  1: map1,
  2: map2,
  3: map3,
  4: map4,
  5: map5,
  6: map6,
  7: map7,
  8: map8,
};

const wellnessImages: Record<number, string> = {
  12: wellness2,
  13: wellness3,
  14: wellness1,
};

type Terrain = {
  id: number;
  name: string;
  description: string;
  price: string;
  inventory: number;
};

const ReservationCategory = () => {
  const navigate = useNavigate();
  const { reservation, setReservationData, goToStep } = useReservation();
  const category = reservation.category || null;
  const { getById } = useTerrains();

  const selectedWellness =
    category === "wellness" && reservation.reservation_items?.[0]
      ? getById(reservation.reservation_items[0].service_id)
      : null;

  useEffect(() => {
    goToStep("category");
    if (!reservation.category) {
      setReservationData({ category: "golf" });
    }
  }, []);

  const { data: tereni } = useFetchData<Terrain[]>("/services/golf%20teren");
  const { data: wellnessUsluge } =
    useFetchData<Terrain[]>("/services/wellness");
  const { data: dodatneUsluge } = useFetchData<Terrain[]>(
    "/services/dodatna%20usluga"
  );

  const selectedTerrain: Terrain | null = reservation.reservation_items?.[0]
    ? (getById(
        reservation.reservation_items[0].service_id
      ) as unknown as Terrain)
    : null;

  const handleOdaberiTeren = (t: Terrain) => {
    setReservationData({
      category: "golf",
      reservation_items: [{ service_id: t.id, quantity: 1 }],
    });
  };

  const handleOdaberiWellness = (w: Terrain) => {
    setReservationData({
      category: "wellness",
      reservation_items: [{ service_id: w.id, quantity: 1 }],
    });
  };
  const sortedTereni = tereni?.sort((a,b) => a.id -b.id)
  const sortedByAvailable = sortedTereni?.sort((a, b) => (a.inventory === 0 ? 1 : 0) - (b.inventory === 0 ? 1 : 0));


  return (
    <div className="space-y-8 max-w-4xl mx-auto p-6">
      {/* Prikaz odabira kategorije samo ako još ništa nije odabrano */}
      {!selectedTerrain && !selectedWellness && (
        <>
          <h2 className="text-3xl font-bold">Odaberite kategoriju</h2>
          <div className="flex flex-col md:flex-row gap-6">
            {[
              {
                key: "golf",
                title: "Golf Courses",
                desc: "Rezervirajte vrhunske golf terene.",
                img: golfkategorija,
              },
              {
                key: "wellness",
                title: "Wellness",
                desc: "Opustite se u wellness oazi.",
                img: wellnesskategorija,
              },
            ].map((c) => (
              <button
                key={c.key}
                onClick={() => {
                  setReservationData({
                    category: c.key as "golf" | "wellness",
                    reservation_items: [],
                  });
                }}
                className={`flex w-full md:w-1/2 rounded-xl overflow-hidden shadow transition ${
                  category === c.key
                    ? "ring-2 ring-green-600"
                    : "opacity-60 hover:opacity-100"
                }`}
              >
                <div className="w-36 h-28 md:w-48 md:h-36 flex-shrink-0">
                  <img
                    src={c.img}
                    alt={c.title}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex-1 p-4 text-left">
                  <h3 className="text-lg font-semibold">{c.title}</h3>
                  <p className="text-sm text-gray-600">{c.desc}</p>
                </div>
              </button>
            ))}
          </div>
        </>
      )}

      {/* Golf tereni */}
      {category === "golf" && !selectedTerrain && (
        <>
          <h3 className="text-xl font-medium mt-4">Odaberi teren</h3>
         
          <ul className="space-y-4">
            {sortedByAvailable?.map((t) => (
              <li
                key={t.id}
                className={`flex items-center bg-white shadow rounded-xl overflow-hidden transition ${
                  t.inventory === 0
                    ? "opacity-50 cursor-not-allowed"
                    : "hover:ring-2 hover:ring-green-500"
                }`}
              >
                <div className="w-32 h-24 flex justify-center items-center flex-shrink-0 pl-2">
                  <img
                    src={terrainImages[t.id]}
                    alt={`Mapa terena ${t.name}`}
                    className="max-w-full max-h-full object-contain"
                  />
                </div>
                <div className="flex-1 p-4 flex flex-col justify-between">
                  <div>
                    <h4 className="font-semibold">{t.name}</h4>
                    <p className="text-gray-700 mb-4">
                      {t.description?.split(".")[0] + "."}
                    </p>
                    <p className="text-sm text-green-700 font-medium mt-1">
                      {t.price} €
                    </p>
                  </div>
                  {t.inventory > 0 ? (
                    <button
                      onClick={() => handleOdaberiTeren(t)}
                      className="mt-2 bg-green-600 text-white px-4 py-1 rounded text-sm self-start"
                    >
                      Odaberi
                    </button>
                  ) : (
                    <span className="mt-2 text-red-500 text-sm font-medium">
                      Nedostupno
                    </span>
                  )}
                </div>
              </li>
            ))}
          </ul>
        </>
      )}

      {/* Prikaz već izabranog terena + dodatne usluge */}
      {category === "golf" && selectedTerrain && (
        <>
          <h3 className="text-xl font-medium mt-4">Odabrani teren</h3>
          <div className="p-4 border rounded bg-white shadow flex flex-col justify-between h-full">
            <div>
              <p>
                <strong>{selectedTerrain.name}</strong>
              </p>
              <div className="flex items-center gap-4 mt-2">
                <div className="w-32 h-24 flex justify-center items-center flex-shrink-0 pl-2">
                  <img
                    src={terrainImages[selectedTerrain.id]}
                    alt={`Mapa terena ${selectedTerrain.name}`}
                    className="max-w-full max-h-full object-contain"
                  />
                </div>
                <p className="text-gray-700 mb-4">
                  {selectedTerrain.description?.split(".")[0] + "."}
                </p>
              </div>
            </div>

            <p className="text-green-600 font-semibold self-end">
              {selectedTerrain.price} €
            </p>
          </div>

          <h3 className="text-xl font-medium mt-4">Dodatne usluge</h3>
          {dodatneUsluge?.map((u) => (
            <ExtraRow
              key={u.id}
              label={u.name}
              id={u.id}
              inventory={u.inventory}
            />
          ))}

          <div className="mt-6 flex justify-between">
            <button
              onClick={() => {
                setReservationData({
                  category: category,
                  reservation_items: [],
                  date: undefined,
                  start_time: undefined,
                  duration_minutes: undefined,
                  user_id: undefined,
                });
                navigate("/rezervacije");
              }}
              className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold py-2 px-6 rounded"
            >
              Otkaži
            </button>

            {selectedTerrain.inventory === 0 && (
              <p className="text-red-600 font-medium mt-2">
                Ovaj teren trenutno nije dostupan za rezervaciju.
              </p>
            )}

            <button
              onClick={() => {
                if (selectedTerrain.inventory > 0) {
                  goToStep("termin");
                  navigate("/rezervacija/termin");
                }
              }}
              disabled={selectedTerrain.inventory === 0}
              className={`px-6 py-2 rounded font-semibold transition ${
                selectedTerrain.inventory === 0
                  ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                  : "bg-green-600 hover:bg-green-700 text-white"
              }`}
            >
              {selectedTerrain.inventory === 0 ? "Nedostupno" : "Nastavi"}
            </button>
          </div>
        </>
      )}

      {/* Wellness usluge */}
      {category === "wellness" && !selectedWellness && (
        <>
          <h3 className="text-xl font-medium mt-4">Odaberi wellness uslugu</h3>
          <ul className="space-y-4">
            {wellnessUsluge?.map((w) => (
              <li
                key={w.id}
                className="flex bg-white shadow rounded-xl overflow-hidden hover:ring-2 hover:ring-green-500 transition"
              >
                <div className="w-32 h-24 flex justify-center items-center flex-shrink-0 pl-2">
                  <img
                    src={wellnessImages[w.id]}
                    alt={`Wellness usluga: ${w.name}`}
                    className="max-w-full max-h-full object-contain"
                  />
                </div>
                <div className="flex-1 p-4 flex flex-col justify-between">
                  <div>
                    <h4 className="font-semibold">{w.name}</h4>
                    <p className="text-sm text-gray-600">
                      {w.description?.split(".")[0] + "."}
                    </p>
                    <p className="text-sm text-green-700 font-medium mt-1">
                      {w.price} €
                    </p>
                  </div>
                  <button
                    onClick={() => handleOdaberiWellness(w)}
                    className="mt-2 bg-green-600 text-white px-4 py-1 rounded text-sm self-start"
                  >
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
          <h3 className="text-xl font-medium mt-4">Odabrana wellness usluga</h3>

          <div className="p-4 border rounded bg-white shadow flex flex-col justify-between h-full">
            <div>
              <p>
                <strong>{selectedWellness.name}</strong>
              </p>
              <div className="flex items-center gap-4 mt-2">
                <div className="w-32 h-24 flex justify-center items-center flex-shrink-0 pl-2">
                  <img
                    src={wellnessImages[selectedWellness.id]}
                    alt={`Slika usluge ${selectedWellness.name}`}
                    className="max-w-full max-h-full object-contain"
                  />
                </div>
                <p className="text-gray-700 mb-4">
                  {selectedWellness.description?.split(".")[0] + "."}
                </p>
              </div>
            </div>

            <p className="text-green-600 font-semibold self-end">
              {selectedWellness.price} €
            </p>
          </div>

          <div className="mt-6 flex justify-between">
            <button
              onClick={() => {
                setReservationData({
                  category: category,
                  reservation_items: [],
                  date: undefined,
                  start_time: undefined,
                  duration_minutes: undefined,
                  user_id: undefined,
                });
                navigate("/rezervacije");
              }}
              className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold py-2 px-6 rounded"
            >
              Otkaži
            </button>

            <button
              onClick={() => {
                goToStep("termin");
                navigate("/rezervacija/termin");
              }}
              className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded"
            >
              Nastavi
            </button>
          </div>
        </>
      )}

    </div>
  );
};

const ExtraRow = ({
  label,
  id,
  inventory,
}: {
  label: string;
  id: number;
  inventory: number;
}) => {
  const { setReservationData, reservation } = useReservation();
  const existingItem = reservation.reservation_items?.find(
    (item) => item.service_id === id
  );
  const [q, setQ] = useState(existingItem?.quantity || 0);

  useEffect(() => {
    const filtered =
      reservation.reservation_items?.filter((item) => item.service_id !== id) ||
      [];
    const updated =
      q > 0 ? [...filtered, { service_id: id, quantity: q }] : filtered;
    setReservationData({ reservation_items: updated });
  }, [q]);

  return (
    <div className="flex justify-between items-center border-b py-2">
      <span>
        {label} <span className="text-sm text-gray-500">(max {inventory})</span>
      </span>
      <div className="flex items-center gap-2">
        <button
          onClick={() => setQ(Math.max(0, q - 1))}
          className="px-2 bg-gray-300 rounded"
        >
          −
        </button>
        <span>{q}</span>
        <button
          onClick={() => q < inventory && setQ(q + 1)}
          disabled={q >= inventory}
          className={`px-2 rounded ${
            q >= inventory
              ? "bg-gray-200 text-gray-400 cursor-not-allowed"
              : "bg-gray-300"
          }`}
        >
          +
        </button>
      </div>
    </div>
  );
};

export default ReservationCategory;
