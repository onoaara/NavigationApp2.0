import axios from "axios";

const fetchWeather = async () => {
  const options = {
    method: "GET",
    url: "https://open-weather13.p.rapidapi.com/city/latlon/6.3344/7.2193",
    headers: {
      "x-rapidapi-key": "0a733cd763msh0d9efc55baee6f9p19719cjsn7f526b163818",
      "x-rapidapi-host": "open-weather13.p.rapidapi.com",
      "Content-Type": "application/json",
    },
  };

  try {
    const response = await axios.request(options);
    console.log(response.data);
    return response.data;
  } catch (error) {
    if (error.response) {
      console.error("Response data:", error.response.data);
      console.error("Response status:", error.response.status);
      console.error("Response headers:", error.response.headers);
    } else if (error.request) {
      console.error("Request data:", error.request);
    } else {
      console.error("Error message:", error.message);
    }
    console.error("Config:", error.config);
    return null;
  }
};

export default fetchWeather;
