import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { useAuth } from "./AuthContext";

type ServiceInfo = {
  name: string;
  price: string;
};

type ReservationItem = {
  service_id: number;
  quantity: number;
  service?: ServiceInfo;
};

type ReservationData = {
  user_id: number;
  date: string;
  start_time: string;
  duration_minutes: number;
  reservation_items: ReservationItem[];
  category?: "golf" | "wellness";
};

type Step = "category" | "termin" | "pregled" | "uspjeh";

type ReservationContextType = {
  reservation: Partial<ReservationData>;
  setReservationData: (data: Partial<ReservationData>) => void;
  resetReservation: () => void;
  currentStep: Step;
  goToStep: (step: Step) => void;

  isLoading:boolean;
  setIsLoading: (loading:boolean) => void;
};

const ReservationContext = createContext<ReservationContextType | undefined>(undefined);

export const ReservationProvider = ({ children }: { children: ReactNode }) => {
  const { user } = useAuth();
  const prevUser = React.useRef(user);

  const EXPIRY_TIME = 30 * 60 * 1000;

  const defaultState = (): Partial<ReservationData> => ({
    user_id: user?.id || 0,
    reservation_items: [],
    category: undefined,
  });

  const [reservation, setReservation] = useState<Partial<ReservationData>>(() => {
    try {
      const stored = localStorage.getItem("reservationData");
      if (!stored) return defaultState();

      const parsed = JSON.parse(stored);
      const now = Date.now();

      if (now - parsed.timestamp > EXPIRY_TIME) {
        localStorage.removeItem("reservationData");
        localStorage.removeItem("reservationStep");
        return defaultState();
      }

      return parsed.data;
    } catch {
      return defaultState();
    }
  });

  const [currentStep, setCurrentStep] = useState<Step>(() => {
    const stored = localStorage.getItem("reservationStep");
    return (stored as Step) || "category";
  });

  const [isLoading, setIsLoading] = useState(false);

  const setReservationData = (data: Partial<ReservationData>) => {
    setReservation((prev) => {
      const updated = { ...prev, ...data };
      localStorage.setItem(
        "reservationData",
        JSON.stringify({ data: updated, timestamp: Date.now() })
      );
      return updated;
    });
  };

  const goToStep = (step: Step) => {
    setCurrentStep(step);
    localStorage.setItem("reservationStep", step);
  };

  const resetReservation = () => {
    localStorage.removeItem("reservationData");
    localStorage.removeItem("reservationStep");
    setReservation(defaultState());
    setCurrentStep("category");
  };

  useEffect(() => {
  if (prevUser.current && !user) {
    resetReservation();
  }
  prevUser.current = user;
}, [user]);


  useEffect(() => {
    if (user?.id && reservation.user_id !== user.id) {
      setReservationData({ user_id: user.id });
    }
  }, [user]);

  useEffect(() => {
  localStorage.setItem(
    "reservationData",
    JSON.stringify({ data: reservation, timestamp: Date.now() })
  );
}, [reservation]);


  return (
    <ReservationContext.Provider
      value={{ reservation, setReservationData, resetReservation, currentStep, goToStep, isLoading, setIsLoading }}
    >
      {children}
    </ReservationContext.Provider>
  );
};

export const useReservation = () => {
  const context = useContext(ReservationContext);
  if (!context) throw new Error("useReservation must be used within ReservationProvider");
  return context;
};
