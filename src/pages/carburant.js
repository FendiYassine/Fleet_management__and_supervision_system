import React from 'react';
import AjouterCarburant from '../components/AjouterCarburant';
import SuiviCarburant from '../components/SuiviCarburant';

export const carburant = () => {
  return <div className="carburant"></div>;
};

export const Alimentation = () => {
  return (
    <div className="carburant">
      <AjouterCarburant />
    </div>
  );
};

export const SuiviOperation = () => {
  return (
    <div className="carburant">
      <SuiviCarburant />
    </div>
  );
};
