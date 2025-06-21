import { useState, useRef, useEffect, useCallback } from 'react';
import { Track } from '@shared/schema';
import { AudioVisualizerService } from '@/lib/audio-utils';
import { apiRequest } from '@/lib/queryClient';

export interface AudioPlayerState {
  isPlaying: boolean;
  currentTrack: Track | null;
  currentTime: number;
  duration: number;
  volume: number;
  isLoading: boolean;
  error: string | null;
}

export const useAudioPlayer = () => {
  const [state, setState] = useState<AudioPlayerState>({
    isPlaying: false,
    currentTrack: null,
    currentTime: 0,
    duration: 0,
    volume: 1,
    isLoading: false,
    error: null,
  });

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const visualizerRef = useRef<AudioVisualizerService>(new AudioVisualizerService());

  const initializeAudio = useCallback(() => {
    if (!audioRef.current) {
      audioRef.current = new Audio();
      audioRef.current.crossOrigin = 'anonymous';
      
      audioRef.current.addEventListener('loadstart', () => {
        setState(prev => ({ ...prev, isLoading: true, error: null }));
      });

      audioRef.current.addEventListener('canplay', () => {
        setState(prev => ({ ...prev, isLoading: false }));
      });

      audioRef.current.addEventListener('timeupdate', () => {
        if (audioRef.current) {
          setState(prev => ({ 
            ...prev, 
            currentTime: audioRef.current!.currentTime,
            duration: audioRef.current!.duration || 0
          }));
        }
      });

      audioRef.current.addEventListener('ended', () => {
        setState(prev => ({ ...prev, isPlaying: false }));
      });

      audioRef.current.addEventListener('error', (e) => {
        setState(prev => ({ 
          ...prev, 
          isLoading: false, 
          error: 'Failed to load audio' 
        }));
      });

      audioRef.current.addEventListener('play', () => {
        setState(prev => ({ ...prev, isPlaying: true }));
      });

      audioRef.current.addEventListener('pause', () => {
        setState(prev => ({ ...prev, isPlaying: false }));
      });
    }
  }, []);

  const playTrack = useCallback(async (track: Track) => {
    initializeAudio();
    
    if (!audioRef.current) return;

    try {
      // Increment play count
      await apiRequest('POST', `/api/tracks/${track.id}/play`);
      
      setState(prev => ({ 
        ...prev, 
        currentTrack: track, 
        isLoading: true, 
        error: null 
      }));

      audioRef.current.src = track.audioUrl;
      await audioRef.current.play();
      
      // Initialize visualizer
      try {
        await visualizerRef.current.initialize(audioRef.current);
      } catch (error) {
        console.warn('Visualizer initialization failed:', error);
      }
    } catch (error) {
      setState(prev => ({ 
        ...prev, 
        error: 'Failed to play track', 
        isLoading: false 
      }));
    }
  }, [initializeAudio]);

  const togglePlayPause = useCallback(() => {
    if (!audioRef.current || !state.currentTrack) return;

    if (state.isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play().catch(() => {
        setState(prev => ({ ...prev, error: 'Failed to play audio' }));
      });
    }
  }, [state.isPlaying, state.currentTrack]);

  const setVolume = useCallback((volume: number) => {
    if (audioRef.current) {
      audioRef.current.volume = Math.max(0, Math.min(1, volume));
      setState(prev => ({ ...prev, volume }));
    }
  }, []);

  const seekTo = useCallback((time: number) => {
    if (audioRef.current && state.duration) {
      audioRef.current.currentTime = Math.max(0, Math.min(state.duration, time));
    }
  }, [state.duration]);

  const getVisualizerData = useCallback(() => {
    return visualizerRef.current.getFrequencyData();
  }, []);

  useEffect(() => {
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.src = '';
      }
      visualizerRef.current.cleanup();
    };
  }, []);

  return {
    ...state,
    playTrack,
    togglePlayPause,
    setVolume,
    seekTo,
    getVisualizerData,
  };
};
