import React, { useState, useEffect } from 'react';

function SavedContracts({ userId, savedContracts }) {
  const [contracts, setContracts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchContracts = async () => {
      try {
        const response = await fetch(`/api/saved_contracts/${userId}`);
        const data = await response.json();

        if (Array.isArray(data)) {
          setContracts(data);
        } else {
          console.error('Received data is not an array:', data);
        }
      } catch (error) {
        console.error('Error fetching saved contracts:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchContracts();
  }, [userId, savedContracts]);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h2>Saved Contracts</h2>
      {contracts.length === 0 ? (
        <p>No saved contracts.</p>
      ) : (
        <ul>
          {contracts.map((contract) => (
            <li key={contract.id}>
              {contract.contract_ticker} - {contract.contract_type} -{' '}
              {contract.strike_price} - {contract.expiration_date}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default SavedContracts;
