import React from "react";

export async function getServerSideProps(context) {

  let zipCode = context.params.zip;
  let countryCode = context.params.country;

  // GET COORDS OF CITY
  const geoRes = await fetch(`http://api.openweathermap.org/geo/1.0/zip?zip=${zipCode},${countryCode}&appid=${process.env.OPEN_WEATHER_KEY}`);
  const geoData = await geoRes.json();
  if (!geoData) {
    return {
      notFound: true
    };
  }
  const lat = geoData['lat'];
  const lon = geoData['lon'];

  // GET WEATHER OF COORDS
  const weatherRes = await fetch(`http://api.openweathermap.org/data/3.0/onecall?lat=${lat}&lon=${lon}&appid=${process.env.OPEN_WEATHER_KEY}&units=imperial&exclude=minutely`);
  const weatherData = await weatherRes.json();
  if (!weatherData) {
    return {
      notFound: true
    };
  }

  return {
    props: {
      geoData: geoData,
      weatherData: weatherData,
    }
  };
}

export default function App({geoData, weatherData}) {
  
  if ("cod" in geoData) {
    return (<p>OpenWeather Geolocation Error {geoData['cod']}: {geoData['message']}</p>);
  }
  if ("cod" in weatherData) {
    return (<p>OpenWeather Weather Error {weatherData['cod']}: {weatherData['message']}</p>);
  }

  return (<>
    <p>The current temperature in {geoData.name}, {geoData.country} is {weatherData.current.temp} F</p>
  </>);
}