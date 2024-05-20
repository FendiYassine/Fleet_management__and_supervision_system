// Filename - pages/Equipements.js

import React from 'react';
import AjouterEquipement1 from '../components/AjouterEquipements';
import ConsulterListeEquipements from '../components/ConsulterListeEquipements';

export const Equipements = () => {
  return <div className="Equipements"></div>;
};

export const AjouterEquipement = () => {
  return (
    <div className="Equipements">
      <AjouterEquipement1 />
    </div>
  );
};

export const ConsulterEquipement = () => {
  return (
    <div className="Equipements">
      <ConsulterListeEquipements />
    </div>
  );
};

export const ServicesThree = () => {
  return (
    <div className="Equipements">
      <h1>GeeksforGeeks Service3</h1>
    </div>
  );
};
