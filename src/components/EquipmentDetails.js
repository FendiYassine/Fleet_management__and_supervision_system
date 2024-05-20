import React from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import GaugeChart from 'react-gauge-chart';
import { GrLinkPrevious } from 'react-icons/gr';
import L from 'leaflet';

const EquipmentDetails = ({ equipment, onBackClick }) => {
  const customIcon = new L.Icon({
    iconUrl: process.env.PUBLIC_URL + '/icons/marker-icon.png',
    iconRetinaUrl: process.env.PUBLIC_URL + '/icons/marker-icon-2x.png',
    shadowUrl: process.env.PUBLIC_URL + '/icons/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41],
  });
  return (
    <div className="container">
      <div className="selected-equipment-details">
        <button onClick={onBackClick} className="back-button">
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
        <h3 className="text-center">Position GPS</h3>
        <div className="map-container">
          <MapContainer
            center={[
              equipment.PositionGPS.Latitude,
              equipment.PositionGPS.Longitude,
            ]}
            zoom={13}
            style={{ height: '400px', width: '100%' }}
          >
            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
            <Marker
              position={[
                equipment.PositionGPS.Latitude,
                equipment.PositionGPS.Longitude,
              ]}
              icon={customIcon}
            >
              <Popup>
                {`Latitude: ${equipment.PositionGPS.Latitude}, Longitude: ${equipment.PositionGPS.Longitude}`}
              </Popup>
            </Marker>
          </MapContainer>
        </div>
      </div>
    </div>
  );
};

export default EquipmentDetails;
