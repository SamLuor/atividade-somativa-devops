import { WeatherData, LocationData, WeatherCondition } from '@/types/weather';

const WEATHER_API_BASE = 'https://api.open-meteo.com/v1';
const GEOCODING_API_BASE = 'https://geocoding-api.open-meteo.com/v1';

export class WeatherApiError extends Error {
  constructor(message: string, public status?: number) {
    super(message);
    this.name = 'WeatherApiError';
  }
}

// Mapeamento dos códigos de clima do Open-Meteo para descrições e ícones
const weatherConditions: Record<number, WeatherCondition> = {
  0: { code: 0, description: 'Céu limpo', icon: '☀️', background: 'from-sky-400 via-sky-500 to-blue-600' },
  1: { code: 1, description: 'Principalmente limpo', icon: '🌤️', background: 'from-sky-300 via-sky-400 to-blue-500' },
  2: { code: 2, description: 'Parcialmente nublado', icon: '⛅', background: 'from-gray-300 via-gray-400 to-gray-500' },
  3: { code: 3, description: 'Nublado', icon: '☁️', background: 'from-gray-400 via-gray-500 to-gray-600' },
  45: { code: 45, description: 'Neblina', icon: '🌫️', background: 'from-gray-300 via-gray-400 to-gray-500' },
  48: { code: 48, description: 'Neblina com geada', icon: '🌫️', background: 'from-blue-200 via-blue-300 to-blue-400' },
  51: { code: 51, description: 'Garoa leve', icon: '🌦️', background: 'from-slate-400 via-slate-500 to-slate-600' },
  53: { code: 53, description: 'Garoa moderada', icon: '🌦️', background: 'from-slate-500 via-slate-600 to-slate-700' },
  55: { code: 55, description: 'Garoa intensa', icon: '🌦️', background: 'from-slate-600 via-slate-700 to-slate-800' },
  56: { code: 56, description: 'Garoa gelada leve', icon: '🌨️', background: 'from-blue-300 via-blue-400 to-blue-500' },
  57: { code: 57, description: 'Garoa gelada intensa', icon: '🌨️', background: 'from-blue-400 via-blue-500 to-blue-600' },
  61: { code: 61, description: 'Chuva leve', icon: '🌧️', background: 'from-slate-500 via-slate-600 to-slate-700' },
  63: { code: 63, description: 'Chuva moderada', icon: '🌧️', background: 'from-slate-600 via-slate-700 to-slate-800' },
  65: { code: 65, description: 'Chuva intensa', icon: '🌧️', background: 'from-slate-700 via-slate-800 to-slate-900' },
  66: { code: 66, description: 'Chuva gelada leve', icon: '🌨️', background: 'from-blue-400 via-blue-500 to-blue-600' },
  67: { code: 67, description: 'Chuva gelada intensa', icon: '🌨️', background: 'from-blue-500 via-blue-600 to-blue-700' },
  71: { code: 71, description: 'Neve leve', icon: '❄️', background: 'from-blue-200 via-blue-300 to-blue-400' },
  73: { code: 73, description: 'Neve moderada', icon: '❄️', background: 'from-blue-300 via-blue-400 to-blue-500' },
  75: { code: 75, description: 'Neve intensa', icon: '❄️', background: 'from-blue-400 via-blue-500 to-blue-600' },
  77: { code: 77, description: 'Granizo', icon: '🧊', background: 'from-gray-400 via-gray-500 to-gray-600' },
  80: { code: 80, description: 'Pancadas de chuva leves', icon: '🌦️', background: 'from-slate-500 via-slate-600 to-slate-700' },
  81: { code: 81, description: 'Pancadas de chuva moderadas', icon: '🌦️', background: 'from-slate-600 via-slate-700 to-slate-800' },
  82: { code: 82, description: 'Pancadas de chuva intensas', icon: '⛈️', background: 'from-slate-700 via-slate-800 to-slate-900' },
  85: { code: 85, description: 'Pancadas de neve leves', icon: '🌨️', background: 'from-blue-300 via-blue-400 to-blue-500' },
  86: { code: 86, description: 'Pancadas de neve intensas', icon: '🌨️', background: 'from-blue-400 via-blue-500 to-blue-600' },
  95: { code: 95, description: 'Tempestade', icon: '⛈️', background: 'from-purple-900 via-slate-800 to-slate-900' },
  96: { code: 96, description: 'Tempestade com granizo leve', icon: '⛈️', background: 'from-purple-800 via-slate-700 to-slate-800' },
  99: { code: 99, description: 'Tempestade com granizo intenso', icon: '⛈️', background: 'from-purple-900 via-slate-800 to-slate-900' },
};

