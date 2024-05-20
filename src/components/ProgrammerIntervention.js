import React, { useState, useEffect } from 'react';
import { getDatabase, ref, get, set } from 'firebase/database';
import './intervention.css'; // Ensure this points to the correct CSS file path

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
    <div className="form-container">
      <div className="form-header">
        <h5>Nouvelle Intervention</h5>
      </div>
      <div className="form-group">
        <label htmlFor="Ref_Intervention">Référence de l'intervention:</label>
        <input
          type="text"
          id="Ref_Intervention"
          name="Ref_Intervention"
          value={refIntervention}
          readOnly
          className="form-control"
        />
      </div>
      <div className="form-group">
        <label htmlFor="Equipement_select">Choisir un équipement:</label>
        <select
          id="Equipement_select"
          value={selectedEquipement}
          onChange={(e) => setSelectedEquipement(e.target.value)}
          className="form-control"
        >
          <option value="">Sélectionner un équipement</option>
          {equipements.map((equipement) => (
            <option key={equipement.id} value={equipement.id}>
              {equipement.Matricule}
            </option>
          ))}
        </select>
      </div>
      <div className="form-group">
        <label htmlFor="Description">Description de l'intervention:</label>
        <input
          type="text"
          id="Description"
          name="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="form-control"
        />
      </div>
      <div className="form-group">
        <label htmlFor="Kilometrage">Kilométrage à l'intervention:</label>
        <input
          type="text"
          id="Kilometrage"
          name="Kilometrage"
          value={kilometrage}
          onChange={(e) => setKilometrage(e.target.value)}
          className="form-control"
        />
      </div>
      <div className="form-group">
        <label htmlFor="Cout">Coûts de l'intervention:</label>
        <input
          type="text"
          id="Cout"
          name="Cout"
          value={cout}
          onChange={(e) => setCout(e.target.value)}
          className="form-control"
        />
      </div>
      <div className="form-group">
        <label htmlFor="PiecesChangees">Les pièces changées:</label>
        <input
          type="text"
          id="PiecesChangees"
          name="PiecesChangees"
          value={piecesChangees}
          onChange={(e) => setPiecesChangees(e.target.value)}
          className="form-control"
        />
      </div>
      <div className="form-group">
        <label htmlFor="ProchaineMaintenance">Prochaine maintenance:</label>
        <input
          type="text"
          id="ProchaineMaintenance"
          name="ProchaineMaintenance"
          value={prochaineMaintenance}
          onChange={(e) => setProchaineMaintenance(e.target.value)}
          className="form-control"
        />
      </div>
      <div className="form-actions" style={{ textAlign: 'center' }}>
        <button onClick={handleSubmit} className="btn">
          Soumettre
        </button>
        <button onClick={handleReset} className="btn">
          Réinitialiser
        </button>
      </div>
    </div>
  );
};

export default ProgrammerIntervention;
