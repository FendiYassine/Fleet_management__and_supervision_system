import React from 'react';
import useMaintenanceNotifications from '../hooks/useMaintenanceNotifications'; // Assurez-vous que le chemin est correct

const MaintenanceAlerts = () => {
  const notifications = useMaintenanceNotifications();

  return (
    <div>
      {notifications.length > 0 ? (
        notifications.map((note, index) => <div key={index}>Alert: {note}</div>)
      ) : (
        <p>Aucune maintenance nécessaire pour le moment.</p>
      )}
    </div>
  );
};

export default MaintenanceAlerts;
