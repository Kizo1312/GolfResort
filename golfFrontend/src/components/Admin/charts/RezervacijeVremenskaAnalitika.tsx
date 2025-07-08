import React, { useEffect, useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Legend,
  Cell,
} from "recharts";
import { apiRequest } from "@/hooks/apiHookAsync";

interface DayData {
  day_index: number;
  day: string;
  count: number;
}

interface HourData {
  hour: number;
  count: number;
}

// Usklađene boje sa PieChart-om
const DAY_COLORS = [
  "#6366F1", // Ponedeljak
  "#10B981", // Utorak
  "#F59E0B", // Sreda
  "#EF4444", // Četvrtak
  "#3B82F6", // Petak
  "#EC4899", // Subota
  "#A855F7", // Nedelja
];

const RezervacijeVremenskaAnalitika = () => {
  const [daysData, setDaysData] = useState<DayData[]>([]);
  const [hoursData, setHoursData] = useState<HourData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    Promise.all([
      apiRequest<DayData[]>("/analytics/bookings-by-day"),
      apiRequest<HourData[]>("/analytics/bookings-by-hour")
    ])
      .then(([daysRes, hoursRes]) => {
        setDaysData(daysRes);
        setHoursData(hoursRes);
        setLoading(false);
      })
      .catch((e) => {
        setError("Greška u dohvaćanju podataka");
        setLoading(false);
      });
  }, []);

  if (loading) return <p>Učitavanje vremenskih podataka...</p>;
  if (error) return <p className="text-red-600">{error}</p>;

  return (
    <div className="bg-white rounded-xl p-6 shadow-2xl">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">📅 Vremenska analitika rezervacija</h2>

      <div className="mb-12">
        <h3 className="text-lg font-semibold mb-2 text-gray-700">Rezervacije po danima</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={daysData}>
            <XAxis dataKey="day" />
            <YAxis allowDecimals={false} />
            <Tooltip />
            <Bar dataKey="count" name="Rezervacije">
              {daysData.map((entry, index) => (
                <Cell key={`cell-day-${index}`} fill={DAY_COLORS[index % DAY_COLORS.length]} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div>
        <h3 className="text-lg font-semibold mb-2 text-gray-700">Rezervacije po satima</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={hoursData}>
            <XAxis dataKey="hour" />
            <YAxis allowDecimals={false} />
            <Tooltip />
            <Bar dataKey="count" name="Rezervacije" fill="#3B82F6" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default RezervacijeVremenskaAnalitika;
