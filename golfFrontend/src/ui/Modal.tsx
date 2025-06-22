import React, { useState } from "react";
import { useModal } from "../components/Context/ModalContext";
import Login from "../components/Login/Login";
import Register from "../components/Register/Register";
// import TerrainDetails from "../components/Terrain/TerrainDetails"; // nova komponenta
import EditItemModal from "../components/EditItemModal";

const Modal = () => {
  const { isOpen, modalType, modalProps, close } = useModal();
  const [activeTab, setActiveTab] = useState<"login" | "register">("login");

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="relative bg-white rounded-lg p-[25px] w-full max-w-md mx-4">
        {/* Close Button */}
        <button
          onClick={close}
          className="absolute top-2 right-2 text-gray-500 hover:text-gray-800 text-xl font-bold"
        >
          &times;
        </button>

        {/* AUTH MODAL */}
        {modalType === "auth" && (
          <>
            <div className="flex mb-4 border-b border-gray-300">
              <button
                onClick={() => setActiveTab("login")}
                className={`flex-1 py-2 text-center font-semibold ${
                  activeTab === "login"
                    ? "text-blue-600 border-b-2 border-blue-600"
                    : "text-gray-500 hover:text-blue-600"
                }`}
              >
                Login
              </button>
              <button
                onClick={() => setActiveTab("register")}
                className={`flex-1 py-2 text-center font-semibold ${
                  activeTab === "register"
                    ? "text-blue-600 border-b-2 border-blue-600"
                    : "text-gray-500 hover:text-blue-600"
                }`}
              >
                Register
              </button>
            </div>

            {activeTab === "login" ? <Login /> : <Register />}
          </>
        )}
        {modalType === "edit-item" && (
        <EditItemModal
          item={modalProps.item}
          onClose={close}
          onUpdate={modalProps.onUpdate} // ← dodaj
        />
      )}

        {/* TERRAIN DETAILS MODAL */}
        {/* {modalType === "terrain-details" && (
          <TerrainDetails {...modalProps} />
        )} */}
      </div>
    </div>
  );
};

export default Modal;
