import React, { useState, useEffect } from 'react';
import EquipmentDetails from './EquipmentDetails';
import 'bootstrap/dist/css/bootstrap.min.css';
import { ref, onValue } from 'firebase/database';
import { db } from '../config/firebase';

const ConsulterListeEquipements = () => {
  const [listeEquipements, setListeEquipements] = useState([]);
  const [selectedEquipement, setSelectedEquipement] = useState(null);
  const [selectedEquipementsIds, setSelectedEquipementsIds] = useState([]);

  useEffect(() => {
    const getEquipements = () => {
      const equipementsRef = ref(db, 'Equipement');
      onValue(equipementsRef, (snapshot) => {
        const equipementsData = snapshot.val();
        if (equipementsData) {
          const equipementsArray = Object.keys(equipementsData).map((key) => ({
            id: key,
            ...equipementsData[key],
          }));
          setListeEquipements(equipementsArray);
        }
      });
    };
    getEquipements();
  }, []);

  const handleEquipementClick = (equipement) => {
    setSelectedEquipement(equipement);
  };

  const handleCheckboxChange = (event, equipementId) => {
    if (event.target.checked) {
      setSelectedEquipementsIds([...selectedEquipementsIds, equipementId]);
    } else {
      setSelectedEquipementsIds(
        selectedEquipementsIds.filter((id) => id !== equipementId)
      );
    }
  };

  const handleBackClick = () => {
    setSelectedEquipement(null);
  };

  return (
    <div className="container-fluid">
      <h1 className="text-center">Liste des équipements</h1>
      {selectedEquipement ? (
        <EquipmentDetails
          equipment={selectedEquipement}
          onBackClick={handleBackClick}
        />
      ) : (
        <div className="table-wrap">
          <table className="table">
            <thead>
              <tr>
                <th></th>
                <th>Matricule</th>
                <th>VIN</th>
                <th>Marque</th>
                <th>Modèle</th>
                <th>Date de première mise en circulation</th>
                <th>Kilométrage</th>
                <th>Condition</th>
              </tr>
            </thead>
            <tbody>
              {listeEquipements.map((equipement) => (
                <tr key={equipement.id} onClick={() => handleEquipementClick(equipement)}>
                  <td><input type="checkbox" onChange={(event) => handleCheckboxChange(event, equipement.id)} checked={selectedEquipementsIds.includes(equipement.id)} /></td>
                  <td>{equipement.Matricule}</td>
                  <td>{equipement.VIN}</td>
                  <td>{equipement.Marque}</td>
                  <td>{equipement.Modele}</td>
                  <td>{equipement.DateMiseCirculation}</td>
                  <td>{equipement.Kilometrage}</td>
                  <td>{equipement.Condition}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};  
export default ConsulterListeEquipements;
