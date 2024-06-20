import React, { useState, useEffect } from 'react';
import { getDatabase, ref, get } from 'firebase/database';
import {
  Box,
  Button,
  Checkbox,
  Flex,
  Heading,
  Table,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
  useDisclosure,
} from '@chakra-ui/react';
import { Select } from 'chakra-react-select';
import useMaintenanceData from '../hooks/useMaintenanceData';
import InterventionFromSuggestion from './InterventionFromSuggestion';

const SuiviMaintenance = () => {
  const [equipements, setEquipements] = useState([]);
  const [selectedEquipement, setSelectedEquipement] = useState(null);
  const [selectedMaintenances, setSelectedMaintenances] = useState([]);
  const [selectAll, setSelectAll] = useState(false);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const maintenanceData = useMaintenanceData();

  useEffect(() => {
    const fetchEquipements = async () => {
      const db = getDatabase();
      const equipementsRef = ref(db, 'Equipement');
      try {
        const snapshot = await get(equipementsRef);
        const equipementsList = [];
        snapshot.forEach((childSnapshot) => {
          equipementsList.push({
            id: childSnapshot.key,
            ...childSnapshot.val(),
          });
        });
        setEquipements(equipementsList);
      } catch (error) {
        console.error('Failed to fetch equipements:', error);
      }
    };
    fetchEquipements();
  }, []);

  // const getSuggestedMaintenances = () => {
  //   let suggestions = [];
  //   const vehicle = equipements.find((veh) => veh.id === selectedEquipement);
  //   maintenanceData.forEach(({ code, intervalKm, description }) => {
  //     if (vehicle && vehicle.Kilometrage >= intervalKm) {
  //       suggestions.push({ code, description, intervalKm });
  //     }
  //   });
  //   return suggestions;
  // };
  const getSuggestedMaintenances = () => {
    let suggestions = [];
    const vehicle = equipements.find((veh) => veh.id === selectedEquipement);
    maintenanceData.forEach(({ code, intervalKm, description }) => {
      if (vehicle && vehicle.Kilometrage >= intervalKm) {
        suggestions.push({ code, description, intervalKm });
      }
    });
    return suggestions;
};

  const handleMaintenanceSelection = (code) => {
    setSelectedMaintenances((prev) => {
      const exists = prev.includes(code);
      return exists ? prev.filter((m) => m !== code) : [...prev, code];
    });
  };

  const toggleSelectAll = () => {
    setSelectAll(!selectAll);
    if (!selectAll) {
      setSelectedMaintenances(getSuggestedMaintenances().map((m) => m.code));
    } else {
      setSelectedMaintenances([]);
    }
  };

  const equipementOptions = equipements.map((e) => ({
    value: e.id,
    label: e.Matricule,
  }));

  return (
    <Box p={4} maxW="7xl" mx="auto">
      <Heading as="h3" size="lg" textAlign="center" mb={6}>
        Suggestions des opérations de maintenance à réaliser
      </Heading>
      <Select
        placeholder="Sélectionner un équipement"
        options={equipementOptions}
        value={equipementOptions.find(
          (option) => option.value === selectedEquipement
        )}
        onChange={(selectedOption) =>
          setSelectedEquipement(selectedOption.value)
        }
        size="md"
        mb={6}
      />
      <Box w="full" h="6" />
      {selectedEquipement && (
        <>
          <Table variant="simple" mb={6}>
            <Thead bg={'gray.100'}>
              <Tr>
                <Th>Code</Th>
                <Th>Description</Th>
                <Th>
                  <Checkbox isChecked={selectAll} onChange={toggleSelectAll}>
                    Selectionner
                  </Checkbox>
                </Th>
              </Tr>
            </Thead>
            <Tbody>
              {getSuggestedMaintenances().map((maint, index) => (
                <Tr key={index}>
                  <Td>{maint.code}</Td>
                  <Td>{maint.description}</Td>
                  <Td>
                    <Checkbox
                      isChecked={selectedMaintenances.includes(maint.code)}
                      onChange={() => handleMaintenanceSelection(maint.code)}
                    />
                  </Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
          {selectedMaintenances.length > 0 && (
            <Flex justify="center">
              <Button colorScheme="teal" onClick={onOpen} width="fit-content">
                Plannifier l'Intervention
              </Button>
            </Flex>
          )}
        </>
      )}
      <InterventionFromSuggestion
        isOpen={isOpen}
        onClose={onClose}
        selectedEquipement={selectedEquipement}
        selectedMaintenances={selectedMaintenances}
        setSelectedMaintenances={setSelectedMaintenances}
        maintenanceData={maintenanceData}
      />
    </Box>
  );
};

export default SuiviMaintenance;
