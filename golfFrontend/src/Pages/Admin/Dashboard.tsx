import React, { useEffect, useState } from "react";
import { apiRequest } from "@/hooks/apiHookAsync";
import { useNavigate } from "react-router-dom";
import ReservationCalendar from "./ReservationCalendar";
import { Reservation } from "@/types/reservation";



const Dashboard = () => {
  const [date, setDate] = useState<string>(new Date().toISOString().split("T")[0]);
  const [reservationCount, setReservationCount] = useState<number>(0);
  const [userCount, setUserCount] = useState<number>(0);
  const [reservations, setReservations] = useState<Reservation[]>([]);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const resData = await apiRequest<Reservation[]>("/reservations");
        const userData = await apiRequest<any[]>("/users");

        setReservations(resData);
        setReservationCount(resData.filter((r) => r.date === date).length);
        setUserCount(userData.length);
      } catch (error) {
        console.error("Error fetching dashboard data", error);
      }
    };

    fetchData();
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
        <div
          onClick={() => navigate("/admin/rezervacije")}
          className="bg-white rounded-lg shadow p-6 hover:bg-gray-50 cursor-pointer"
        >
          <h3 className="text-lg font-semibold mb-2">Rezervacije ({date})</h3>
          <p className="text-3xl font-bold text-green-600">{reservationCount}</p>
        </div>

        <div
          onClick={() => navigate("/admin/korisnici")}
          className="bg-white rounded-lg shadow p-6 hover:bg-gray-50 cursor-pointer"
        >
          <h3 className="text-lg font-semibold mb-2">Ukupno korisnika</h3>
          <p className="text-3xl font-bold text-blue-600">{userCount}</p>
        </div>

        
      </div>

      
      <ReservationCalendar reservations={reservations} />
    </div>
  );
};

export default Dashboard;
