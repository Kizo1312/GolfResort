import React, { useState, useEffect } from "react";
import { useFetchData } from "../hooks/useFetchData";
import { useNavigate, useSearchParams } from "react-router-dom";

type Wellness = {
  id: number;
  name: string;
  description: string;
  images: string[];
  pricePerHour: number;
};

const WellnessComponents = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const { data: wellnessList, loading, error } = useFetchData<Wellness[]>("/services/wellness");
  const [selectedId, setSelectedId] = useState<number | null>(null);

  useEffect(() => {
    const selectedFromUrl = searchParams.get("selectedId");
    const parsedId = selectedFromUrl ? parseInt(selectedFromUrl) : null;

    if (wellnessList && wellnessList.length > 0) {
      if (parsedId && wellnessList.some(w => w.id === parsedId)) {
        setSelectedId(parsedId);
      } else if (selectedId === null) {
        setSelectedId(wellnessList[0].id);
      }
    }
  }, [wellnessList, selectedId, searchParams]);

  if (loading) return <p>Loading wellness options...</p>;
  if (error) return <p>Error: {error}</p>;
  if (!wellnessList || wellnessList.length === 0) return <p>No wellness options found.</p>;

  const selectedWellness = wellnessList.find(w => w.id === selectedId);

  return (
    <div className="max-w-6xl mx-auto p-6">
      {/* Tabs */}
      <div className="flex overflow-x-auto border-b border-gray-300 mb-6">
        {wellnessList.map(wellness => (
          <button
            key={wellness.id}
            onClick={() => setSelectedId(wellness.id)}
            className={`whitespace-nowrap px-4 py-2 border-b-2 ${
              wellness.id === selectedId ? "border-green-600 text-green-600 font-bold" : "border-transparent text-gray-600"
            } hover:text-green-700`}
          >
            {wellness.name}
          </button>
        ))}
      </div>

      {/* Selected Wellness Details */}
      {selectedWellness && (
        <div className="bg-white shadow rounded-lg p-6">
          <h2 className="text-3xl font-semibold mb-4">{selectedWellness.name}</h2>
          <p className="mb-4 text-gray-700">{selectedWellness.description}</p>
          <p className="text-lg font-semibold text-green-600 mb-6">
            Cijena od {selectedWellness.pricePerHour}€ / sat
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {(selectedWellness.images && selectedWellness.images.length > 0
              ? selectedWellness.images.slice(0, 2)
              : [null, null]
            ).map((imgUrl, idx) =>
              imgUrl ? (
                <img
                  key={idx}
                  src={imgUrl}
                  alt={`${selectedWellness.name} image ${idx + 1}`}
                  className="rounded-lg object-cover w-full h-64"
                />
              ) : (
                <div
                  key={idx}
                  className="rounded-lg bg-gray-300 flex items-center justify-center w-full h-64 text-gray-500"
                >
                  No image available
                </div>
              )
            )}
          </div>

          <button
          onClick={() => navigate(`/rezervacije?category=wellness&serviceId=${selectedId}`)}

          className="mt-6 bg-green-600 text-white px-6 py-3 rounded hover:bg-green-700"
            >
          Rezerviraj
          </button>
        </div>
      )}
    </div>
  );
};

export default WellnessComponents;
