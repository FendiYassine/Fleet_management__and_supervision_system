import React, { useState, useEffect, useRef } from 'react';
import { getDatabase, ref, set } from 'firebase/database';
import vehicleData from '../car-list.json';
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
  useToast,
} from '@chakra-ui/react';

const AjouterEquipement = () => {
  const [selectedMake, setSelectedMake] = useState('');
  const [selectedModel, setSelectedModel] = useState('');
  const [makes, setMakes] = useState([]);
  const [models, setModels] = useState([]);
  const toast = useToast();

  const matriculeRef = useRef();
  const vinRef = useRef();
  const kilometrageRef = useRef();
  const dateRef = useRef();
  const conditionRef = useRef();

  useEffect(() => {
    const uniqueMakes = Array.from(
      new Set(vehicleData.map((vehicle) => vehicle.brand))
    );
    const sortedUniqueMakes = uniqueMakes.sort((a, b) => a.localeCompare(b));
    setMakes(sortedUniqueMakes);
  }, []);

  const fetchModelsForMake = async (makeName) => {
    try {
      const filteredModels = vehicleData.find(
        (vehicle) => vehicle.brand === makeName
      ).models;
      const sortedUniqueModels = filteredModels.sort((a, b) =>
        a.localeCompare(b)
      );
      setModels(sortedUniqueModels);
    } catch (error) {
      console.error('Error fetching models for make:', error);
    }
  };

  const handleMakeChange = (event) => {
    const selectedMakeName = event.target.value;
    setSelectedMake(selectedMakeName);
    setSelectedModel('');
    if (selectedMakeName) {
      fetchModelsForMake(selectedMakeName);
    } else {
      setModels([]);
    }
  };

  const handleModelChange = (event) => {
    setSelectedModel(event.target.value);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const matriculeValue = matriculeRef.current.value;
    const vinValue = vinRef.current.value;
    const kilometrageValue = kilometrageRef.current.value;
    const dateMiseCirculationValue = dateRef.current.value;
    const conditionValue = conditionRef.current.value;

    try {
      const db = getDatabase();
      await set(ref(db, 'Equipement/' + matriculeValue), {
        Matricule: matriculeValue,
        VIN: vinValue,
        Kilometrage: kilometrageValue,
        Marque: selectedMake,
        Modele: selectedModel,
        DateMiseCirculation: dateMiseCirculationValue,
        Condition: conditionValue,
        PositionGPS: {
          DateEtHeure: '',
          Latitude: 0,
          Longitude: 0,
        },
        OBDParameter: {
          Speed: 0,
          RPM: 0,
          EngineLoad: 0,
          ThrottlePosition: 0,
          FuelLevel: 0,
          FuelType: '',
          EngineCoolantTemperature: 0,
          FuelPressure: 0,
          IntakeManifoldPressure: 0,
          EngineRuntime: 0,
          DistanceTraveledSinceCodesCleared: 0,
        },
      });

      event.target.reset();
      toast({
        title: 'Équipement ajouté avec succès !',
        status: 'success',
        duration: 5000,
        isClosable: true,
      });
    } catch (error) {
      console.error("Erreur lors de l'ajout de l'équipement : ", error);
      toast({
        title: "Une erreur s'est produite lors de l'ajout de l'équipement.",
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    }
  };

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
        Ajouter Equipement
      </Heading>
      <Stack spacing={4} as="form" onSubmit={handleSubmit}>
        <FormControl id="Matricule" isRequired>
          <FormLabel>Matricule</FormLabel>
          <Input type="text" ref={matriculeRef} />
        </FormControl>

        <FormControl id="VIN" isRequired>
          <FormLabel>VIN</FormLabel>
          <Input type="text" ref={vinRef} />
        </FormControl>

        <FormControl id="Kilometrage" isRequired>
          <FormLabel>Kilométrage</FormLabel>
          <Input type="number" ref={kilometrageRef} />
        </FormControl>

        <FormControl id="make" isRequired>
          <FormLabel>Marque</FormLabel>
          <Select value={selectedMake} onChange={handleMakeChange}>
            <option value="">Sélectionner une marque</option>
            {makes.map((make, index) => (
              <option key={index} value={make}>
                {make}
              </option>
            ))}
          </Select>
        </FormControl>

        <FormControl id="model" isRequired>
          <FormLabel>Modèle</FormLabel>
          <Select value={selectedModel} onChange={handleModelChange}>
            <option value="">Sélectionner un modèle</option>
            {models.map((model, index) => (
              <option key={index} value={model}>
                {model}
              </option>
            ))}
          </Select>
        </FormControl>

        <FormControl id="date" isRequired>
          <FormLabel>Date de mise en circulation</FormLabel>
          <Input type="date" ref={dateRef} />
        </FormControl>

        <FormControl id="condition" isRequired>
          <FormLabel>Condition</FormLabel>
          <Select ref={conditionRef}>
            <option value="">Sélectionner une condition</option>
            <option value="Neuf">Neuf</option>
            <option value="Occasion">Occasion</option>
          </Select>
        </FormControl>

        <Button type="submit" colorScheme="blue" width="full">
          Ajouter Equipement
        </Button>
      </Stack>
    </Box>
  );
};

export default AjouterEquipement;
