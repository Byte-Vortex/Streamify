import { z } from "zod";

const API_KEY = process.env.NEXT_PUBLIC_LAST_FM_API_KEY!;
const BASE_URL = process.env.NEXT_PUBLIC_LAST_FM_BASE_URL!;

const artistSchema = z.object({
  name: z.string(),
  playcount: z.string().optional().default("0"),
  listeners: z.string().optional().default("0"),
  mbid: z.string().optional(),
  url: z.string(),
  streamable: z.string().optional().default("0"),
});

const trackSchema = z.object({
  name: z.string(),
  duration: z.union([z.string(), z.number()]).optional(),
  playcount: z.union([z.string(), z.number()]).default("0"),
  listeners: z.union([z.string(), z.number()]).optional().default("0"),
  mbid: z.string().optional(),
  url: z.string(),
  streamable: z
    .union([
      z.string(),
      z.object({
        "#text": z.string(),
        fulltrack: z.string(),
      }),
    ])
    .optional(),
  artist: 
    z.object({
      name: z.string(),
      mbid: z.string().optional(),
      url: z.string().optional(),
    }),
});

const tagSchema = z.object({
  name: z.string(),
  total: z.number().optional(),
  reach: z.preprocess((val) => Number(val), z.number()),
  wiki: z.object({
    summary: z.string().optional().default("No summary available"),
    content: z.string().optional().default("No content available"),
  }),
});

const albumSchema = z.object({
  name: z.string(),
  artist: z.union([z.string(), z.object({ name: z.string() })]),
  url: z.string(),
  playcount: z.number().optional(),
});

const geoTopArtistSchema = z.object({
  name: z.string(),
  listeners: z.string(),
  url: z.string(),
  streamable: z.string(),
});

const geoTopTrackSchema = z.object({
  name: z.string(),
  listeners: z.string(),
  artist: z.object({
    name: z.string(),
    mbid: z.string().optional(),
    url: z.string(),
  }),
});

export type Artist = z.infer<typeof artistSchema>;
export type Track = z.infer<typeof trackSchema>;
export type Tag = z.infer<typeof tagSchema>;
export type Album = z.infer<typeof albumSchema>;
export type GeoTopArtist = z.infer<typeof geoTopArtistSchema>;

async function fetchLastFM(
  method: string,
  params: Record<string, string> = {}
) {
  const searchParams = new URLSearchParams({
    method,
    api_key: API_KEY,
    format: "json",
    ...params,
  });
  const response = await fetch(`${BASE_URL}?${searchParams.toString()}`);
  if (!response.ok) {
    throw new Error(`Last.fm API error: ${response.statusText}`);
  }
  return response.json();
}

export async function getTopArtists() {
  const data = await fetchLastFM("chart.gettopartists", { limit: "5" });
  return z.array(artistSchema).parse(data.artists.artist);
}

export async function getTopTracks() {
  const data = await fetchLastFM("chart.gettoptracks", { limit: "5" });
  return z.array(trackSchema).parse(data.tracks.track);
}

export async function getArtistInfo(artist: string) {
  const data = await fetchLastFM("artist.getInfo", { artist });
  return artistSchema.parse(data.artist);
}

export async function getSimilarArtists(artist: string) {
  const data = await fetchLastFM("artist.getSimilar", { artist, limit: "5" });
  return z.array(artistSchema).parse(data.similarartists.artist);
}

export async function getTagInfo(tag: string) {
  const data = await fetchLastFM("tag.getinfo", { tag });
  const parsedData = tagSchema.parse(data.tag);
  return parsedData;
}

export async function getTopTags() {
  const data = await fetchLastFM("chart.getTopTags");
  const formattedTags = data.tags.tag.map((tag: any) => ({
    ...tag,
    count: tag.count ? Number(tag.count) : undefined,
    reach: tag.reach,
  }));
  return z.array(tagSchema).parse(formattedTags);
}

export async function getArtistTopAlbums(artist: string) {
  const data = await fetchLastFM("artist.getTopAlbums", { artist, limit: "5" });
  return z.array(albumSchema).parse(data.topalbums.album);
}

export async function getArtistTopTracks(artist: string) {
  const data = await fetchLastFM("artist.getTopTracks", { artist, limit: "5" });
  return z.array(trackSchema).parse(data.toptracks.track);
}

export async function getGeoTopArtists(country: string) {
  const data = await fetchLastFM("geo.getTopArtists", { country, limit: "5" });
  return z.array(geoTopArtistSchema).parse(data.topartists.artist);
}

export async function getGeoTopTracks(country: string) {
  const data = await fetchLastFM("geo.getTopTracks", { country, limit: "5" });
  return z.array(geoTopTrackSchema).parse(data.tracks.track);
}

export async function getTrackInfo(track: string, artist: string) {
  const data = await fetchLastFM("track.getInfo", { track, artist });
  return trackSchema.parse(data.track);
}

export async function getSimilarTracks(track: string, artist: string) {
  const data = await fetchLastFM("track.getSimilar", {
    track,
    artist,
    limit: "5",
  });
  const parsedTracks = data.similartracks.track.map((track: any) => ({
    ...track,
    playcount: String(track.playcount),
    listeners: track.listeners ? String(track.listeners) : "0",
  }));

  return z.array(trackSchema).parse(parsedTracks);
}

export async function searchArtists(query: string) {
  const data = await fetchLastFM('artist.search', { artist: query, limit: '5' });
  return z.array(artistSchema).parse(data.results.artistmatches.artist);
}

export async function searchTracks(query: string) {
  const data = await fetchLastFM('track.search', { track: query, limit: '5' });

  // Transform data before parsing
  const parsedTracks = data.results.trackmatches.track.map((track: any) => ({
    ...track,
    playcount: track.playcount ?? "0", // Default playcount if missing
    artist: typeof track.artist === "string" ? { name: track.artist } : track.artist,
  }));

  return z.array(trackSchema).parse(parsedTracks);
}


export async function searchAlbums(query: string) {
  const data = await fetchLastFM('album.search', { album: query, limit: '5' });

  const parsedAlbums = data.results.albummatches.album.map((album: any) => ({
    ...album,
    artist: typeof album.artist === "string" ? { name: album.artist } : album.artist,
    playcount: album.playcount ?? 0, // Default to 0 if missing
  }));

  return z.array(albumSchema).parse(parsedAlbums);
}
