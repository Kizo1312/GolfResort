import React, { useEffect, useState } from "react";

const Dashboard = () => {
  const [date, setDate] = useState<string>(new Date().toISOString().split("T")[0]);
  const [reservationCount, setReservationCount] = useState<number>(0);
  const [userCount, setUserCount] = useState<number>(0);

  // ❗Zamijeni URL s tvojim API pozivima
  useEffect(() => {
    // Dohvati broj rezervacija za odabrani datum
    fetch(`http://127.0.0.1:5000/reservations/count?date=${date}`)
      .then((res) => res.json())
      .then((data) => setReservationCount(data.count || 0))
      .catch(() => setReservationCount(0));

    // Dohvati ukupan broj korisnika
    fetch("http://127.0.0.1:5000/users/count")
      .then((res) => res.json())
      .then((data) => setUserCount(data.count || 0))
      .catch(() => setUserCount(0));
  }, [date]);

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">Pregled</h2>

      <div className="flex items-center gap-4 mb-6">
        <label htmlFor="date" className="font-medium">
          Odaberi datum:
        </label>
        <input
          id="date"
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          className="border px-3 py-2 rounded shadow-sm focus:outline-none focus:ring focus:ring-green-300"
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold mb-2">Rezervacije ({date})</h3>
          <p className="text-3xl font-bold text-green-600">{reservationCount}</p>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold mb-2">Ukupno korisnika</h3>
          <p className="text-3xl font-bold text-blue-600">{userCount}</p>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold mb-2">Kalendar</h3>
          <div className="text-gray-500">📆 Ovdje možeš prikazati kalendar</div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
