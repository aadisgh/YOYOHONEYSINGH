import { users, albums, tracks, playlists, playlistTracks, type User, type InsertUser, type Album, type Track, type InsertAlbum, type InsertTrack, type Playlist, type InsertPlaylist } from "@shared/schema";

export interface IStorage {
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  getAlbums(): Promise<Album[]>;
  getAlbum(id: number): Promise<Album | undefined>;
  createAlbum(album: InsertAlbum): Promise<Album>;
  
  getTracks(): Promise<Track[]>;
  getTrack(id: number): Promise<Track | undefined>;
  getTracksByAlbum(albumId: number): Promise<Track[]>;
  searchTracks(query: string): Promise<Track[]>;
  incrementPlayCount(trackId: number): Promise<void>;
  createTrack(track: InsertTrack): Promise<Track>;
  
  getPlaylists(): Promise<Playlist[]>;
  getPlaylist(id: number): Promise<Playlist | undefined>;
  createPlaylist(playlist: InsertPlaylist): Promise<Playlist>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private albums: Map<number, Album>;
  private tracks: Map<number, Track>;
  private playlists: Map<number, Playlist>;
  private currentUserId: number;
  private currentAlbumId: number;
  private currentTrackId: number;
  private currentPlaylistId: number;

  constructor() {
    this.users = new Map();
    this.albums = new Map();
    this.tracks = new Map();
    this.playlists = new Map();
    this.currentUserId = 1;
    this.currentAlbumId = 1;
    this.currentTrackId = 1;
    this.currentPlaylistId = 1;
    this.seedData();
  }

  private seedData() {
    // Create sample albums
    const album1: Album = {
      id: this.currentAlbumId++,
      title: "Desi Kalakaar",
      artist: "Yo Yo Honey Singh",
      coverUrl: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=400",
      releaseYear: 2014,
    };
    
    const album2: Album = {
      id: this.currentAlbumId++,
      title: "Glory",
      artist: "Yo Yo Honey Singh",
      coverUrl: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=400",
      releaseYear: 2021,
    };

    const album3: Album = {
      id: this.currentAlbumId++,
      title: "International Villager",
      artist: "Yo Yo Honey Singh",
      coverUrl: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=400",
      releaseYear: 2012,
    };

    const album4: Album = {
      id: this.currentAlbumId++,
      title: "King Kohli",
      artist: "Yo Yo Honey Singh",
      coverUrl: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=400",
      releaseYear: 2023,
    };

    this.albums.set(album1.id, album1);
    this.albums.set(album2.id, album2);
    this.albums.set(album3.id, album3);
    this.albums.set(album4.id, album4);

    // Create sample tracks
    const sampleTracks: Omit<Track, 'id'>[] = [
      {
        title: "Blue Eyes",
        artist: "Yo Yo Honey Singh",
        albumId: album1.id,
        duration: 225,
        audioUrl: "https://www.soundjay.com/misc/sounds/bell-ringing-05.wav",
        coverUrl: album1.coverUrl,
        playCount: 1500000,
      },
      {
        title: "Angreji Beat",
        artist: "Yo Yo Honey Singh ft. Gippy Grewal",
        albumId: album2.id,
        duration: 252,
        audioUrl: "https://www.soundjay.com/misc/sounds/bell-ringing-05.wav",
        coverUrl: album2.coverUrl,
        playCount: 2000000,
      },
      {
        title: "Brown Rang",
        artist: "Yo Yo Honey Singh",
        albumId: album3.id,
        duration: 208,
        audioUrl: "https://www.soundjay.com/misc/sounds/bell-ringing-05.wav",
        coverUrl: album3.coverUrl,
        playCount: 1800000,
      },
      {
        title: "Lungi Dance",
        artist: "Yo Yo Honey Singh",
        albumId: album1.id,
        duration: 245,
        audioUrl: "https://www.soundjay.com/misc/sounds/bell-ringing-05.wav",
        coverUrl: album1.coverUrl,
        playCount: 3000000,
      },
      {
        title: "Dope Shope",
        artist: "Yo Yo Honey Singh ft. Deep Money",
        albumId: album3.id,
        duration: 232,
        audioUrl: "https://www.soundjay.com/misc/sounds/bell-ringing-05.wav",
        coverUrl: album3.coverUrl,
        playCount: 1200000,
      },
      {
        title: "Love Dose",
        artist: "Yo Yo Honey Singh",
        albumId: album2.id,
        duration: 258,
        audioUrl: "https://www.soundjay.com/misc/sounds/bell-ringing-05.wav",
        coverUrl: album2.coverUrl,
        playCount: 2500000,
      },
    ];

    sampleTracks.forEach(track => {
      const fullTrack: Track = { ...track, id: this.currentTrackId++ };
      this.tracks.set(fullTrack.id, fullTrack);
    });
  }

  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.currentUserId++;
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  async getAlbums(): Promise<Album[]> {
    return Array.from(this.albums.values());
  }

  async getAlbum(id: number): Promise<Album | undefined> {
    return this.albums.get(id);
  }

  async createAlbum(insertAlbum: InsertAlbum): Promise<Album> {
    const id = this.currentAlbumId++;
    const album: Album = { ...insertAlbum, id };
    this.albums.set(id, album);
    return album;
  }

  async getTracks(): Promise<Track[]> {
    return Array.from(this.tracks.values());
  }

  async getTrack(id: number): Promise<Track | undefined> {
    return this.tracks.get(id);
  }

  async getTracksByAlbum(albumId: number): Promise<Track[]> {
    return Array.from(this.tracks.values()).filter(track => track.albumId === albumId);
  }

  async searchTracks(query: string): Promise<Track[]> {
    const lowerQuery = query.toLowerCase();
    return Array.from(this.tracks.values()).filter(track =>
      track.title.toLowerCase().includes(lowerQuery) ||
      track.artist.toLowerCase().includes(lowerQuery)
    );
  }

  async incrementPlayCount(trackId: number): Promise<void> {
    const track = this.tracks.get(trackId);
    if (track) {
      track.playCount = (track.playCount || 0) + 1;
      this.tracks.set(trackId, track);
    }
  }

  async createTrack(insertTrack: InsertTrack): Promise<Track> {
    const id = this.currentTrackId++;
    const track: Track = { ...insertTrack, id, playCount: 0 };
    this.tracks.set(id, track);
    return track;
  }

  async getPlaylists(): Promise<Playlist[]> {
    return Array.from(this.playlists.values());
  }

  async getPlaylist(id: number): Promise<Playlist | undefined> {
    return this.playlists.get(id);
  }

  async createPlaylist(insertPlaylist: InsertPlaylist): Promise<Playlist> {
    const id = this.currentPlaylistId++;
    const playlist: Playlist = { ...insertPlaylist, id };
    this.playlists.set(id, playlist);
    return playlist;
  }
}

export const storage = new MemStorage();
