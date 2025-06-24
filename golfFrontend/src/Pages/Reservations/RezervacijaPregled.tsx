import { useEffect } from "react";
import { useReservation } from "@/components/Context/ReservationContext";
import { useTerrains } from "@/components/Context/TerrainsContext";
import { useAuth } from "@/components/Context/AuthContext";
import { useModal } from "@/components/Context/ModalContext";
import { useNavigate } from "react-router-dom";
import dayjs from "dayjs";
import toast from "react-hot-toast";

const RezervacijaPregled = () => {
  const { reservation, resetReservation } = useReservation();
  const { getById } = useTerrains();
  const { user } = useAuth();
  const { open, isOpen, modalType } = useModal();
  const navigate = useNavigate();

  const mainService = reservation.reservation_items?.[0];
  const dodatne = reservation.reservation_items?.slice(1) || [];
  const isGolf = reservation.category === "golf";

  // ✅ Spriječi ulaz bez prethodno ispunjenih koraka
  useEffect(() => {
    const valid =
      reservation.category &&
      reservation.date &&
      reservation.start_time &&
      reservation.duration_minutes &&
      reservation.reservation_items &&
      reservation.reservation_items.length > 0;

    if (!valid) {
      toast.error("Molimo dovršite prethodne korake rezervacije.");
      navigate("/rezervacija");
    }
  }, []);

  const ukupnaCijena = () => {
    const main = mainService?.quantity && getById(mainService.service_id)?.price
      ? isGolf
        ? mainService.quantity * (reservation.duration_minutes! / 60) * parseFloat(getById(mainService.service_id)?.price.toString() || "0")
        : mainService.quantity * parseFloat(getById(mainService.service_id)?.price.toString() || "0")
      : 0;

    const extras = dodatne.reduce((sum, d) => {
      const cijena = d.quantity && getById(d.service_id)?.price
        ? d.quantity * parseFloat(getById(d.service_id)?.price.toString() || "0")
        : 0;
      return sum + cijena;
    }, 0);

    return (main + extras).toFixed(2);
  };

  const handleSubmit = async () => {
    if (!reservation.date || !reservation.start_time || !user?.id) {
      toast.error("Nedostaju podaci za rezervaciju.");
      return;
    }

    const cleanedReservation = {
      user_id: user.id,
      date: reservation.date,
      start_time: reservation.start_time,
      duration_minutes: reservation.duration_minutes,
      reservation_items: reservation.reservation_items?.map(({ service_id, quantity }) => ({
        service_id,
        quantity,
      })),
    };

    try {
      const res = await fetch("http://localhost:5000/reservations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(cleanedReservation),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message || "Neuspješno.");
      }

      toast.success("Rezervacija uspješno kreirana!");
      resetReservation();
      navigate("/rezervacija/uspjeh");
    } catch (err: any) {
      toast.error(err.message || "Greška pri rezervaciji.");
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <h2 className="text-3xl font-bold text-center">Pregled rezervacije</h2>

      <div className="bg-white shadow rounded p-6 space-y-4">
        <p><strong>Kategorija:</strong> {reservation.category}</p>
        <p><strong>Datum:</strong> {reservation.date}</p>
        <p><strong>Vrijeme:</strong> {reservation.start_time} – {dayjs(`${reservation.date}T${reservation.start_time}`).add(reservation.duration_minutes || 30, "minute").format("HH:mm")}</p>

        <div>
          <p className="font-medium">Glavna usluga:</p>
          {mainService && (
            <p>
              {getById(mainService.service_id)?.name} – {mainService.quantity} kom × {getById(mainService.service_id)?.price} € × {isGolf ? `${reservation.duration_minutes! / 60}h` : ""} = <strong>{
                isGolf
                  ? (mainService.quantity * (reservation.duration_minutes! / 60) * parseFloat(getById(mainService.service_id)?.price.toString() || "0")).toFixed(2)
                  : (mainService.quantity * parseFloat(getById(mainService.service_id)?.price.toString() || "0")).toFixed(2)
              } €</strong>
            </p>
          )}
        </div>

        {dodatne.length > 0 && (
          <div>
            <p className="font-medium">Dodatne usluge:</p>
            <ul className="list-disc list-inside text-sm text-gray-700">
              {dodatne.map((d, i) => (
                <li key={i}>
                  {getById(d.service_id)?.name} – {d.quantity} kom × {getById(d.service_id)?.price} € ={" "}
                  {(d.quantity * parseFloat(getById(d.service_id)?.price.toString() || "0")).toFixed(2)} €
                </li>
              ))}
            </ul>
          </div>
        )}

        <div className="pt-4 border-t font-semibold text-green-700 text-lg">
          Ukupno za platiti: {ukupnaCijena()} €
        </div>
      </div>

      <div className="flex justify-between pt-6">
        <button
          onClick={() => navigate(-1)}
          className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold py-2 px-6 rounded"
        >
          Natrag
        </button>
        <button
          onClick={handleSubmit}
          disabled={!user}
          title={!user ? "Prijavite se da biste dovršili rezervaciju" : ""}
          className={`py-2 px-6 font-semibold rounded ${
            !user
              ? "bg-gray-300 text-gray-500 cursor-not-allowed"
              : "bg-blue-600 hover:bg-blue-700 text-white"
          }`}
        >
          Potvrdi rezervaciju
        </button>
      </div>
    </div>
  );
};

export default RezervacijaPregled;
