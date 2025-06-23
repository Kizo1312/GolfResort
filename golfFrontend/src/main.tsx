import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';
import { ModalProvider } from "./components/Context/ModalContext";
import { TerrainsProvider } from "./components/Context/TerrainsContext";

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <TerrainsProvider>
    <ModalProvider>
      <App />
    </ModalProvider>
    </TerrainsProvider>
  </React.StrictMode>
);
