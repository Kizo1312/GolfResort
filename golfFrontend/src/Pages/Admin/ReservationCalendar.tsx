import { useState } from "react";
import { Calendar, dateFnsLocalizer, Event, View } from "react-big-calendar";
import { format, parse, startOfWeek, getDay } from "date-fns";
import { hr } from "date-fns/locale";
import "react-big-calendar/lib/css/react-big-calendar.css";

type Service = {
  name: string;
};

type ReservationItem = {
  quantity: number;
  service: Service;
};

type Reservation = {
  date: string;
  start_time: string;
  end_time: string;
  reservation_items: ReservationItem[];
};

type Props = {
  reservations: Reservation[];
};

const locales = {
  hr: hr,
};

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek: () => startOfWeek(new Date(), { locale: hr }),
  getDay,
  locales,
});

const ReservationCalendar: React.FC<Props> = ({ reservations }) => {
  const [view, setView] = useState<View>("month");

  
  const reservationsPerDay = reservations.reduce((acc, res) => {
    acc.set(res.date, (acc.get(res.date) || 0) + 1);
    return acc;
  }, new Map<string, number>());


  const monthEvents: Event[] = Array.from(reservationsPerDay.entries()).map(
    ([dateStr, count]) => ({
      title: `${count} rezervacij${count > 1 ? "e" : "a"}`,
      start: new Date(`${dateStr}T00:00:00`),
      end: new Date(`${dateStr}T23:59:59`),
      allDay: true,
    })
  );

  
  const detailedEvents: Event[] = reservations.map((r) => {
    const itemsStr = r.reservation_items
      .map((item) => `${item.service?.name} (${item.quantity}x)`)
      .join(", ");

    const title = `${r.start_time} - ${r.end_time}: ${itemsStr}`;

    return {
      title,
      start: new Date(`${r.date}T${r.start_time}`),
      end: new Date(`${r.date}T${r.end_time}`),
      allDay: false,
    };
  });

  
  const events = view === "month" ? monthEvents : detailedEvents;

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h3 className="text-xl font-semibold mb-4">Kalendar rezervacija</h3>

      <Calendar
        localizer={localizer}
        events={events}
        startAccessor="start"
        endAccessor="end"
        style={{ height: 500 }}
        onView={(newView) => setView(newView)}
        view={view}
        messages={{
          next: "Sljedeći",
          previous: "Prethodni",
          today: "Danas",
          month: "Mjesec",
          week: "Tjedan",
          day: "Dan",
          agenda: "Agenda",
          date: "Datum",
          time: "Vrijeme",
          event: "Događaj",
          noEventsInRange: "Nema događaja u ovom rasponu.",
        }}
        tooltipAccessor={(event) => String(event.title)}
      />
    </div>
  );
};

export default ReservationCalendar;
