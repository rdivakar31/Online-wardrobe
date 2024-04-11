// WeatherForecast.js
import React, { useEffect, useState } from 'react';
import WeatherCard from './WeatherCard';
import Grid from '@mui/material/Grid';
import WeatherSelector from './WeatherSelector';

const WeatherForecast = () => {
  const [weatherData, setWeatherData] = useState([]);
  const [selectedCity, setSelectedCity] = useState('');

  useEffect(() => {
    if (selectedCity) { // Only fetch weather if a city is selected
      const fetchWeatherData = async () => {
        try {
          const weatherApiKey = process.env.REACT_APP_WEATHER_API_KEY;
          const response = await fetch(`https://api.tomorrow.io/v4/weather/forecast?location=${encodeURIComponent(selectedCity)}&timesteps=1d&apikey=${weatherApiKey}`);
          const data = await response.json();
          if (data && data.timelines && data.timelines.daily) {
            setWeatherData(data.timelines.daily);
          } else {
            console.log("Weather data not found");
          }
        } catch (error) {
          console.error(error);
        }
      };

      fetchWeatherData(selectedCity);
    } else {
      setWeatherData([]); // Clear weather data if no city is selected
    }
  }, [selectedCity]); // Depend on selectedCity

  const handleLocationChange = (city) => {
    setSelectedCity(city);
  };

  return (
    <div>
      <Grid container spacing={2}>
        {/* WeatherSelector 组件现在在左边 */}
        <Grid item xs={1} sm={1} md={1}>
          <WeatherSelector onLocationChange={handleLocationChange} />
        </Grid>
  
        {/* 天气卡片的Grid项现在跟在选择器后面 */}
        {weatherData.map((day) => (
          <Grid key={`${selectedCity}-${day.time}`} item xs={1.8} sm={1.8} md={1.8} style={{marginTop: "10px"}}>
            <WeatherCard dayWeather={day} />
          </Grid>
        ))}
      </Grid>
    </div>
   );
  };

export default WeatherForecast;


