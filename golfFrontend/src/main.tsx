import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';
import { ModalProvider } from "./components/Context/ModalContext";
import { TerrainsProvider } from "./components/Context/TerrainsContext";
import { ReservationProvider } from "./components/Context/ReservationContext";
import { AuthProvider } from "./components/Context/AuthContext";
import { useModal } from "./components/Context/ModalContext";

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <AuthProvider>
    <TerrainsProvider>
      <ModalProvider>
        <ReservationProvider>
          <App />
        </ReservationProvider>
      </ModalProvider>
    </TerrainsProvider>
    </AuthProvider>
  </React.StrictMode>
);
