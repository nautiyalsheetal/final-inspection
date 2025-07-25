import React, { } from 'react';
import './inspectiontable.css';


const InspectionTable = ({ data }) => {
  return (
    <div className="inspection-layout">
      <div className="image-side">
        <h3>Operation Drawing</h3>
        <p>
          You can upload the operation drawing which shall assist the quality inspector.
          The operation drawing is uploaded from the operation master on your Quad Platform
        </p>
        <div className="image-missing">
          <div className="image-icon">🚫</div>
          <div>IMAGE NO LONGER AVAILABLE</div>
        </div>
      </div>

      <div className="table-side">
        <h3>Inspection Table</h3>
        <p>
          The inspection elements registered on the control parameters within the operation are populated
          here for the Quality Inspector. Upon successful entry of these inspection parameters,
          a Process Chart is generated which helps us understand whether the process is within control.
        </p>





        {(!data || data.length === 0) ? (
          <p style={{ color: 'red', fontWeight: 'bold' }}>
            🚫 No inspection data found for this part.
          </p>
        ) : (
          <>
            <table className="inspection-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Instrument</th>
                  <th>Min</th>
                  <th>Max</th>
                  <th>Value</th>
                  <th>Comments</th>
                </tr>
              </thead>
              <tbody>
                {data.map((item, index) => (
                  <tr key={index}>
                    <td>{item.name}</td>
                    <td>{item.instrument}</td>
                    <td>{item.minThreshold}</td>
                    <td>{item.maxThreshold}</td>
                    <td>
                      <div style={{ display: 'flex', gap: '10px', justifyContent: 'center' }}>
                        <input type="text" placeholder="LH" style={{ width: '60px' }} />
                        <input type="text" placeholder="RH" style={{ width: '60px' }} />
                      </div>
                    </td>
                    <td><input type="text" placeholder="Enter Value" /></td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Buttons only shown if data exists */}
            <div className="table-buttons-right">
              <button className="btn btn-primary">Submit Not Ok</button>
              <button className="btn btn-primary">Submit Ok</button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default InspectionTable;


// const InspectionTable = () => {
//   const tableRows = Array.from({ length: 5 }, (_, i) => (
//     <tr key={i}>
//       <td>{i + 1}</td>
//       <td>Ejector Pin ...</td>
//       <td>HG</td>
//       <td>0.5</td>
//       <td>0.5</td>
//       <td><input type="text" placeholder="Enter Value" /></td>
//       <td><span className="status-icon">!</span></td>
//       <td><input type="text" placeholder="Comment..." /></td>
//       <td>0.34</td>
//     </tr>
//   ));

// const InspectionTable = ({ data }) => {
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
//           <table className="inspection-table">
//             <thead>
//               <tr>
//                 <th>Name</th>
//                 <th>Instrument</th>
//                 <th>Min</th>
//                 <th>Max</th>
//                 <th>Value</th>

//                 <th>comments</th>
//               </tr>
//             </thead>
//             <tbody>
//               {data.map((item, index) => (
//                 <tr key={index}>
//                   <td>{item.name}</td>
//                   <td>{item.instrument}</td>
//                   <td>{item.minThreshold}</td>
//                   <td>{item.maxThreshold}</td>
//                   <td>
//                     <div style={{ display: 'flex', gap: '10px', justifyContent: 'center' }}>
//                       <input type="text" placeholder="LH" style={{ width: '60px' }} />
//                       <input type="text" placeholder="RH" style={{ width: '60px' }} />
//                     </div>
//                   </td>
//                   <td><input type="text" placeholder="Enter Value" /></td>



//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         )}
//       </div>
//     </div>
//   );
// };

// export default InspectionTable;



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

