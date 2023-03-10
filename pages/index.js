import React from "react";
import {useRouter} from "next/router";
import {useState} from 'react'
import Head from 'next/head';

export default function App() {

  const router = useRouter();
  const [country, setCountry] = useState();
  const [zip, setZip] = useState();

  function handleSubmit(event) {
    event.preventDefault();
    router.push(`${country}/${zip}`);
  }

  return (
  <div class="searchPageContainer">
    <Head>
      <title>My New Weather App</title>
    </Head>
    <form onSubmit={handleSubmit}>
      <label htmlFor="country">Country code: </label>
      <input id="country" onChange={(inputElement) => {
        setCountry(inputElement.target.value);
      }} required></input>
      <br></br>
      <label htmlFor="zip">Zip code: </label>
      <input id="zip" onChange={(inputElement) => {
        setZip(inputElement.target.value);
      }} required></input>
      <br></br>
      <button type="submit">Submit</button>
    </form>
  </div>);
}