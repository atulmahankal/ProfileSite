import Navigation from "@/components/navigation";
import Footer from "@/components/footer";
import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CalendarDays, Camera, Images } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { PhotoAlbum, Photo } from "@shared/schema";

function AlbumThumbnail({ albumId, title }: { albumId: string; title: string }) {
  const { data: photos } = useQuery<Photo[]>({
    queryKey: ["/api/photo-albums", albumId, "photos"],
    queryFn: () => fetch(`/api/photo-albums/${albumId}/photos`).then(res => res.json()),
  });

  const thumbnailUrl = photos && photos.length > 0 
    ? photos[0].thumbnailUrl || photos[0].imageUrl 
    : "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop&crop=center";

  return (
    <img
      src={thumbnailUrl}
      alt={title}
      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
      onError={(e) => {
        const target = e.target as HTMLImageElement;
        target.src = "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop&crop=center";
      }}
      data-testid={`img-thumbnail-${albumId}`}
    />
  );
}

function PhotographySection() {
  const { data: albums, isLoading, error } = useQuery<PhotoAlbum[]>({
    queryKey: ["/api/photo-albums"],
  });

  if (isLoading) {
    return (
      <section className="py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <Camera className="h-12 w-12 text-blue-500 mx-auto mb-4" />
            <h2 className="text-5xl font-bold text-white mb-4">Photography</h2>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              Capturing moments and memories through the lens
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <Card key={i} className="bg-gray-800 border-gray-700 animate-pulse">
                <div className="aspect-video bg-gray-700 rounded-t-lg"></div>
                <CardHeader>
                  <div className="h-4 bg-gray-700 rounded w-3/4"></div>
                  <div className="h-3 bg-gray-700 rounded w-1/2"></div>
                </CardHeader>
              </Card>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="py-20 px-6">
        <div className="max-w-7xl mx-auto text-center">
          <Camera className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-5xl font-bold text-white mb-4">Photography</h2>
          <p className="text-xl text-red-400">Failed to load photo albums. Please try again later.</p>
        </div>
      </section>
    );
  }

  return (
    <section className="py-20 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <Camera className="h-12 w-12 text-blue-500 mx-auto mb-4" />
          <h2 className="text-5xl font-bold text-white mb-4">Photography</h2>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            Capturing moments and memories through the lens. Explore my photography collections.
          </p>
        </div>

        {albums && albums.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {albums.map((album) => (
              <Card key={album.id} className="bg-gray-800 border-gray-700 hover:border-blue-500 transition-all duration-300 group overflow-hidden" data-testid={`card-album-${album.id}`}>
                <div className="aspect-video bg-gray-700 relative overflow-hidden">
                  <AlbumThumbnail albumId={album.id} title={album.title} />
                  <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-300 flex items-center justify-center">
                    <div className="text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <Images className="h-12 w-12" />
                    </div>
                  </div>
                </div>
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <CardTitle className="text-white text-lg" data-testid={`text-title-${album.id}`}>{album.title}</CardTitle>
                    {album.category && (
                      <Badge variant="secondary" className="bg-blue-600 text-white" data-testid={`badge-category-${album.id}`}>
                        {album.category}
                      </Badge>
                    )}
                  </div>
                  {album.description && (
                    <CardDescription className="text-gray-400" data-testid={`text-description-${album.id}`}>
                      {album.description}
                    </CardDescription>
                  )}
                  {album.dateCreated && (
                    <div className="flex items-center text-sm text-gray-500 mt-2" data-testid={`text-date-${album.id}`}>
                      <CalendarDays className="h-4 w-4 mr-2" />
                      {new Date(album.dateCreated).toLocaleDateString()}
                    </div>
                  )}
                </CardHeader>
                <CardContent>
                  <Button
                    asChild
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                    data-testid={`button-view-album-${album.id}`}
                  >
                    <Link href={`/photography/album/${album.id}`}>
                      <Images className="h-4 w-4 mr-2" />
                      View Photos
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <Camera className="h-16 w-16 text-gray-500 mx-auto mb-4" />
            <h3 className="text-2xl font-semibold text-white mb-2">No Albums Found</h3>
            <p className="text-gray-400 max-w-md mx-auto">
              Photography albums will appear here once they are added to the Google Spreadsheet.
            </p>
          </div>
        )}

        <div className="mt-16 bg-gray-800 rounded-lg p-8 border border-gray-700">
          <h3 className="text-2xl font-bold text-white mb-4">📋 Google Spreadsheet Setup</h3>
          <p className="text-gray-300 mb-4">
            To populate this page with your photography albums and photos, create a Google Spreadsheet with two sheets:
          </p>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-gray-900 rounded-lg p-4 border border-gray-600">
              <h4 className="text-lg font-semibold text-white mb-3">Sheet 1: "Albums"</h4>
              <div className="space-y-3 text-sm">
                <div>
                  <strong className="text-blue-400">Album Title</strong>
                  <p className="text-gray-400">Name of your photo album</p>
                </div>
                <div>
                  <strong className="text-blue-400">Album Description</strong>
                  <p className="text-gray-400">Brief description of the album content</p>
                </div>
                <div>
                  <strong className="text-blue-400">Category</strong>
                  <p className="text-gray-400">Album category (Nature, Urban, Portrait, etc.)</p>
                </div>
                <div>
                  <strong className="text-blue-400">Date Created</strong>
                  <p className="text-gray-400">Album creation date (YYYY-MM-DD format)</p>
                </div>
              </div>
            </div>

            <div className="bg-gray-900 rounded-lg p-4 border border-gray-600">
              <h4 className="text-lg font-semibold text-white mb-3">Sheet 2: "Photos"</h4>
              <div className="space-y-3 text-sm">
                <div>
                  <strong className="text-blue-400">Album ID</strong>
                  <p className="text-gray-400">Must match the album title from Albums sheet</p>
                </div>
                <div>
                  <strong className="text-blue-400">Photo Title</strong>
                  <p className="text-gray-400">Name or title of the photo (optional)</p>
                </div>
                <div>
                  <strong className="text-blue-400">Photo Description</strong>
                  <p className="text-gray-400">Description of the photo (optional)</p>
                </div>
                <div>
                  <strong className="text-blue-400">Image URL</strong>
                  <p className="text-gray-400">Direct link to the high-resolution image</p>
                </div>
                <div>
                  <strong className="text-blue-400">Thumbnail URL</strong>
                  <p className="text-gray-400">Direct link to the thumbnail image (optional)</p>
                </div>
                <div>
                  <strong className="text-blue-400">Order Index</strong>
                  <p className="text-gray-400">Number for photo ordering (0, 1, 2, etc.)</p>
                </div>
              </div>
            </div>
          </div>

          <p className="text-gray-400 mt-4 text-sm">
            💡 <strong>Tip:</strong> Update the spreadsheet URL in <code className="bg-gray-700 px-2 py-1 rounded">shared/config.ts</code> to connect your sheet.
          </p>
        </div>
      </div>
    </section>
  );
}

export default function Photography() {
  return (
    <div className="min-h-screen bg-portfolio-background">
      <Navigation />
      <main className="pt-8">
        <PhotographySection />
      </main>
      <Footer />
    </div>
  );
}