import React, { useState, useEffect, useCallback } from 'react';
import { getDatabase, ref, set, get } from 'firebase/database';

const InterventionFromSuggestion = ({
  selectedEquipement,
  selectedMaintenances,
  setSelectedMaintenances,
  updateEquipmentDetails,
  maintenanceData = [],
}) => {
  const [description, setDescription] = useState('');
  const [kilometrage, setKilometrage] = useState('');
  const [cout, setCout] = useState('');
  const [piecesChangees, setPiecesChangees] = useState('');
  const [prochaineMaintenance, setProchaineMaintenance] = useState('');
  const [refIntervention, setRefIntervention] = useState('');
  const [showConfirm, setShowConfirm] = useState(false);

  const fetchCurrentKilometrage = useCallback(async () => {
    const db = getDatabase();
    if (selectedEquipement.length === 1) {
      const equipementRef = ref(db, `Equipement/${selectedEquipement[0]}`);
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
        EquipementId: selectedEquipement.join(', '),
        Description: description,
        Kilometrage: kilometrage,
        Cout: cout,
        PiecesChangees: piecesChangees,
        ProchaineMaintenance: prochaineMaintenance,
      }
    );
    updateEquipmentDetails();
    setShowConfirm(false);
    alert('Intervention ajoutée avec succès !');
  };

  const handleReset = () => {
    setDescription('');
    setKilometrage('');
    setCout('');
    setPiecesChangees('');
    setProchaineMaintenance('');
    setShowConfirm(false);
  };

  return (
    <div className="form-container">
      {showConfirm ? (
        <div className="popup">
          <h5>Confirm Details</h5>
          <p>Description: {description}</p>
          <p>Current Km: {kilometrage}</p>
          <p>Next Maintenance Km: {prochaineMaintenance}</p>
          <input
            type="text"
            placeholder="Cost of the intervention"
            value={cout}
            onChange={(e) => setCout(e.target.value)}
          />
          <div className="form-actions">
            <button onClick={handleSubmit} className="btn">
              Confirm
            </button>
            <button onClick={handleReset} className="btn">
              Cancel
            </button>
          </div>
        </div>
      ) : (
        <button onClick={() => setShowConfirm(true)} className="btn">
          Plan Intervention
        </button>
      )}
    </div>
  );
};

export default InterventionFromSuggestion;
