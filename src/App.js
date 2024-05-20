import React, { useState } from 'react';
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
import Support from './pages/Support';
import EquipmentInfo from './components/EquipmentInfo';

function App() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const shouldShowSidebar = () => {
    return location.pathname !== "/";
  };

  return (
    <div className="App">
      {shouldShowSidebar() && <Sidebar toggleSidebar={toggleSidebar} sidebarOpen={sidebarOpen} />}
      <div className={sidebarOpen && shouldShowSidebar() ? 'content' : 'content content-closed'}>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/Dashboard" element={<Dashboard />} />
            <Route path="/Equipements" element={<Equipements />} />
            <Route path="/Equipements/AjouterEquipement" element={<AjouterEquipement />} />
            <Route path="/Equipements/ConsulterEquipement" element={<ConsulterEquipement />} />
            <Route path="/Equipements/services3" element={<ServicesThree />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/maintenances" element={<Maintenance />} />
            <Route path="/maintenances/ProgrammerIntervention" element={<EventsOne />} />
            <Route path="/maintenances/SuiviMaintenance" element={<EventsTwo />} />
            <Route path="/support" element={<Support />} />
            <Route path="/Equipements/ViewEquipmentInfo/:equipmentId" element={<EquipmentInfo />} />
        </Routes>
      </div>
    </div>
  );
}

export default App;
