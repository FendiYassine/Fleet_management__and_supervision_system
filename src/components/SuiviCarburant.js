import React, { useState, useEffect } from 'react';
import { Box, Text } from '@chakra-ui/react';
import { getDatabase, ref, onValue } from 'firebase/database';
import {
  DataList,
  DataListCell,
  DataListEmptyState,
  DataListErrorState,
  DataListLoadingState,
  DataListRow,
  DataListText,
  DataListTextHeader,
} from '../components/DataList';

const SuiviCarburant = () => {
  const [fuelOperations, setFuelOperations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchFuelOperations = () => {
      const db = getDatabase();
      const fuelRef = ref(db, 'FuelSupply');
      onValue(
        fuelRef,
        (snapshot) => {
          const fuelData = snapshot.val();
          if (fuelData) {
            const operationsArray = Object.keys(fuelData).map((key) => ({
              id: key,
              ...fuelData[key],
            }));
            setFuelOperations(operationsArray);
          } else {
            setFuelOperations([]);
          }
          setLoading(false);
        },
        (error) => {
          setError(error);
          setLoading(false);
        }
      );
    };

    fetchFuelOperations();
  }, []);

  if (loading) {
    return <DataListLoadingState />;
  }

  if (error) {
    return <DataListErrorState retry={() => window.location.reload()} />;
  }

  return (
    <Box maxW="7xl" mx="auto" py={10} px={4}>
      <Text as="h1" textAlign="center" mb={6} fontSize="2xl" fontWeight="bold">
        Suivi des opérations d'alimentation en carburant
      </Text>
      <DataList>
        {fuelOperations.length === 0 ? (
          <DataListEmptyState>
            Aucune opération d'alimentation en carburant disponible.
          </DataListEmptyState>
        ) : (
          <>
            <DataListRow>
              <DataListCell>
                <DataListTextHeader>ID Equipement</DataListTextHeader>
              </DataListCell>
              <DataListCell>
                <DataListTextHeader>Kilométrage</DataListTextHeader>
              </DataListCell>
              <DataListCell>
                <DataListTextHeader>Coût</DataListTextHeader>
              </DataListCell>
              <DataListCell>
                <DataListTextHeader>Quantité de Carburant (L)</DataListTextHeader>
              </DataListCell>
              <DataListCell>
                <DataListTextHeader>Date</DataListTextHeader>
              </DataListCell>
            </DataListRow>
            {fuelOperations.map((operation) => (
              <DataListRow key={operation.id}>
                <DataListCell>
                  <DataListText>{operation.EquipementId}</DataListText>
                </DataListCell>
                <DataListCell>
                  <DataListText>{operation.Kilometrage}</DataListText>
                </DataListCell>
                <DataListCell>
                  <DataListText>{operation.Cout}</DataListText>
                </DataListCell>
                <DataListCell>
                  <DataListText>{operation.liter}</DataListText>
                </DataListCell>
                <DataListCell>
                  <DataListText>{operation.Date}</DataListText>
                </DataListCell>
              </DataListRow>
            ))}
          </>
        )}
      </DataList>
    </Box>
  );
};

export default SuiviCarburant;
