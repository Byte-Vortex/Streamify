"use client";

import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
  Album,
  Track,
  getSimilarArtists,
  getArtistTopAlbums,
  getArtistTopTracks,
  getTrackInfo,
  getSimilarTracks,
} from "@/lib/lastfm";
import Link from "next/link";
import { LoaderCircle } from "lucide-react";
import { ArtistModal } from "./ArtistModal";

interface TrackModalProps {
  track: Track;
  isOpen: boolean;
  onClose: () => void;
}

interface ArtistModalProps {
  artist: Artist;
  isOpen: boolean;
  onClose: () => void;
}

export function TrackModal({ track, isOpen, onClose}: TrackModalProps) {
  const [selectedArtist, setSelectedArtist] = useState<Artist | null>(null);
  const [similarTracks, setSimilarTracks] = useState<Track[]>([]);
  const [similarArtists, setSimilarArtists] = useState<Artist[]>([]);
  const [similarArtistsTopTracks, setSimilarArtistsTopTracks] = useState<
    Record<string, string>
  >({});

  useEffect(() => {
    if (isOpen && track) {
      const fetchData = async () => {
        try {
          const [similarTracksData, similarArtists] = await Promise.all([
            getSimilarTracks(track.name, track.artist.name),
            getSimilarArtists(track.artist.name),
          ]);
          setSimilarTracks(similarTracksData);
          setSimilarArtists(similarArtists); // Fixed the variable name

          const topTracksMap: Record<string, string> = {};
          await Promise.all(
            similarArtists.map(async (simArtist) => {
              const simArtistTracks = await getArtistTopTracks(simArtist.name);
              topTracksMap[simArtist.name] =
                simArtistTracks.length > 0 ? simArtistTracks[0].name : "N/A";
            })
          );
          setSimilarArtistsTopTracks(topTracksMap);
        } catch (error) {
          console.error("Error fetching artist data:", error);
        }
      };
      fetchData();
    }
  }, [isOpen, track]);

  return (
    <> 
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent
        className="max-w-4xl max-h-[90vh] overflow-y-auto"
        aria-describedby={undefined}
      >
        <DialogHeader>
          <DialogTitle className="pt-5 pl-2">
            <p className="text-xl pb-2 ">{track.name}</p>
            <Link href={track.url} className="text-2xl text-violet-600" target="_blank">
              ~ {track.artist.name}
            </Link>

            {track.listeners && track.playcount !== "0" && (
              <div className="w-72 text-sm flex justify-between gap-3 pt-4">
                <p>
                  Listeners:{" "}
                  <span className="text-xs text-gray-600">
                    {track.listeners}
                  </span>
                </p>
                <p>
                  Playcount:{" "}
                  <span className="text-gray-600 text-xs">
                    {track.playcount}
                  </span>
                </p>
              </div>
            )}
          </DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Similar Tracks</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Track</TableHead>
                      <TableHead>Artist Name</TableHead>
                      <TableHead>Playcount</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {similarTracks.map((similar) => (
                      <TableRow key={similar.name}>
                        <TableCell className="font-medium">
                          {similar.name}
                        </TableCell>
                        <TableCell>{similar.artist.name}</TableCell>
                        <TableCell>{similar.playcount}</TableCell>
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
                      <TableRow key={similar.name} className="cursor-pointer" onClick={() =>
                        setSelectedArtist(similar)
                      }>
                        <TableCell className="font-medium">
                          {similar.name}
                        </TableCell>
                        <TableCell>
                          {similarArtistsTopTracks[similar.name] || (
                            <>
                              <LoaderCircle className="animate-spin"></LoaderCircle>
                            </>
                          )}
                        </TableCell>
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
