import { Search, X } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useSearch } from '@/hooks/use-search';
import { Track } from '@shared/schema';
import { StaticVisualizer } from './visualizer';
import { formatTime } from '@/lib/audio-utils';

interface SearchBarProps {
  onTrackSelect: (track: Track) => void;
}

export default function SearchBar({ onTrackSelect }: SearchBarProps) {
  const { query, setQuery, searchResults, isLoading, hasQuery, clearSearch } = useSearch();

  return (
    <div className="relative w-full max-w-xl mx-8">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
        <Input
          type="text"
          placeholder="Search for tracks, artists, albums..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="w-full pl-12 pr-12 py-3 glassmorphic rounded-full text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-neon-purple border-0 bg-transparent"
        />
        {hasQuery && (
          <Button
            variant="ghost"
            size="sm"
            onClick={clearSearch}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 p-1 hover:bg-white/10"
          >
            <X className="w-4 h-4 text-gray-400" />
          </Button>
        )}
      </div>

      {/* Search Results */}
      {hasQuery && (
        <div className="absolute top-full left-0 right-0 mt-2 glassmorphic rounded-2xl border border-white/20 overflow-hidden z-50 max-h-96 overflow-y-auto">
          {isLoading ? (
            <div className="p-4 text-center text-gray-400">
              <div className="animate-spin w-6 h-6 border-2 border-neon-purple border-t-transparent rounded-full mx-auto"></div>
              <p className="mt-2">Searching...</p>
            </div>
          ) : searchResults.length > 0 ? (
            <div className="py-2">
              {searchResults.map((track) => (
                <button
                  key={track.id}
                  onClick={() => {
                    onTrackSelect(track);
                    clearSearch();
                  }}
                  className="w-full p-4 hover:bg-white/5 transition-colors text-left flex items-center space-x-4 group"
                >
                  <img
                    src={track.coverUrl}
                    alt={track.title}
                    className="w-12 h-12 rounded-lg shadow-lg"
                  />
                  <div className="flex-1">
                    <h4 className="font-semibold text-white group-hover:text-neon-purple transition-colors">
                      {track.title}
                    </h4>
                    <p className="text-sm text-gray-400">{track.artist}</p>
                  </div>
                  <div className="flex items-center space-x-3">
                    <StaticVisualizer className="opacity-0 group-hover:opacity-100 transition-opacity" />
                    <span className="text-sm text-gray-400">{formatTime(track.duration)}</span>
                  </div>
                </button>
              ))}
            </div>
          ) : (
            <div className="p-4 text-center text-gray-400">
              <p>No tracks found for "{query}"</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
