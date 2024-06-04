import React, { useState, useEffect, useCallback } from 'react';
import { getDatabase, ref, get, set ,push} from 'firebase/database';
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
  useToast,
} from '@chakra-ui/react';
import { Select } from 'chakra-react-select';

const AjouterCarburant = () => {
  const [equipements, setEquipements] = useState([]);
  const [selectedEquipement, setSelectedEquipement] = useState('');
  const [kilometrage, setKilometrage] = useState('');
  const [liter, setliter] = useState('');
  const [cout, setCout] = useState('');
  const [dateOperation, setDateOperation] = useState(
    new Date().toISOString().substring(0, 10)
  );
  const toast = useToast();

  useEffect(() => {
    fetchEquipements();
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

  const handleReset = () => {
    setSelectedEquipement('');
    setKilometrage('');
    setCout('');
    setliter('');
    setDateOperation(new Date().toISOString().substring(0, 10)); // Reset to today's date
  };

  useEffect(() => {
    if (selectedEquipement) {
      fetchCurrentKilometrage(selectedEquipement);
    }
  }, [selectedEquipement, fetchCurrentKilometrage]);

  const handleSubmit = async () => {
    if (!selectedEquipement || !kilometrage || !cout || !dateOperation || !liter) {
      toast({
        title: 'Champs manquants',
        description: 'Veuillez remplir tous les champs obligatoires.',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
      return;
    }
    try {
      const db = getDatabase();
      const fuelSupplyRef = ref(db, 'FuelSupply');
      const newFuelSupplyRef = push(fuelSupplyRef); // Generates a unique key
      await set(newFuelSupplyRef, {
        EquipementId: selectedEquipement,
        Kilometrage: kilometrage,
        Cout: cout,
        liter: liter,
        Date: dateOperation,
      });
      handleReset();
      toast({
        title: "Opération d'alimentation carburant ajoutée avec succès !",
        status: 'success',
        duration: 5000,
        isClosable: true,
      });
    } catch (error) {
      console.error("Erreur lors de l'ajout de l'opératiuon :", error);
      toast({
        title: "Une erreur s'est produite lors de l'ajout de l'opération.",
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    }
  };
  

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
        Nouvelle opération d'achat du carburant
      </Heading>
      <Stack spacing={4}>
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
          <FormLabel>Kilométrage à l'Opération</FormLabel>
          <Input
            type="text"
            value={kilometrage}
            onChange={(e) => setKilometrage(e.target.value)}
          />
        </FormControl>
        <FormControl>
          <FormLabel>Coûts de l'Opération</FormLabel>
          <Input
            type="text"
            value={cout}
            onChange={(e) => setCout(e.target.value)}
          />
        </FormControl>

        <FormControl>
          <FormLabel>Quantité de carburant remplie (L)</FormLabel>
          <Input
            type="text"
            value={liter}
            onChange={(e) => setliter(e.target.value)}
          />
        </FormControl>

        <FormControl>
          <FormLabel>Date et heure de l'Opération</FormLabel>
          <Input
            placeholder="Select Date and Time"
            size="md"
            type="datetime-local"
            value={dateOperation}
            onChange={(e) => setDateOperation(e.target.value)}
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

export default AjouterCarburant;
