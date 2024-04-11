import {
  WiDaySunny,
  WiDaySunnyOvercast,
  WiDayCloudyHigh,
  WiCloud,
  WiCloudy,
  WiFog,
  WiSprinkle,
  WiRain,
  WiShowers,
  WiRainMix,
  WiSnow,
  WiDaySnow,
  WiSnowWind,
  WiSleet,
  WiHail,
  WiStormShowers,
} from "react-icons/wi";
import React from "react";

export const getWeatherIcon = (weatherCode) => {
  switch (weatherCode) {
    case "1000":
      return <WiDaySunny size={48} color="#636363" />;
    case "1100":
      return <WiDaySunnyOvercast size={48} color="#636363" />;
    case "1101":
      return <WiDayCloudyHigh size={48} color="#636363" />;
    case "1102":
      return <WiCloud size={48} color="#636363" />;
    case "1001":
      return <WiCloudy size={48} color="#636363" />;
    case "2000":
    case "2100":
      return <WiFog size={48} color="#636363" />;
    case "4000":
      return <WiSprinkle size={48} color="#636363" />;
    case "4001":
      return <WiRain size={48} color="#636363" />;
    case "4200":
      return <WiShowers size={48} color="#636363" />;
    case "4201":
      return <WiRainMix size={48} color="#636363" />;
    case "5000":
    case "5001":
      return <WiSnow size={48} color="#636363" />;
    case "5100":
      return <WiDaySnow size={48} color="#636363" />;
    case "5101":
      return <WiSnowWind size={48} color="#636363" />;
    case "6000":
    case "6001":
    case "6200":
    case "6201":
      return <WiSleet size={48} color="#636363" />;
    case "7000":
    case "7101":
    case "7102":
      return <WiHail size={48} color="#636363" />;
    case "8000":
      return <WiStormShowers size={48} color="#636363" />;
    default:
      return <WiDaySunny size={48} color="#636363" />;
  }
};
