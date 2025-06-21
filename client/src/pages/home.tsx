import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Track, Album } from '@shared/schema';
import { useAudioPlayer } from '@/hooks/use-audio-player';
import SearchBar from '@/components/search-bar';
import AlbumCarousel from '@/components/album-carousel';
import TrackList from '@/components/track-list';
import AudioPlayer from '@/components/audio-player';
import Visualizer from '@/components/visualizer';
import SpaceBackground from '@/components/space-background';
import { Button } from '@/components/ui/button';
import { Heart, User, Menu, Music, Play } from 'lucide-react';

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
    <div className="min-h-screen text-white relative">
      {/* 3D Space Background */}
      <SpaceBackground />
      
      {/* Header Navigation */}
      <header className="sticky top-0 z-50 card-modern border-b border-border">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-gold to-orange rounded-lg flex items-center justify-center">
                <Music className="w-6 h-6 text-black" />
              </div>
              <h1 className="text-2xl font-bold gradient-text">
                HONEY<span className="text-orange">BEATS</span>
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
                className="p-3 rounded-full hover:bg-muted transition-colors"
              >
                <Heart className="w-5 h-5 text-red" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="p-3 rounded-full hover:bg-muted transition-colors"
              >
                <User className="w-5 h-5 text-gold" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="md:hidden p-3 rounded-full hover:bg-muted"
              >
                <Menu className="w-5 h-5 text-foreground" />
              </Button>
            </div>
          </div>

          {/* Mobile Search */}
          <div className="md:hidden mt-4">
            <SearchBar onTrackSelect={handleTrackSelect} />
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="min-h-screen flex items-center justify-center relative z-10 px-4">
        <div className="container mx-auto text-center">
          {/* Main Featured Artist */}
          <div className="mb-16 animate-fade-in-up">
            <h1 className="text-6xl md:text-9xl font-black mb-6 tracking-wider">
              <span className="bg-gradient-to-r from-gold via-orange to-red bg-clip-text text-transparent animate-pulse">
                YO YO
              </span>
              <br />
              <span className="bg-gradient-to-r from-purple via-red to-gold bg-clip-text text-transparent">
                HONEY SINGH
              </span>
            </h1>
            <p className="text-2xl md:text-4xl text-orange font-bold mb-8 animate-glow">
              THE KING OF DESI HIP-HOP
            </p>
            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
              Experience the ultimate fusion of beats, rhythm, and energy in this cosmic journey through sound
            </p>
          </div>

          {/* Featured Album Art - Floating */}
          <div className="mb-16 relative">
            <div className="relative w-96 h-96 mx-auto group">
              <div className="absolute inset-0 bg-gradient-to-r from-gold to-orange rounded-full blur-3xl opacity-30 group-hover:opacity-50 transition-opacity duration-500"></div>
              <div className="relative card-modern w-full h-full p-8 hover-lift group-hover:scale-105 transition-transform duration-500">
                <img 
                  src="https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=400"
                  alt="Featured Album"
                  className="w-full h-72 object-cover rounded-xl mb-4 shadow-2xl"
                />
                <h3 className="text-2xl font-bold text-gold mb-2">GLORY</h3>
                <p className="text-muted-foreground">Latest Album • 2021</p>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-16">
            <Button className="bg-gradient-to-r from-gold to-orange text-black font-bold px-12 py-4 rounded-full text-xl hover:scale-105 transition-transform shadow-2xl">
              <Play className="w-6 h-6 mr-3" fill="currentColor" />
              PLAY NOW
            </Button>
            <Button variant="outline" className="border-gold text-gold hover:bg-gold hover:text-black font-bold px-12 py-4 rounded-full text-xl transition-all duration-300">
              <Heart className="w-6 h-6 mr-3" />
              ADD TO FAVORITES
            </Button>
          </div>

          {/* Enhanced Music Visualizer */}
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-gold/20 to-orange/20 rounded-full blur-2xl"></div>
            <Visualizer 
              isPlaying={audioPlayer.isPlaying} 
              getVisualizerData={audioPlayer.getVisualizerData}
              className="w-64 h-20 mx-auto relative z-10"
            />
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
          <div className="w-6 h-10 border-2 border-gold rounded-full flex justify-center">
            <div className="w-1 h-3 bg-gold rounded-full mt-2 animate-pulse"></div>
          </div>
          <p className="text-gold text-sm mt-2 font-medium">SCROLL</p>
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
