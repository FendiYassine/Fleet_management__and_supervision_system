import React, { useState, useEffect, useCallback } from 'react';
import { getDatabase, ref, get, set } from 'firebase/database';
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Heading,
  Input,
  Stack,
  useColorModeValue,
  Flex,
  Textarea,
  useToast,
} from '@chakra-ui/react';
import { Select } from 'chakra-react-select';
import maintenanceData from '../Maintenance.json';

const ProgrammerIntervention = () => {
  const [equipements, setEquipements] = useState([]);
  const [selectedEquipement, setSelectedEquipement] = useState('');
  const [description, setDescription] = useState('');
  const [kilometrage, setKilometrage] = useState('');
  const [cout, setCout] = useState('');
  const [piecesChangees, setPiecesChangees] = useState([]);
  const [prochaineMaintenance, setProchaineMaintenance] = useState('');
  const [refIntervention, setRefIntervention] = useState('');
  const [dateIntervention, setDateIntervention] = useState(
    new Date().toISOString().substring(0, 10)
  ); // Default to today's date
  const toast = useToast();

  useEffect(() => {
    fetchEquipements();
    fetchLastInterventionNumber();
  }, []);

  const fetchEquipements = async () => {
    const db = getDatabase();
    const equipementsRef = ref(db, 'Equipement');
    try {
      const snapshot = await get(equipementsRef);
      const equipementsList = [];
      snapshot.forEach((childSnapshot) => {
        equipementsList.push({ id: childSnapshot.key, ...childSnapshot.val() });
      });
      setEquipements(equipementsList);
    } catch (error) {
      console.error('Failed to fetch equipements:', error);
    }
  };

  const fetchLastInterventionNumber = async () => {
    const currentYear = new Date().getFullYear();
    const db = getDatabase();
    const interventionsRef = ref(db, `Interventions/INT${currentYear}`);
    try {
      const snapshot = await get(interventionsRef);
      let lastNumber = 0;
      snapshot.forEach((childSnapshot) => {
        const key = childSnapshot.key;
        const interventionNumber = parseInt(key, 10);
        if (interventionNumber > lastNumber) {
          lastNumber = interventionNumber;
        }
      });
      const newInterventionNumber = lastNumber + 1;
      setRefIntervention(`INT${currentYear}/${newInterventionNumber}`);
    } catch (error) {
      console.error('Failed to fetch last intervention number:', error);
    }
  };

  const fetchCurrentKilometrage = useCallback(async (equipementId) => {
    const db = getDatabase();
    const equipementRef = ref(db, `Equipement/${equipementId}`);
    try {
      const snapshot = await get(equipementRef);
      if (snapshot.exists()) {
        const data = snapshot.val();
        setKilometrage(data.Kilometrage || '');
      }
    } catch (error) {
      console.error('Failed to fetch current kilometrage:', error);
    }
  }, []);

  const calculateNextMaintenance = (currentKilometrage, selectedPieces) => {
    if (selectedPieces.length === 0) return currentKilometrage;

    const intervals = selectedPieces.map(
      (piece) => maintenanceData.Maintenances[piece.value].intervalKm
    );
    const minInterval = Math.min(...intervals);

    return currentKilometrage + minInterval;
  };

  const handleReset = () => {
    setSelectedEquipement('');
    setDescription('');
    setKilometrage('');
    setCout('');
    setPiecesChangees([]);
    setProchaineMaintenance('');
    setDateIntervention(new Date().toISOString().substring(0, 10)); // Reset to today's date
  };

  useEffect(() => {
    if (selectedEquipement) {
      fetchCurrentKilometrage(selectedEquipement);
    }
  }, [selectedEquipement, fetchCurrentKilometrage]);

  const handlePiecesChange = (selectedOptions) => {
    setPiecesChangees(selectedOptions);
    if (selectedEquipement) {
      const nextMaintenance = calculateNextMaintenance(
        parseInt(kilometrage),
        selectedOptions
      );
      setProchaineMaintenance(nextMaintenance);
    }
  };

  const handleSubmit = async () => {
    if (!refIntervention) {
      toast({
        title: 'Waiting for RefIntervention to be set.',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
      return;
    }
    try {
      const db = getDatabase();
      await set(
        ref(
          db,
          `Interventions/INT${new Date().getFullYear()}/${
            refIntervention.split('/')[1]
          }`
        ),
        {
          RefIntervention: refIntervention,
          EquipementId: selectedEquipement,
          Description: description,
          Kilometrage: kilometrage,
          Cout: cout,
          PiecesChangees: piecesChangees.map((p) => p.value).join(', '),
          ProchaineMaintenance: prochaineMaintenance,
          Date: dateIntervention,
        }
      );
      handleReset();
      toast({
        title: 'Intervention ajoutée avec succès !',
        status: 'success',
        duration: 5000,
        isClosable: true,
      });
    } catch (error) {
      console.error("Erreur lors de l'ajout de l'intervention :", error);
      toast({
        title: "Une erreur s'est produite lors de l'ajout de l'intervention.",
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    }
  };

  const maintenanceOptions = Object.keys(maintenanceData.Maintenances).map(
    (key) => ({
      value: key,
      label: maintenanceData.Maintenances[key].description,
    })
  );

  const equipementOptions = equipements.map((e) => ({
    value: e.id,
    label: e.Matricule,
  }));

  return (
    <Box
      p={4}
      maxW="xl"
      mx="auto"
      bg={useColorModeValue('white', 'gray.700')}
      borderWidth={1}
      borderRadius="md"
      boxShadow="md"
    >
      <Heading as="h3" size="lg" textAlign="center" mb={6}>
        Programmer une intervention de maintenance Curative
      </Heading>
      <Stack spacing={4}>
        <FormControl>
          <FormLabel>Référence de l'intervention</FormLabel>
          <Input type="text" value={refIntervention} readOnly />
        </FormControl>
        <FormControl>
          <FormLabel>Choisir un équipement</FormLabel>
          <Select
            placeholder="Sélectionner un équipement"
            options={equipementOptions}
            value={equipementOptions.find(
              (option) => option.value === selectedEquipement
            )}
            onChange={(selectedOption) => {
              setSelectedEquipement(selectedOption.value);
              fetchCurrentKilometrage(selectedOption.value);
            }}
            size="md"
          />
        </FormControl>
        <FormControl>
          <FormLabel>Description de l'intervention</FormLabel>
          <Textarea
            type="text"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </FormControl>
        <FormControl>
          <FormLabel>Kilométrage à l'intervention</FormLabel>
          <Input
            type="text"
            value={kilometrage}
            onChange={(e) => setKilometrage(e.target.value)}
          />
        </FormControl>
        <FormControl>
          <FormLabel>Coûts de l'intervention</FormLabel>
          <Input
            type="text"
            value={cout}
            onChange={(e) => setCout(e.target.value)}
          />
        </FormControl>
        <FormControl>
          <FormLabel>Les pièces changées</FormLabel>
          <Select
            isMulti
            options={maintenanceOptions}
            value={piecesChangees}
            onChange={handlePiecesChange}
            closeMenuOnSelect={false}
          />
        </FormControl>
        <FormControl>
          <FormLabel>Prochaine maintenance</FormLabel>
          <Input type="text" value={prochaineMaintenance} readOnly />
        </FormControl>
        <FormControl>
          <FormLabel>Date de l'intervention</FormLabel>
          <Input
            type="date"
            value={dateIntervention}
            onChange={(e) => setDateIntervention(e.target.value)}
          />
        </FormControl>
        <Flex justify="space-between" gap="4">
          <Button colorScheme="teal" onClick={handleSubmit}>
            Soumettre
          </Button>
          <Button onClick={handleReset}>Réinitialiser</Button>
        </Flex>
      </Stack>
    </Box>
  );
};

export default ProgrammerIntervention;
