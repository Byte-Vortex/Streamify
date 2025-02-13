import React from 'react'
import { Card,CardHeader,CardTitle,CardContent } from "@/components/ui/card";
import { Table,TableBody,TableCell,TableHeader,TableRow,TableHead } from "@/components/ui/table";
import { userGrowthData } from '@/lib/data';

const RevenueReport = () => {
  return (
    <Card>
    <CardHeader>
      <CardTitle>Monthly Revenue Report</CardTitle>
    </CardHeader>
    <CardContent>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Month</TableHead>
            <TableHead>Subscriptions</TableHead>
            <TableHead>Advertisements</TableHead>
            <TableHead>Total</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {userGrowthData.map((data) => (
            <TableRow key={data.month}>
              <TableCell className="font-medium">
                {data.month}
              </TableCell>
              <TableCell>
                ${(Math.random() * 1000000 + 500000).toFixed(2)}
              </TableCell>
              <TableCell>
                ${(Math.random() * 500000 + 100000).toFixed(2)}
              </TableCell>
              <TableCell>
                ${(Math.random() * 1500000 + 600000).toFixed(2)}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </CardContent>
  </Card>
  )
}

export default RevenueReport