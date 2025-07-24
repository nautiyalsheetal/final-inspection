import React from 'react';
import './inspectiontable.css';

const InspectionTable = () => {
  const tableRows = Array.from({ length: 5 }, (_, i) => (
    <tr key={i}>
      <td>{i + 1}</td>
      <td>Ejector Pin ...</td>
      <td>HG</td>
      <td>0.5</td>
      <td>0.5</td>
      <td><input type="text" placeholder="Enter Value" /></td>
      <td><span className="status-icon">!</span></td>
      <td><input type="text" placeholder="Comment..." /></td>
      <td>0.34</td>
    </tr>
  ));

  return (
    <div className="inspection-layout">
      <div className="image-side">
        <h3>Operation Drawing</h3>
        <p>You can upload the operation drawing which shall assist the quality inspector.
        The operation drawing is uploaded from the operation master on your Quad Platform</p>
        <div className="image-missing">
          <div className="image-icon">🚫</div>
          <div>IMAGE NO LONGER AVAILABLE</div>
        </div>
      </div>

      <div className="table-side">
        <h3>Inspection Table</h3>
        <p >The inspection elements registered on the control parameters within the operation are populated
             here for the Quality Inspector. Upon successful entry of these inspection parameters,
             a Process Chart chart is generated which helps us understand whether the process is within control.</p>
        <table className="inspection-table">
          <thead>
            <tr>
              <th>SR. NO.</th>
              <th>INSPECTION</th>
              <th>INSTRUMENT</th>
              <th>MIN</th>
              <th>MAX</th>
              <th>VALUE</th>
              <th>STATUS</th>
              <th>COMMENT</th>
              <th>LAST READING</th>
            </tr>
          </thead>
          <tbody>{tableRows}</tbody>
        </table>
      </div>
    </div>
  );
};

export default InspectionTable;
