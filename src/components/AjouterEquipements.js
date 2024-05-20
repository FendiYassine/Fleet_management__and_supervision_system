import React, { useState, useEffect } from 'react';
import { getDatabase, ref, set } from 'firebase/database';
import vehicleData from '../car-list.json';
import './form.css';

const AjouterEquipement = () => {
  const [selectedMake, setSelectedMake] = useState('');
  const [selectedModel, setSelectedModel] = useState('');
  const [makes, setMakes] = useState([]);
  const [models, setModels] = useState([]);

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

    const matriculeValue = event.target.elements.Matricule.value;
    const vinValue = event.target.elements.VIN.value;
    const kilometrageValue = event.target.elements.Kilometrage.value;
    const dateMiseCirculationValue = event.target.elements.date.value;
    const conditionValue = event.target.elements.condition.value;

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

      alert('Équipement ajouté avec succès !');
    } catch (error) {
      console.error("Erreur lors de l'ajout de l'équipement : ", error);
      alert("Une erreur s'est produite lors de l'ajout de l'équipement.");
    }
  };

  return (
    <div className="Ajouter-Equipement">
      <form onSubmit={handleSubmit}>
        <div className="form-inline mb-3">
          <label htmlFor="Matricule" className="form-label mr-2">
            Matricule
          </label>
          <input type="text" className="form-control" id="Matricule" required />
        </div>

        <div className="form-inline mb-3">
          <label htmlFor="VIN" className="form-label mr-2">
            VIN
          </label>
          <input type="text" className="form-control" id="VIN" required />
        </div>

        <div className="form-inline mb-3">
          <label htmlFor="Kilometrage" className="form-label mr-2">
            Kilométrage
          </label>
          <input
            type="text"
            className="form-control"
            id="Kilometrage"
            required
          />
        </div>

        <div className="form-inline mb-3">
          <label htmlFor="make" className="form-label mr-2">
            Marque
          </label>
          <select
            value={selectedMake}
            onChange={handleMakeChange}
            id="make"
            required
          >
            <option value="">Sélectionner une marque</option>
            {makes.map((make, index) => (
              <option key={index} value={make}>
                {make}
              </option>
            ))}
          </select>
        </div>

        <div className="form-inline mb-3">
          <label htmlFor="model" className="form-label mr-2">
            Modèle
          </label>
          <select
            value={selectedModel}
            onChange={handleModelChange}
            id="model"
            required
          >
            <option value="">Sélectionner un modèle</option>
            {models.map((model, index) => (
              <option key={index} value={model}>
                {model}
              </option>
            ))}
          </select>
        </div>

        <div className="form-inline mb-3">
          <label htmlFor="date" className="form-label mr-2">
            Date de mise en circulation
          </label>
          <input type="date" className="form-control" id="date" required />
        </div>

        <div className="form-inline mb-3">
          <label htmlFor="condition" className="form-label mr-2">
            Condition
          </label>
          <select className="form-select" id="condition" required>
            <option value="">Sélectionner une condition</option>
            <option value="Neuf">Neuf</option>
            <option value="Occasion">Occasion</option>
          </select>
        </div>
        <div align="center">
          <button type="submit" className="btn btn-primary">
            Ajouter Equipement
          </button>
        </div>
      </form>
    </div>
  );
};

export default AjouterEquipement;
