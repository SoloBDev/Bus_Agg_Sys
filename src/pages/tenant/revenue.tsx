"use client"
import { useEffect, useState } from 'react';
import axios from 'axios';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface RevenueData {
  success: boolean;
  tenantId: string;
  totalRevenue: number;
  totalBookings: number;
  totalSeats: number;
  avgRevenuePerBooking: number;
  revenueByDay: { _id: string; revenue: number }[];
  mostPopularRoute: {
    _id: string;
    routeName: string;
    from: string;
    to: string;
    price: number;
  } | null;
  cancelledBookings: number;
  refundedBookings: number;
}

export default function RevenueDashboard({ tenantId }: { tenantId: string }) {
  const [data, setData] = useState<RevenueData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchRevenueData = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`https://n7gjzkm4-3002.euw.devtunnels.ms/api/revenue/${tenantId}`,
            {
               headers: {
               'Content-Type': 'application/json',
               Authorization: `Bearer ${localStorage.getItem('token')}`
               }
            }
        );
        setData(response.data);
      } catch (err) {
        console.error('Error fetching revenue data:', err);
        setError('Failed to load revenue data');
        // Set default empty data if API fails
        setData({
          success: false,
          tenantId,
          totalRevenue: 0,
          totalBookings: 0,
          totalSeats: 0,
          avgRevenuePerBooking: 0,
          revenueByDay: [],
          mostPopularRoute: null,
          cancelledBookings: 0,
          refundedBookings: 0
        });
      } finally {
        setLoading(false);
      }
    };

    fetchRevenueData();
  }, [tenantId]);

  if (loading) {
    return <div className="flex justify-center items-center h-64">Loading revenue data...</div>;
  }

  if (error) {
    return <div className="text-red-500 text-center p-4">{error}</div>;
  }

  if (!data) {
    return null;
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Revenue Dashboard</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <span className="text-muted-foreground">ETB</span>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data.totalRevenue.toLocaleString()}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Bookings</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data.totalBookings}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Seats</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data.totalSeats}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Revenue/Booking</CardTitle>
            <span className="text-muted-foreground">ETB</span>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data.avgRevenuePerBooking.toFixed(2)}</div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Revenue by Day</CardTitle>
          </CardHeader>
          <CardContent className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={data.revenueByDay.length > 0 ? data.revenueByDay : [{ _id: 'No data', revenue: 0 }]}
                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="_id" />
                <YAxis />
                <Tooltip formatter={(value) => [`ETB ${value}`, 'Revenue']} />
                <Bar dataKey="revenue" fill="#8884d8" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Popular Route</CardTitle>
            </CardHeader>
            <CardContent>
              {data.mostPopularRoute ? (
                <div>
                  <p className="font-medium">{data.mostPopularRoute.routeName}</p>
                  <p>{data.mostPopularRoute.from} to {data.mostPopularRoute.to}</p>
                  <p className="text-muted-foreground">Price: ETB {data.mostPopularRoute.price}</p>
                </div>
              ) : (
                <p>No popular route data</p>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Cancellations & Refunds</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>Cancelled Bookings:</span>
                  <span>{data.cancelledBookings}</span>
                </div>
                <div className="flex justify-between">
                  <span>Refunded Bookings:</span>
                  <span>{data.refundedBookings}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}