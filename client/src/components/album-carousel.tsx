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
    <section className="py-20 relative">
      <div className="container mx-auto px-4">
        <h2 className="text-4xl md:text-5xl font-black text-center mb-16 neon-text text-neon-blue">
          TRENDING ALBUMS
        </h2>
        
        <div className="relative overflow-hidden">
          <div className="flex space-x-8 overflow-x-auto scrollbar-hide py-8" style={{ scrollSnapType: 'x mandatory' }}>
            {albums?.map((album, index) => (
              <div 
                key={album.id} 
                className="flex-shrink-0 group cursor-pointer" 
                style={{ scrollSnapAlign: 'center' }}
              >
                <div className="relative album-3d">
                  <img
                    src={album.coverUrl}
                    alt={album.title}
                    className="w-72 h-72 rounded-2xl shadow-2xl group-hover:scale-105 transition-all duration-500 animate-float"
                    style={{
                      boxShadow: `0 15px 35px ${
                        index % 4 === 0 ? 'rgba(139, 92, 246, 0.4)' :
                        index % 4 === 1 ? 'rgba(236, 72, 153, 0.4)' :
                        index % 4 === 2 ? 'rgba(59, 130, 246, 0.4)' :
                        'rgba(16, 185, 129, 0.4)'
                      }`,
                      animationDelay: `${index * 0.5}s`,
                    }}
                  />
                  <div className="absolute inset-0 glassmorphic rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                    <Button
                      onClick={() => onAlbumSelect(album)}
                      className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm hover:bg-white/30 border-0"
                    >
                      <Play className="text-2xl text-neon-green ml-1 w-6 h-6" fill="currentColor" />
                    </Button>
                  </div>
                </div>
                <div className="mt-6 text-center">
                  <h3 className={`text-xl font-bold ${
                    index % 4 === 0 ? 'text-neon-purple' :
                    index % 4 === 1 ? 'text-neon-pink' :
                    index % 4 === 2 ? 'text-neon-blue' :
                    'text-neon-green'
                  }`}>
                    {album.title}
                  </h3>
                  <p className="text-gray-400">{album.artist}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