export async function searchLocations(query: string): Promise<LocationData> {
  try {
    const response = await fetch(
      `${GEOCODING_API_BASE}/search?name=${encodeURIComponent(query)}&count=10&language=pt&format=json`
    );
    
    if (!response.ok) {
      throw new WeatherApiError('Erro ao buscar localizações');
    }
    
    return await response.json();
  } catch (error) {
    if (error instanceof WeatherApiError) {
      throw error;
    }
    throw new WeatherApiError('Erro de conexão ao buscar localizações');
  }
}

export async function getCurrentWeather(latitude: number, longitude: number): Promise<WeatherData> {
  try {
    const params = new URLSearchParams({
      latitude: latitude.toString(),
      longitude: longitude.toString(),
      current: [
        'temperature_2m',
        'relative_humidity_2m',
        'apparent_temperature',
        'is_day',
        'precipitation',
        'weather_code',
        'cloud_cover',
        'surface_pressure',
        'wind_speed_10m',
        'wind_direction_10m',
        'wind_gusts_10m'
      ].join(','),
      daily: [
        'weather_code',
        'temperature_2m_max',
        'temperature_2m_min',
        'sunrise',
        'sunset',
        'precipitation_sum',
        'precipitation_probability_max',
        'wind_speed_10m_max',
        'wind_direction_10m_dominant'
      ].join(','),
      timezone: 'auto',
      forecast_days: '7'
    });

    const response = await fetch(`${WEATHER_API_BASE}/forecast?${params}`);
    
    if (!response.ok) {
      throw new WeatherApiError('Erro ao buscar dados meteorológicos');
    }
    
    return await response.json();
  } catch (error) {
    if (error instanceof WeatherApiError) {
      throw error;
    }
    throw new WeatherApiError('Erro de conexão ao buscar dados meteorológicos');
  }
}

export async function getCurrentWeatherByCity(city: string): Promise<{ weather: WeatherData; location: any }> {
  try {
    // Primeiro, buscar a localização
    const locationData = await searchLocations(city);
    
    if (!locationData.results || locationData.results.length === 0) {
      throw new WeatherApiError('Cidade não encontrada');
    }
    
    const location = locationData.results[0];
    
    // Depois, buscar o clima para essa localização
    const weather = await getCurrentWeather(location.latitude, location.longitude);
    
    return { weather, location };
  } catch (error) {
    if (error instanceof WeatherApiError) {
      throw error;
    }
    throw new WeatherApiError('Erro ao buscar dados da cidade');
  }
}

export function getWeatherCondition(code: number): WeatherCondition {
  return weatherConditions[code] || weatherConditions[0];
}

export function formatTemperature(temp: number): string {
  return `${Math.round(temp)}°C`;
}

export function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString('pt-BR', {
    weekday: 'short',
    day: 'numeric',
    month: 'short'
  });
}

export function formatTime(dateString: string): string {
  return new Date(dateString).toLocaleTimeString('pt-BR', {
    hour: '2-digit',
    minute: '2-digit'
  });
}

export function getWindDirection(degrees: number): string {
  const directions = ['N', 'NNE', 'NE', 'ENE', 'E', 'ESE', 'SE', 'SSE', 'S', 'SSW', 'SW', 'WSW', 'W', 'WNW', 'NW', 'NNW'];
  const index = Math.round(degrees / 22.5) % 16;
  return directions[index];
}

export function formatPressure(pressure: number): string {
  return `${Math.round(pressure)} hPa`;
}

export function formatWindSpeed(speed: number): string {
  return `${Math.round(speed * 3.6)} km/h`; // Converter m/s para km/h
}