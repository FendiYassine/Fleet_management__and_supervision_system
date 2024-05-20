import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ref, onValue } from 'firebase/database';
import { db } from '../config/firebase';
import GaugeChart from 'react-gauge-chart';
import { GrLinkPrevious } from 'react-icons/gr';

const EquipmentInfo = ({ onBackClick }) => {
  const { equipmentId } = useParams();
  const [equipment, setEquipment] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const equipmentRef = ref(db, `Equipement/${equipmentId}`);
    onValue(equipmentRef, (snapshot) => {
      setEquipment(snapshot.val());
    });
  }, [equipmentId]);

  if (!equipment || !equipment.OBDParameter) {
    return <div>Loading equipment details...</div>;
  }
  const handleBack = () => {
    navigate(-1); // Navigate back
  };
  return (
    <div className="container">
      <div className="selected-equipment-details">
      <button onClick={handleBack} className="back-button">
          <GrLinkPrevious /> Previous
        </button>
        <h2 className="text-center">Détails de l'équipement sélectionné</h2>
        <div className="info-sections">
        <div className="info-card">
          <h4>Niveau de carburant</h4>
          <GaugeChart
            id="fuel-level-gauge"
            percent={equipment.OBDParameter.FuelLevel / 100}
            textColor="#333"
          />
          <p>{equipment.OBDParameter.FuelLevel}%</p>
        </div>
        <div className="info-card">
          <h4>Température de liquide de refroidissement</h4>
          <GaugeChart
            id="coolant-temperature-gauge"
            percent={equipment.OBDParameter.EngineCoolantTemperature / 200}
            textColor="#333"
          />
          <p>{equipment.OBDParameter.EngineCoolantTemperature}°C</p>
        </div>
        <div className="info-card">
          <h4>Vitesse</h4>
          <p>{equipment.OBDParameter.Speed} km/h</p>
        </div>
        <div className="info-card">
          <h4>Régime moteur</h4>
          <p>{equipment.OBDParameter.RPM} RPM</p>
        </div>
        <div className="info-card">
          <h4>Pression du collecteur d'admission</h4>
          <p>{equipment.OBDParameter.IntakeManifoldPressure} kPa</p>
        </div>
        <div className="info-card">
          <h4>Pression de carburant</h4>
          <p>{equipment.OBDParameter.FuelPressure} PSI</p>
        </div>
      </div>
    </div>
    </div>
  );
};

export default EquipmentInfo;
