export type Service = {
  name: string;
  category?: string;
};

export type ReservationItem = {
  quantity: number;
  service: Service;
};

export type Reservation = {
  id: number;
  date: string;
  start_time: string;
  end_time: string;
  reservation_items: ReservationItem[];
};
