// import React, { useEffect, useState } from 'react';
// import { useParams, useNavigate } from 'react-router-dom';
// import { ref, onValue } from 'firebase/database';
// import { db } from '../config/firebase';
// import GaugeChart from 'react-gauge-chart';
// import { GrLinkPrevious } from 'react-icons/gr';

// const EquipmentInfo = ({ onBackClick }) => {
//   const { equipmentId } = useParams();
//   const [equipment, setEquipment] = useState(null);
//   const navigate = useNavigate();

//   useEffect(() => {
//     const equipmentRef = ref(db, `Equipement/${equipmentId}`);
//     onValue(equipmentRef, (snapshot) => {
//       setEquipment(snapshot.val());
//     });
//   }, [equipmentId]);

//   if (!equipment || !equipment.OBDParameter) {
//     return <div>Loading equipment details...</div>;
//   }
//   const handleBack = () => {
//     navigate(-1); // Navigate back
//   };
//   return (
//     <div className="container">
//       <div className="selected-equipment-details">
//       <button onClick={handleBack} className="back-button">
//           <GrLinkPrevious /> Previous
//         </button>
//         <h2 className="text-center">Détails de l'équipement sélectionné</h2>
//         <div className="info-sections">
//         <div className="info-card">
//           <h4>Niveau de carburant</h4>
//           <GaugeChart
//             id="fuel-level-gauge"
//             percent={equipment.OBDParameter.FuelLevel / 100}
//             textColor="#333"
//           />
//           <p>{equipment.OBDParameter.FuelLevel}%</p>
//         </div>
//         <div className="info-card">
//           <h4>Température de liquide de refroidissement</h4>
//           <GaugeChart
//             id="coolant-temperature-gauge"
//             percent={equipment.OBDParameter.EngineCoolantTemperature / 200}
//             textColor="#333"
//           />
//           <p>{equipment.OBDParameter.EngineCoolantTemperature}°C</p>
//         </div>
//         <div className="info-card">
//           <h4>  Vitesse</h4>
//           <p>{equipment.OBDParameter.Speed} km/h</p>
//         </div>
//         <div className="info-card">
//           <h4>Régime moteur</h4>
//           <p>{equipment.OBDParameter.RPM} RPM</p>
//         </div>
//         <div className="info-card">
//           <h4>Pression du collecteur d'admission</h4>
//           <p>{equipment.OBDParameter.IntakeManifoldPressure} kPa</p>
//         </div>
//         <div className="info-card">
//           <h4>Pression de carburant</h4>
//           <p>{equipment.OBDParameter.FuelPressure} PSI</p>
//         </div>
//       </div>
//     </div>
//     </div>
//   );
// };

// export default EquipmentInfo;


import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ref, onValue } from 'firebase/database';
import { db } from '../config/firebase';
import GaugeChart from 'react-gauge-chart';
import { GrLinkPrevious } from 'react-icons/gr';
import {
  Box,
  Button,
  Flex,
  Grid,
  Heading,
  Text,
  useColorModeValue,
} from '@chakra-ui/react';

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

const EquipmentInfo = () => {
  const { equipmentId } = useParams();
  const [equipment, setEquipment] = useState(null);
  const navigate = useNavigate();
  const textColor = useColorModeValue('#333', '#fff');
  // const bgColor = useColorModeValue('white', 'gray.800');

  useEffect(() => {
    const equipmentRef = ref(db, `Equipement/${equipmentId}`);
    onValue(equipmentRef, (snapshot) => {
      setEquipment(snapshot.val());
    });
  }, [equipmentId]);

  if (!equipment || !equipment.OBDParameter) {
    return <div>Loading equipment details...</div>;
  }

  const handleBack = () => {
    navigate(-1); // Navigate back
  };

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
          onClick={handleBack}
          leftIcon={<GrLinkPrevious />}
          maxW={{ base: 'full', sm: '120px' }}
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
              textColor={textColor}
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
              textColor={textColor}
            />
          }
        />
        <InfoCard title='Vitesse' value={`${equipment.OBDParameter.Speed} km/h`} />
        <InfoCard title='Régime moteur' value={`${equipment.OBDParameter.RPM} RPM`} />
        <InfoCard
          title="Pression du collecteur d'admission"
          value={`${equipment.OBDParameter.IntakeManifoldPressure} kPa`}
        />
        <InfoCard
          title='Pression de carburant'
          value={`${equipment.OBDParameter.FuelPressure} PSI`}
        />
      </Grid>
    </Box>
  );
};

export default EquipmentInfo;

