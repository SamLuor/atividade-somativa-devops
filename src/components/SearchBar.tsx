import { useState } from 'react';
import { Search, MapPin } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

interface SearchBarProps {
  onSearch: (city: string) => void;
  onLocationSearch: () => void;
  loading: boolean;
}

export function SearchBar({ onSearch, onLocationSearch, loading }: SearchBarProps) {
  const [searchTerm, setSearchTerm] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      onSearch(searchTerm.trim());
    }
  };

  return (
    <div className="w-full max-w-lg mx-auto mb-8">
      <form onSubmit={handleSubmit} className="flex gap-2 mb-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            type="text"
            placeholder="Digite o nome da cidade (ex: São Paulo, Rio de Janeiro)..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
            disabled={loading}
          />
        </div>
        <Button type="submit" disabled={loading || !searchTerm.trim()}>
          Buscar
        </Button>
      </form>
      
      <Button
        variant="outline"
        onClick={onLocationSearch}
        disabled={loading}
        className="w-full"
      >
        <MapPin className="mr-2 h-4 w-4" />
        Usar minha localização
      </Button>
    </div>
  );
}