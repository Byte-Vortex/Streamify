"use client";
import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
  Music2,
  TrendingUp,
  Globe,
  Tag,
  LoaderCircle,
  Search,
} from "lucide-react";
import {
  Artist,
  Track,
  Tag as MusicTag,
  getTopArtists,
  getTopTracks,
  getTopTags,
  getGeoTopArtists,
  getGeoTopTracks,
} from "@/lib/lastfm";
import { ArtistModal } from "@/components/ArtistModal";
import { TrackModal } from "@/components/TrackModal";
import UserEngagement from "@/components/sections/UserEngagement";
import RevenueReport from "@/components/sections/RevenueReport";
import HeroSection from "@/components/sections/HeroSection";
import OverviewContent from "@/components/sections/OverviewContent";
import AnalyticsTabContent from "@/components/sections/AnalyticsTabContent";
import { TagModal } from "@/components/TagModal";
import { SearchModal } from "@/components/SearchModal";
import { Button } from "@/components/ui/button";

interface GeoTrack {
  country: string;
  track: Track[];
}

export default function Dashboard() {
  const [topArtists, setTopArtists] = useState<Artist[]>([]);
  const [topTracks, setTopTracks] = useState<Track[]>([]);
  const [topTags, setTopTags] = useState<MusicTag[]>([]);
  const [selectedTrack, setSelectedTrack] = useState<Track | null>(null);
  const [selectedArtist, setSelectedArtist] = useState<Artist | null>(null);
  const [selectedTag, setSelectedTag] = useState<MusicTag | null>(null); // Changed Tag to MusicTag
  const [geoArtists, setGeoArtists] = useState<
    { country: string; artists: Artist[] }[]
  >([]);
  const [geoTracks, setGeoTracks] = useState<GeoTrack[]>([]);
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [artists, tracks, tags] = await Promise.all([
          getTopArtists(),
          getTopTracks(),
          getTopTags(),
        ]);
        setTopArtists(artists);
        setTopTracks(tracks);
        setTopTags(tags);

        const countries = [
          "United States",
          "United Kingdom",
          "Germany",
          "France",
          "Canada",
        ];
        const geoData = await Promise.all(
          countries.map(async (country) => ({
            country,
            artists: await getGeoTopArtists(country),
          }))
        );
        setGeoArtists(
          geoData.map((data) => ({
            country: data.country,
            artists: data.artists.map((artist) => ({
              ...artist,
              playcount: artist.listeners,
            })),
          }))
        );
        const geoTrackData = await Promise.all(
          countries.map(async (country) => ({
            country,
            tracks: await getGeoTopTracks(country),
          }))
        );
        setGeoTracks(
          geoTrackData.map((data) => ({
            country: data.country,
            track: data.tracks.map((track) => ({
              ...track,
              playcount: track.listeners,
              url: track.artist.url,
            })),
          }))
        );
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
  }, []);

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="space-y-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold tracking-tight">
              Streamify
            </h1>
            <p className="text-muted-foreground">
              Your music streaming analytics at a glance
            </p>
          </div>
          <Button
            onClick={() => setIsSearchOpen(true)}
            className="flex items-center gap-2"
          >
            <Search className="h-4 w-4" />
            Search Music
          </Button>
        </div>
        <HeroSection />
        <Tabs defaultValue="overview" className="space-y-4">
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
            <TabsTrigger value="discovery">Music Discovery</TabsTrigger>
            <TabsTrigger value="reports">Reports</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-10">
            <OverviewContent />

            <div className="grid gap-4 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Music2 className="h-5 w-5" />
                    Top Artists
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Artist</TableHead>
                        <TableHead>Listeners</TableHead>
                        <TableHead>Playcount</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {topArtists.map((artist) => (
                        <TableRow
                          key={artist.name}
                          className="cursor-pointer hover:bg-muted/50"
                          onClick={() => setSelectedArtist(artist)}
                        >
                          <TableCell className="font-medium">
                            {artist.name}
                          </TableCell>
                          <TableCell>{artist.listeners}</TableCell>
                          <TableCell>{artist.playcount}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="h-5 w-5" />
                    Top Tracks
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Track</TableHead>
                        <TableHead>Artist</TableHead>
                        <TableHead>Listeners</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {topTracks.map((track) => (
                        <TableRow
                          key={track.name}
                          className="cursor-pointer hover:bg-muted/50"
                          onClick={() => setSelectedTrack(track)}
                        >
                          <TableCell className="font-medium">
                            {track.name}
                          </TableCell>
                          <TableCell>{track.artist.name}</TableCell>
                          <TableCell>{track.listeners}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Analytics Tab */}
          <TabsContent value="analytics">
            <AnalyticsTabContent />
          </TabsContent>

          {/* Music Discovery Tab */}
          <TabsContent value="discovery" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Tag className="h-5 w-5" />
                    Popular Music Tags
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {topTags.map((tag) => (
                      <span
                        key={tag.name}
                        className="capitalize cursor-pointer inline-flex items-center rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-medium text-primary transition-colors hover:bg-primary/20"
                        onClick={() => setSelectedTag(tag)}
                      >
                        {tag.name}
                        <span className="ml-1 text-primary/60">
                          ({tag.reach})
                        </span>
                      </span>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Globe className="h-5 w-5" />
                    Regional Favorites
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <Tabs defaultValue="artists" className="space-y-4">
                    <TabsList>
                      <TabsTrigger value="artists">Top Artists</TabsTrigger>
                      <TabsTrigger value="tracks">Top Tracks</TabsTrigger>
                    </TabsList>

                    {/* Top Artists Tab */}
                    <TabsContent value="artists" className="space-y-4">
                      <Card>
                        <CardContent>
                          <Table>
                            <TableHeader>
                              <TableRow>
                                <TableHead>Country</TableHead>
                                <TableHead>Top Artist</TableHead>
                                <TableHead>Listeners</TableHead>
                              </TableRow>
                            </TableHeader>
                            <TableBody>
                              {geoArtists.map((geo) => (
                                <TableRow
                                  key={geo.country}
                                  className="cursor-pointer hover:bg-muted/50"
                                  onClick={() =>
                                    setSelectedArtist(geo.artists[0] ?? null)
                                  }
                                >
                                  <TableCell className="font-medium">
                                    {geo.country}
                                  </TableCell>
                                  <TableCell>
                                    {geo.artists[0]?.name || (
                                      <>
                                        <LoaderCircle className="animate-spin"></LoaderCircle>
                                      </>
                                    )}
                                  </TableCell>
                                  <TableCell>
                                    {geo.artists[0]?.listeners || "N/A"}
                                  </TableCell>
                                </TableRow>
                              ))}
                            </TableBody>
                          </Table>
                        </CardContent>
                      </Card>
                    </TabsContent>
                    {/* Top Tracks Tab */}
                    <TabsContent value="tracks" className="space-y-4">
                      <Card>
                        <CardContent>
                          <Table>
                            <TableHeader>
                              <TableRow>
                                <TableHead>Country</TableHead>
                                <TableHead>Top Track</TableHead>
                                <TableHead>Artist</TableHead>
                                <TableHead>Listeners</TableHead>
                              </TableRow>
                            </TableHeader>
                            <TableBody>
                              {geoTracks.map((geo) => (
                                <TableRow
                                  key={geo.country}
                                  className="cursor-pointer hover:bg-muted/50"
                                  onClick={() =>
                                    setSelectedTrack(geo.track[0] ?? null)
                                  }
                                >
                                  <TableCell className="font-medium">
                                    {geo.country}
                                  </TableCell>
                                  <TableCell>
                                    {geo.track[0]?.name || (
                                      <>
                                        <LoaderCircle className="animate-spin"></LoaderCircle>
                                      </>
                                    )}
                                  </TableCell>
                                  <TableCell>
                                    {geo.track[0]?.artist.name}
                                  </TableCell>
                                  <TableCell>
                                    {geo.track[0]?.listeners || "N/A"}
                                  </TableCell>
                                </TableRow>
                              ))}
                            </TableBody>
                          </Table>
                        </CardContent>
                      </Card>
                    </TabsContent>
                  </Tabs>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Reports Tab */}
          <TabsContent value="reports" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <RevenueReport />
              <UserEngagement />
            </div>
          </TabsContent>
        </Tabs>
      </div>

      {selectedArtist && (
        <ArtistModal
          artist={selectedArtist}
          isOpen={!!selectedArtist}
          onClose={() => setSelectedArtist(null)}
        />
      )}
      {selectedTrack && (
        <TrackModal
          track={selectedTrack}
          isOpen={!!selectedTrack}
          onClose={() => setSelectedTrack(null)}
        />
      )}
      {selectedTag && (
        <TagModal
          tag={selectedTag}
          isOpen={!!selectedTag}
          onClose={() => setSelectedTag(null)}
        />
      )}
      <SearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
      />
    </div>
  );
}
