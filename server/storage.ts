import { users, albums, tracks, playlists, playlistTracks, type User, type InsertUser, type Album, type Track, type InsertAlbum, type InsertTrack, type Playlist, type InsertPlaylist } from "@shared/schema";
import { db } from "./db";
import { eq } from "drizzle-orm";

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

    // Create sample tracks with working HTML5 test audio
    const sampleTracks: Omit<Track, 'id'>[] = [
      {
        title: "Blue Eyes",
        artist: "Yo Yo Honey Singh",
        albumId: album1.id,
        duration: 30,
        audioUrl: "data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+D2wm0gBTuB0PLNbSIIJXfO8Nd0KwQgd8n1w2ogBTmByu7tcyoEEWu/8Nqe0gINAKdgOQJQp+b1wm0gBT2B0PLNbSUHKXDN8dd2KgQod9Xx0HciAy+A0+7Obi0FGGu/7/2efpfS",
        coverUrl: album1.coverUrl,
        playCount: 1500000,
      },
      {
        title: "Angreji Beat",
        artist: "Yo Yo Honey Singh ft. Gippy Grewal",
        albumId: album2.id,
        duration: 30,
        audioUrl: "https://html5test.com/samples/audio/beep.wav",
        coverUrl: album2.coverUrl,
        playCount: 2000000,
      },
      {
        title: "Brown Rang",
        artist: "Yo Yo Honey Singh",
        albumId: album3.id,
        duration: 30,
        audioUrl: "https://www.w3schools.com/html/horse.ogg",
        coverUrl: album3.coverUrl,
        playCount: 1800000,
      },
      {
        title: "Lungi Dance",
        artist: "Yo Yo Honey Singh",
        albumId: album1.id,
        duration: 30,
        audioUrl: "https://www.w3schools.com/html/horse.mp3",
        coverUrl: album1.coverUrl,
        playCount: 3000000,
      },
      {
        title: "Dope Shope",
        artist: "Yo Yo Honey Singh ft. Deep Money",
        albumId: album3.id,
        duration: 30,
        audioUrl: "https://interactive-examples.mdn.mozilla.net/media/cc0-audio/t-rex-roar.mp3",
        coverUrl: album3.coverUrl,
        playCount: 1200000,
      },
      {
        title: "Love Dose",
        artist: "Yo Yo Honey Singh",
        albumId: album2.id,
        duration: 30,
        audioUrl: "https://sample-videos.com/zip/10/mp3/SampleAudio_0.4mb.mp3",
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
    const album: Album = { 
      ...insertAlbum, 
      id,
      releaseYear: insertAlbum.releaseYear ?? null
    };
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
    const track: Track = { 
      ...insertTrack, 
      id, 
      playCount: 0,
      albumId: insertTrack.albumId ?? null
    };
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
    const playlist: Playlist = { 
      ...insertPlaylist, 
      id,
      coverUrl: insertPlaylist.coverUrl ?? null,
      userId: insertPlaylist.userId ?? null
    };
    this.playlists.set(id, playlist);
    return playlist;
  }
}

export class DatabaseStorage implements IStorage {
  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user || undefined;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user || undefined;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(insertUser)
      .returning();
    return user;
  }

  async getAlbums(): Promise<Album[]> {
    return await db.select().from(albums);
  }

  async getAlbum(id: number): Promise<Album | undefined> {
    const [album] = await db.select().from(albums).where(eq(albums.id, id));
    return album || undefined;
  }

  async createAlbum(insertAlbum: InsertAlbum): Promise<Album> {
    const [album] = await db
      .insert(albums)
      .values(insertAlbum)
      .returning();
    return album;
  }

  async getTracks(): Promise<Track[]> {
    return await db.select().from(tracks);
  }

  async getTrack(id: number): Promise<Track | undefined> {
    const [track] = await db.select().from(tracks).where(eq(tracks.id, id));
    return track || undefined;
  }

  async getTracksByAlbum(albumId: number): Promise<Track[]> {
    return await db.select().from(tracks).where(eq(tracks.albumId, albumId));
  }

  async searchTracks(query: string): Promise<Track[]> {
    const results = await db.select().from(tracks);
    const lowerQuery = query.toLowerCase();
    return results.filter(track =>
      track.title.toLowerCase().includes(lowerQuery) ||
      track.artist.toLowerCase().includes(lowerQuery)
    );
  }

  async incrementPlayCount(trackId: number): Promise<void> {
    const [track] = await db.select().from(tracks).where(eq(tracks.id, trackId));
    if (track) {
      await db
        .update(tracks)
        .set({ playCount: (track.playCount || 0) + 1 })
        .where(eq(tracks.id, trackId));
    }
  }

  async createTrack(insertTrack: InsertTrack): Promise<Track> {
    const [track] = await db
      .insert(tracks)
      .values({ ...insertTrack, playCount: 0 })
      .returning();
    return track;
  }

  async getPlaylists(): Promise<Playlist[]> {
    return await db.select().from(playlists);
  }

  async getPlaylist(id: number): Promise<Playlist | undefined> {
    const [playlist] = await db.select().from(playlists).where(eq(playlists.id, id));
    return playlist || undefined;
  }

  async createPlaylist(insertPlaylist: InsertPlaylist): Promise<Playlist> {
    const [playlist] = await db
      .insert(playlists)
      .values(insertPlaylist)
      .returning();
    return playlist;
  }
}

export const storage = new DatabaseStorage();
