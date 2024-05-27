import React, { useState, useEffect } from 'react';
import { getDatabase, ref, get, set } from 'firebase/database';
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Heading,
  Input,
  Select,
  Stack,
  useColorModeValue,
  Flex,
  Textarea,
} from '@chakra-ui/react';

const ProgrammerIntervention = () => {
  const [equipements, setEquipements] = useState([]);
  const [selectedEquipement, setSelectedEquipement] = useState('');
  const [description, setDescription] = useState('');
  const [kilometrage, setKilometrage] = useState('');
  const [cout, setCout] = useState('');
  const [piecesChangees, setPiecesChangees] = useState('');
  const [prochaineMaintenance, setProchaineMaintenance] = useState('');
  const [refIntervention, setRefIntervention] = useState('');

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

  const handleReset = () => {
    setSelectedEquipement('');
    setDescription('');
    setKilometrage('');
    setCout('');
    setPiecesChangees('');
    setProchaineMaintenance('');
  };

  const handleSubmit = async () => {
    if (!refIntervention) {
      alert('Waiting for RefIntervention to be set.');
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
          PiecesChangees: piecesChangees,
          ProchaineMaintenance: prochaineMaintenance,
        }
      );
      handleReset();
      alert('Intervention ajoutée avec succès !');
    } catch (error) {
      console.error("Erreur lors de l'ajout de l'intervention :", error);
      alert("Une erreur s'est produite lors de l'ajout de l'intervention.");
    }
  };

  return (
    <Box
      p={4}
      maxW='md'
      mx='auto'
      bg={useColorModeValue('white', 'gray.700')}
      borderWidth={1}
      borderRadius='md'
      boxShadow='md'
    >
      <Heading as='h3' size='lg' textAlign='center' mb={6}>
        Nouvelle Intervention
      </Heading>
      <Stack spacing={4}>
        <FormControl>
          <FormLabel>Référence de l'intervention</FormLabel>
          <Input type='text' value={refIntervention} readOnly />
        </FormControl>
        <FormControl>
          <FormLabel>Choisir un équipement</FormLabel>
          <Select
            placeholder='Sélectionner un équipement'
            value={selectedEquipement}
            onChange={(e) => setSelectedEquipement(e.target.value)}
          >
            {equipements.map((equipement) => (
              <option key={equipement.id} value={equipement.id}>
                {equipement.Matricule}
              </option>
            ))}
          </Select>
        </FormControl>
        <FormControl>
          <FormLabel>Description de l'intervention</FormLabel>
          <Textarea
            type='text'
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </FormControl>
        <FormControl>
          <FormLabel>Kilométrage à l'intervention</FormLabel>
          <Input
            type='text'
            value={kilometrage}
            onChange={(e) => setKilometrage(e.target.value)}
          />
        </FormControl>
        <FormControl>
          <FormLabel>Coûts de l'intervention</FormLabel>
          <Input
            type='text'
            value={cout}
            onChange={(e) => setCout(e.target.value)}
          />
        </FormControl>
        <FormControl>
          <FormLabel>Les pièces changées</FormLabel>
          <Input
            type='text'
            value={piecesChangees}
            onChange={(e) => setPiecesChangees(e.target.value)}
          />
        </FormControl>
        <FormControl>
          <FormLabel>Prochaine maintenance</FormLabel>
          <Input
            type='text'
            value={prochaineMaintenance}
            onChange={(e) => setProchaineMaintenance(e.target.value)}
          />
        </FormControl>
        <Flex justify='space-between' gap="4">
          <Button colorScheme='teal' onClick={handleSubmit}>
            Soumettre
          </Button>
          <Button onClick={handleReset}>Réinitialiser</Button>
        </Flex>
      </Stack>
    </Box>
  );
};

export default ProgrammerIntervention;
