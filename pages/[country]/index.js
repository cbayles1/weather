import React from "react";
import {useRouter} from "next/router";
import {useState} from 'react'

export default function Country() {

  const router = useRouter();
  const [zip, setZip] = useState();
  let country = router.asPath;
  country = router.asPath.slice(1, country.length);

  function handleSubmit(event) {
    event.preventDefault();
    router.push(`${country}/${zip}`);
  }

  return (<>
    <h1>Welcome to {country}!</h1>
    <form onSubmit={handleSubmit}>
      <label htmlFor="zip">Zip code: </label>
      <input id="zip" onChange={(inputElement) => {
        setZip(inputElement.target.value);
      }} required></input>
      <br></br>
      <button type="submit">Submit</button>
    </form>
  </>);
}