"use client"

import { useState } from "react"
import { Sidebar } from "../../components/sidebar"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../components/ui/tabs"
import { useAuth } from "../../context/auth-context"
import { BarChart, LineChart } from "../../components/charts"
import { AlertTriangle, Bus, Calendar, CheckCircle, Clock, MapPin, Users } from "lucide-react"
import { Button } from "../../components/ui/button"
import { Badge } from "../../components/ui/badge"

export default function OperatorDashboardPage() {
  const { user } = useAuth()
  const [activeTab, setActiveTab] = useState("today")

  return (
    <Sidebar>
      <div className="flex flex-col">
        <header className="sticky top-0 z-10 flex h-16 items-center gap-4 border-b bg-background px-6">
          <div className="flex flex-1 items-center gap-4">
            <h1 className="text-xl font-semibold">Operator Dashboard</h1>
          </div>
          <div className="flex items-center gap-4">
            <Button variant="outline" size="sm">
              <AlertTriangle className="mr-2 h-4 w-4" />
              Report Issue
            </Button>
          </div>
        </header>
        <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Today's Trips</CardTitle>
                <Bus className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">4</div>
                <div className="flex items-center gap-2 pt-1">
                  <Badge variant="outline" className="bg-green-500/10 text-green-500">
                    <CheckCircle className="mr-1 h-3 w-3" /> 2 Completed
                  </Badge>
                  <Badge variant="outline" className="bg-yellow-500/10 text-yellow-500">
                    <Clock className="mr-1 h-3 w-3" /> 2 Upcoming
                  </Badge>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Passengers Today</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">42</div>
                <p className="text-xs text-muted-foreground">12 more than yesterday</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Current Route</CardTitle>
                <MapPin className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-xl font-bold">Addis Ababa - Akaki</div>
                <p className="text-xs text-muted-foreground">Next departure: 14:30</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Week Schedule</CardTitle>
                <Calendar className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">18</div>
                <p className="text-xs text-muted-foreground">Trips scheduled this week</p>
              </CardContent>
            </Card>
          </div>
          <Tabs defaultValue="today" className="space-y-4">
            <TabsList>
              <TabsTrigger value="today" onClick={() => setActiveTab("today")}>
                Today's Trips
              </TabsTrigger>
              <TabsTrigger value="passengers" onClick={() => setActiveTab("passengers")}>
                Passenger Manifest
              </TabsTrigger>
              <TabsTrigger value="scan" onClick={() => setActiveTab("scan")}>
                Scan Tickets
              </TabsTrigger>
              <TabsTrigger value="issues" onClick={() => setActiveTab("issues")}>
                Report Issues
              </TabsTrigger>
            </TabsList>
            <TabsContent value="today" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Trip Schedule</CardTitle>
                  <CardDescription>Your trips for today, May 18, 2025</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {[
                      { time: "08:00", route: "Addis Ababa - Akaki", status: "Completed", passengers: 18 },
                      { time: "11:30", route: "Akaki - Addis Ababa", status: "Completed", passengers: 24 },
                      { time: "14:30", route: "Addis Ababa - Akaki", status: "Upcoming", passengers: 12 },
                      { time: "17:00", route: "Akaki - Addis Ababa", status: "Upcoming", passengers: 0 },
                    ].map((trip, i) => (
                      <div key={i} className="flex items-center justify-between rounded-lg border p-4">
                        <div className="grid gap-1">
                          <div className="font-medium">{trip.route}</div>
                          <div className="text-sm text-muted-foreground">Departure: {trip.time}</div>
                        </div>
                        <div className="flex items-center gap-4">
                          <div className="text-sm">
                            <span className="text-muted-foreground">Passengers:</span> {trip.passengers}
                          </div>
                          <Badge
                            variant="outline"
                            className={
                              trip.status === "Completed"
                                ? "bg-green-500/10 text-green-500"
                                : "bg-yellow-500/10 text-yellow-500"
                            }
                          >
                            {trip.status}
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
              <div className="grid gap-4 md:grid-cols-2">
                <Card>
                  <CardHeader>
                    <CardTitle>Passenger Volume</CardTitle>
                    <CardDescription>Today's passenger volume by trip</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <BarChart />
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader>
                    <CardTitle>Weekly Trend</CardTitle>
                    <CardDescription>Passenger volume for the week</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <LineChart />
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
            <TabsContent value="passengers" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Passenger Manifest</CardTitle>
                  <CardDescription>Manage passenger check-ins for your current trip</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-[400px] flex items-center justify-center border rounded-md">
                    <p className="text-muted-foreground">Passenger manifest content will be displayed here</p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="scan" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Scan Tickets</CardTitle>
                  <CardDescription>Scan passenger tickets using QR code</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-[400px] flex items-center justify-center border rounded-md">
                    <p className="text-muted-foreground">QR code scanner will be displayed here</p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="issues" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Report Issues</CardTitle>
                  <CardDescription>Report any issues encountered during your trips</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-[400px] flex items-center justify-center border rounded-md">
                    <p className="text-muted-foreground">Issue reporting form will be displayed here</p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </main>
      </div>
    </Sidebar>
  )
}
