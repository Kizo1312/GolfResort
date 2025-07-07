import React from "react";
import { useModal } from "@/components/Context/ModalContext";
import CreateItemModal from "../CreateItemModal";

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

  const isGolfCategory = items.length > 0 && items[0].category === "golf teren";

  const sortedItems = [...items].sort((a,b) => a.id - b.id);

  return (
    <div className="bg-white shadow rounded-lg overflow-hidden">
       <div className="flex justify-between items-center px-6 py-4 border-b">
        <h3 className="font-semibold text-gray-700">Popis usluga</h3>

        {!isGolfCategory && (
          <button
            onClick={() => open("create-item", { onUpdate })}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded text-sm"
          >
            + Dodaj novu uslugu
          </button>
        )}
      </div>

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
        {sortedItems.map((item) => {
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
                {!isGolf && (
                  <button
                    onClick={() => open("delete-item", { item, onUpdate })}
                    className="text-red-500 hover:underline text-sm"
                  >
                    Obriši
                  </button>
                )}
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default ItemTable;
