import { useState, useEffect } from 'react';
import { getDatabase, ref, onValue } from 'firebase/database';
import useMaintenanceData from './useMaintenanceData'; // Importez le hook de données de maintenance

const useMaintenanceNotifications = () => {
    const [notifications, setNotifications] = useState([]);
    const maintenanceIntervals = useMaintenanceData();

    useEffect(() => {
        const db = getDatabase();
        const equipementsRef = ref(db, 'Equipement');
        
        onValue(equipementsRef, (snapshot) => {
            const equipements = snapshot.val();
            const newNotifications = [];

            Object.keys(equipements).forEach((id) => {
                const { Kilometrage } = equipements[id];
                Object.keys(maintenanceIntervals).forEach((key) => {
                    const { intervalKm, description } = maintenanceIntervals[key];
                    if (Kilometrage >= intervalKm) {
                        newNotifications.push({
                            equipementId: id,
                            message: `${description} nécessaire pour le véhicule ${id}`,
                            maintenanceType: key
                        });
                    }
                });
            });

            setNotifications(newNotifications);
        });
    }, [maintenanceIntervals]);

    return notifications;
};

export default useMaintenanceNotifications;
