import React, { useState, useEffect } from 'react';
import {
  Box,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Portal,
  Text,
  useDisclosure,
} from '@chakra-ui/react';
import { ref, onValue } from 'firebase/database';
import { db } from '../config/firebase';
import EquipmentDetails from './EquipmentDetails';
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
import { ActionsButton } from './ActionsButton';
import { LuDelete, LuPenLine } from 'react-icons/lu';
import { Icon } from './Icons';
import { ConfirmMenuItem } from './ConfirmMenuItem';

export const preventDefault = (e) => {
  e.preventDefault();
  e.stopPropagation();
  e.nativeEvent.stopImmediatePropagation();
};

const MenuRow = ({ equipement }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();

  const deleteItem = (ev) => {
    // code de delete
    preventDefault(ev);
    console.log('delete item');
  };
  const editItem = (ev) => {
    // code de delete
    preventDefault(ev);
    console.log('Edit item');
  };
  return (
    <Menu
      isOpen={isOpen}
      onOpen={onOpen}
      onClose={onClose}
      isLazy
      placement='left-start'
    >
      <MenuButton
        as={ActionsButton}
        onClick={(ev) => {
          preventDefault(ev);
          onOpen();
        }}
      />
      <Portal>
        <MenuList>
          <MenuItem
            icon={<Icon icon={LuPenLine} fontSize='lg' color='gray.400' />}
            onClick={editItem}
          >
            Edit
          </MenuItem>
          <ConfirmMenuItem
            icon={<Icon icon={LuDelete} fontSize='lg' color='gray.400' />}
            onClick={deleteItem}
            
          >
            Delete
          </ConfirmMenuItem>
        </MenuList>
      </Portal>
    </Menu>
  );
};

const ConsulterListeEquipements = () => {
  const [listeEquipements, setListeEquipements] = useState([]);
  const [selectedEquipement, setSelectedEquipement] = useState(null);
  // const [selectedEquipementsIds, setSelectedEquipementsIds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const getEquipements = () => {
      const equipementsRef = ref(db, 'Equipement');
      onValue(
        equipementsRef,
        (snapshot) => {
          const equipementsData = snapshot.val();
          if (equipementsData) {
            const equipementsArray = Object.keys(equipementsData).map(
              (key) => ({
                id: key,
                ...equipementsData[key],
              })
            );
            setListeEquipements(equipementsArray);
          } else {
            setListeEquipements([]);
          }
          setLoading(false);
        },
        (error) => {
          setError(error);
          setLoading(false);
        }
      );
    };
    getEquipements();
  }, []);

  const handleEquipementClick = (equipement) => {
    setSelectedEquipement(equipement);
  };

  const handleBackClick = () => {
    setSelectedEquipement(null);
  };

  if (loading) {
    return <DataListLoadingState />;
  }

  if (error) {
    return <DataListErrorState retry={() => window.location.reload()} />;
  }

  return (
    <Box className='container-fluid'>
      <Text as='h1' textAlign='center'>
        Liste des équipements
      </Text>
      {selectedEquipement ? (
        <EquipmentDetails
          equipment={selectedEquipement}
          onBackClick={handleBackClick}
        />
      ) : (
        <DataList>
          {listeEquipements.length === 0 ? (
            <DataListEmptyState>Aucune donnée disponible</DataListEmptyState>
          ) : (
            <>
              <DataListRow>
                <DataListCell>
                  <DataListTextHeader>Matricule</DataListTextHeader>
                </DataListCell>
                <DataListCell>
                  <DataListTextHeader>VIN</DataListTextHeader>
                </DataListCell>
                <DataListCell>
                  <DataListTextHeader>Marque</DataListTextHeader>
                </DataListCell>
                <DataListCell>
                  <DataListTextHeader>Modèle</DataListTextHeader>
                </DataListCell>
                <DataListCell>
                  <DataListTextHeader>
                    Date de première mise en circulation
                  </DataListTextHeader>
                </DataListCell>
                <DataListCell>
                  <DataListTextHeader>Kilométrage</DataListTextHeader>
                </DataListCell>
                <DataListCell>
                  <DataListTextHeader>Condition</DataListTextHeader>
                </DataListCell>
                <DataListCell></DataListCell>
              </DataListRow>
              {listeEquipements.map((equipement) => (
                <DataListRow
                  key={equipement.id}
                  withHover
                  cursor='pointer'
                  onClick={() => handleEquipementClick(equipement)}
                >
                  <DataListCell>
                    <DataListText>{equipement.Matricule}</DataListText>
                  </DataListCell>
                  <DataListCell>
                    <DataListText>{equipement.VIN}</DataListText>
                  </DataListCell>
                  <DataListCell>
                    <DataListText>{equipement.Marque}</DataListText>
                  </DataListCell>
                  <DataListCell>
                    <DataListText>{equipement.Modele}</DataListText>
                  </DataListCell>
                  <DataListCell>
                    <DataListText>
                      {equipement.DateMiseCirculation}
                    </DataListText>
                  </DataListCell>
                  <DataListCell>
                    <DataListText>{equipement.Kilometrage}</DataListText>
                  </DataListCell>
                  <DataListCell>
                    <DataListText>{equipement.Condition}</DataListText>
                  </DataListCell>
                  <DataListCell w='auto' p={0}>
                    <MenuRow equipement={equipement} />
                  </DataListCell>
                </DataListRow>
              ))}
            </>
          )}
        </DataList>
      )}
    </Box>
  );
};

export default ConsulterListeEquipements;
