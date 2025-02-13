import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  AreaChart,
  Area,
} from "recharts";
import { Users, Clock, Globe } from "lucide-react";
import { dailyListeningData } from "@/lib/data";
import { retentionData } from "@/lib/data";
import { geographicData } from "@/lib/data";

const AnalyticsTabContent = () => {
  return (
    <div className="space-y-10">
      <div className="grid gap-5 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5" />
              Daily Listening Patterns
            </CardTitle>
          </CardHeader>
          <CardContent className="h-[400px] text-xs py-4">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={dailyListeningData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="hour" />
                <YAxis />
                <Tooltip />
                <Area
                  type="monotone"
                  dataKey="listeners"
                  stroke="#0d010a"
                  fill="#6f666d"
                  fillOpacity={0.3}
                />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Globe className="h-5 w-5" />
              Geographic Distribution
            </CardTitle>
          </CardHeader>
          <CardContent className="h-[400px] text-xs py-4">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={geographicData} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis type="number" />
                <YAxis dataKey="country" type="category" />
                <Tooltip />
                <Bar dataKey="listeners" fill="#313031" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            User Retention
          </CardTitle>
        </CardHeader>
        <CardContent className="h-[400px] text-sm py-5">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={retentionData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Line
                type="monotone"
                dataKey="Retention Rate"
                stroke="#0d010a"
                strokeWidth={2}
              />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
};

export default AnalyticsTabContent;
