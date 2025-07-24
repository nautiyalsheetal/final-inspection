import React, { useEffect, useState } from 'react';
import Navbar from './navbar';
import './dashboard.css';
import Inspectiontable from './inspectiontable';

const Dashboard = () => {
  const [plants, setPlants] = useState([]);
  const [operators, setOperators] = useState([]);
  const [selectedPlant, setSelectedPlant] = useState('');
  const [selectedOperator, setSelectedOperator] = useState('');

  useEffect(() => {
    const storedUserData = localStorage.getItem("userLoginData");

    try {
      const parsedUser = JSON.parse(storedUserData);
      const clientId = parsedUser?.clientId;
      const token = parsedUser?.token;

      if (!clientId || !token) {
        console.error("Missing clientId or token");
        window.location.href = '/';
        return;
      }

      const fetchPlants = async () => {
        try {
          const response = await fetch(`https://pel.quadworld.in/operator-panel/plants?clientId=${clientId}`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });

          const data = await response.json();

          if (Array.isArray(data)) {
            setPlants(data);
          } else if (Array.isArray(data.result)) {
            setPlants(data.result);
          } else {
            console.error("Unexpected plant response format", data);
          }
        } catch (error) {
          console.error("Failed to fetch plants", error);
        }
      };

      const fetchOperators = async () => {
        try {
          const response = await fetch(`https://opms.quadworld.in/operator/all/operator-panel`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });

          const data = await response.json();

          if (Array.isArray(data)) {
            setOperators(data);
          } else if (Array.isArray(data.result)) {
            setOperators(data.result);
          } else {
            console.error("Unexpected operator response format", data);
          }
        } catch (error) {
          console.error("Failed to fetch operators", error);
        }
      };

      fetchPlants();
      fetchOperators();
    } catch (e) {
      console.error("Invalid login data", e);
      window.location.href = '/';
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("userLoginData");
    window.location.href = '/';
  };
// git remote add origin https://github.com/nautiyalsheetal/final-inspection.git

  return (
    <>
      <Navbar onLogout={handleLogout} />

      <div className="dashboard-body">
        <div className="selector-row">
          <div className="form-group">
            <label className="label-white">Select Plant</label>
            <select className="dropdown2" value={selectedPlant} onChange={(e) => setSelectedPlant(e.target.value)}>
              <option value="">Select</option>
              {plants.map((plant) => (
                <option key={plant.id} value={plant.id}>{plant.name}</option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label className="label-white">Select Part</label>
            <select className="dropdown2">
              <option value="">Select</option>
              <option>Part A</option>
              <option>Part B</option>
            </select>
          </div>

          <div className="form-group">
            <label className="label-white">Select Operator</label>
            <select
              className="dropdown2"
              value={selectedOperator}
              onChange={(e) => setSelectedOperator(e.target.value)}
            >
              <option value="">Select</option>
              {operators.map((op) => (
                <option key={op._id} value={op._id}>{op.fullName}</option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label className="invisible">Generate</label>
            <button className="generate-btn">Generate</button>
          </div>
        </div>

        <Inspectiontable />
      </div>
    </>
  );
};

export default Dashboard;
