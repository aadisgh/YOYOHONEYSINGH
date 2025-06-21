import { useQuery } from '@tanstack/react-query';
import { Album } from '@shared/schema';
import { Play } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface AlbumCarouselProps {
  onAlbumSelect: (album: Album) => void;
}

export default function AlbumCarousel({ onAlbumSelect }: AlbumCarouselProps) {
  const { data: albums, isLoading } = useQuery<Album[]>({
    queryKey: ['/api/albums'],
  });

  if (isLoading) {
    return (
      <div className="py-20">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl md:text-5xl font-black text-center mb-16 neon-text text-neon-blue">
            TRENDING ALBUMS
          </h2>
          <div className="flex space-x-8 overflow-x-auto py-8">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="flex-shrink-0 animate-pulse">
                <div className="w-72 h-72 bg-gray-700 rounded-2xl"></div>
                <div className="mt-6 text-center">
                  <div className="h-6 bg-gray-700 rounded w-32 mx-auto mb-2"></div>
                  <div className="h-4 bg-gray-700 rounded w-24 mx-auto"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <section className="py-20">
      <div className="container mx-auto px-4">
        <h2 className="text-4xl md:text-5xl font-black text-center mb-16 gradient-text">
          TRENDING ALBUMS
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {albums?.map((album, index) => (
            <div 
              key={album.id} 
              className="card-modern p-6 hover-lift cursor-pointer group"
              onClick={() => onAlbumSelect(album)}
            >
              <div className="relative mb-4">
                <img
                  src={album.coverUrl}
                  alt={album.title}
                  className="w-full aspect-square object-cover rounded-lg"
                />
                <div className="absolute inset-0 bg-black/50 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <Button
                    size="sm"
                    className="bg-gold text-black rounded-full w-12 h-12 hover:scale-110 transition-transform"
                  >
                    <Play className="w-4 h-4 ml-0.5" fill="currentColor" />
                  </Button>
                </div>
              </div>
              <div className="text-center">
                <h3 className={`text-lg font-bold mb-1 ${
                  index % 4 === 0 ? 'text-gold' :
                  index % 4 === 1 ? 'text-orange' :
                  index % 4 === 2 ? 'text-red' :
                  'text-purple'
                }`}>
                  {album.title}
                </h3>
                <p className="text-muted-foreground text-sm">{album.artist}</p>
                <p className="text-xs text-muted-foreground mt-1">{album.releaseYear}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
