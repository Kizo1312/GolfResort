import React, { useEffect, useState } from "react";
import { useModal } from "@/components/Context/ModalContext";
import { apiRequest } from "@/hooks/apiHookAsync";

interface TerrainStats {
  total_bookings: number;
  most_booked_hour: number | null;
  most_booked_day: {
    index: number;
    name: string;
  } | null;
}

const TerrainDetailsModal = () => {
  const { modalProps, close } = useModal();
  const [stats, setStats] = useState<TerrainStats | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const terrainId = modalProps?.id;

  useEffect(() => {
    if (!terrainId) return;

    setLoading(true);
    apiRequest<TerrainStats>(`/analytics/course/${terrainId}`)
      .then((res) => {
        setStats(res);
        setLoading(false);
      })
      .catch((e) => {
        setError(e.message || "Greška pri dohvaćanju statistike");
        setLoading(false);
      });
  }, [terrainId]);

  if (!terrainId) return null;

  return (
    <div className="modal">
    
      <h2>Statistika za teren: {modalProps?.name}</h2>

      {loading && <p>Učitavanje...</p>}
      {error && <p style={{ color: "red" }}>Greška: {error}</p>}

      {stats && (
        <div>
          <p><strong>Ukupno rezervacija:</strong> {stats.total_bookings}</p>
          <p>
            <strong>Najčešće rezervirano vrijeme:</strong>{" "}
            {stats.most_booked_hour !== null ? stats.most_booked_hour + ":00" : "Nema podataka"}
          </p>
          <p>
            <strong>Najčešće rezreviran dan:</strong>{" "}
            {stats.most_booked_day ? stats.most_booked_day.name : "Nema podataka"}
          </p>
        </div>
      )}
    </div>
  );
};

export default TerrainDetailsModal;