'use client';

import { useEffect, useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Artist, Album, Track, getSimilarArtists, getArtistTopAlbums, getArtistTopTracks } from '@/lib/lastfm';
import { LoaderCircle } from 'lucide-react';
import Link from 'next/link';

interface ArtistModalProps {
  artist: Artist;
  isOpen: boolean;
  onClose: () => void;
}

export function ArtistModal({ artist, isOpen, onClose }: ArtistModalProps) {
  const [selectedArtist, setSelectedArtist] = useState<Artist | null>(null);
  const [similarArtists, setSimilarArtists] = useState<Artist[]>([]);
  const [similarArtistsTopTracks, setSimilarArtistsTopTracks] = useState<Record<string, string>>({});
  const [topAlbums, setTopAlbums] = useState<Album[]>([]);
  const [topTracks, setTopTracks] = useState<Track[]>([]);

  useEffect(() => {
    if (isOpen && artist) {
      const fetchData = async () => {
        try {
          const [similar, albums, tracks] = await Promise.all([
            getSimilarArtists(artist.name),
            getArtistTopAlbums(artist.name),
            getArtistTopTracks(artist.name),
          ]);
          setSimilarArtists(similar);
          setTopAlbums(albums);
          setTopTracks(tracks);

          // Fetch top track for each similar artist
          const topTracksMap: Record<string, string> = {};
          await Promise.all(
            similar.map(async (simArtist) => {
              const simArtistTracks = await getArtistTopTracks(simArtist.name);
              if (simArtistTracks.length > 0) {
                topTracksMap[simArtist.name] = simArtistTracks[0].name; // Get the first (top) track
              } else {
                topTracksMap[simArtist.name] = 'N/A'; // If no tracks are available
              }
            })
          );
          setSimilarArtistsTopTracks(topTracksMap);
        } catch (error) {
          console.error('Error fetching artist data:', error);
        }
      };
      fetchData();
    }
  }, [isOpen, artist]);

  return (
    <>
     
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto" aria-describedby={undefined}>
        <DialogHeader>
          <DialogTitle className='pt-5 pl-5'>
            <Link href={artist.url} className="text-2xl text-pink-600" target='blank'>{artist.name} </Link>
            {artist.listeners && artist.playcount != '0' ? <div className='text-sm flex justify-between w-72 pt-4'><p>Listeners : <span className='text-xs text-gray-600'>{artist.listeners}</span></p>
            <p>Playcounts : <span className='text-gray-600 text-xs'>{artist.playcount}</span></p></div> : ""}
          </DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
        <Card>
            <CardHeader>
              <CardTitle>Top Tracks</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Track</TableHead>
                    <TableHead>Listeners</TableHead>
                    <TableHead>Playcount</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {topTracks.map((track) => (
                    <TableRow key={track.name}>
                      <TableCell className="font-medium">{track.name}</TableCell>
                      <TableCell>{track.listeners}</TableCell>
                      <TableCell>{track.playcount}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
          <div className="grid gap-4 md:grid-cols-2">
          <Card>
              <CardHeader>
                <CardTitle>Top Albums</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Album</TableHead>
                      <TableHead>Playcount</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {topAlbums.map((album) => (
                      <TableRow key={album.name}>
                        <TableCell className="font-medium">{album.name}</TableCell>
                        <TableCell>{album.playcount}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Similar Artists</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Artist</TableHead>
                      <TableHead>Top Track</TableHead> 
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {similarArtists.map((similar) => (
                      <TableRow key={similar.name} onClick={() => setSelectedArtist(similar)}>
                        <TableCell className="font-medium">{similar.name}</TableCell>
                        <TableCell>{similarArtistsTopTracks[similar.name] || <><LoaderCircle className='animate-spin'></LoaderCircle></>}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </div>
        </div>
      </DialogContent>
    </Dialog>
    {selectedArtist && (
        <ArtistModal
          artist={selectedArtist}
          isOpen={!!selectedArtist}
          onClose={() => setSelectedArtist(null)}
        />
      )}</>
  );
}
