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
    <div className="min-h-screen text-white">
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
      <section className="py-20 px-4">
        <div className="container mx-auto text-center">
          {/* Main Featured Artist */}
          <div className="mb-12">
            <h2 className="text-5xl md:text-7xl font-black mb-4 gradient-text">
              YO YO HONEY SINGH
            </h2>
            <p className="text-xl md:text-2xl text-orange mb-8 font-semibold">
              The King of Desi Hip-Hop is Back!
            </p>
          </div>

          {/* Featured Album Art - Modern Card */}
          <div className="mb-12">
            <div className="card-modern w-80 h-80 mx-auto p-6 hover-lift">
              <img 
                src="https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=400"
                alt="Featured Album"
                className="w-full h-56 object-cover rounded-lg mb-4"
              />
              <h3 className="text-xl font-bold text-gold mb-2">Glory</h3>
              <p className="text-muted-foreground">Latest Album</p>
            </div>
          </div>

          {/* Play Button - Modern */}
          <Button className="bg-gradient-to-r from-gold to-orange text-black font-bold px-8 py-3 rounded-full text-lg hover:scale-105 transition-transform">
            <Play className="w-5 h-5 mr-2" fill="currentColor" />
            PLAY NOW
          </Button>

          {/* Music Visualizer */}
          <div className="mt-12">
            <Visualizer 
              isPlaying={audioPlayer.isPlaying} 
              getVisualizerData={audioPlayer.getVisualizerData}
              className="w-48 h-16 mx-auto"
            />
          </div>
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
