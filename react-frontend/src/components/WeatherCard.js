// WeatherCard.js
import React from 'react';
import { getWeatherIcon } from '../weatherHelper'; 

const WeatherCard = ({ dayWeather }) => {
  const { temperatureMin, temperatureMax, weatherCodeMax } = dayWeather.values;
  const weatherIcon = getWeatherIcon(weatherCodeMax.toString());
  console.log(weatherCodeMax.toString()); // 添加这行来检查天气代码

  console.log('Date string:', dayWeather.time); // 添加这行来检查日期字符串

  // Helper function to format date from API
  const formatDate = (dateString) => {
    const options = { month: '2-digit', day: '2-digit' };
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', options);
  };

  return (
    <div className="weather-card">
      <div className="weather-date">
        {formatDate(dayWeather.time)}
      </div>
      <div className="weather-icon">{weatherIcon}</div>
      <div className="temperature-range">
        {temperatureMin}°C - {temperatureMax}°C
      </div>
    </div>
  );
};

export default WeatherCard;
