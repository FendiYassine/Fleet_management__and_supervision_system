import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { Link } from 'react-router-dom';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { ref, onValue } from 'firebase/database';
import { db } from '../config/firebase';
import {
  Box,
  Heading,
  Center,
  SimpleGrid,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  useColorModeValue,
  VStack,
} from '@chakra-ui/react';

export const Dashboard = () => {
  const [equipments, setEquipments] = useState([]);
  const [totalFuelCost, setTotalFuelCost] = useState(0);
  const [totalMaintenanceCost, setTotalMaintenanceCost] = useState(0);
  const [equipmentsUnderMaintenance, setEquipmentsUnderMaintenance] =
    useState(0);
  const [availableEquipments, setAvailableEquipments] = useState(0);

  // Fetching data from Firebase
  useEffect(() => {
    const equipementsRef = ref(db, 'Equipement');
    onValue(equipementsRef, (snapshot) => {
      const equipementsData = snapshot.val();
      if (equipementsData) {
        const equipementsArray = Object.keys(equipementsData).map((key) => ({
          id: key,
          ...equipementsData[key],
        }));
        setEquipments(equipementsArray);

        // Calculate statistics
        let fuelCost = 0;
        let maintenanceCost = 0;
        let underMaintenance = 0;
        let available = 0;

        equipementsArray.forEach((equipment) => {
          if (equipment.FuelCost) fuelCost += equipment.FuelCost;
          if (equipment.MaintenanceCost)
            maintenanceCost += equipment.MaintenanceCost;
          if (equipment.Status === 'Under Maintenance') underMaintenance += 1;
          if (equipment.Status === 'Available') available += 1;
        });

        setTotalFuelCost(fuelCost);
        setTotalMaintenanceCost(maintenanceCost);
        setEquipmentsUnderMaintenance(underMaintenance);
        setAvailableEquipments(available);
      }
    });
  }, []);

  // Custom marker icon setup
  const customIcon = new L.Icon({
    iconUrl: process.env.PUBLIC_URL + '/icons/marker-icon.png',
    iconRetinaUrl: process.env.PUBLIC_URL + '/icons/marker-icon-2x.png',
    shadowUrl: process.env.PUBLIC_URL + '/icons/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41],
  });

  return (
    <Box
      p={4}
      mx="auto"
      bg={useColorModeValue('white', 'gray.700')}
      borderWidth={1}
      borderRadius="md"
      boxShadow="md"
    >
      <Heading as="h1" size="lg" textAlign="center" mb={6}>
        Gestion de flotte
      </Heading>
      <SimpleGrid columns={{ sm: 1, md: 2, lg: 4 }} spacing={4} mb={6}>
        <Stat>
          <StatLabel>Nombre d'équipements</StatLabel>
          <StatNumber>{equipments.length}</StatNumber>
        </Stat>
        <Stat>
          <StatLabel>Coût total du carburant</StatLabel>
          <StatNumber>{totalFuelCost} TND</StatNumber>
        </Stat>
        <Stat>
          <StatLabel>Coût total de maintenance</StatLabel>
          <StatNumber>{totalMaintenanceCost} TND</StatNumber>
        </Stat>
        <Stat>
          <StatLabel>Équipements en maintenance</StatLabel>
          <StatNumber>{equipmentsUnderMaintenance}</StatNumber>
        </Stat>
        <Stat>
          <StatLabel>Équipements disponibles</StatLabel>
          <StatNumber>{availableEquipments}</StatNumber>
        </Stat>
      </SimpleGrid>
      <Center>
        <Heading as="h2" size="md" mb={4}>
          Carte des équipements
        </Heading>
      </Center>
      <Center>
        <MapContainer
          center={[34.0, 9.0]} // Centered on Tunisia
          zoom={6} // Adjusted zoom level for better focus on the country
          style={{ height: '600px', width: '65%' }}
        >
          <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
          {equipments.map((equipment) => (
            <Marker
              key={equipment.id}
              position={[
                equipment.PositionGPS.Latitude,
                equipment.PositionGPS.Longitude,
              ]}
              icon={customIcon}
            >
              <Popup>
                {equipment.Matricule} {equipment.Marque} {equipment.Modele} -{' '}
                <Link to={`/Equipements/ViewEquipmentInfo/${equipment.id}`}>
                  View Details
                </Link>
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      </Center>
    </Box>
  );
};

export default Dashboard;
