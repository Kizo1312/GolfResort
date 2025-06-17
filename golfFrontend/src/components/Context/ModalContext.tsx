import { createContext, useContext, useState, ReactNode } from "react";

type ModalType = "auth" | "terrain-details" | null;

interface ModalContextType {
  isOpen: boolean;
  open: (type: ModalType, props?: any) => void;
  close: () => void;
  modalType: ModalType;
  modalProps?: any;
}

const ModalContext = createContext<ModalContextType>({
  isOpen: false,
  open: () => {},
  close: () => {},
  modalType: null,
});

export const useModal = () => useContext(ModalContext);

export const ModalProvider = ({ children }: { children: ReactNode }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [modalType, setModalType] = useState<ModalType>(null);
  const [modalProps, setModalProps] = useState<any>(null);

  const open = (type: ModalType, props?: any) => {
    setModalType(type);
    setModalProps(props);
    setIsOpen(true);
  };

  const close = () => {
    setIsOpen(false);
    setModalType(null);
    setModalProps(null);
  };

  return (
    <ModalContext.Provider value={{ isOpen, open, close, modalType, modalProps }}>
      {children}
    </ModalContext.Provider>
  );
};