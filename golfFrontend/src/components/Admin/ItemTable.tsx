import React from "react";

type Item = {
  id: number;
  name: string;
  price?: string;
  description?: string;
};

type Props = {
  items: Item[];
};

const ItemTable = ({ items }: Props) => {
  return (
    <div className="bg-white shadow rounded-lg overflow-hidden">
      <div className="px-6 py-4 border-b font-semibold text-gray-700 grid grid-cols-3">
        <span>Naziv</span>
        <span>Cijena</span>
        <span>Opis</span>
      </div>
      <ul>
        {items.map((item) => (
          <li
            key={item.id}
            className="px-6 py-3 border-b grid grid-cols-3 items-center hover:bg-gray-50 group relative"
          >
            <span>{item.name}</span>
            <span>{item.price}</span>
            <span>
              {item.description?.length && item.description.length > 50
                ? item.description.slice(0, 50) + "..."
                : item.description}
            </span>

            <div className="absolute right-6 opacity-0 group-hover:opacity-100 flex gap-2 transition">
              <button className="text-blue-600 text-sm">Uredi</button>
              <button className="text-red-500 text-sm">Obriši</button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ItemTable;
