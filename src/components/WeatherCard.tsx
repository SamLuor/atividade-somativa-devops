import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Droplets,
  Wind,
  Gauge,
  Sunrise,
  Sunset,
  MapPin,
  CloudRain
} from 'lucide-react';
import { WeatherData } from '@/types/weather';
import {
  formatTemperature,
  formatTime,
  getWeatherCondition,
  getWindDirection,
  formatPressure,
  formatWindSpeed
} from '@/lib/weatherApi';

interface WeatherCardProps {
  data: WeatherData;
  locationName: string;
  country: string;
}

export function WeatherCard({ data, locationName, country }: WeatherCardProps) {
  const weatherCondition = getWeatherCondition(data.current.weather_code);
  const todayData = {
    sunrise: data.daily.sunrise[0],
    sunset: data.daily.sunset[0],
    tempMax: data.daily.temperature_2m_max[0],
    tempMin: data.daily.temperature_2m_min[0],
    precipitation: data.daily.precipitation_sum[0],
    precipitationProb: data.daily.precipitation_probability_max[0]
  };

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6">
      {/* Cartão Principal */}
      <Card className="overflow-hidden">
        <div className={`bg-gradient-to-br ${weatherCondition.background} text-white p-6`}>
          <div className="flex items-center justify-between mb-4">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <MapPin className="h-4 w-4" />
                <span className="text-lg font-medium">
                  {locationName}, {country}
                </span>
              </div>
              <div className="text-5xl font-bold mb-2">
                {formatTemperature(data.current.temperature_2m)}
              </div>
              <div className="text-xl opacity-90">
                Sensação térmica: {formatTemperature(data.current.apparent_temperature)}
              </div>
            </div>
            <div className="text-center">
              <div className="text-6xl mb-2">
                {weatherCondition.icon}
              </div>
              <div className="text-lg font-medium">
                {weatherCondition.description}
              </div>
              <div className="text-sm opacity-80 mt-1">
                {data.current.is_day ? 'Dia' : 'Noite'}
              </div>
            </div>
          </div>

          <div className="flex justify-between items-center">
            <Badge variant="secondary" className="bg-white/20 text-white">
              Mín: {formatTemperature(todayData.tempMin)}
            </Badge>
            <Badge variant="secondary" className="bg-white/20 text-white">
              Máx: {formatTemperature(todayData.tempMax)}
            </Badge>
          </div>
        </div>
      </Card>

      {/* Cartões de Detalhes */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center space-y-0 pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Droplets className="h-4 w-4 text-blue-500" />
              Umidade
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data.current.relative_humidity_2m}%</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center space-y-0 pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Wind className="h-4 w-4 text-gray-500" />
              Vento
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatWindSpeed(data.current.wind_speed_10m)}</div>
            <p className="text-xs text-muted-foreground">
              {getWindDirection(data.current.wind_direction_10m)} • Rajadas: {formatWindSpeed(data.current.wind_gusts_10m)}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center space-y-0 pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <CloudRain className="h-4 w-4 text-indigo-500" />
              Precipitação
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{todayData.precipitation} mm</div>
            <p className="text-xs text-muted-foreground">
              Probabilidade: {todayData.precipitationProb}%
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center space-y-0 pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Gauge className="h-4 w-4 text-orange-500" />
              Pressão
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatPressure(data.current.surface_pressure)}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center space-y-0 pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Sunrise className="h-4 w-4 text-yellow-500" />
              Nascer do Sol
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatTime(todayData.sunrise)}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center space-y-0 pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Sunset className="h-4 w-4 text-red-500" />
              Pôr do Sol
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatTime(todayData.sunset)}</div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}