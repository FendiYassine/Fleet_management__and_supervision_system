
import React, { useState, useEffect } from 'react';
import { getDatabase, ref, get } from 'firebase/database';
import useMaintenanceData from '../hooks/useMaintenanceData';
import './SuiviMaintenance.css';
import InterventionFromSuggestion from './InterventionFromSuggestion';

const SuiviMaintenance = () => {
  const [equipements, setEquipements] = useState([]);
  const [selectedEquipement, setSelectedEquipement] = useState([]);
  const [selectedMaintenances, setSelectedMaintenances] = useState([]);
  const [selectAll, setSelectAll] = useState(false);
  const maintenanceData = useMaintenanceData();

  useEffect(() => {
    const fetchEquipements = async () => {
      const db = getDatabase();
      const equipementsRef = ref(db, 'Equipement');
      try {
        const snapshot = await get(equipementsRef);
        const equipementsList = [];
        snapshot.forEach((childSnapshot) => {
          equipementsList.push({
            id: childSnapshot.key,
            ...childSnapshot.val(),
          });
        });
        setEquipements(equipementsList);
      } catch (error) {
        console.error('Failed to fetch equipements:', error);
      }
    };
    fetchEquipements();
  }, []);

  const getSuggestedMaintenances = () => {
    let suggestions = [];
    selectedEquipement.forEach((equip) => {
      const vehicle = equipements.find((veh) => veh.id === equip);
      maintenanceData.forEach(({ code, intervalKm, description }) => {
        if (vehicle && vehicle.Kilometrage >= intervalKm) {
          suggestions.push({ code, description, intervalKm });
        }
      });
    });
    return suggestions;
  };

  const handleMaintenanceSelection = (code) => {
    setSelectedMaintenances((prev) => {
      const exists = prev.some((m) => m.code === code);
      return exists ? prev.filter((m) => m.code !== code) : [...prev, code];
    });
  };

  const toggleSelectAll = () => {
    setSelectAll(!selectAll);
    if (!selectAll) {
      setSelectedMaintenances(getSuggestedMaintenances().map((m) => m.code));
    } else {
      setSelectedMaintenances([]);
    }
  };

  const updateEquipmentDetails = () => {
    console.log("Equipment details updated.");
  };

  const getNextMaintenanceKm = () => {
    if (selectedMaintenances.length > 0 && equipements.length > 0) {
      const currentKm = equipements.find((veh) =>
        selectedEquipement.includes(veh.id)
      )?.Kilometrage;
      console.log('Current Km:', currentKm);
      const intervals = selectedMaintenances.map((code) => {
        const maint = maintenanceData.find((m) => m.code === code);
        console.log(
          'Maintenance interval for code',
          code,
          ':',
          maint?.intervalKm
        );
        return maint ? maint.intervalKm : Infinity;
      });

      const minIntervalKm = Math.min(...intervals);
      console.log('Calculated intervals:', intervals);
      console.log('Minimum interval Km:', minIntervalKm);

      return isFinite(minIntervalKm) && currentKm
        ? (currentKm + minIntervalKm).toString()
        : 'Not calculable';
    }
    return '';
  };

  return (
    <div className="suivi-maintenance">
      <select
        multiple
        onChange={(e) =>
          setSelectedEquipement(
            [...e.target.selectedOptions].map((o) => o.value)
          )
        }
        value={selectedEquipement}
      >
        {equipements.map((e) => (
          <option key={e.id} value={e.id}>
            {e.Matricule}
          </option>
        ))}
      </select>
      <table>
        <thead>
          <tr>
            <th>Code</th>
            <th>Description</th>
            <th>
              <input type="checkbox" checked={selectAll} onChange={toggleSelectAll} />
              Select
            </th>
          </tr>
        </thead>
        <tbody>
          {getSuggestedMaintenances().map((maint, index) => (
            <tr key={index}>
              <td>{maint.code}</td>
              <td>{maint.description}</td>
              <td>
                <input
                  type="checkbox"
                  checked={selectedMaintenances.includes(maint.code)}
                  onChange={() => handleMaintenanceSelection(maint.code)}
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {selectedEquipement.length > 0 && selectedMaintenances.length > 0 && (
        <InterventionFromSuggestion
        selectedEquipement={selectedEquipement}
        selectedMaintenances={selectedMaintenances}
        nextMaintenanceKm={getNextMaintenanceKm()}
        maintenanceData={maintenanceData}
        updateEquipmentDetails={updateEquipmentDetails}
      />
      )}
    </div>
  );
};

export default SuiviMaintenance;
