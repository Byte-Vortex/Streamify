import React from "react";
import { Card,CardHeader,CardTitle,CardContent } from "@/components/ui/card";
import { Table,TableBody,TableCell,TableHeader,TableRow,TableHead } from "@/components/ui/table";

const UserEngagement = () => {
  return (
    <Card className="h-[350px]">
    <CardHeader>
      <CardTitle>User Engagement Summary</CardTitle>
    </CardHeader>
    <CardContent>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Metric</TableHead>
            <TableHead>Last Month</TableHead>
            <TableHead>This Month</TableHead>
            <TableHead>Change</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow>
            <TableCell className="font-medium">
              Avg. Daily Active Users
            </TableCell>
            <TableCell>789,123</TableCell>
            <TableCell>823,456</TableCell>
            <TableCell className="text-green-600">+4.35%</TableCell>
          </TableRow>
          <TableRow>
            <TableCell className="font-medium">
              Avg. Session Duration
            </TableCell>
            <TableCell>45 mins</TableCell>
            <TableCell>48 mins</TableCell>
            <TableCell className="text-green-600">+6.67%</TableCell>
          </TableRow>
          <TableRow>
            <TableCell className="font-medium">
              Songs per Session
            </TableCell>
            <TableCell>12</TableCell>
            <TableCell>14</TableCell>
            <TableCell className="text-green-600">
              +16.67%
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell className="font-medium">
              Premium Conversion
            </TableCell>
            <TableCell>15.2%</TableCell>
            <TableCell>16.8%</TableCell>
            <TableCell className="text-green-600">+1.6%</TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </CardContent>
  </Card>
  )
}

export default UserEngagement