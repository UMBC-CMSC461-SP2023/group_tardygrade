import React, { useState, useEffect } from 'react';
import './App.css';
import Auth from './Auth';
import StockSearch from './SearchBar';
import ContractsTable from './ContractsTable';
import Filters from './Filters';
import SavedContracts from './SavedContracts';

function App() {
  const [showAuth, setShowAuth] = useState(false);
  const [currentUser, setCurrentUser] = useState({});
  const [ticker, setTicker] = useState('');
  const [savedContracts, setSavedContracts] = useState([]);
  const [filters, setFilters] = useState({
    expiration_date: '',
    contract_type: '',
    strike_price: '',
  });

  const handleAuthClose = (user) => {
    if (user) {
      setShowAuth(false);
      setCurrentUser(user);
    } else {
      console.error('User data is not defined');
    }
  };

  useEffect(() => {
    console.log(currentUser);
  }, [currentUser]);
  
  const useFilteredContracts = (ticker, filters) => {
    const [contracts, setContracts] = useState([]);
    
    useEffect(() => {
      if (!ticker) return;
  
      const fetchContracts = async () => {
        try {
          const response = await fetch(`/api/get_contracts/${ticker}`);
          const data = await response.json();
          setContracts(data);
        } catch (error) {
          console.error('Error fetching contracts:', error);
        }
      };
  
      fetchContracts();
    }, [ticker]);

    const filteredContracts = contracts.filter((contract) => {
      const { expiration_date, contract_type, strike_price } = filters;
      return (
        (!expiration_date ||
          new Date(contract.expiration_date).toISOString().slice(0, 10) ===
            new Date(expiration_date).toISOString().slice(0, 10)) &&
        (!contract_type || contract.contract_type === contract_type) &&
        (!strike_price || String(contract.strike_price) === strike_price)
      );
    });
    
    return filteredContracts;
  };

  const filteredContracts = useFilteredContracts(ticker, filters);

  return (
    <div className='App'>
      <header>
        {currentUser.username ? (
          <span>{currentUser.username}</span>
        ) : (
          <button onClick={() => setShowAuth(true)}>Sign Up</button>
        )}
      </header>
      {showAuth && <Auth onClose={(user) => handleAuthClose(user)} />}
      <StockSearch onSubmit={setTicker}/>
      <Filters filters={filters} onChange={setFilters} />
      {currentUser.id && (
        <ContractsTable 
          contracts={filteredContracts} 
          currentUser={currentUser} 
          savedContracts={savedContracts} 
          setSavedContracts={setSavedContracts}
        />
      )}
      {currentUser.id && (
        <SavedContracts 
          userId={currentUser.id} 
          savedContracts={savedContracts} 
        />
      )}
    </div>
  );
}

export default App;
