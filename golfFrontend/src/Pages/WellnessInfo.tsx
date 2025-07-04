import React, { useState, useEffect } from "react";
import { useFetchData } from "../hooks/useFetchData";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useReservation } from "@/components/Context/ReservationContext";

import photo1 from "@/assets/wellnessinfo/1-wellness.webp";
import photo2 from "@/assets/wellnessinfo/2-wellness.webp";
import photo3 from "@/assets/wellnessinfo/3-wellness.webp";

const imageMap: Record<number, { photo: string }> = {
  13: { photo: photo1 },
  12: { photo: photo2 },
  14: { photo: photo3 },
};

type Wellness = {
  id: number;
  name: string;
  description: string;
};

const WellnessComponents = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { setReservationData, goToStep } = useReservation();

  const {
    data: wellnessList,
    loading,
    error,
  } = useFetchData<Wellness[]>("/services/wellness");
  const [selectedId, setSelectedId] = useState<number | null>(null);

  useEffect(() => {
    const selectedFromUrl = searchParams.get("selectedId");
    const parsedId = selectedFromUrl ? parseInt(selectedFromUrl) : null;

    if (wellnessList && wellnessList.length > 0) {
      if (parsedId && wellnessList.some((w) => w.id === parsedId)) {
        setSelectedId(parsedId);
      } else if (selectedId === null) {
        setSelectedId(wellnessList[0].id);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [wellnessList]);

  if (loading) return <p>Loading wellness options...</p>;
  if (error) return <p>Error: {error}</p>;
  if (!wellnessList || wellnessList.length === 0)
    return <p>No wellness options found.</p>;

  const selectedWellness = wellnessList.find((w) => w.id === selectedId);

  return (
    <div className="max-w-7xl mx-auto mt-10 shadow rounded overflow-hidden min-h-[600px]">
      {/* Mobile dropdown navigation */}
      <div className="md:hidden p-4 bg-gray-100">
        <select
          value={selectedId ?? ""}
          onChange={(e) => setSelectedId(Number(e.target.value))}
          className="w-full p-2 border rounded"
        >
          {wellnessList.map((wellness) => (
            <option key={wellness.id} value={wellness.id}>
              {wellness.name}
            </option>
          ))}
        </select>
      </div>

      <div className="flex flex-col md:flex-row">
        {/* Sidebar for desktop */}
        <aside className="hidden md:block w-[320px] flex-none bg-gray-100 p-6 overflow-y-auto">
          <nav className="flex flex-col space-y-2">
            {wellnessList.map((wellness) => (
              <button
                key={wellness.id}
                onClick={() => setSelectedId(wellness.id)}
                className={`p-3 rounded text-left w-full ${
                  wellness.id === selectedId
                    ? "bg-green-600 text-white font-semibold"
                    : "hover:bg-green-200 text-gray-700"
                }`}
              >
                {wellness.name}
              </button>
            ))}
          </nav>
        </aside>

        {/* Main content */}
        <main className="flex-grow bg-white p-8 flex flex-col">
          {selectedWellness ? (
            <>
              <h2 className="text-3xl font-semibold mb-4">
                {selectedWellness.name}
              </h2>
              <div className="flex justify-center mb-8">
                {imageMap[selectedWellness.id]?.photo ? (
                  <img
                    src={imageMap[selectedWellness.id].photo}
                    alt={`${selectedWellness.name} photo`}
                    className="rounded-lg object-cover max-h-[400px] w-auto"
                  />
                ) : (
                  <div className="rounded-lg bg-gray-300 w-full max-w-lg h-[400px] flex items-center justify-center text-gray-500">
                    No photo available
                  </div>
                )}
              </div>
              <p className="mb-6 text-gray-700">
                {selectedWellness.description}
              </p>

              <div className="mt-auto flex justify-end">
                <button
                  onClick={() => {
                    setReservationData({
                      category: "wellness",
                      reservation_items: [
                        { service_id: selectedWellness.id, quantity: 1 },
                      ],
                    });
                    goToStep("category");
                    navigate("/rezervacije");
                  }}
                  className="bg-green-600 text-white px-6 py-3 rounded hover:bg-green-700"
                >
                  Rezerviraj
                </button>
              </div>
            </>
          ) : (
            <p>Odaberite wellness opciju sa liste.</p>
          )}
        </main>
      </div>
    </div>
  );
};

export default WellnessComponents;
