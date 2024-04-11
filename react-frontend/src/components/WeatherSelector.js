import React, { useState, useEffect } from 'react';
import statesCities from '../statesCities.json';

const WeatherSelector = ({ onLocationChange }) => {
  const [selectedState, setSelectedState] = useState('New York');
  const [selectedCity, setSelectedCity] = useState('New York');
  const [cities, setCities] = useState([]);

  // When the selected state changes, update the cities list without setting a city
  useEffect(() => {
    const citiesList = statesCities[selectedState] || [];
    setCities(citiesList);
    // Do not set the selectedCity here, keep it empty
    setSelectedCity('');
  }, [selectedState]);

  // Trigger the location change only when a city is selected
  useEffect(() => {
    if (selectedCity) {
      onLocationChange(selectedCity);
    }
  }, [selectedCity, onLocationChange]);

  return (
    <div style={{marginLeft: "20px"}}>
      <p>State</p>
      <select value={selectedState} onChange={e => setSelectedState(e.target.value)}>
        {Object.keys(statesCities).map((state) => (
          <option key={state} value={state}>{state}</option>
        ))}
      </select>
      <p>City</p>
      <select value={selectedCity} onChange={e => setSelectedCity(e.target.value)}>
        {selectedCity === '' && <option>Select a city</option>}
        {cities.map((city) => (
          <option key={city} value={city}>{city}</option>
        ))}
      </select>
    </div>
  );
};


export default WeatherSelector;



