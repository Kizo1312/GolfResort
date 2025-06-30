import React from "react";
import { apiRequest } from "@/hooks/apiHookAsync";
import { useModal } from "./Context/ModalContext";
import toast from "react-hot-toast";

type Props = {
  item: {
    id: number;
    name: string;
  };
  onClose: () => void;
  onUpdate: () => void;
};

const DeleteItemModal = ({ item, onClose, onUpdate }: Props) => {
  const { close } = useModal();

  const handleDelete = async () => {
    try {
      await apiRequest(`/services/${item.id}`, "DELETE");
      toast.success(`Usluga "${item.name}" obrisana.`);
      onUpdate();
      onClose();
    } catch (error) {
      console.error("Greška pri brisanju:", error);
      toast.error("Greška pri brisanju usluge.");
    }
  };

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Obriši uslugu</h2>
      <p>Jeste li sigurni da želite obrisati <strong>{item.name}</strong>?</p>
      <div className="flex justify-end gap-4 mt-6">
        <button
          onClick={onClose}
          className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
        >
          Odustani
        </button>
        <button
          onClick={handleDelete}
          className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
        >
          Obriši
        </button>
      </div>
    </div>
  );
};

export default DeleteItemModal;
