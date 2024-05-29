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
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Button,
  Input,
  useToast,
} from '@chakra-ui/react';
import { ref, onValue, remove, update } from 'firebase/database';
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

const MenuRow = ({ equipement, onEdit, showToast }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();

  const deleteItem = (ev) => {
    preventDefault(ev);
    const equipementRef = ref(db, `Equipement/${equipement.id}`);
    remove(equipementRef)
      .then(() => {
        showToast('Équipement supprimé avec succès', 'success');
      })
      .catch((error) => {
        console.error('Error deleting item:', error);
        showToast("Erreur lors de la suppression de l'équipement", 'error');
      });
  };

  const editItem = (ev) => {
    preventDefault(ev);
    onEdit(equipement);
  };

  return (
    <Menu
      isOpen={isOpen}
      onOpen={onOpen}
      onClose={onClose}
      isLazy
      placement="left-start"
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
            icon={<Icon icon={LuPenLine} fontSize="lg" color="gray.400" />}
            onClick={editItem}
          >
            Edit
          </MenuItem>
          <ConfirmMenuItem
            icon={<Icon icon={LuDelete} fontSize="lg" color="gray.400" />}
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
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast = useToast();
  const [editEquipement, setEditEquipement] = useState(null);
  const [editValues, setEditValues] = useState({
    Matricule: '',
    VIN: '',
    Marque: '',
    Modele: '',
    DateMiseCirculation: '',
    Kilometrage: '',
    Condition: '',
  });

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

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditValues((prevValues) => ({
      ...prevValues,
      [name]: value,
    }));
  };

  const handleEditSave = () => {
    const equipementRef = ref(db, `Equipement/${editEquipement.id}`);
    update(equipementRef, editValues)
      .then(() => {
        onClose();
        setEditEquipement(null);
        toast({
          title: 'Équipement mis à jour avec succès',
          status: 'success',
          duration: 5000,
          isClosable: true,
        });
      })
      .catch((error) => {
        console.error('Error updating item:', error);
        toast({
          title: "Erreur lors de la mise à jour de l'équipement",
          status: 'error',
          duration: 5000,
          isClosable: true,
        });
      });
  };

  const openEditModal = (equipement) => {
    setEditEquipement(equipement);
    setEditValues({
      Matricule: equipement.Matricule,
      VIN: equipement.VIN,
      Marque: equipement.Marque,
      Modele: equipement.Modele,
      DateMiseCirculation: equipement.DateMiseCirculation,
      Kilometrage: equipement.Kilometrage,
      Condition: equipement.Condition,
    });
    onOpen();
  };

  const showToast = (title, status) => {
    toast({
      title,
      status,
      duration: 5000,
      isClosable: true,
    });
  };

  if (loading) {
    return <DataListLoadingState />;
  }

  if (error) {
    return <DataListErrorState retry={() => window.location.reload()} />;
  }

  return (
    <Box className="container-fluid">
      <Text as="h1" textAlign="center">
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
                  cursor="pointer"
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
                  <DataListCell w="auto" p={0}>
                    <MenuRow
                      equipement={equipement}
                      onEdit={openEditModal}
                      showToast={showToast}
                    />
                  </DataListCell>
                </DataListRow>
              ))}
            </>
          )}
        </DataList>
      )}

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Modifier l'équipement</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Input
              placeholder="Matricule"
              name="Matricule"
              value={editValues.Matricule}
              onChange={handleEditChange}
              mb={3}
            />
            <Input
              placeholder="VIN"
              name="VIN"
              value={editValues.VIN}
              onChange={handleEditChange}
              mb={3}
            />
            <Input
              placeholder="Marque"
              name="Marque"
              value={editValues.Marque}
              onChange={handleEditChange}
              mb={3}
            />
            <Input
              placeholder="Modèle"
              name="Modele"
              value={editValues.Modele}
              onChange={handleEditChange}
              mb={3}
            />
            <Input
              placeholder="Date de première mise en circulation"
              name="DateMiseCirculation"
              value={editValues.DateMiseCirculation}
              onChange={handleEditChange}
              mb={3}
            />
            <Input
              placeholder="Kilométrage"
              name="Kilometrage"
              value={editValues.Kilometrage}
              onChange={handleEditChange}
              mb={3}
            />
            <Input
              placeholder="Condition"
              name="Condition"
              value={editValues.Condition}
              onChange={handleEditChange}
              mb={3}
            />
          </ModalBody>

          <ModalFooter>
            <Button colorScheme="blue" mr={3} onClick={handleEditSave}>
              Enregistrer
            </Button>
            <Button variant="ghost" onClick={onClose}>
              Annuler
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
};

export default ConsulterListeEquipements;
