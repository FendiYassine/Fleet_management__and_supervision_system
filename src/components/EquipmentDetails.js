import React from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import GaugeChart from 'react-gauge-chart';
import { GrLinkPrevious } from 'react-icons/gr';
import L from 'leaflet';
import {
  Box,
  Button,
  Flex,
  Grid,
  Heading,
  Text,
  VStack,
  useColorModeValue,
} from '@chakra-ui/react';
import { FaArrowLeft } from 'react-icons/fa';

const customIcon = new L.Icon({
  iconUrl: process.env.PUBLIC_URL + '/icons/marker-icon.png',
  iconRetinaUrl: process.env.PUBLIC_URL + '/icons/marker-icon-2x.png',
  shadowUrl: process.env.PUBLIC_URL + '/icons/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

const InfoCard = ({ title, value, gauge }) => (
  <Box
    p={4}
    borderWidth='1px'
    borderRadius='md'
    boxShadow='md'
    bg={useColorModeValue('white', 'gray.800')}
    textAlign='center'
  >
    <Text fontWeight='bold' mb={2}>
      {title}
    </Text>
    {gauge}
    <Text mt={2} fontSize='lg' fontWeight='semibold'>
      {value}
    </Text>
  </Box>
);

const EquipmentDetails = ({ equipment, onBackClick }) => {
  return (
    <Box p={4} maxW='7xl' mx='auto'>
      <Flex
        flexDir={{ base: 'column', sm: 'row' }}
        justify='center'
        alignItems='center'
        mb={4}
        gap={4}
      >
        <Button
          onClick={onBackClick}
          leftIcon={<GrLinkPrevious />}
          maxW={{base: 'full', sm: '120px'}}
        >
          Previous
        </Button>
        <Heading as='h2' size='lg' flex='1' m={0}>
          Détails de l'équipement sélectionné
        </Heading>
        <Box width='75px' />
      </Flex>
      <Grid
        templateColumns='repeat(auto-fit, minmax(250px, 1fr))'
        gap={6}
        mb={6}
      >
        <InfoCard
          title='Niveau de carburant'
          value={`${equipment.OBDParameter.FuelLevel}%`}
          gauge={
            <GaugeChart
              id='fuel-level-gauge'
              percent={equipment.OBDParameter.FuelLevel / 100}
              textColor={useColorModeValue('#333', '#fff')}
            />
          }
        />
        <InfoCard
          title='Température de liquide de refroidissement'
          value={`${equipment.OBDParameter.EngineCoolantTemperature}°C`}
          gauge={
            <GaugeChart
              id='coolant-temperature-gauge'
              percent={equipment.OBDParameter.EngineCoolantTemperature / 200}
              textColor={useColorModeValue('#333', '#fff')}
            />
          }
        />
        <InfoCard
          title='Vitesse'
          value={`${equipment.OBDParameter.Speed} km/h`}
        />
        <InfoCard
          title='Régime moteur'
          value={`${equipment.OBDParameter.RPM} RPM`}
        />
        <InfoCard
          title="Pression du collecteur d'admission"
          value={`${equipment.OBDParameter.IntakeManifoldPressure} kPa`}
        />
        <InfoCard
          title='Pression de carburant'
          value={`${equipment.OBDParameter.FuelPressure} PSI`}
        />
      </Grid>
      <Heading as='h3' size='md' textAlign='center' mb={4}>
        Position GPS
      </Heading>
      <Box borderWidth='1px' borderRadius='md' overflow='hidden' boxShadow='md'>
        <MapContainer
          center={[
            equipment.PositionGPS.Latitude,
            equipment.PositionGPS.Longitude,
          ]}
          zoom={13}
          style={{ height: '400px', width: '100%' }}
        >
          <TileLayer url='https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png' />
          <Marker
            position={[
              equipment.PositionGPS.Latitude,
              equipment.PositionGPS.Longitude,
            ]}
            icon={customIcon}
          >
            <Popup>
              {`Latitude: ${equipment.PositionGPS.Latitude}, Longitude: ${equipment.PositionGPS.Longitude}`}
            </Popup>
          </Marker>
        </MapContainer>
      </Box>
    </Box>
  );
};

export default EquipmentDetails;
