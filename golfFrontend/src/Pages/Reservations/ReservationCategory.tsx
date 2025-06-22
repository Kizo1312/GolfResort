import { useState } from "react";
import { useFetchData } from "@/hooks/useFetchData";

type Terrain = { id: number; name: string; description: string; price: string };

const categories = [
  {
    key: "golf" as const,
    title: "Golf Courses",
    desc: "Rezervirajte vrhunske golf terene.",
    img: "https://source.unsplash.com/400x300/?golf",
  },
  {
    key: "wellness" as const,
    title: "Wellness",
    desc: "Opustite se u wellness oazi.",
    img: "https://source.unsplash.com/400x300/?spa",
  },
];

const ReservationCategory = () => {
  const [category, setCategory] = useState<"golf" | "wellness" | null>('golf');
  const [terrain, setTerrain] = useState<Terrain | null>(null);
  const [selectedWellness, setSelectedWellness] = useState<Terrain | null>(null);

  const {
    data: tereni,
    loading: loadingTereni,
    error: errorTereni,
  } = useFetchData<Terrain[]>("/services/golf%20teren");

  const {
    data: wellnessUsluge,
    loading: loadingWellness,
    error: errorWellness,
  } = useFetchData<Terrain[]>("/services/wellness");

  return (
    <div className="space-y-8 max-w-4xl mx-auto p-6">
      <h2 className="text-3xl font-bold">Odaberite kategoriju</h2>

      {/* Kategorije */}
      <div className="flex flex-col md:flex-row gap-6">
        {categories.map((c) => {
          const active = category === c.key;
          return (
            <button
              key={c.key}
              onClick={() => {
                setCategory(c.key);
                setTerrain(null);
                setSelectedWellness(null);
              }}
              className={`flex w-full md:w-1/2 rounded-xl overflow-hidden shadow transition
                ${active ? "ring-2 ring-green-600" : "opacity-60 hover:opacity-100"}`}
            >
              <div className="w-36 h-28 md:w-48 md:h-36 flex-shrink-0">
                <img src={c.img} alt={c.title} className="w-full h-full object-cover" />
              </div>
              <div className="flex-1 p-4 text-left">
                <h3 className="text-lg font-semibold">{c.title}</h3>
                <p className="text-sm text-gray-600">{c.desc}</p>
              </div>
            </button>
          );
        })}
      </div>

      {/* GOLF TERENI */}
      {category === "golf" && !terrain && (
        <>
          <h3 className="text-xl font-medium mt-4">Odaberi teren</h3>
          {loadingTereni && <p>Učitavanje...</p>}
          {errorTereni && <p>Greška: {errorTereni}</p>}
          <ul className="space-y-4">
            {tereni?.map((t) => (
              <li
                key={t.id}
                className="flex bg-white shadow rounded-xl overflow-hidden hover:ring-2 hover:ring-green-500 transition"
              >
                <div className="w-32 h-24 bg-gray-200 flex-shrink-0">
                  <img
                    src="https://source.unsplash.com/128x96/?golfcourse"
                    alt={t.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex-1 p-4 flex flex-col justify-between">
                  <div>
                    <h4 className="font-semibold">{t.name}</h4>
                    <p className="text-sm text-gray-600">{t.description}</p>
                    <p className="text-sm text-green-700 font-medium mt-1">{t.price} €</p>
                  </div>
                  <button
                    onClick={() => setTerrain(t)}
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

      {/* WELLNESS USLUGE */}
      {category === "wellness" && !selectedWellness && (
        <>
          <h3 className="text-xl font-medium mt-4">Odaberi wellness uslugu</h3>
          {loadingWellness && <p>Učitavanje...</p>}
          {errorWellness && <p>Greška: {errorWellness}</p>}
          <ul className="space-y-4">
            {wellnessUsluge?.map((w) => (
              <li
                key={w.id}
                className="flex bg-white shadow rounded-xl overflow-hidden hover:ring-2 hover:ring-green-500 transition"
              >
                <div className="w-32 h-24 bg-gray-200 flex-shrink-0">
                  <img
                    src="https://source.unsplash.com/128x96/?spa"
                    alt={w.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex-1 p-4 flex flex-col justify-between">
                  <div>
                    <h4 className="font-semibold">{w.name}</h4>
                    <p className="text-sm text-gray-600">{w.description}</p>
                    <p className="text-sm text-green-700 font-medium mt-1">{w.price} €</p>
                  </div>
                  <button
                    onClick={() => setSelectedWellness(w)}
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

      {/* DODATNE USLUGE ZA GOLF */}
      {category === "golf" && terrain && (
        <>
          <h3 className="text-xl font-medium">
            Dodatne usluge za: {terrain.name}
          </h3>
          {["Set palica", "Set loptica", "Caddy"].map((l) => (
            <ExtraRow key={l} label={l} />
          ))}
          <label className="inline-flex gap-2 items-center pt-3">
            <input type="checkbox" /> Trener
          </label>

          <button className="mt-6 bg-green-600 text-white px-6 py-2 rounded">
            Nastavi
          </button>
        </>
      )}

      {/* POTVRDA WELLNESS USLUGE */}
      {category === "wellness" && selectedWellness && (
        <>
          <h3 className="text-xl font-medium">Odabrali ste: {selectedWellness.name}</h3>
          <p className="text-gray-700">{selectedWellness.description}</p>
          <p className="text-green-700 font-semibold pt-1">{selectedWellness.price} €</p>
          <button className="mt-6 bg-green-600 text-white px-6 py-2 rounded">
            Nastavi
          </button>
        </>
      )}
    </div>
  );
};

/* Komponenta za brojač dodatnih usluga */
const ExtraRow = ({ label }: { label: string }) => {
  const [q, setQ] = useState(0);
  return (
    <div className="flex justify-between items-center border-b py-2">
      <span>{label}</span>
      <div className="flex items-center gap-2">
        <button
          onClick={() => setQ(Math.max(0, q - 1))}
          className="px-2 bg-gray-300 rounded"
        >
          −
        </button>
        <span>{q}</span>
        <button
          onClick={() => setQ(q + 1)}
          className="px-2 bg-gray-300 rounded"
        >
          +
        </button>
      </div>
    </div>
  );
};

export default ReservationCategory;
