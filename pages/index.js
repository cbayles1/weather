async function getLocation() {
  if (navigator.geolocation) {
    return new Promise((resolve, reject) => {
      navigator.geolocation.getCurrentPosition(resolve, reject);
    });
  } else {
    console.error("Not allowed location access.");
  }
}

export async function getServerSideProps({params}) {

  let lat = 39.84031;
  let lon = -88.9548;

  const res = await fetch(`https://api.openweathermap.org/data/3.0/onecall?lat=${lat}&lon=${lon}&appid=${process.env.OPEN_WEATHER_KEY}&exclude=minutely`);
  const data = await res.json();
  return {
    props: {
      weatherData: data,
    },
  };
}

export default function Home({weatherData}) {

  return (
    <div>
      <h1>MY WEATHER APP</h1>
      <p>It is currently {weatherData['current'].temp} K where you live.</p>
    </div>
  );
}