import {useState} from 'react'
import Login from './components/Login/Login'
import Modal from './ui/Modal';
import Navbar from './components/Navbar/Navbar'
import { useModal } from "./ui/ModalContext";
import Register from './components/Register/Register'
import { Toaster } from 'react-hot-toast';

const App = () => {
  const [logRegister, setLogRegister] = useState('login')
  return (
    <>
     <Toaster position="top-right" />
    <Navbar/>
      <Modal>
        {logRegister === 'login' ? <Login/> : <Register/>}
      </Modal>
    </>
  );
}

export default App;
