import React from "react";
import {useState} from 'react';

const moment = require('moment');

export async function getServerSideProps(context) {

  let zipCode = context.params.zip;
  let countryCode = context.params.country;

  // GET COORDS OF CITY
  const geoRes = await fetch(`http://api.openweathermap.org/geo/1.0/zip?zip=${zipCode},${countryCode}&appid=${process.env.OPEN_WEATHER_KEY}`);
  const geoData = await geoRes.json();
  if (!geoData) {
    return {};
  }
  const lat = geoData['lat'];
  const lon = geoData['lon'];

  // GET CURRENT WEATHER OF COORDS
  const currentWeatherRes = await fetch(`http://api.openweathermap.org/data/3.0/onecall?lat=${lat}&lon=${lon}&appid=${process.env.OPEN_WEATHER_KEY}&units=imperial&exclude=minutely,daily,alerts,hourly`);
  const currentWeather = await currentWeatherRes.json();
  if (!currentWeather) {
    return {};
  }

  // GET CURRENT WEATHER OF COORDS
  const forecastWeatherRes = await fetch(`http://api.openweathermap.org/data/3.0/onecall?lat=${lat}&lon=${lon}&appid=${process.env.OPEN_WEATHER_KEY}&units=imperial&exclude=minutely,daily,alerts,current`);
  const forecastWeather = await forecastWeatherRes.json();
  if (!forecastWeather) {
    return {};
  }

  return {
    props: {
      geoData: geoData,
      forecastWeather: forecastWeather['hourly'],
      currentWeather: currentWeather['current'],
    }
  };
}

export default function Zip({geoData, currentWeather, forecastWeather}) {
  
  if ("cod" in geoData) {
    return (<div>OpenWeather Geolocation Error {geoData['cod']}: {geoData['message']}</div>);
  }
  if ("cod" in currentWeather) {
    return (<div>OpenWeather Current Weather Error {currentWeather['cod']}: {currentWeather['message']}</div>);
  }
  if ("cod" in forecastWeather) {
    return (<div>OpenWeather Hourly Weather Error {forecastWeather['cod']}: {forecastWeather['message']}</div>);
  }

  const currentDatetime = moment().format('LLLL');
  const sunrise = moment(currentWeather['sunrise'] * 1000).format('LT');
  const sunset = moment(currentWeather['sunset'] * 1000).format('LT');
  forecastWeather = forecastWeather.slice(0,8);

  return (<>
    <div id="current">
      <span id="leftHalf">
        <div id="back">Change Location</div>
        <div id="currentTempBox">
          <h2 id="currentTemp">{currentWeather['temp']}</h2>
          <p id="feelsLike">{currentWeather['feels_like']}</p>
        </div>
      </span>
      <span id="rightHalf">
        <img id="todayImg"></img>
        <p id="desc">{currentWeather['weather'][0]['description']}</p>
      </span>
      <div id="otherCurrentInfo">
        <span className="otherCurrentInfo">UV Index: {currentWeather['uvi']} </span>
        <span className="otherCurrentInfo">Wind Speed: {currentWeather['wind_speed']} </span>
        <span className="otherCurrentInfo">Sunrise: {sunrise}</span>
        <br></br>
        <span className="otherCurrentInfo">Humidity: {currentWeather['humidity']} </span>
        <span className="otherCurrentInfo">Pressure: {currentWeather['pressure']} </span>
        <span className="otherCurrentInfo">Sunset: {sunset}</span>
      </div>
    </div>
    <div id="timePlaceBanner">
      <span id="currentDatetime">{currentDatetime}</span>
      <span id="location">
        {geoData['name']}, {geoData['country']} {geoData['zip']}
      </span>
    </div>
    <div id="forecast">
      {forecastWeather.map(hourlyWeather => (
        <span key={hourlyWeather['dt']}>
          <img className='forecastImg'></img>
          <p className='forecastTemp'>{hourlyWeather['temp']}</p>
          <p className='forecastTime'>{moment(hourlyWeather['dt'] * 1000).format('LLLL')}</p>
        </span>
      ))}
    </div>
  </>);
}