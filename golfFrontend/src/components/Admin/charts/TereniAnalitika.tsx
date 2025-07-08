import React, { useEffect, useState } from "react";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer
} from "recharts";
import { useModal } from "@/components/Context/ModalContext";
import { apiRequest } from "@/hooks/apiHookAsync";

interface TerrainBooking {
  id: number;
  name: string;
  bookings: number;
}

const COLORS = [
  "#6366F1", // Indigo
  "#10B981", // Emerald
  "#F59E0B", // Amber
  "#EF4444", // Red
  "#3B82F6", // Blue
  "#EC4899", // Pink
  "#22D3EE", // Cyan
  "#A855F7", // Purple
];

const TereniAnalitika = () => {
  const { open } = useModal();
  const [data, setData] = useState<TerrainBooking[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    apiRequest<TerrainBooking[]>("/analytics/bookings-per-course")
      .then((res) => {
        setData(res);
        setLoading(false);
      })
      .catch((e) => {
        setError(e.message || "Greška pri dohvaćanju podataka");
        setLoading(false);
      });
  }, []);

  const onClickTerrain = (terrainId: number, name: string) => {
    open("terrain-analytics", { id: terrainId, name });
  };

  if (loading) return <p>Učitavanje podataka...</p>;
  if (error) return <p>Greška: {error}</p>;

  return (
    <div className="bg-white rounded-xl p-6 shadow-2xl">
      <h4 className="text-2xl font-bold mb-6 text-gray-800">
        Rezervacije po terenima
      </h4>

      <div className="flex flex-col lg:flex-row gap-10">
        {/* Pie Chart prikaz */}
        <div className="w-full lg:w-2/3 h-[400px]">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                dataKey="bookings"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={130}
                label={(entry) => `${entry.name} (${entry.bookings})`}
              >
                {data.map((entry, index) => (
                  <Cell
                    key={`cell-${entry.id}-${index}`}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Lista terena sa akcijama */}
        <div className="w-full lg:w-1/3 flex flex-col gap-4">
          <h3 className="text-lg font-semibold text-gray-700">
            Detalji po terenu
          </h3>
          {data.map((terrain) => (
            <button
              key={`terrain-${terrain.id}`}
              onClick={() => onClickTerrain(terrain.id, terrain.name)}
              className="flex items-center gap-2 bg-gray-100 hover:bg-indigo-100 px-4 py-2 rounded-md shadow-sm transition-colors duration-200"
            >
              <span role="img" aria-label="golfer">🏌️</span>
              <span className="text-gray-800 font-medium">{terrain.name}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TereniAnalitika;
