import { useState, useEffect } from 'react';
import maintenanceData from '../Maintenance.json';

const useMaintenanceData = () => {
  const [data, setData] = useState([]);

  useEffect(() => {
    const maintenanceArray = Object.keys(maintenanceData.Maintenances).map(
      (key) => {
        return {
          code: key,
          intervalKm: maintenanceData.Maintenances[key].intervalKm,
          description: maintenanceData.Maintenances[key].description,
        };
      }
    );
    setData(maintenanceArray);
  }, []);

  return data;
};

export default useMaintenanceData;
