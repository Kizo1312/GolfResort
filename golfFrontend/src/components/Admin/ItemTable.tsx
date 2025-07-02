import React from "react";
import { useModal } from "@/components/Context/ModalContext";

type Item = {
  id: number;
  name: string;
  price?: string;
  description?: string;
  category?: string;
  inventory?: number;
};

type Props = {
  items: Item[];
  onUpdate: () => void;
};

const ItemTable = ({ items, onUpdate }: Props) => {
  const { open } = useModal();

  return (
    <div className="bg-white shadow rounded-lg overflow-hidden">
      {/* Header */}
      <div
        className="grid px-6 py-3 border-b font-semibold text-gray-700"
        style={{
          gridTemplateColumns: "2.5fr 140px 5fr 120px 120px",
          columnGap: "16px",
        }}
      >
        <span className="truncate text-left">Naziv</span>
        <span className="pr-4 text-left">Cijena</span>
        <span className="text-left">Opis</span>
        <span className="text-left">Stanje</span>
        <span className="text-right">Akcije</span>
      </div>

      {/* Rows */}
      <ul>
        {items.map((item) => {
          const isGolf = item.category === "golf teren";
          return (
            <li
              key={item.id}
              className="grid items-center px-6 py-3 border-b hover:bg-gray-50"
              style={{
                gridTemplateColumns: "2.5fr 140px 5fr 120px 120px",
                columnGap: "16px",
              }}
            >
              {/* Naziv */}
              <span className="truncate text-left" title={item.name}>
                {item.name}
              </span>

              {/* Cijena */}
              <span className="text-left pr-4">{item.price} €</span>

              {/* Opis */}
              <span className="text-left">
                {item.description?.length && item.description.length > 50
                  ? item.description.slice(0, 50) + "..."
                  : item.description}
              </span>

              {/* Stanje */}
              <span className="text-left">
                {isGolf ? (
                  item.inventory && item.inventory > 0 ? (
                    <span className="text-green-600 font-medium">Dostupan</span>
                  ) : (
                    <span className="text-red-500 font-medium">Nedostupan</span>
                  )
                ) : (
                  <span className="text-gray-800">{item.inventory ?? 0} kom</span>
                )}
              </span>

              {/* Akcije */}
              <div className="flex justify-end gap-4">
                <button
                  onClick={() => open("edit-item", { item, onUpdate })}
                  className="text-blue-600 hover:underline text-sm"
                >
                  Uredi
                </button>
                <button
                  onClick={() => open("delete-item", { item, onUpdate })}
                  className="text-red-500 hover:underline text-sm"
                >
                  Obriši
                </button>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default ItemTable;
