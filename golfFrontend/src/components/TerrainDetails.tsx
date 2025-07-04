import React from "react";
import { useTerrains } from "./Context/TerrainsContext";
import { useNavigate } from "react-router-dom";
import { useModal } from "./Context/ModalContext";
import { useReservation } from "./Context/ReservationContext";
import map1 from "../assets/tereni/1-map.svg";
import map2 from "../assets/tereni/2-map.svg";
import map3 from "../assets/tereni/3-map.svg";
import map4 from "../assets/tereni/4-map.svg";
import map5 from "../assets/tereni/5-map.svg";
import map6 from "../assets/tereni/6-map.svg";
import map7 from "../assets/tereni/7-map.svg";
import map8 from "../assets/tereni/8-map.svg";

const terrainImages: Record<number, string> = {
  1: map1,
  2: map2,
  3: map3,
  4: map4, 
  5: map5,
  6: map6, 
  7: map7, 
  8: map8
}

type Props = {
  id: number;
};

const TerrainDetails = ({ id }: Props) => {
  const { getById, loading, error } = useTerrains();
  const { setReservationData, goToStep } = useReservation();
  const terrain = getById(id);
  const navigate = useNavigate();
  const { close } = useModal();

  if (loading) return <p>Učitavanje...</p>;
  if (error) return <p>Greška: {error}</p>;
  if (!terrain) return <p>Nema podataka o terenu.</p>;

  // Move function here, outside of JSX
  const handleClickSaznajVise = () => {
    close();
    navigate(`/golf-tereni?selectedId=${id}`);
  };

  const handleRezerviraj = () => {
    setReservationData({
      category: "golf",
      reservation_items: [{ service_id: terrain.id, quantity: 1 }],
    });
    goToStep("category"); // opcionalno, već se koristi
    navigate("/rezervacije");
    close();
  };

  return (
    <div className="max-w-4xl mx-auto bg-white shadow-md rounded-lg p-6">
      <div className="flex flex-col md:flex-row gap-6">
        {/* Left side: info */}
        <div className="flex-1">
          <h2 className="text-2xl font-bold mb-2">{terrain.name}</h2>
          <p className="text-gray-700 mb-4">
          {terrain.description?.split(".")[0] + "."}
          </p>
          <p className="text-lg font-semibold text-green-600">Cijena: {terrain.price} €</p>
        </div>

        {/* Right side: placeholder image */}
        <div className="w-full md:w-1/2 min-h-[150px] rounded-lg overflow-hidden flex items-center justify-center">
         <img
            src={terrainImages[id]}
            alt={`Mapa terena ${terrain.name}`}
            className="max-w-full max-h-full object-contain"
          />
        </div>
      </div>

      {/* Bottom buttons */}
      <div className="mt-6 flex justify-end gap-4">
        <button
          className="px-4 py-2 border border-gray-400 text-gray-700 rounded hover:bg-gray-100"
          onClick={handleClickSaznajVise} // <-- Use function here
        >
          Saznaj više
        </button>
        <button
          className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
          onClick={handleRezerviraj}
        >
          Rezerviraj
        </button>
      </div>
    </div>
  );
};

export default TerrainDetails;
