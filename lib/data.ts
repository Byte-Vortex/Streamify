import { Track } from "./lastfm";
export interface GeoTrack {
    country: string;
    track: Track[];
  }
export const revenueData = [
    { name: "Subscriptions", value: 75000 },
    { name: "Advertisements", value: 25000 },
    { name: "Merchandise", value: 5000 },
  ];
  
export const userGrowthData = Array.from({ length: 12 }, (_, i) => ({
    month: new Date(2024, i, 1).toLocaleString("default", { month: "short" }),
    "Total Users": Math.floor(Math.random() * 500000) + 1000000,
    "Active Users": Math.floor(Math.random() * 300000) + 500000,
  }));
  
export  const dailyListeningData = Array.from({ length: 24 }, (_, i) => ({
    hour: `${i}:00`,
    listeners: Math.floor(Math.random() * 50000) + 10000,
  }));
  
export  const geographicData = [
    { country: "United States", listeners: 1200000 },
    { country: "United Kingdom", listeners: 800000 },
    { country: "Germany", listeners: 600000 },
    { country: "France", listeners: 450000 },
    { country: "Canada", listeners: 400000 },
  ];
  
export const retentionData = Array.from({ length: 12 }, (_, i) => ({
    month: new Date(2024, i, 1).toLocaleString("default", { month: "short" }),
    "Retention Rate": Math.floor(Math.random() * 20) + 70,
  }));
  
export  const COLORS = ["#313031", "#515050", "#5e4d59", "#96CEB4", "#FFEEAD"];