import React, { useState } from 'react';
import moment from 'moment';
import './inspectiontable.css';
import { FaCheckCircle, FaTimesCircle } from 'react-icons/fa';

const InspectionTable = ({
  data = [],
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
      },
    }));
  };

  const getISTDateTime = () => {
    const now = moment().utcOffset('+05:30');
    return {
      date: now.format('YYYY-MM-DD'),
      dateTime: now.format('YYYY-MM-DDTHH:mm:ss.SSS[Z]'),
    };
  };
const isAllOk = () => {
  const filledEntries = Object.entries(values);

  // If nothing is filled, consider it valid
  if (filledEntries.length === 0) return true;

  return data.every((item, index) => {
    const entry = values[index];
    if (!entry) return true; // not filled, consider valid

    const lh = entry.lh;
    const rh = entry.rh;

    if (item.type === 'boolean') {
      // if one of them is false, return false
      if (lh === false || rh === false) return false;
      return true; // true or undefined is okay
    } else {
      const lhNum = parseFloat(lh);
      const rhNum = parseFloat(rh);
      const min = parseFloat(item.minThreshold);
      const max = parseFloat(item.maxThreshold);

      // if value filled but invalid, return false
      if (!isNaN(lhNum) && (lhNum < min || lhNum > max)) return false;
      if (!isNaN(rhNum) && (rhNum < min || rhNum > max)) return false;

      return true;
    }
  });
};




  const handleSubmit = async (status) => {
    const token = localStorage.getItem('token');
    if (!token) return alert('Unauthorized: No token found.');

    const { date, dateTime } = getISTDateTime();

    const inspections = Object.values(values).map(entry => ({
      inspectionId: entry.inspectionId || '',
      lhValue: entry.lh ?? '',
      rhValue: entry.rh ?? '',
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
      res.status === 401
        ? alert('Unauthorized: Invalid token.')
        : alert('Submission successful!');
    } catch (error) {
      console.error('Error submitting:', error);
      alert('Submission failed');
    }
  };

  const getValidationIcon = (val, min, max) => {
    if (val === '' || isNaN(val)) return null;
    const num = parseFloat(val);
    return num >= min && num <= max ? (
      <FaCheckCircle color="limegreen" />
    ) : (
      <FaTimesCircle color="red" />
    );
  };

  const getBooleanIcon = (val) => {
    if (val === true) return <FaCheckCircle color="limegreen" />;
    if (val === false) return <FaTimesCircle color="red" />;
    return null;
  };

  return (
    <div className="inspection-layout">
      <div className="image-side">
        <h3>Operation Drawing</h3>
        <p>
          The operation drawing is uploaded from the operation master on your Quad Platform.
        </p>
        <div className="image-missing">
          <div className="image-icon">🚫</div>
          <div>IMAGE NO LONGER AVAILABLE</div>
        </div>
      </div>

      <div className="table-side">
        <h3>Inspection Table</h3>
        <p>
          Inspection elements registered on control parameters are shown here. Fill the values
          to generate the Process Chart.
        </p>

        {data.length === 0 ? (
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

                    {/* LH Input */}
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
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                          <input
                            type="text"
                            placeholder="LH"
                            style={{ width: '70px' }}
                            onChange={(e) => handleInputChange(index, 'lh', e.target.value)}
                          />
                          {(() => {
                            const val = parseFloat(values[index]?.lh);
                            const min = parseFloat(item.minThreshold);
                            const max = parseFloat(item.maxThreshold);
                            if (!isNaN(val) && !isNaN(min) && !isNaN(max)) {
                              return val >= min && val <= max ? (
                                <FaCheckCircle color="limegreen" />
                              ) : (
                                <FaTimesCircle color="red" />
                              );
                            }
                            return null;
                          })()}
                        </div>
                      )}
                    </td>

                    {/* RH Input */}
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
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                          <input
                            type="text"
                            placeholder="RH"
                            style={{ width: '70px' }}
                            onChange={(e) => handleInputChange(index, 'rh', e.target.value)}
                          />
                          {(() => {
                            const val = parseFloat(values[index]?.rh);
                            const min = parseFloat(item.minThreshold);
                            const max = parseFloat(item.maxThreshold);
                            if (!isNaN(val) && !isNaN(min) && !isNaN(max)) {
                              return val >= min && val <= max ? (
                                <FaCheckCircle color="limegreen" />
                              ) : (
                                <FaTimesCircle color="red" />
                              );
                            }
                            return null;
                          })()}
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

<div className="table-buttons-right">
 <button
  className="btn btn-danger"
  onClick={() => handleSubmit('Not Ok')}
  disabled={isAllOk()}
  style={isAllOk() ? { opacity: 0.5, cursor: 'not-allowed' } : {}}
>
  Submit Not Ok
</button>

<button
  className="btn btn-success"
  onClick={() => handleSubmit('Ok')}
  disabled={!isAllOk()}
  style={!isAllOk() ? { opacity: 0.5, cursor: 'not-allowed' } : {}}
>
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

