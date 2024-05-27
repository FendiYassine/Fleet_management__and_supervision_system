import React, { useState, useEffect, useCallback } from 'react';
import { getDatabase, ref, set, get } from 'firebase/database';
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Stack,
  useColorModeValue,
} from '@chakra-ui/react';

const InterventionFromSuggestion = ({
  isOpen,
  onClose,
  selectedEquipement,
  selectedMaintenances,
  setSelectedMaintenances,
  maintenanceData = [],
}) => {
  const [description, setDescription] = useState('');
  const [kilometrage, setKilometrage] = useState('');
  const [cout, setCout] = useState('');
  const [piecesChangees, setPiecesChangees] = useState('');
  const [prochaineMaintenance, setProchaineMaintenance] = useState('');
  const [refIntervention, setRefIntervention] = useState('');

  const fetchCurrentKilometrage = useCallback(async () => {
    const db = getDatabase();
    if (selectedEquipement) {
      const equipementRef = ref(db, `Equipement/${selectedEquipement}`);
      const snapshot = await get(equipementRef);
      if (snapshot.exists()) {
        setKilometrage(snapshot.val().Kilometrage);
      }
    }
  }, [selectedEquipement]);

  useEffect(() => {
    fetchLastInterventionNumber();
    fetchCurrentKilometrage();
  }, [selectedEquipement, fetchCurrentKilometrage]);

  useEffect(() => {
    if (selectedMaintenances.length > 0 && kilometrage && maintenanceData) {
      const intervals = selectedMaintenances
        .map((maintenance) => {
          const maintenanceDetail = maintenanceData.find(
            (data) => data.code === maintenance
          );
          return maintenanceDetail ? maintenanceDetail.intervalKm : Infinity;
        })
        .filter((km) => !isNaN(km));

      const minIntervalKm = Math.min(...intervals);
      if (!isNaN(minIntervalKm)) {
        setProchaineMaintenance(parseInt(kilometrage, 10) + minIntervalKm);
      }
    }
  }, [selectedMaintenances, kilometrage, maintenanceData]);

  const fetchLastInterventionNumber = async () => {
    const db = getDatabase();
    const interventionsRef = ref(
      db,
      `Interventions/INT${new Date().getFullYear()}`
    );
    const snapshot = await get(interventionsRef);
    let lastNumber = 0;
    snapshot.forEach((childSnapshot) => {
      const key = childSnapshot.key;
      const interventionNumber = parseInt(key, 10);
      if (interventionNumber > lastNumber) {
        lastNumber = interventionNumber;
      }
    });
    setRefIntervention(`INT${new Date().getFullYear()}/${lastNumber + 1}`);
  };

  const handleSubmit = async () => {
    if (!refIntervention || isNaN(prochaineMaintenance)) {
      alert(
        'Waiting for RefIntervention to be set or valid maintenance interval.'
      );
      return;
    }
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
    setSelectedMaintenances([]);
    onClose();
    alert('Intervention ajoutée avec succès !');
  };

  const handleReset = () => {
    setDescription('');
    setKilometrage('');
    setCout('');
    setPiecesChangees('');
    setProchaineMaintenance('');
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size='lg'>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Plan Intervention</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Stack spacing={4}>
            <FormControl>
              <FormLabel>Description</FormLabel>
              <Input
                type='text'
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </FormControl>
            <FormControl>
              <FormLabel>Kilométrage</FormLabel>
              <Input
                type='text'
                value={kilometrage}
                onChange={(e) => setKilometrage(e.target.value)}
              />
            </FormControl>
            <FormControl>
              <FormLabel>Coût de l'intervention</FormLabel>
              <Input
                type='text'
                value={cout}
                onChange={(e) => setCout(e.target.value)}
              />
            </FormControl>
            <FormControl>
              <FormLabel>Pièces changées</FormLabel>
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
          </Stack>
        </ModalBody>
        <ModalFooter>
          <Button colorScheme='teal' mr={3} onClick={handleSubmit}>
            Confirmer
          </Button>
          <Button onClick={handleReset}>Annuler</Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default InterventionFromSuggestion;
