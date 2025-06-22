import React from "react";

const mockItems = Array.from({ length: 30 }, (_, i) => ({
  id: i + 1,
  name: `Stavka ${i + 1}`,
  price: `${(10 + i * 5).toFixed(2)} €`,
  description: `Ovo je opis stavke broj ${i + 1}, koji može biti jako dugačak i sadržavati više informacija nego što je potrebno za prikaz u jednoj liniji.`
}));

const ItemList = () => {
  const itemsToShow = mockItems.slice(0, 20);

  return (
    <div className="bg-white shadow rounded-lg overflow-hidden">
      <div className="px-6 py-4 border-b font-semibold text-gray-700 grid grid-cols-3">
        <span>Naziv</span>
        <span>Cijena</span>
        <span>Opis</span>
      </div>
      <ul>
        {itemsToShow.map(item => (
          <li key={item.id} className="px-6 py-3 border-b grid grid-cols-3 items-center hover:bg-gray-50">
            <span className="text-gray-800">{item.name}</span>
            <span className="text-blue-600 font-medium">{item.price}</span>
            <span className="text-gray-600">
              {item.description.length > 50
                ? item.description.slice(0, 50) + "..."
                : item.description}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ItemList; // 👈 OBAVEZNO mora postojati ovaj red
