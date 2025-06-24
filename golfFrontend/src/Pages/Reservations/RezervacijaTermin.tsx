import { useState, useEffect } from "react";
import { useReservation } from "@/components/Context/ReservationContext";
import { useTerrains } from "@/components/Context/TerrainsContext";
import { useModal } from "@/components/Context/ModalContext";
import { useAuth } from "@/components/Context/AuthContext";
import toast from "react-hot-toast";
import dayjs from "dayjs";
import { useNavigate } from "react-router-dom";

const RezervacijaTermin = () => {
  const { reservation, setReservationData } = useReservation();
  const { getById } = useTerrains();
  const { user } = useAuth();
  const { open } = useModal();
  const [selectedDate, setSelectedDate] = useState(dayjs().format("YYYY-MM-DD"));
  const [selectedDuration, setSelectedDuration] = useState(1);
  const [availableSlots, setAvailableSlots] = useState<string[]>([]);
  const [busyRanges, setBusyRanges] = useState<{ start: string; end: string }[]>([]);
  const navigate = useNavigate();
  
  
  const mainService = reservation.reservation_items?.[0];
  const mainServiceId = mainService?.service_id;
  const dodatne = reservation.reservation_items?.slice(1) || [];
  const isGolf = reservation.category === "golf";

  const getService = (id: number) => getById(id);
  
  useEffect(() => {
  const isValid =
    reservation.category &&
    reservation.reservation_items &&
    reservation.reservation_items.length > 0 &&
    reservation.reservation_items[0].service_id;

  if (!isValid) {
    toast.error("Molimo započnite rezervaciju ispočetka.");
    navigate("/rezervacija");
  }
}, []);

  useEffect(() => {
    if (!mainServiceId) return;

    const fetchReservations = async () => {
      try {
        const res = await fetch(`http://localhost:5000/reservations/by-date/${selectedDate}`);
        if (!res.ok) {
          if (res.status === 404) {
            setBusyRanges([]);
            return;
          }
          throw new Error("Greška u dohvatu rezervacija");
        }

        const data = await res.json();
        const sameService = data.filter((r: any) =>
          r.reservation_items.some((it: any) => it.service_id === mainServiceId)
        );

        const busy = sameService.flatMap((r: any) => ({
          start: r.start_time,
          end: r.end_time,
        }));

        setBusyRanges(busy);
      } catch (err) {
        console.error("Greška pri dohvaćanju rezervacija:", err);
        setBusyRanges([]);
      }
    };

    fetchReservations();
  }, [selectedDate, mainServiceId]);

  useEffect(() => {
    if (!mainServiceId) return;

    const allSlots = isGolf
      ? generateGolfSlots(selectedDuration)
      : generateWellnessSlots();

    const filtered = allSlots.filter((slot) =>
      isSlotFree(slot, isGolf ? selectedDuration * 60 : 30)
    );

    setAvailableSlots(filtered);
  }, [selectedDate, selectedDuration, busyRanges, isGolf, mainServiceId]);

  const generateGolfSlots = (dur: number) => {
    const arr: string[] = [];
    for (let h = 8; h <= 20 - dur; h++) arr.push(`${h.toString().padStart(2, "0")}:00`);
    return arr;
  };

  const generateWellnessSlots = () => {
    const arr: string[] = [];
    for (let h = 8; h <= 19; h++) {
      arr.push(`${h.toString().padStart(2, "0")}:00`);
      arr.push(`${h.toString().padStart(2, "0")}:30`);
    }
    return arr;
  };

  const isSlotFree = (candidateStart: string, durMin: number) => {
    const [h, m] = candidateStart.split(":").map(Number);
    const cStart = h * 60 + m;
    const cEnd = cStart + durMin;

    return !busyRanges.some(({ start, end }) => {
      const [sh, sm] = start.split(":").map(Number);
      const [eh, em] = end.split(":").map(Number);
      const sMin = sh * 60 + sm;
      const eMin = eh * 60 + em;
      return cStart < eMin && cEnd > sMin;
    });
  };

  const ukupnaCijena = () => {
    const main = mainService?.quantity && getService(mainService.service_id)?.price
      ? isGolf
        ? mainService.quantity * selectedDuration * parseFloat(getService(mainService.service_id)?.price.toString() || "0")
        : mainService.quantity * parseFloat(getService(mainService.service_id)?.price.toString() || "0")
      : 0;

    const extras = dodatne.reduce((sum, d) => {
      const cijena = d.quantity && getService(d.service_id)?.price
        ? d.quantity * parseFloat(getService(d.service_id)?.price.toString() || "0")
        : 0;
      return sum + cijena;
    }, 0);

    return (main + extras).toFixed(2);
  };

  const handleStartTimeChange = (value: string) => {
    setReservationData({
      start_time: value,
      date: selectedDate,
      duration_minutes: isGolf ? selectedDuration * 60 : 30,
      user_id: user?.id || 0,
    });
  };

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      <h2 className="text-3xl font-bold text-center">Odaberite termin</h2>

      {!mainServiceId ? (
        <p className="text-center text-red-600">Najprije odaberite teren ili wellness uslugu.</p>
      ) : (
        <div className="flex flex-col md:flex-row gap-8">
          <div className="md:w-1/2 bg-white rounded-xl shadow p-4 space-y-4">
            <h3 className="text-xl font-semibold">Odabrano:</h3>

            {mainService && (
              <div>
                <p className="font-medium">
                  {getService(mainService.service_id)?.name || "Glavna usluga"} – {mainService.quantity} kom ×{" "}
                  {getService(mainService.service_id)?.price || "-"} € × {isGolf ? `${selectedDuration} h × ` : ""}
                  ={" "}
                  {(
                    isGolf
                      ? mainService.quantity * selectedDuration * parseFloat(getService(mainService.service_id)?.price.toString() || "0")
                      : mainService.quantity * parseFloat(getService(mainService.service_id)?.price.toString() || "0")
                  ).toFixed(2)} €
                </p>
              </div>
            )}

            {dodatne.length > 0 && (
              <div>
                <h4 className="font-medium mt-4">Dodatne usluge:</h4>
                <ul className="list-disc list-inside text-sm text-gray-700">
                  {dodatne.map((d, i) => (
                    <li key={i}>
                      {getService(d.service_id)?.name || "Usluga"} – {d.quantity} kom × {getService(d.service_id)?.price || "-"} € ={" "}
                      {(d.quantity * parseFloat(getService(d.service_id)?.price.toString() || "0")).toFixed(2)} €
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <div className="pt-4 border-t font-semibold text-green-700">
              Ukupno: {ukupnaCijena()} €
            </div>
          </div>

          <div className="md:w-1/2 space-y-4">
            <div>
              <label className="block mb-1 font-medium">Datum</label>
              <input
                type="date"
                className="border rounded p-2 w-full"
                value={selectedDate}
                onChange={(e) => {
                  const newDate = e.target.value;
                  setSelectedDate(newDate);
                  setReservationData({
                    date: newDate,
                    start_time: undefined,
                  });
                }}
                onKeyDown={(e) => e.preventDefault()}
                min={dayjs().format("YYYY-MM-DD")}
                max={dayjs().add(90, "day").format("YYYY-MM-DD")}
              />
            </div>

            {isGolf && (
              <div>
                <label className="block mb-1 font-medium">Trajanje (sati)</label>
                <select
                  value={selectedDuration}
                  onChange={(e) => {
                    const newDur = parseInt(e.target.value);
                    setSelectedDuration(newDur);
                    setReservationData({ duration_minutes: newDur * 60 });
                  }}
                  className="border rounded p-2 w-full"
                >
                  {[1, 2, 3, 4].map((h) => (
                    <option key={h} value={h}>
                      {h} sat
                    </option>
                  ))}
                </select>
              </div>
            )}

            <div>
              <label className="block mb-1 font-medium">Dostupni termini</label>
              <select
                value={reservation.start_time || ""}
                disabled={availableSlots.length === 0}
                className="border rounded p-2 w-full disabled:opacity-50"
                onChange={(e) => handleStartTimeChange(e.target.value)}
              >
                <option value="">
                  {availableSlots.length === 0
                    ? "-- Nema slobodnih termina --"
                    : "-- Odaberite termin --"}
                </option>
                {availableSlots.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>

              {reservation.start_time && reservation.date && reservation.duration_minutes && (
                <div className="mt-4 text-sm text-gray-700">
                  <strong>Rezervacija termina:</strong>{" "}
                  {reservation.date}, vrijeme {reservation.start_time} –{" "}
                  {dayjs(`${reservation.date}T${reservation.start_time}`)
                    .add(reservation.duration_minutes, "minute")
                    .format("HH:mm")}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {mainServiceId && (
        <div className="flex justify-between pt-10">
          <button
            onClick={() => window.history.back()}
            className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold py-2 px-6 rounded"
          >
            Natrag
          </button>
          <button
            onClick={() => {
              if (!user) {
                open("auth");
                return;
              }

              if (!reservation.start_time || !reservation.date) {
                alert("Molimo odaberite termin prije potvrde.");
                return;
              }

              navigate("/rezervacija/pregled");
            }}
            className="bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-6 rounded"
          >
            ✅ Potvrdi
          </button>
        </div>
      )}
    </div>
  );
};

export default RezervacijaTermin;
