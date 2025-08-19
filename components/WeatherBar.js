import React, { useState, useEffect } from "react";
import {
  ActivityIndicator,
  StyleSheet,
  Text,
  View,
  Dimensions,
} from "react-native";
import { Icon } from "@rneui/base";
import fetchWeather from "./fetchWeather";

const { width, height } = Dimensions.get("window");

const WeatherBar = () => {
  const [weatherData, setWeatherData] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      const data = await fetchWeather();
      if (data) {
        setWeatherData(data);
      } else {
        console.error("Failed to fetch weather data");
      }
    };
    fetchData();
  }, []);

  const kelvinToCelsius = (temp) => {
    return (temp - 273.15).toFixed(0);
  };

  const getWeatherIcon = (weather) => {
    const weatherIcons = {
      Thunderstorm: "weather-lightning",
      Drizzle: "weather-rainy",
      Rain: "weather-pouring",
      Snow: "weather-snowy",
      Mist: "weather-fog",
      Smoke: "weather-fog",
      Haze: "weather-hazy",
      Dust: "weather-fog",
      Fog: "weather-fog",
      Sand: "weather-fog",
      Ash: "weather-fog",
      Squall: "weather-windy",
      Tornado: "weather-tornado",
      Clear: "weather-sunny",
      Clouds: "weather-cloudy",
    };

    return weatherIcons[weather] || "weather-sunny";
  };

  return (
    <View style={styles.container}>
      {weatherData ? (
        <>
          <View style={styles.subContainer}>
            <Text style={styles.head}>
              {kelvinToCelsius(weatherData.main.temp)}°C
            </Text>
            <Text style={styles.bodyDate}>
              {new Date(weatherData.dt * 1000).toLocaleDateString()}
            </Text>
            <Text style={styles.weatherCondition}>
              {weatherData.weather[0].description}
            </Text>
            <View style={styles.location}>
              <Icon
                type="ionicon"
                name="location-outline"
                size={height * 0.02}
                color="black"
              />
              <Text style={styles.bodyLoc}>{weatherData.name}</Text>
            </View>
          </View>
          <View style={styles.weatherIcon}>
            <Icon
              type="material-community"
              name={getWeatherIcon(weatherData.weather[0].main)}
              size={height * 0.05}
              color="#fff"
            />
          </View>
        </>
      ) : (
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <ActivityIndicator size={"small"} color={"#bbb"} />
          <Text>Loading...</Text>
        </View>
      )}
    </View>
  );
};

export default WeatherBar;

const styles = StyleSheet.create({
  container: {
    marginTop: height * 0.025,
    width: "100%",
    height: height * 0.15,
    padding: width * 0.03,
    backgroundColor: "#eeeeee",
    borderRadius: 12,
    flexDirection: "row",
    justifyContent: "space-between",
    shadowColor: "#000",
    shadowRadius: 5,
    shadowOpacity: 0.2,
    elevation: 5,
  },
  subContainer: {
    justifyContent: "center",
  },
  head: {
    fontSize: height * 0.03,
    fontWeight: "500",
    color: "#000000",
  },
  bodyDate: {
    marginTop: height * 0.0045,
    color: "#000000",
    fontSize: height * 0.018,
  },
  bodyLoc: {
    marginTop: height * 0.003,
    color: "#000000",
    fontSize: height * 0.015,
  },
  location: {
    flexDirection: "row",
    alignItems: "center",
  },
  weatherIcon: {
    width: width * 0.15,
    height: width * 0.15,
    padding: width * 0.015,
    backgroundColor: "#4361ee",
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  weatherCondition: {
    marginTop: height * 0.002,
    color: "#000000",
    fontSize: height * 0.018,
  },
});
