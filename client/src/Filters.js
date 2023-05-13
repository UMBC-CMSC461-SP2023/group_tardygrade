import React from 'react';

const Filters = ({ filters, onChange }) => {
    const handleChange = (e) => {
        const { name, value } = e.target;
      
        if (name === 'strike_price') {
          const strikePriceValue = parseFloat(value);
          if (!isNaN(strikePriceValue)) {
            onChange({
              ...filters,
              [name]: strikePriceValue.toFixed(2),
            });
          } else {
            onChange({
              ...filters,
              [name]: '',
            });
          }
        } else {
          onChange({
            ...filters,
            [name]: value,
          });
        }
      };

  return (
    <div>
      <label>
        Expiration Date:
        <input
          type="date"
          name="expiration_date"
          value={filters.expiration_date}
          onChange={handleChange}
        />
      </label>
      <label>
        Contract Type:
        <select
          name="contract_type"
          value={filters.contract_type}
          onChange={handleChange}
        >
          <option value="">All</option>
          <option value="call">Call</option>
          <option value="put">Put</option>
        </select>
      </label>
      <label>
        Strike Price:
        <input
          type="number"
          name="strike_price"
          min="0"
      step="0.50"
      value={filters.strike_price}
      onChange={handleChange}
    />
  </label>
</div>
);
};

export default Filters;