import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';

const ContractsTable = ({ contracts, currentUser }) => {
  const [savedContracts, setSavedContracts] = useState([]);

  const handleSave = async (contractId) => {
    try {
      const response = await fetch('/api/save_contract', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: currentUser.id,
          contractId: contractId,
        }),
      });
  
      if (response.ok) {
        setSavedContracts((prevSavedContracts) => [...prevSavedContracts, contractId]);
      } else {
        console.error('Failed to save contract');
      }
    } catch (error) {
      console.error('Error saving contract:', error);
    }
  };

return (
        <div className="contracts-table-container">
          <table className="table table-striped table-hover">
            <thead>
              <tr>
            <th>Contract Ticker</th>
            <th>Type</th>
            <th>Expiry</th>
            <th>Strike</th>
            <th>Underlying</th>
            <th>Break Even Price</th>
            <th>OI</th>
            <th>Delta</th>
            <th>Gamma</th>
            <th>Theta</th>
            <th>Vega</th>
            <th>IV</th>
            {currentUser.id && <th>Action</th>}
          </tr>
        </thead>
        <tbody>
          {contracts.map((contract) => (
            <tr key={contract.contract_ticker}>
              <td>{contract.contract_ticker}</td>
              <td>{contract.contract_type}</td>
              <td>{contract.expiration_date}</td>
              <td>{contract.strike_price}</td>
              <td>{contract.underlying_ticker}</td>
              <td>{contract.break_even_price}</td>
              <td>{contract.open_interest}</td>
              <td>{contract.greeks_delta}</td>
              <td>{contract.greeks_gamma}</td>
              <td>{contract.greeks_theta}</td>
              <td>{contract.greeks_vega}</td>
              <td>{contract.implied_volatility}</td>
              {currentUser.id && (
                <td>
                  <button
                    className="btn btn-primary"
                    disabled={savedContracts.includes(contract.id)}
                    onClick={() => handleSave(contract.id)}
                  >
                    {savedContracts.includes(contract.id) ? 'Saved!' : 'Save'}
                  </button>
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ContractsTable;