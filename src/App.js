// import React, { useState } from 'react';
// import './App.css';
// import Sidebar from './components/Sidebar';
// import Login from './components/Login';
// import { Routes, Route, useLocation } from 'react-router-dom';
// import { Dashboard } from './pages/Dashboard';
// import 'bootstrap/dist/css/bootstrap.min.css';
// import {
//   Equipements,
//   AjouterEquipement,
//   ConsulterEquipement,
//   ServicesThree,
// } from './pages/Equipements';
// import { Maintenance, EventsOne, EventsTwo } from './pages/Maintenance';
// import Contact from './pages/ContactUs';
// // import Support from './pages/Support';
// import EquipmentInfo from './components/EquipmentInfo';
// import { ChakraBaseProvider, theme as chakraTheme } from '@chakra-ui/react';

// function App() {
//   const [sidebarOpen, setSidebarOpen] = useState(false);
//   const location = useLocation();

//   const toggleSidebar = () => {
//     setSidebarOpen(!sidebarOpen);
//   };

//   const shouldShowSidebar = () => {
//     return location.pathname !== '/';
//   };

//   return (
//     <ChakraBaseProvider theme={chakraTheme}>
//       <div className='App'>
//         {shouldShowSidebar() && (
//           <Sidebar toggleSidebar={toggleSidebar} sidebarOpen={sidebarOpen} />
//         )}
//         <div
//           className={
//             sidebarOpen && shouldShowSidebar()
//               ? 'content'
//               : 'content content-closed'
//           }
//         >
//           <Routes>
//             <Route path='/' element={<Login />} />
//             <Route path='/Dashboard' element={<Dashboard />} />
//             <Route path='/Equipements' element={<Equipements />} />
//             <Route
//               path='/Equipements/AjouterEquipement'
//               element={<AjouterEquipement />}
//             />
//             <Route
//               path='/Equipements/ConsulterEquipement'
//               element={<ConsulterEquipement />}
//             />
//             <Route path='/Equipements/services3' element={<ServicesThree />} />
//             <Route path='/contact' element={<Contact />} />
//             <Route path='/maintenances' element={<Maintenance />} />
//             <Route
//               path='/maintenances/ProgrammerIntervention'
//               element={<EventsOne />}
//             />
//             <Route
//               path='/maintenances/SuiviMaintenance'
//               element={<EventsTwo />}
//             />
//             {/* <Route path='/support' element={<Support />} /> */}
//             <Route
//               path='/Equipements/ViewEquipmentInfo/:equipmentId'
//               element={<EquipmentInfo />}
//             />
//           </Routes>
//         </div>
//       </div>
//     </ChakraBaseProvider>
//   );
// }

// export default App;
import React, { useState, useEffect, useRef} from 'react';
import './App.css';
import Sidebar from './components/Sidebar';
import Login from './components/Login';
import { Routes, Route, useLocation } from 'react-router-dom';
import { Dashboard } from './pages/Dashboard';
import 'bootstrap/dist/css/bootstrap.min.css';
import {
  Equipements,
  AjouterEquipement,
  ConsulterEquipement,
  ServicesThree,
} from './pages/Equipements';
import { Maintenance, EventsOne, EventsTwo } from './pages/Maintenance';
import Contact from './pages/ContactUs';
import EquipmentInfo from './components/EquipmentInfo';
import {
  Box,
  ChakraBaseProvider,
  theme as chakraTheme,
} from '@chakra-ui/react';

function App() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();
  const sidebarRef = useRef(null);
  const navbarRef = useRef(null);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const shouldShowSidebar = () => {
    return location.pathname !== '/';
  };

  const handleClickOutside = (event) => {
    if (
      sidebarRef.current &&
      navbarRef.current &&
      !sidebarRef.current.contains(event.target) &&
      !navbarRef.current.contains(event.target)
    ) {
      setSidebarOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener('click', handleClickOutside);
    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, []);

  return (
    <ChakraBaseProvider theme={chakraTheme}>
      <Box h='100vh' w='100vw' bg='gray.50'>
        {shouldShowSidebar() && (
          <Sidebar
            toggleSidebar={toggleSidebar}
            sidebarOpen={sidebarOpen}
            sidebarRef={sidebarRef}
            navbarRef={navbarRef}
          />
        )}
        <div
          className={
            sidebarOpen && shouldShowSidebar()
              ? 'content'
              : 'content content-closed'
          }
        >
          <Routes>
            <Route path='/' element={<Login />} />
            <Route path='/Dashboard' element={<Dashboard />} />
            <Route path='/Equipements' element={<Equipements />} />
            <Route
              path='/Equipements/AjouterEquipement'
              element={<AjouterEquipement />}
            />
            <Route
              path='/Equipements/ConsulterEquipement'
              element={<ConsulterEquipement />}
            />
            <Route path='/Equipements/services3' element={<ServicesThree />} />
            <Route path='/contact' element={<Contact />} />
            <Route path='/maintenances' element={<Maintenance />} />
            <Route
              path='/maintenances/ProgrammerIntervention'
              element={<EventsOne />}
            />
            <Route
              path='/maintenances/SuiviMaintenance'
              element={<EventsTwo />}
            />
            <Route
              path='/Equipements/ViewEquipmentInfo/:equipmentId'
              element={<EquipmentInfo />}
            />
          </Routes>
        </div>
      </Box>
    </ChakraBaseProvider>
  );
}

export default App;
