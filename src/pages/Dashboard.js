import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { Link } from 'react-router-dom';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { ref, onValue } from 'firebase/database';
import { db } from '../config/firebase';

export const Dashboard = () => {
  const [equipments, setEquipments] = useState([]);

  // Fetching data from Firebase
  useEffect(() => {
    const equipementsRef = ref(db, 'Equipement');
    onValue(equipementsRef, (snapshot) => {
      const equipementsData = snapshot.val();
      if (equipementsData) {
        const equipementsArray = Object.keys(equipementsData).map((key) => ({
          id: key,
          ...equipementsData[key],
        }));
        setEquipments(equipementsArray);
      }
    });
  }, []);

  // Custom marker icon setup
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
    <div className="container-fluid">
      <div className="info-card">
      <h1 className="text-center">
        Nombre d'équipement: {equipments.length}
      </h1>
      </div>
      <center>
        <h2>Carte des équipements</h2>
        <MapContainer
          center={[34.0, 9.0]} // Centered on Tunisia
          zoom={6} // Adjusted zoom level for better focus on the country
          style={{ height: '500px', width: '50%' }}
        >
          <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
          {equipments.map((equipment) => (
            <Marker
              key={equipment.id}
              position={[
                equipment.PositionGPS.Latitude,
                equipment.PositionGPS.Longitude,
              ]}
              icon={customIcon}
            >
              <Popup>
                {equipment.Matricule} {equipment.Marque} {equipment.Modele} -{' '}
                <Link to={`/Equipements/ViewEquipmentInfo/${equipment.id}`}>
                  View Details
                </Link>
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      </center>
    </div>
  );
};

export default Dashboard;
