import React, { useState, useEffect, useRef } from 'react';
import './App.css';
import Sidebar from './components/Sidebar';
import Login from './components/Login';
import { Routes, Route, useLocation, Navigate } from 'react-router-dom';
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
import {
  Box,
  ChakraBaseProvider,
  theme as chakraTheme,
} from '@chakra-ui/react';
import EquipmentInfo from './components/EquipmentInfo';
import { Alimentation, SuiviOperation } from './pages/carburant';

function useAuth() {
  const token = localStorage.getItem('token');
  return !!token;
}

function PrivateRoute({ children }) {
  const isAuthenticated = useAuth();
  return isAuthenticated ? children : <Navigate to="/" />;
}

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
      <Box h="100vh" w="100vw" bg="gray.50">
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
            <Route path="/" element={<Login />} />
            <Route
              path="/Dashboard"
              element={
                <PrivateRoute>
                  <Dashboard />
                </PrivateRoute>
              }
            />
            <Route
              path="/Equipements"
              element={
                <PrivateRoute>
                  <Equipements />
                </PrivateRoute>
              }
            />
            <Route
              path="/Equipements/AjouterEquipement"
              element={
                <PrivateRoute>
                  <AjouterEquipement />
                </PrivateRoute>
              }
            />
            <Route
              path="/Equipements/ConsulterEquipement"
              element={
                <PrivateRoute>
                  <ConsulterEquipement />
                </PrivateRoute>
              }
            />
            <Route
              path="/Equipements/services3"
              element={
                <PrivateRoute>
                  <ServicesThree />
                </PrivateRoute>
              }
            />
            <Route
              path="/contact"
              element={
                <PrivateRoute>
                  <Contact />
                </PrivateRoute>
              }
            />
            <Route
              path="/maintenances"
              element={
                <PrivateRoute>
                  <Maintenance />
                </PrivateRoute>
              }
            />
            <Route
              path="/maintenances/ProgrammerIntervention"
              element={
                <PrivateRoute>
                  <EventsOne />
                </PrivateRoute>
              }
            />
            <Route
              path="/maintenances/SuiviMaintenance"
              element={
                <PrivateRoute>
                  <EventsTwo />
                </PrivateRoute>
              }
            />
            <Route
              path="/Equipements/ViewEquipmentInfo/:equipmentId"
              element={
                <PrivateRoute>
                  <EquipmentInfo />
                </PrivateRoute>
              }
            />
            <Route
              path="/carburant"
              element={
                <PrivateRoute>
                  <Alimentation />
                </PrivateRoute>
              }
            />
            <Route
              path="/carburant/AjouterCarburant"
              element={
                <PrivateRoute>
                  <Alimentation />
                </PrivateRoute>
              }
            />
            <Route
              path="/carburant/SuiviCarburant"
              element={
                <PrivateRoute>
                  <SuiviOperation />
                </PrivateRoute>
              }
            />
          </Routes>
        </div>
      </Box>
    </ChakraBaseProvider>
  );
}

export default App;
