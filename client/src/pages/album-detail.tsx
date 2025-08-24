import { useState } from "react";
import { useParams } from "wouter";
import Navigation from "@/components/navigation";
import Footer from "@/components/footer";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { CalendarDays, Camera, ChevronLeft, ChevronRight, X, Play, Pause } from "lucide-react";
import type { PhotoAlbum, Photo } from "@shared/schema";

interface PhotoLightboxProps {
  photos: Photo[];
  currentIndex: number;
  isOpen: boolean;
  onClose: () => void;
  onNext: () => void;
  onPrevious: () => void;
}

function PhotoLightbox({ photos, currentIndex, isOpen, onClose, onNext, onPrevious }: PhotoLightboxProps) {
  const [isSlideshow, setIsSlideshow] = useState(false);
  const [slideshowInterval, setSlideshowInterval] = useState<NodeJS.Timeout | null>(null);

  const startSlideshow = () => {
    setIsSlideshow(true);
    const interval = setInterval(() => {
      onNext();
    }, 3000); // 3 seconds per photo
    setSlideshowInterval(interval);
  };

  const stopSlideshow = () => {
    setIsSlideshow(false);
    if (slideshowInterval) {
      clearInterval(slideshowInterval);
      setSlideshowInterval(null);
    }
  };

  const handleClose = () => {
    stopSlideshow();
    onClose();
  };

  if (!isOpen || !photos.length) return null;

  const currentPhoto = photos[currentIndex];

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-7xl h-[90vh] p-0 bg-black border-none" data-testid="photo-lightbox">
        <div className="relative w-full h-full flex items-center justify-center">
          {/* Close Button */}
          <Button
            variant="ghost"
            size="sm"
            onClick={handleClose}
            className="absolute top-4 right-4 z-10 text-white hover:bg-gray-800"
            data-testid="button-close-lightbox"
          >
            <X className="h-6 w-6" />
          </Button>

          {/* Navigation Controls */}
          <Button
            variant="ghost"
            size="sm"
            onClick={onPrevious}
            className="absolute left-4 top-1/2 transform -translate-y-1/2 z-10 text-white hover:bg-gray-800"
            disabled={photos.length <= 1}
            data-testid="button-previous-photo"
          >
            <ChevronLeft className="h-8 w-8" />
          </Button>

          <Button
            variant="ghost"
            size="sm"
            onClick={onNext}
            className="absolute right-4 top-1/2 transform -translate-y-1/2 z-10 text-white hover:bg-gray-800"
            disabled={photos.length <= 1}
            data-testid="button-next-photo"
          >
            <ChevronRight className="h-8 w-8" />
          </Button>

          {/* Slideshow Controls */}
          <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 z-10 flex items-center space-x-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={isSlideshow ? stopSlideshow : startSlideshow}
              className="text-white hover:bg-gray-800"
              disabled={photos.length <= 1}
              data-testid="button-slideshow-toggle"
            >
              {isSlideshow ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5" />}
              <span className="ml-2">{isSlideshow ? "Stop" : "Start"} Slideshow</span>
            </Button>
            <span className="text-white text-sm" data-testid="text-photo-counter">
              {currentIndex + 1} of {photos.length}
            </span>
          </div>

          {/* Main Image */}
          <img
            src={currentPhoto.imageUrl}
            alt={currentPhoto.title || "Photo"}
            className="max-w-full max-h-full object-contain"
            data-testid={`img-lightbox-${currentPhoto.id}`}
          />

          {/* Photo Info */}
          {(currentPhoto.title || currentPhoto.description) && (
            <div className="absolute bottom-16 left-4 right-4 bg-black bg-opacity-75 text-white p-4 rounded-lg" data-testid="photo-info">
              {currentPhoto.title && (
                <h3 className="text-lg font-semibold mb-2" data-testid={`text-photo-title-${currentPhoto.id}`}>
                  {currentPhoto.title}
                </h3>
              )}
              {currentPhoto.description && (
                <p className="text-sm text-gray-300" data-testid={`text-photo-description-${currentPhoto.id}`}>
                  {currentPhoto.description}
                </p>
              )}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}

function AlbumDetailSection() {
  const { albumId } = useParams<{ albumId: string }>();
  const [selectedPhotoIndex, setSelectedPhotoIndex] = useState(0);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);

  const { data: albums, isLoading: albumsLoading } = useQuery<PhotoAlbum[]>({
    queryKey: ["/api/photo-albums"],
  });

  const { data: photos, isLoading: photosLoading } = useQuery<Photo[]>({
    queryKey: ["/api/photo-albums", albumId, "photos"],
    queryFn: () => fetch(`/api/photo-albums/${albumId}/photos`).then(res => res.json()),
  });

  const album = albums?.find(a => a.id === albumId);

  const openLightbox = (index: number) => {
    setSelectedPhotoIndex(index);
    setIsLightboxOpen(true);
  };

  const nextPhoto = () => {
    if (photos && photos.length > 0) {
      setSelectedPhotoIndex((prev) => (prev + 1) % photos.length);
    }
  };

  const previousPhoto = () => {
    if (photos && photos.length > 0) {
      setSelectedPhotoIndex((prev) => (prev - 1 + photos.length) % photos.length);
    }
  };

  if (albumsLoading || photosLoading) {
    return (
      <section className="py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-700 rounded w-1/3 mb-4"></div>
            <div className="h-4 bg-gray-700 rounded w-1/2 mb-8"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="aspect-square bg-gray-700 rounded-lg"></div>
              ))}
            </div>
          </div>
        </div>
      </section>
    );
  }

  if (!album) {
    return (
      <section className="py-20 px-6">
        <div className="max-w-7xl mx-auto text-center">
          <Camera className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-3xl font-bold text-white mb-4">Album Not Found</h2>
          <p className="text-gray-400">The requested album could not be found.</p>
        </div>
      </section>
    );
  }

  return (
    <section className="py-20 px-6">
      <div className="max-w-7xl mx-auto">
        {/* Album Header */}
        <div className="mb-12">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-4xl font-bold text-white" data-testid={`text-album-title-${album.id}`}>
              {album.title}
            </h1>
            <div className="flex items-center space-x-4">
              {album.category && (
                <Badge variant="secondary" className="bg-blue-600 text-white" data-testid={`badge-album-category-${album.id}`}>
                  {album.category}
                </Badge>
              )}
              {album.dateCreated && (
                <div className="flex items-center text-gray-400" data-testid={`text-album-date-${album.id}`}>
                  <CalendarDays className="h-4 w-4 mr-2" />
                  {new Date(album.dateCreated).toLocaleDateString()}
                </div>
              )}
            </div>
          </div>
          {album.description && (
            <p className="text-xl text-gray-300 max-w-3xl" data-testid={`text-album-description-${album.id}`}>
              {album.description}
            </p>
          )}
        </div>

        {/* Photo Grid */}
        {photos && photos.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {photos.map((photo, index) => (
              <Card
                key={photo.id}
                className="bg-gray-800 border-gray-700 hover:border-blue-500 transition-all duration-300 group cursor-pointer overflow-hidden"
                onClick={() => openLightbox(index)}
                data-testid={`card-photo-${photo.id}`}
              >
                <div className="aspect-square relative overflow-hidden">
                  <img
                    src={photo.thumbnailUrl || photo.imageUrl}
                    alt={photo.title || "Photo"}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src = "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=400&fit=crop&crop=center";
                    }}
                    data-testid={`img-photo-${photo.id}`}
                  />
                  <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-300 flex items-center justify-center">
                    <div className="text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <Camera className="h-8 w-8" />
                    </div>
                  </div>
                </div>
                {(photo.title || photo.description) && (
                  <CardHeader className="p-3">
                    {photo.title && (
                      <CardTitle className="text-white text-sm" data-testid={`text-photo-title-${photo.id}`}>
                        {photo.title}
                      </CardTitle>
                    )}
                    {photo.description && (
                      <CardDescription className="text-gray-400 text-xs line-clamp-2" data-testid={`text-photo-desc-${photo.id}`}>
                        {photo.description}
                      </CardDescription>
                    )}
                  </CardHeader>
                )}
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <Camera className="h-16 w-16 text-gray-500 mx-auto mb-4" />
            <h3 className="text-2xl font-semibold text-white mb-2">No Photos Found</h3>
            <p className="text-gray-400 max-w-md mx-auto">
              This album doesn't contain any photos yet. Photos will appear here once they are added to the Google Spreadsheet.
            </p>
          </div>
        )}

        {/* Lightbox */}
        {photos && (
          <PhotoLightbox
            photos={photos}
            currentIndex={selectedPhotoIndex}
            isOpen={isLightboxOpen}
            onClose={() => setIsLightboxOpen(false)}
            onNext={nextPhoto}
            onPrevious={previousPhoto}
          />
        )}
      </div>
    </section>
  );
}

export default function AlbumDetail() {
  return (
    <div className="min-h-screen bg-portfolio-background">
      <Navigation />
      <main className="pt-8">
        <AlbumDetailSection />
      </main>
      <Footer />
    </div>
  );
}