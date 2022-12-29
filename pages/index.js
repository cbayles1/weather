import React from "react";

export async function getServerSideProps(context) {

  let city = "Los Angeles";

  // GET COORDS OF CITY
  const geoRes = await fetch(`http://api.openweathermap.org/geo/1.0/direct?q=${city}&limit=1&appid=${process.env.OPEN_WEATHER_KEY}`);
  const geoData = await geoRes.json();
  if (!geoData) {
    return {
      notFound: true
    };
  }
  const lat = geoData[0]['lat'];
  const lon = geoData[0]['lon'];

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
      geoData: geoData[0],
      weatherData: weatherData,
    }
  };
}

export default function App({geoData, weatherData}) {

  if (geoData['notFound'] || weatherData['notFound']) {
    return (<></>);
  }

  return (<>
  <p>The current temperature in {geoData.name}, {geoData.country} is {weatherData.current.temp} F</p>
  </>);
}