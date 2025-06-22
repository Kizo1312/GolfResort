import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import {useState} from 'react'
import Login from './components/Login/Login'
import Modal from './ui/Modal';
import Navbar from './components/Navbar/Navbar'
import { useModal } from "./components/Context/ModalContext";
import Register from './components/Register/Register'
import { Toaster } from 'react-hot-toast';
import HomePage from './Pages/Home';
import AdminLayout from './components/Layouts/AdminLayout';
import ItemList from './Pages/Admin/List';


// const App = () => {
//   const [logRegister, setLogRegister] = useState('login')
//   return (
//     <>
//     {/* <Toaster position="top-right" />
//     <Navbar/>
//     <HomePage/>
//     <Modal></Modal> */}
//     <Router>
//       <Routes>
//         <Route path="/admin" element={<AdminLayout />}>
//           <Route path="tereni" element={<ItemList />} />
//         </Route>
//       </Routes>
//     </Router>
//     </>
//   );
// }

// export default App;


const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/admin" element={<AdminLayout />}>
          <Route path="tereni" element={<ItemList />} />
        </Route>
      </Routes>
    </Router>
  );
};

export default App;