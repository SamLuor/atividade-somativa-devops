export interface WeatherData {
  current: {
    time: string;
    temperature_2m: number;
    relative_humidity_2m: number;
    apparent_temperature: number;
    is_day: number;
    precipitation: number;
    weather_code: number;
    cloud_cover: number;
    surface_pressure: number;
    wind_speed_10m: number;
    wind_direction_10m: number;
    wind_gusts_10m: number;
  };
  current_units: {
    time: string;
    temperature_2m: string;
    relative_humidity_2m: string;
    apparent_temperature: string;
    precipitation: string;
    weather_code: string;
    cloud_cover: string;
    surface_pressure: string;
    wind_speed_10m: string;
    wind_direction_10m: string;
    wind_gusts_10m: string;
  };
  daily: {
    time: string[];
    weather_code: number[];
    temperature_2m_max: number[];
    temperature_2m_min: number[];
    sunrise: string[];
    sunset: string[];
    precipitation_sum: number[];
    precipitation_probability_max: number[];
    wind_speed_10m_max: number[];
    wind_direction_10m_dominant: number[];
  };
  daily_units: {
    time: string;
    weather_code: string;
    temperature_2m_max: string;
    temperature_2m_min: string;
    sunrise: string;
    sunset: string;
    precipitation_sum: string;
    precipitation_probability_max: string;
    wind_speed_10m_max: string;
    wind_direction_10m_dominant: string;
  };
  timezone: string;
  timezone_abbreviation: string;
  elevation: number;
}

export interface LocationData {
  results: Array<{
    id: number;
    name: string;
    latitude: number;
    longitude: number;
    elevation: number;
    feature_code: string;
    country_code: string;
    admin1: string;
    admin2: string;
    admin3: string;
    admin4: string;
    timezone: string;
    population: number;
    country: string;
    admin1_name: string;
    admin2_name: string;
    admin3_name: string;
    admin4_name: string;
  }>;
  generationtime_ms: number;
}

export interface WeatherCondition {
  code: number;
  description: string;
  icon: string;
  background: string;
}