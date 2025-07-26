import React, { useState } from 'react';
import moment from 'moment';
import './inspectiontable.css';

const InspectionTable = ({
  data,
  clientId,
  plantId,
  partId,
  operatorId,
  shift,
  
  
}) => {
  const [values, setValues] = useState({});

  const handleInputChange = (index, field, value) => {
    setValues(prev => ({
      ...prev,
      [index]: {
        ...(prev[index] || {}),
        [field]: value,
        inspectionId: data[index]?.id,
      }
    }));
  };

  const getISTDateTime = () => {
    const now = moment().utcOffset('+05:30');
    return {
      date: now.format("YYYY-MM-DD"),
      dateTime: now.format("YYYY-MM-DDTHH:mm:ss.SSS[Z]"),
    };
  };

  const handleSubmit = async (status) => {
    const token = localStorage.getItem('token');
    if (!token) {
      alert('Unauthorized: No token found.');
      return;
    }

    const { date, dateTime } = getISTDateTime();
    const inspections = Object.entries(values).map(([_, entry]) => ({
  inspectionId: entry?.inspectionId || '',
  lhValue: entry?.lh || '',
  rhValue: entry?.rh || '',
}));


    const payload = {
      clientId,
      plantId,
      partId,
      operatorId,
      inspections,
      date,
      dateTime,
      shift,
      productionStatus: status === 'Ok',
    };

    console.log('Submitting payload:', payload);

    try {
      const res = await fetch('https://pel.quadworld.in/final-inspection-logs', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      const result = await res.json();
      console.log('API Response:', result);

      if (res.status === 401) {
        alert('Unauthorized: Please check your token.');
      } else {
        alert('Submission successful!');
      }
    } catch (error) {
      console.error('Submission failed:', error);
      alert('Submission failed');
    }
  };

  return (
    <div className="inspection-layout">
      <div className="image-side">
        <h3>Operation Drawing</h3>
        <p>You can upload the operation drawing which shall assist the quality inspector.</p>
        <div className="image-missing">
          <div className="image-icon">🚫</div>
          <div>IMAGE NO LONGER AVAILABLE</div>
        </div>
      </div>

      <div className="table-side">
        <h3>Inspection Table</h3>
        {!data || data.length === 0 ? (
          <p style={{ color: 'red', fontWeight: 'bold' }}>
            🚫 No inspection data found for this part.
          </p>
        ) : (
          <>
            <table className="inspection-table">
              <thead>
                <tr>
                  <th>Sr No.</th>
                  <th>Name</th>
                  <th>Instrument</th>
                  <th>Min</th>
                  <th>Max</th>
                  <th>LH</th>
                  <th>RH</th>
                </tr>
              </thead>
              <tbody>
                {data.map((item, index) => (
                  <tr key={index}>
                     <td>{index + 1}</td>
                    <td>{item.name}</td>
                    <td>{item.instrument}</td>
                    <td>{item.minThreshold ?? 'N/A'}</td>
                    <td>{item.maxThreshold ?? 'N/A'}</td>
                    <td>
                      {item.type === 'boolean' ? (
                        <>
                          <label>
                            <input
                              type="radio"
                              name={`lh-${index}`}
                              value="true"
                              onChange={() => handleInputChange(index, 'lh', true)}
                            /> Ok
                          </label>
                          <label style={{ marginLeft: '10px' }}>
                            <input
                              type="radio"
                              name={`lh-${index}`}
                              value="false"
                              onChange={() => handleInputChange(index, 'lh', false)}
                            /> Not Ok
                          </label>
                        </>
                      ) : (
                        <input
                          type="text"
                          placeholder="LH"
                          style={{ width: '70px' }}
                          onChange={(e) => handleInputChange(index, 'lh', e.target.value)}
                        />
                      )}
                    </td>
                    <td>
                      {item.type === 'boolean' ? (
                        <>
                          <label>
                            <input
                              type="radio"
                              name={`rh-${index}`}
                              value="true"
                              onChange={() => handleInputChange(index, 'rh', true)}
                            /> Ok
                          </label>
                          <label style={{ marginLeft: '10px' }}>
                            <input
                              type="radio"
                              name={`rh-${index}`}
                              value="false"
                              onChange={() => handleInputChange(index, 'rh', false)}
                            /> Not Ok
                          </label>
                        </>
                      ) : (
                        <input
                          type="text"
                          placeholder="RH"
                          style={{ width: '70px' }}
                          onChange={(e) => handleInputChange(index, 'rh', e.target.value)}
                        />
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            <div className="table-buttons-right">
              <button className="btn btn-danger" onClick={() => handleSubmit('Not Ok')}>
                Submit Not Ok
              </button>
              <button className="btn btn-success" onClick={() => handleSubmit('Ok')}>
                Submit Ok
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default InspectionTable;









// -----------------start data table-------------------------
// const InspectionTable = ({ data }) => {
//   const [currentPage, setCurrentPage] = useState(1);
//   const rowsPerPage = 5;

//   // Pagination logic
//   const indexOfLastRow = currentPage * rowsPerPage;
//   const indexOfFirstRow = indexOfLastRow - rowsPerPage;
//   const currentRows = data?.slice(indexOfFirstRow, indexOfLastRow) || [];
//   const totalPages = Math.ceil((data?.length || 0) / rowsPerPage);

//   const goToPage = (pageNum) => {
//     if (pageNum >= 1 && pageNum <= totalPages) setCurrentPage(pageNum);
//   };

//   const handlePrevPage = () => {
//     if (currentPage > 1) setCurrentPage(prev => prev - 1);
//   };

//   const handleNextPage = () => {
//     if (currentPage < totalPages) setCurrentPage(prev => prev + 1);
//   };

//   return (
//     <div className="inspection-layout">
//       <div className="image-side">
//         <h3>Operation Drawing</h3>
//         <p>
//           You can upload the operation drawing which shall assist the quality inspector.
//           The operation drawing is uploaded from the operation master on your Quad Platform
//         </p>
//         <div className="image-missing">
//           <div className="image-icon">🚫</div>
//           <div>IMAGE NO LONGER AVAILABLE</div>
//         </div>
//       </div>

//       <div className="table-side">
//         <h3>Inspection Table</h3>
//         <p>
//           The inspection elements registered on the control parameters within the operation are populated
//           here for the Quality Inspector. Upon successful entry of these inspection parameters,
//           a Process Chart is generated which helps us understand whether the process is within control.
//         </p>

//         {(!data || data.length === 0) ? (
//           <p style={{ color: 'red', fontWeight: 'bold' }}>
//             No inspection data found for this part.
//           </p>
//         ) : (
//           <>
//             <table className="inspection-table">
//               <thead>
//                 <tr>
//                   <th>Name</th>
//                   <th>Instrument</th>
//                   <th>Min</th>
//                   <th>Max</th>
//                   <th>Value</th>
//                   <th>Comments</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {currentRows.map((item, index) => (
//                   <tr key={index}>
//                     <td>{item.name}</td>
//                     <td>{item.instrument}</td>
//                     <td>{item.minThreshold}</td>
//                     <td>{item.maxThreshold}</td>
//                     <td>
//                       <div style={{ display: 'flex', gap: '10px', justifyContent: 'center' }}>
//                         <input type="text" placeholder="LH" className="dark-input" />
//                         <input type="text" placeholder="RH" className="dark-input" />
//                       </div>
//                     </td>
//                     <td>
//                       <input type="text" placeholder="Comment" className="dark-input" />
//                     </td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>

//             <div className="custom-pagination">
//               <button onClick={handlePrevPage} disabled={currentPage === 1}>Prev</button>
//               <span className="page-info">Page {currentPage} of {totalPages}</span>
//               <button onClick={handleNextPage} disabled={currentPage === totalPages}>Next</button>
//             </div>

//           </>
//         )}
//       </div>
//     </div>
//   );
// };

// export default InspectionTable;
// data-table-ends

