import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Droplets, Wind } from 'lucide-react';
import { WeatherData } from '@/types/weather';
import { 
  formatTemperature, 
  formatDate, 
  getWeatherCondition,
  getWindDirection,
  formatWindSpeed
} from '@/lib/weatherApi';

interface ForecastCardProps {
  data: WeatherData;
  locationName: string;
}

export function ForecastCard({ data, locationName }: ForecastCardProps) {
  // Pegar os próximos 5 dias (excluindo hoje)
  const forecastDays = data.daily.time.slice(1, 6);

  return (
    <div className="w-full max-w-4xl mx-auto">
      <Card>
        <CardHeader>
          <CardTitle className="text-xl font-bold">
            Previsão de 5 Dias - {locationName}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {forecastDays.map((day, index) => {
              const dayIndex = index + 1; // +1 porque começamos do dia seguinte
              const weatherCondition = getWeatherCondition(data.daily.weather_code[dayIndex]);
              const tempMax = data.daily.temperature_2m_max[dayIndex];
              const tempMin = data.daily.temperature_2m_min[dayIndex];
              const precipitation = data.daily.precipitation_sum[dayIndex];
              const precipitationProb = data.daily.precipitation_probability_max[dayIndex];
              const windSpeed = data.daily.wind_speed_10m_max[dayIndex];
              const windDirection = data.daily.wind_direction_10m_dominant[dayIndex];
              
              return (
                <div key={day} className="border rounded-lg p-4 hover:bg-muted/50 transition-colors">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="text-4xl">
                        {weatherCondition.icon}
                      </div>
                      <div>
                        <div className="font-medium text-lg">
                          {formatDate(day)}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {weatherCondition.description}
                        </div>
                      </div>
                    </div>
                    
                    <div className="text-right">
                      <div className="font-bold text-xl mb-2">
                        {formatTemperature(tempMax)} / {formatTemperature(tempMin)}
                      </div>
                      <div className="flex gap-2 flex-wrap justify-end">
                        <Badge variant="outline" className="text-xs">
                          <Droplets className="h-3 w-3 mr-1" />
                          {precipitation}mm ({precipitationProb}%)
                        </Badge>
                        <Badge variant="outline" className="text-xs">
                          <Wind className="h-3 w-3 mr-1" />
                          {formatWindSpeed(windSpeed)} {getWindDirection(windDirection)}
                        </Badge>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}