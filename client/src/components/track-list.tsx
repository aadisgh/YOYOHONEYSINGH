import { useQuery } from '@tanstack/react-query';
import { Track } from '@shared/schema';
import { StaticVisualizer } from './visualizer';
import { formatTime, formatPlayCount } from '@/lib/audio-utils';
import { Play } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface TrackListProps {
  onTrackSelect: (track: Track) => void;
  currentTrack?: Track | null;
}

export default function TrackList({ onTrackSelect, currentTrack }: TrackListProps) {
  const { data: tracks, isLoading } = useQuery<Track[]>({
    queryKey: ['/api/tracks'],
  });

  if (isLoading) {
    return (
      <section className="py-20 relative">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl md:text-5xl font-black text-center mb-16 neon-text text-neon-red">
            TOP HITS
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="glassmorphic rounded-2xl p-6 animate-pulse">
                <div className="flex items-center space-x-4">
                  <div className="w-16 h-16 bg-gray-700 rounded-xl"></div>
                  <div className="flex-1">
                    <div className="h-5 bg-gray-700 rounded mb-2"></div>
                    <div className="h-4 bg-gray-700 rounded w-3/4"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  const neonColors = ['text-neon-purple', 'text-neon-pink', 'text-neon-blue', 'text-neon-green', 'text-neon-red'];

  return (
    <section className="py-20 relative">
      <div className="container mx-auto px-4">
        <h2 className="text-4xl md:text-5xl font-black text-center mb-16 neon-text text-neon-red">
          TOP HITS
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {tracks?.map((track, index) => {
            const isCurrentTrack = currentTrack?.id === track.id;
            const colorClass = neonColors[index % neonColors.length];
            
            return (
              <div
                key={track.id}
                className="glassmorphic rounded-2xl p-6 hover:scale-105 transition-all duration-300 group cursor-pointer"
                onClick={() => onTrackSelect(track)}
              >
                <div className="flex items-center space-x-4">
                  <div className="relative">
                    <img
                      src={track.coverUrl}
                      alt={track.title}
                      className="w-16 h-16 rounded-xl shadow-lg"
                    />
                    {isCurrentTrack && (
                      <div className="absolute inset-0 rounded-xl bg-black/50 flex items-center justify-center">
                        <div className="animate-spin w-4 h-4 border-2 border-neon-green border-t-transparent rounded-full"></div>
                      </div>
                    )}
                  </div>
                  <div className="flex-1">
                    <h3 className={`text-lg font-bold text-white group-hover:${colorClass} transition-colors ${isCurrentTrack ? colorClass : ''}`}>
                      {track.title}
                    </h3>
                    <p className="text-gray-400">{track.artist}</p>
                    <div className="flex items-center mt-2">
                      <StaticVisualizer className={isCurrentTrack ? "opacity-100" : "opacity-0 group-hover:opacity-100 transition-opacity"} />
                      <span className="ml-3 text-sm text-gray-400">{formatTime(track.duration)}</span>
                      {track.playCount && (
                        <span className="ml-2 text-sm text-gray-500">
                          • {formatPlayCount(track.playCount)} plays
                        </span>
                      )}
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="w-12 h-12 glassmorphic rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-white/10"
                  >
                    <Play className="text-neon-green ml-1 w-4 h-4" fill="currentColor" />
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
