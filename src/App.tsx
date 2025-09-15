import { useState, useEffect } from 'react';
import { Cloud } from 'lucide-react';
import { WeatherData } from '@/types/weather';
import { 
  getCurrentWeatherByCity, 
  getCurrentWeather,
  WeatherApiError 
} from '@/lib/weatherApi';
import { SearchBar } from '@/components/SearchBar';
import { WeatherCard } from '@/components/WeatherCard';
import { ForecastCard } from '@/components/ForecastCard';
import { LoadingSpinner } from '@/components/LoadingSpinner';
import { ErrorMessage } from '@/components/ErrorMessage';
import { useToast } from '@/hooks/use-toast';
import { Toaster } from '@/components/ui/sonner';

function App() {
  const [currentWeather, setCurrentWeather] = useState<WeatherData | null>(null);
  const [locationInfo, setLocationInfo] = useState<{ name: string; country: string } | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    console.log("Só testando")
    handleSearch('São Paulo');
  }, []);

  const handleSearch = async (city: string) => {
    setLoading(true);
    setError(null);

    try {
      const { weather, location } = await getCurrentWeatherByCity(city);
      
      setCurrentWeather(weather);
      setLocationInfo({
        name: location.name,
        country: location.country
      });
      
      toast({
        title: "Dados atualizados!",
        description: `Previsão do tempo para ${location.name} carregada com sucesso.`,
      });
      
    } catch (err) {
      const errorMessage = err instanceof WeatherApiError 
        ? err.message 
        : 'Erro desconhecido ao buscar dados do clima';
      setError(errorMessage);
      setCurrentWeather(null);
      setLocationInfo(null);
      
      toast({
        title: "Erro ao buscar dados",
        description: errorMessage,
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleLocationSearch = async () => {
    if (!navigator.geolocation) {
      toast({
        title: "Geolocalização não suportada",
        description: "Seu navegador não suporta geolocalização.",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);
    setError(null);

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const { latitude, longitude } = position.coords;
          const weather = await getCurrentWeather(latitude, longitude);
          
          setCurrentWeather(weather);
          setLocationInfo({
            name: 'Sua Localização',
            country: 'Local'
          });
          
          toast({
            title: "Localização encontrada!",
            description: "Previsão do tempo para sua localização carregada.",
          });
          
        } catch (err) {
          const errorMessage = err instanceof WeatherApiError 
            ? err.message 
            : 'Erro ao buscar dados da sua localização';
          setError(errorMessage);
          
          toast({
            title: "Erro na geolocalização",
            description: errorMessage,
            variant: "destructive"
          });
        } finally {
          setLoading(false);
        }
      },
      (err) => {
        setLoading(false);
        let message = 'Erro ao acessar localização';
        
        switch (err.code) {
          case err.PERMISSION_DENIED:
            message = 'Permissão de localização negada. Permita acesso à localização.';
            break;
          case err.POSITION_UNAVAILABLE:
            message = 'Localização indisponível.';
            break;
          case err.TIMEOUT:
            message = 'Tempo limite excedido ao buscar localização.';
            break;
        }
        
        setError(message);
        toast({
          title: "Erro na geolocalização",
          description: message,
          variant: "destructive"
        });
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 300000
      }
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-50 via-blue-50 to-indigo-100 p-4">
      <div className="container mx-auto py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="p-3 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full">
              <Cloud className="h-8 w-8 text-white" />
            </div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              WeatherApp
            </h1>
          </div>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Acompanhe a previsão do tempo em tempo real para qualquer cidade do mundo.
            Dados precisos e gratuitos fornecidos pela API Open-Meteo.
          </p>
        </div>

        {/* Search Bar */}
        <SearchBar
          onSearch={handleSearch}
          onLocationSearch={handleLocationSearch}
          loading={loading}
        />

        {/* Content */}
        <div className="space-y-8">
          {loading && <LoadingSpinner />}
          
          {error && (
            <ErrorMessage 
              message={error} 
              onRetry={() => locationInfo && handleSearch(locationInfo.name)} 
            />
          )}
          
          {currentWeather && locationInfo && !loading && !error && (
            <>
              <WeatherCard 
                data={currentWeather} 
                locationName={locationInfo.name}
                country={locationInfo.country}
              />
              <ForecastCard 
                data={currentWeather} 
                locationName={locationInfo.name}
              />
            </>
          )}
        </div>

        {/* Footer */}
        <footer className="mt-16 text-center text-sm text-muted-foreground">
          <p>Dados meteorológicos fornecidos gratuitamente pela Open-Meteo API</p>
          <p className="mt-2">
            ✨ Sem necessidade de chave de API ou cadastro - Totalmente gratuito!
          </p>
        </footer>
      </div>
      
      <Toaster />
    </div>
  );
}

export default App;