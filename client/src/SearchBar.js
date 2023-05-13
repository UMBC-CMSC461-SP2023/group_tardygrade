import React, { useState } from 'react';
import { Form, Button } from 'react-bootstrap';
import { fetchOptionsContracts } from './api';

const SearchBar = ({ onSubmit }) => {
  const [searchTerm, setSearchTerm] = useState('');

  const handleSearch = async (e) => {
    e.preventDefault();

    // Fetch and insert options contracts into the PostgreSQL database
    await fetchOptionsContracts(searchTerm);

    // Update the ticker state in the App component
    onSubmit(searchTerm);
  };

  return (
    <Form onSubmit={handleSearch} className="d-flex">
      <Form.Control
        type="text"
        placeholder="Enter stock ticker"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
      <Button variant="primary" type="submit" className="ml-2">
        Search
      </Button>
    </Form>
  );
};

export default SearchBar;
