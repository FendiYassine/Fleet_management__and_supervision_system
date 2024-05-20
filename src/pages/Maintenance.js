// Filename - pages/Maintenance.js

import React from 'react';
import ProgrammerIntervention from '../components/ProgrammerIntervention';
import SuiviMaintenance from '../components/SuiviMaintenance';

export const Maintenance = () => {
  return (
    <div className="maintenances">
    </div>
  );
};

export const EventsOne = () => {
  return (
    <div className="maintenances">
      <ProgrammerIntervention />
    </div>
  );
};

export const EventsTwo = () => {
  return (
    <div className="maintenances">
      <SuiviMaintenance />
    </div>
  );
};
