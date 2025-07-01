import React from "react";
import { useModal } from "@/components/Context/ModalContext";

type Item = {
  id: number;
  name: string;
  price?: string;
  description?: string;
  category?: string;
};

type Props = {
  items: Item[];
  onUpdate: () => void;
};

const ItemTable = ({ items, onUpdate }: Props) => {
  const { open } = useModal();

  const isGolfCategory = items.length > 0 && items[0].category === "golf teren";

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

      
      <div className="grid grid-cols-4 gap-4 px-6 py-3 border-b font-semibold text-gray-700">
        <span>Naziv</span>
        <span>Cijena</span>
        <span>Opis</span>
        <span className="text-right">Akcije</span>
      </div>

      
      <ul>
        {items.map((item) => (
          <li
            key={item.id}
            className="grid grid-cols-4 gap-4 items-center px-6 py-3 border-b hover:bg-gray-50"
          >
            <span>{item.name}</span>
            <span>{item.price} €</span>
            <span>
              {item.description?.length && item.description.length > 50
                ? item.description.slice(0, 50) + "..."
                : item.description}
            </span>

           
            <div className="flex justify-end gap-4">
              <button
                onClick={() => open("edit-item", { item, onUpdate })}
                className="text-blue-600 hover:underline text-sm"
              >
                Uredi
              </button>
              {!isGolfCategory && (

              <button
                onClick={() => open("delete-item", { item, onUpdate })}
                className="text-red-500 hover:underline text-sm"
              >
                Obriši
              </button>
              )}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ItemTable;
