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

  const colors = ['text-gold', 'text-orange', 'text-red', 'text-purple', 'text-green'];

  return (
    <section className="py-20">
      <div className="container mx-auto px-4">
        <h2 className="text-4xl md:text-5xl font-black text-center mb-16 gradient-text">
          TOP HITS
        </h2>

        <div className="grid grid-cols-1 gap-4">
          {tracks?.map((track, index) => {
            const isCurrentTrack = currentTrack?.id === track.id;
            const colorClass = colors[index % colors.length];
            
            return (
              <div
                key={track.id}
                className="card-modern p-4 hover-lift group cursor-pointer"
                onClick={() => onTrackSelect(track)}
              >
                <div className="flex items-center space-x-4">
                  <div className="relative">
                    <img
                      src={track.coverUrl}
                      alt={track.title}
                      className="w-16 h-16 rounded-lg object-cover"
                    />
                    {isCurrentTrack && (
                      <div className="absolute inset-0 rounded-lg bg-black/50 flex items-center justify-center">
                        <div className="animate-spin w-4 h-4 border-2 border-gold border-t-transparent rounded-full"></div>
                      </div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className={`text-lg font-bold text-foreground group-hover:${colorClass} transition-colors ${isCurrentTrack ? colorClass : ''}`}>
                      {track.title}
                    </h3>
                    <p className="text-muted-foreground">{track.artist}</p>
                    <div className="flex items-center mt-1 space-x-3">
                      <StaticVisualizer className={isCurrentTrack ? "opacity-100" : "opacity-0 group-hover:opacity-100 transition-opacity"} />
                      <span className="text-sm text-muted-foreground">{formatTime(track.duration)}</span>
                      {track.playCount && (
                        <span className="text-sm text-muted-foreground">
                          • {formatPlayCount(track.playCount)} plays
                        </span>
                      )}
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="w-10 h-10 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-muted"
                  >
                    <Play className="text-gold ml-0.5 w-4 h-4" fill="currentColor" />
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
