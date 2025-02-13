"use client";

import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Artist,
  Track,
  Album,
  searchArtists,
  searchTracks,
  searchAlbums,
} from "@/lib/lastfm";
import { Search } from "lucide-react";
import { useDebounce } from "@/hooks/use-debounce";

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}
  
export function SearchModal({ isOpen, onClose }: SearchModalProps) {
  const [query, setQuery] = useState("");
  const [artists, setArtists] = useState<Artist[]>([]);
  const [tracks, setTracks] = useState<Track[]>([]);
  const [albums, setAlbums] = useState<Album[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const debouncedQuery = useDebounce(query, 500);

  const handleClose = () => {
    setQuery("");
    onClose();
  };

  const handleSearch = async (searchQuery: string) => {
    if (!searchQuery) {
      setArtists([]);
      setTracks([]);
      setAlbums([]);
      return;
    }

    setIsLoading(true);
    try {
      const [artistResults, trackResults, albumResults] = await Promise.all([
        searchArtists(searchQuery),
        searchTracks(searchQuery),
        searchAlbums(searchQuery),
      ]);
      setArtists(artistResults);
      setTracks(trackResults);
      setAlbums(albumResults);
    } catch (error) {
      console.error("Search error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Effect to handle debounced search
  useEffect(() => {
    handleSearch(debouncedQuery);
  }, [debouncedQuery]);

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent
        className="max-w-2xl max-h-[90vh] overflow-y-auto"
        aria-describedby={undefined}
      >
        <DialogHeader>
          <DialogTitle>Search Music</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search for artists, tracks, or albums..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <Tabs defaultValue="artists">
            <TabsList>
              <TabsTrigger value="artists">Artists</TabsTrigger>
              <TabsTrigger value="tracks">Tracks</TabsTrigger>
              <TabsTrigger value="albums">Albums</TabsTrigger>
            </TabsList>
            <TabsContent value="artists">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Artist</TableHead>
                    <TableHead>Listeners</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {isLoading ? (
                    <TableRow>
                      <TableCell colSpan={2} className="text-center">
                        Loading...
                      </TableCell>
                    </TableRow>
                  ) : artists.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={2} className="text-center">
                        No results found
                      </TableCell>
                    </TableRow>
                  ) : (
                    artists.map((artist) => (
                      <TableRow key={artist.name}>
                        <TableCell className="font-medium">
                          {artist.name}
                        </TableCell>
                        <TableCell>{artist.listeners}</TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </TabsContent>
            <TabsContent value="tracks">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Track</TableHead>
                    <TableHead>Artist</TableHead>
                    <TableHead>Listeners</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {isLoading ? (
                    <TableRow>
                      <TableCell colSpan={3} className="text-center">
                        Loading...
                      </TableCell>
                    </TableRow>
                  ) : tracks.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={3} className="text-center">
                        No results found
                      </TableCell>
                    </TableRow>
                  ) : (
                    tracks.map((track, index) => (
                      <TableRow
                        key={`${track.mbid ?? track.name}-${
                          track.artist.name
                        }-${index}`}
                      >
                        <TableCell className="font-medium">
                          {track.name}
                        </TableCell>
                        <TableCell>{track.artist.name}</TableCell>
                        <TableCell>{track.listeners}</TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </TabsContent>
            <TabsContent value="albums">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Album</TableHead>
                    <TableHead>Artist</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {isLoading ? (
                    <TableRow>
                      <TableCell colSpan={2} className="text-center">
                        Loading...
                      </TableCell>
                    </TableRow>
                  ) : albums.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={2} className="text-center">
                        No results found
                      </TableCell>
                    </TableRow>
                  ) : (
                    albums.map((album) => (
                      <TableRow key={`${album.artist}-${album.name}`}>
                        <TableCell className="font-medium">
                          {album.name}
                        </TableCell>
                        <TableCell>
                          {typeof album.artist === "string"
                            ? album.artist
                            : album.artist.name}
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </TabsContent>
          </Tabs>
        </div>
      </DialogContent>
    </Dialog>
  );
}
