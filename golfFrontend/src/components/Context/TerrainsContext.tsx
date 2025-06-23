import React, { createContext, useContext } from "react";
import { useFetchData } from "@/hooks/useFetchData"; // prilagodi path
export type Terrain = {
  id: number;
  name: string;
  description: string;
  price: number;
};

type Context = {
  terrains: Terrain[];
  loading: boolean;
  error: string | null;
  refetch: () => void;
  getById: (id: number) => Terrain | undefined;
};

const TerrainsContext = createContext<Context>({
  terrains: [],
  loading: true,
  error: null,
  refetch: () => {},
  getById: () => undefined,
});

export const useTerrains = () => useContext(TerrainsContext);

export const TerrainsProvider = ({ children }: { children: React.ReactNode }) => {
const {
  data,
  loading,
  error,
  refetch
} = useFetchData<Terrain[]>(`/services/${encodeURIComponent("golf teren")}`);

  return (
    <TerrainsContext.Provider
      value={{
        terrains: data || [],
        loading,
        error,
        refetch,
        getById: (id) => (data || []).find((t) => t.id === id),
      }}
    >
      {children}
    </TerrainsContext.Provider>
  );
};
