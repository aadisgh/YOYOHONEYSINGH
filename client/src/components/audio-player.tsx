import { useState } from 'react';
import { Track } from '@shared/schema';
import { formatTime } from '@/lib/audio-utils';
import { StaticVisualizer } from './visualizer';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { 
  Play, 
  Pause, 
  SkipBack, 
  SkipForward, 
  Volume2, 
  VolumeX, 
  Heart,
  Maximize2
} from 'lucide-react';

interface AudioPlayerProps {
  currentTrack: Track | null;
  isPlaying: boolean;
  currentTime: number;
  duration: number;
  volume: number;
  isLoading: boolean;
  onTogglePlayPause: () => void;
  onSeek: (time: number) => void;
  onVolumeChange: (volume: number) => void;
}

export default function AudioPlayer({
  currentTrack,
  isPlaying,
  currentTime,
  duration,
  volume,
  isLoading,
  onTogglePlayPause,
  onSeek,
  onVolumeChange,
}: AudioPlayerProps) {
  const [isMuted, setIsMuted] = useState(false);

  if (!currentTrack) return null;

  const handleVolumeToggle = () => {
    if (isMuted) {
      setIsMuted(false);
      onVolumeChange(0.7);
    } else {
      setIsMuted(true);
      onVolumeChange(0);
    }
  };

  const progressPercentage = duration > 0 ? (currentTime / duration) * 100 : 0;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 card-modern border-t border-border">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          
          {/* Current Track Info */}
          <div className="flex items-center space-x-4 flex-1 min-w-0">
            <div className="relative flex-shrink-0">
              <img
                src={currentTrack.coverUrl}
                alt={currentTrack.title}
                className="w-12 h-12 md:w-16 md:h-16 rounded-lg object-cover"
              />
              {isLoading && (
                <div className="absolute inset-0 rounded-lg bg-black/50 flex items-center justify-center">
                  <div className="animate-spin w-4 h-4 border-2 border-gold border-t-transparent rounded-full"></div>
                </div>
              )}
            </div>
            <div className="hidden md:block min-w-0 flex-1">
              <h4 className="font-bold text-foreground truncate">{currentTrack.title}</h4>
              <p className="text-sm text-muted-foreground truncate">{currentTrack.artist}</p>
            </div>
            <StaticVisualizer className="hidden md:flex ml-4" />
          </div>

          {/* Player Controls */}
          <div className="flex items-center space-x-4 flex-shrink-0">
            <Button
              variant="ghost"
              size="sm"
              className="p-2 hover:bg-muted rounded-full transition-colors hidden md:block"
            >
              <SkipBack className="w-4 h-4 text-muted-foreground hover:text-foreground" />
            </Button>
            
            <Button
              onClick={onTogglePlayPause}
              disabled={isLoading}
              className="w-12 h-12 bg-gradient-to-r from-gold to-orange text-black rounded-full flex items-center justify-center hover:scale-105 transition-transform disabled:opacity-50"
            >
              {isLoading ? (
                <div className="animate-spin w-4 h-4 border-2 border-black border-t-transparent rounded-full"></div>
              ) : isPlaying ? (
                <Pause className="w-5 h-5" fill="currentColor" />
              ) : (
                <Play className="w-5 h-5 ml-0.5" fill="currentColor" />
              )}
            </Button>
            
            <Button
              variant="ghost"
              size="sm"
              className="p-2 hover:bg-muted rounded-full transition-colors hidden md:block"
            >
              <SkipForward className="w-4 h-4 text-muted-foreground hover:text-foreground" />
            </Button>
          </div>

          {/* Volume and Additional Controls */}
          <div className="hidden md:flex items-center space-x-4 flex-1 justify-end">
            <Button
              variant="ghost"
              size="sm"
              className="p-2 hover:bg-muted rounded-full transition-colors"
            >
              <Heart className="w-4 h-4 text-muted-foreground hover:text-red transition-colors" />
            </Button>
            
            <Button
              variant="ghost"
              size="sm"
              onClick={handleVolumeToggle}
              className="p-2 hover:bg-muted rounded-full transition-colors"
            >
              {isMuted || volume === 0 ? (
                <VolumeX className="w-4 h-4 text-muted-foreground hover:text-foreground" />
              ) : (
                <Volume2 className="w-4 h-4 text-muted-foreground hover:text-foreground" />
              )}
            </Button>
            
            <div className="w-20">
              <Slider
                value={[isMuted ? 0 : volume * 100]}
                onValueChange={(value) => {
                  const newVolume = value[0] / 100;
                  onVolumeChange(newVolume);
                  setIsMuted(newVolume === 0);
                }}
                max={100}
                step={1}
                className="w-full"
              />
            </div>

            <Button
              variant="ghost"
              size="sm"
              className="p-2 hover:bg-muted rounded-full transition-colors"
            >
              <Maximize2 className="w-4 h-4 text-muted-foreground hover:text-foreground" />
            </Button>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mt-3">
          <div className="flex items-center space-x-2 text-xs text-muted-foreground">
            <span className="w-10 text-right">{formatTime(currentTime)}</span>
            <div className="flex-1 h-2 bg-muted rounded-full cursor-pointer relative group">
              <div 
                className="h-full bg-gradient-to-r from-gold to-orange rounded-full relative"
                style={{ width: `${progressPercentage}%` }}
              >
                <div className="absolute right-0 top-1/2 transform -translate-y-1/2 w-3 h-3 bg-gold rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity"></div>
              </div>
              <input
                type="range"
                min="0"
                max={duration || 0}
                value={currentTime}
                onChange={(e) => onSeek(parseFloat(e.target.value))}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              />
            </div>
            <span className="w-10">{formatTime(duration)}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
