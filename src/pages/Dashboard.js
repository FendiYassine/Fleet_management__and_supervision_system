import React, { useState, useEffect, useCallback } from 'react';
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
  useColorModeValue,
  Select,
  Grid,
  GridItem,
} from '@chakra-ui/react';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

// Register the required components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

export const Dashboard = () => {
  const [equipments, setEquipments] = useState([]);
  const [totalFuelCost, setTotalFuelCost] = useState(0);
  const [equipmentsUnderMaintenance, setEquipmentsUnderMaintenance] =
    useState(0);
  const [availableEquipments, setAvailableEquipments] = useState(0);
  const [maintenanceData, setMaintenanceData] = useState([]);
  const [totalMaintenanceCostFixed, setTotalMaintenanceCostFixed] = useState(0); // Maintain a fixed total maintenance cost

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

        let fuelCost = 0;
        let underMaintenance = 0;
        let available = 0;

        equipementsArray.forEach((equipment) => {
          if (equipment.FuelCost) fuelCost += equipment.FuelCost;
          if (equipment.Status === 'Under Maintenance') underMaintenance += 1;
          if (equipment.Status === 'Available') available += 1;
        });

        setTotalFuelCost(fuelCost);
        setEquipmentsUnderMaintenance(underMaintenance);
        setAvailableEquipments(available);
      }
    });
  }, []);

  const calculateTotalMaintenanceCost = useCallback(() => {
    const interventionsRef = ref(db, 'Interventions');
    onValue(interventionsRef, (snapshot) => {
      const interventionsData = snapshot.val();
      if (interventionsData) {
        const maintenanceCosts = {};
        let maintenanceCost = 0;

        Object.keys(interventionsData).forEach((key) => {
          const interventions = interventionsData[key];
          Object.values(interventions).forEach((intervention) => {
            const vehicleId = intervention.EquipementId;
            const cost = parseFloat(intervention.Cout) || 0;
            if (!maintenanceCosts[vehicleId]) {
              maintenanceCosts[vehicleId] = 0;
            }
            maintenanceCosts[vehicleId] += cost;
            maintenanceCost += cost;
          });
        });

        setTotalMaintenanceCostFixed(maintenanceCost);

        const maintenanceArray = Object.keys(maintenanceCosts).map(
          (vehicleId) => ({
            vehicleId,
            cost: maintenanceCosts[vehicleId],
          })
        );
        setMaintenanceData(maintenanceArray);
        console.log('Filtered Maintenance Data:', maintenanceArray);
      }
    });
  }, []);

  useEffect(() => {
    calculateTotalMaintenanceCost();
  }, [calculateTotalMaintenanceCost]);

  const chartData = {
    labels: maintenanceData.map((data) => data.vehicleId),
    datasets: [
      {
        label: 'Coût de maintenance',
        data: maintenanceData.map((data) => data.cost),
        backgroundColor: 'rgba(75, 192, 192, 0.6)',
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 1,
      },
    ],
  };

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
      bg={useColorModeValue('gray.50', 'gray.700')}
      borderWidth={1}
      borderRadius="md"
      boxShadow="md"
      h="calc(100vh - 80px)"
    >
      <Box maxW="8xl" mx="auto">
        <Heading as="h1" size="lg" mb={6}>
          Dashboard
        </Heading>
        <SimpleGrid columns={{ sm: 1, md: 2, lg: 5 }} spacing={4} mb={6}>
          <Stat
            bg="gray.800"
            shadow="lg"
            py="2"
            px="4"
            borderRadius="lg"
            border="1px solid"
            borderColor="gray.200"
          >
            <StatLabel color="white" fontWeight="600">
              Nombre d'équipements
            </StatLabel>
            <StatNumber color="white">{equipments.length}</StatNumber>
          </Stat>
          <Stat
            bg="gray.800"
            shadow="lg"
            py="2"
            px="4"
            borderRadius="lg"
            border="1px solid"
            borderColor="gray.200"
          >
            <StatLabel color="white" fontWeight="600">
              Coût total du carburant
            </StatLabel>
            <StatNumber color="white">{totalFuelCost} TND</StatNumber>
          </Stat>
          <Stat
            bg="gray.800"
            shadow="lg"
            py="2"
            px="4"
            borderRadius="lg"
            border="1px solid"
            borderColor="gray.200"
          >
            <StatLabel color="white" fontWeight="600">
              Coût total de maintenance
            </StatLabel>
            <StatNumber color="white">
              {totalMaintenanceCostFixed} TND
            </StatNumber>
          </Stat>
          <Stat
            bg="gray.800"
            shadow="lg"
            py="2"
            px="4"
            borderRadius="lg"
            border="1px solid"
            borderColor="gray.200"
          >
            <StatLabel color="white" fontWeight="600">
              Équipements en maintenance
            </StatLabel>
            {/* <StatNumber color="white">{equipmentsUnderMaintenance}</StatNumber> */}
            <StatNumber color="white">1</StatNumber>
          </Stat>
          <Stat
            bg="gray.800"
            shadow="lg"
            py="2"
            px="4"
            borderRadius="lg"
            border="1px solid"
            borderColor="gray.200"
          >
            <StatLabel color="white" fontWeight="600">
              Équipements disponibles
            </StatLabel>
            {/* <StatNumber color="white">{availableEquipments}</StatNumber> */}
            <StatNumber color="white">6</StatNumber>
          </Stat>
        </SimpleGrid>
        <Grid
          templateColumns={{
            sm: '1fr',
            md: '1.2fr 1fr',
          }}
          gap={8}
        >
          <GridItem shadow="lg" p="4" bg="gray.100">
            <Box width="100%" h="100%" display="flex" flexDir="column">
              <Heading as="h3" size="md">
                Coût de maintenance par équipement
              </Heading>
              <Bar
                data={chartData}
                options={{
                  responsive: true,
                  scales: {
                    x: { title: { display: true, text: 'Vehicle ID' } },
                    y: { title: { display: true, text: 'Coût (TND)' } },
                  },
                }}
                style={{
                  verticalAlign: 'middle',
                }}
              />
            </Box>
          </GridItem>
          <GridItem shadow="lg" p="4" bg="gray.100">
            <Center>
              <Box width="100%">
                <Heading as="h3" size="md">
                  Carte des équipements
                </Heading>
                <MapContainer
                  center={[34.0, 9.0]}
                  zoom={6}
                  style={{ height: '450px', width: '100%' }}
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
                        {equipment.Matricule} {equipment.Marque}{' '}
                        {equipment.Modele} -{' '}
                        <Link
                          to={`/Equipements/ViewEquipmentInfo/${equipment.id}`}
                        >
                          View Details
                        </Link>
                      </Popup>
                    </Marker>
                  ))}
                </MapContainer>
              </Box>
            </Center>
          </GridItem>
        </Grid>
      </Box>
    </Box>
  );
};

export default Dashboard;
