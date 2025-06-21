import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Track, Album } from '@shared/schema';
import { useAudioPlayer } from '@/hooks/use-audio-player';
import SearchBar from '@/components/search-bar';
import AlbumCarousel from '@/components/album-carousel';
import TrackList from '@/components/track-list';
import AudioPlayer from '@/components/audio-player';
import Visualizer from '@/components/visualizer';
import { Button } from '@/components/ui/button';
import { Heart, User, Menu, Music } from 'lucide-react';

export default function Home() {
  const audioPlayer = useAudioPlayer();

  const handleTrackSelect = (track: Track) => {
    audioPlayer.playTrack(track);
  };

  const handleAlbumSelect = async (album: Album) => {
    try {
      const response = await fetch(`/api/albums/${album.id}/tracks`);
      if (response.ok) {
        const tracks: Track[] = await response.json();
        if (tracks.length > 0) {
          audioPlayer.playTrack(tracks[0]);
        }
      }
    } catch (error) {
      console.error('Failed to load album tracks:', error);
    }
  };

  return (
    <div className="min-h-screen text-white">
      {/* Particle Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="particle" style={{ top: '10%', left: '10%', animationDelay: '0s' }}></div>
        <div className="particle" style={{ top: '20%', left: '80%', animationDelay: '1s' }}></div>
        <div className="particle" style={{ top: '60%', left: '20%', animationDelay: '2s' }}></div>
        <div className="particle" style={{ top: '80%', left: '70%', animationDelay: '3s' }}></div>
        <div className="particle" style={{ top: '40%', left: '90%', animationDelay: '1.5s' }}></div>
        <div className="particle" style={{ top: '70%', left: '10%', animationDelay: '2.5s' }}></div>
      </div>

      {/* Header Navigation */}
      <header className="relative z-50 glassmorphic border-b border-white/10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-neon-purple to-neon-pink rounded-lg flex items-center justify-center animate-glow">
                <Music className="w-6 h-6 text-white" />
              </div>
              <h1 className="text-2xl font-bold neon-text text-neon-purple">
                BEAT<span className="text-neon-pink">BOX</span>
              </h1>
            </div>

            {/* Search Bar */}
            <div className="hidden md:flex flex-1">
              <SearchBar onTrackSelect={handleTrackSelect} />
            </div>

            {/* Navigation Icons */}
            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                size="sm"
                className="p-3 glassmorphic rounded-full hover:bg-white/20 transition-all duration-300"
              >
                <Heart className="w-5 h-5 text-neon-pink" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="p-3 glassmorphic rounded-full hover:bg-white/20 transition-all duration-300"
              >
                <User className="w-5 h-5 text-neon-blue" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="md:hidden p-3 glassmorphic rounded-full"
              >
                <Menu className="w-5 h-5 text-white" />
              </Button>
            </div>
          </div>

          {/* Mobile Search */}
          <div className="md:hidden mt-4">
            <SearchBar onTrackSelect={handleTrackSelect} />
          </div>
        </div>
      </header>

      {/* Hero Section with Featured Artist */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Background with blur effect */}
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{ 
            backgroundImage: "url('https://images.unsplash.com/photo-1470225620780-dba8ba36b745?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&h=1080')",
            filter: 'blur(3px)'
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/50 to-transparent" />
        
        <div className="relative z-10 text-center px-4">
          {/* Main Featured Artist */}
          <div className="mb-8">
            <h2 className="text-6xl md:text-8xl font-black neon-text text-neon-purple mb-4 animate-glow">
              YO YO HONEY SINGH
            </h2>
            <p className="text-2xl md:text-3xl text-neon-pink mb-8 font-bold">
              The King of Desi Hip-Hop is Back!
            </p>
          </div>

          {/* Featured Album Art with 3D Effect */}
          <div className="album-3d mb-8">
            <img 
              src="https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=400"
              alt="Featured Album"
              className="w-64 h-64 md:w-80 md:h-80 mx-auto rounded-3xl shadow-2xl animate-rotate-3d"
              style={{ 
                boxShadow: '0 20px 40px rgba(139, 92, 246, 0.5), 0 0 80px rgba(236, 72, 153, 0.3)' 
              }}
            />
          </div>

          {/* Play Button */}
          <Button className="group relative px-12 py-4 glassmorphic rounded-full font-bold text-xl hover:scale-110 transition-all duration-300 animate-pulse-neon border-0 bg-transparent">
            <i className="fas fa-play mr-3 text-neon-green"></i>
            PLAY NOW
            <div className="absolute inset-0 rounded-full bg-gradient-to-r from-neon-purple to-neon-pink opacity-0 group-hover:opacity-20 transition-opacity duration-300"></div>
          </Button>
        </div>

        {/* 3D Music Visualizer */}
        <div className="absolute bottom-20 left-1/2 transform -translate-x-1/2">
          <Visualizer 
            isPlaying={audioPlayer.isPlaying} 
            getVisualizerData={audioPlayer.getVisualizerData}
            className="w-48 h-16"
          />
        </div>
      </section>

      {/* 3D Album Carousel */}
      <AlbumCarousel onAlbumSelect={handleAlbumSelect} />

      {/* Popular Tracks Section */}
      <TrackList onTrackSelect={handleTrackSelect} currentTrack={audioPlayer.currentTrack} />

      {/* Error Display */}
      {audioPlayer.error && (
        <div className="fixed top-20 left-1/2 transform -translate-x-1/2 z-50 glassmorphic border border-red-500/50 rounded-lg p-4 bg-red-900/20">
          <p className="text-red-300 text-sm">{audioPlayer.error}</p>
        </div>
      )}

      {/* Bottom Music Player */}
      <AudioPlayer
        currentTrack={audioPlayer.currentTrack}
        isPlaying={audioPlayer.isPlaying}
        currentTime={audioPlayer.currentTime}
        duration={audioPlayer.duration}
        volume={audioPlayer.volume}
        isLoading={audioPlayer.isLoading}
        onTogglePlayPause={audioPlayer.togglePlayPause}
        onSeek={audioPlayer.seekTo}
        onVolumeChange={audioPlayer.setVolume}
      />

      {/* Mobile Bottom Padding for Player */}
      <div className="h-32 md:h-24"></div>
    </div>
  );
}
