import React, { useEffect, useState } from 'react';
import Navbar from './navbar';
import './dashboard.css';
import Inspectiontable from './inspectiontable';
import Select from 'react-select';

const Dashboard = () => {
  const [plants, setPlants] = useState([]);
  const [parts, setParts] = useState([]);
  const [operators, setOperators] = useState([]);
  const [selectedPlant, setSelectedPlant] = useState(null);
  const [selectedPart, setSelectedPart] = useState(null);
  const [selectedOperator, setSelectedOperator] = useState(null);
  const [clientId, setClientId] = useState(null);
  const [token, setToken] = useState(null);
  const [showTable, setShowTable] = useState(false);
  const [inspectionData, setInspectionData] = useState([]);
  const [loadingParts, setLoadingParts] = useState(false);
  const [shifts, setShifts] = useState([]);
  const [shiftName, setShiftName] = useState('');

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

      setClientId(clientId);
      setToken(token);

      const fetchPlants = async () => {
        const response = await fetch(`https://pel.quadworld.in/operator-panel/plants?clientId=${clientId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await response.json();
        const plantOptions = (Array.isArray(data) ? data : data.result || []).map(p => ({
          label: p.name,
          value: p.id,
        }));
        setPlants(plantOptions);

        if (plantOptions.length > 0) {
          const firstPlant = plantOptions[0];
          setSelectedPlant(firstPlant);
          await Promise.all([
            fetchPartsByPlant(clientId, token, firstPlant.value),
            fetchOperatorsByPlant(clientId, token, firstPlant.value),
            fetchShiftsByPlant(clientId, token, firstPlant.value),
          ]);
        }
      };

      fetchPlants();
    } catch (e) {
      console.error("Invalid login data", e);
      window.location.href = '/';
    }
  }, []);

  const fetchPartsByPlant = async (clientId, token, plantId) => {
    setLoadingParts(true);
    const response = await fetch(`https://pel.quadworld.in/parts?clientId=${clientId}&plantId=${plantId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await response.json();
    const partOptions = (Array.isArray(data) ? data : data.result || []).map(p => ({
      label: p.name,
      value: p.id,
    }));
    setParts(partOptions);
    setLoadingParts(false);
  };

  const fetchOperatorsByPlant = async (clientId, token, plantId) => {
    const response = await fetch(`https://opms.quadworld.in/operator/all/operator-panel?clientId=${clientId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await response.json();
    const operatorOptions = (Array.isArray(data) ? data : data.result || []).filter(op => op.plantId === plantId).map(op => ({
      value: op._id,
      label: op.fullName,
    }));
    setOperators(operatorOptions);
  };

  const fetchShiftsByPlant = async (clientId, token, plantId) => {
    try {
      const response = await fetch(
        `https://pel.quadworld.in/shifts/getIntervals?clientId=${clientId}&plantId=${plantId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      const data = await response.json();
      const shiftData = Array.isArray(data) ? data : data.result || [];
      setShifts(shiftData);
      console.log("Shift Data:", shiftData);
    } catch (error) {
      console.error("Failed to fetch shift intervals:", error);
    }
  };

  const handlePlantChange = async (selected) => {
    setSelectedPlant(selected);
    setSelectedPart(null);
    setSelectedOperator(null);

    if (clientId && token && selected?.value) {
      await Promise.all([
        fetchPartsByPlant(clientId, token, selected.value),
        fetchOperatorsByPlant(clientId, token, selected.value),
        fetchShiftsByPlant(clientId, token, selected.value),
      ]);
    }
  };

  const handleGenerate = async () => {
    if (!clientId || !token || !selectedPlant?.value || !selectedPart?.value) return;

    try {
      const response = await fetch(
        `https://pel.quadworld.in/parts?clientId=${clientId}&plantId=${selectedPlant.value}&id=${selectedPart.value}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      const data = await response.json();
      const result = Array.isArray(data) ? data : data.result || [];

      console.log("Full Part Response:", result);

      if (result.length > 0) {
        const inspections = result[0].finalInspections || [];
        setInspectionData(inspections);
        setShowTable(true);
      } else {
        setInspectionData([]);
        setShowTable(false);
      }
    } catch (error) {
      console.error("Error fetching part data:", error);
      setInspectionData([]);
      setShowTable(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("userLoginData");
    window.location.href = '/';
  };

  return (
    <>
      <Navbar onLogout={handleLogout} />

      <div className="dashboard-body">
        <div className="selector-row row">
          <div className="form-group col-md-3">
            <label className="label-white">Select Plant</label>
            <Select
              classNamePrefix="react-select"
              className="react-select-container"
              options={plants}
              value={selectedPlant}
              onChange={handlePlantChange}
              isSearchable
              placeholder="Search or Select Plant"
            />
          </div>

          <div className="form-group col-md-3">
            <label className="label-white">Select Part</label>
            <Select
              classNamePrefix="react-select"
              className="react-select-container"
              options={parts}
              value={selectedPart}
              onChange={setSelectedPart}
              isLoading={loadingParts}
              isSearchable
              placeholder={!selectedPlant ? "Select Plant First" : "Search or Select Part"}
              isDisabled={!selectedPlant}
            />
          </div>

          <div className="form-group col-md-3">
            <label className="label-white">Select Operator</label>
            <Select
              classNamePrefix="react-select"
              className="react-select-container"
              options={operators}
              value={selectedOperator}
              onChange={setSelectedOperator}
              isSearchable
              placeholder={!selectedPlant ? "Select Plant First" : "Search or Select Operator"}
              isDisabled={!selectedPlant}
            />
          </div>

          <div className="form-group col-md-3">
            <label className="invisible">Generate</label>
            <button onClick={handleGenerate}>Generate</button>
          </div>
        </div>

        {showTable && (
          <Inspectiontable
            data={inspectionData}
            clientId={clientId}
            plantId={selectedPlant?.value}
            partId={selectedPart?.value}
            operatorId={selectedOperator?.value || ""}
            shift="A"
            token={token}
         
          />
        )}
      </div>
    </>
  );
};

export default Dashboard;







// import React, { useEffect, useState } from 'react';
// import Navbar from './navbar';
// import './dashboard.css';
// import Inspectiontable from './inspectiontable';

// const Dashboard = () => {
//   const [plants, setPlants] = useState([]);
//   const [operators, setOperators] = useState([]);
//   const [selectedPlant, setSelectedPlant] = useState('');
//   const [selectedOperator, setSelectedOperator] = useState('');

//   useEffect(() => {
//     const storedUserData = localStorage.getItem("userLoginData");

//     try {
//       const parsedUser = JSON.parse(storedUserData);
//       const clientId = parsedUser?.clientId;
//       const token = parsedUser?.token;

//       if (!clientId || !token) {
//         console.error("Missing clientId or token");
//         window.location.href = '/';
//         return;
//       }

//       const fetchPlants = async () => {
//         try {
//           const response = await fetch(`https://pel.quadworld.in/operator-panel/plants?clientId=${clientId}`, {
//             headers: {
//               Authorization: `Bearer ${token}`,
//             },
//           });

//           const data = await response.json();

//           if (Array.isArray(data)) {
//             setPlants(data);
//           } else if (Array.isArray(data.result)) {
//             setPlants(data.result);
//           } else {
//             console.error("Unexpected plant response format", data);
//           }
//         } catch (error) {
//           console.error("Failed to fetch plants", error);
//         }
//       };

//       const fetchOperators = async () => {
//         try {
//           const response = await fetch(`https://opms.quadworld.in/operator/all/operator-panel`, {
//             headers: {
//               Authorization: `Bearer ${token}`,
//             },
//           });

//           const data = await response.json();

//           if (Array.isArray(data)) {
//             setOperators(data);
//           } else if (Array.isArray(data.result)) {
//             setOperators(data.result);
//           } else {
//             console.error("Unexpected operator response format", data);
//           }
//         } catch (error) {
//           console.error("Failed to fetch operators", error);
//         }
//       };

//       fetchPlants();
//       fetchOperators();
//     } catch (e) {
//       console.error("Invalid login data", e);
//       window.location.href = '/';
//     }
//   }, []);

//   const handleLogout = () => {
//     localStorage.removeItem("userLoginData");
//     window.location.href = '/';
//   };
// // git remote add origin https://github.com/nautiyalsheetal/final-inspection.git

//   return (
//     <>
//       <Navbar onLogout={handleLogout} />

//       <div className="dashboard-body">
//         <div className="selector-row">
//           <div className="form-group">
//             <label className="label-white">Select Plant</label>
//             <select className="dropdown2" value={selectedPlant} onChange={(e) => setSelectedPlant(e.target.value)}>
//               <option value="">Select</option>
//               {plants.map((plant) => (
//                 <option key={plant.id} value={plant.id}>{plant.name}</option>
//               ))}
//             </select>
//           </div>

//           <div className="form-group">
//             <label className="label-white">Select Part</label>
//             <select className="dropdown2">
//               <option value="">Select</option>
//               <option>Part A</option>
//               <option>Part B</option>
//             </select>
//           </div>

//           <div className="form-group">
//             <label className="label-white">Select Operator</label>
//             <select
//               className="dropdown2"
//               value={selectedOperator}
//               onChange={(e) => setSelectedOperator(e.target.value)}
//             >
//               <option value="">Select</option>
//               {operators.map((op) => (
//                 <option key={op._id} value={op._id}>{op.fullName}</option>
//               ))}
//             </select>
//           </div>

//           <div className="form-group">
//             <label className="invisible">Generate</label>
//             <button className="generate-btn">Generate</button>
//           </div>
//         </div>

//         <Inspectiontable />
//       </div>
//     </>
//   );
// };

// export default Dashboard;

