"use client"

import { useState } from "react"
import { Sidebar } from "../../components/sidebar"
import { Card, CardContent } from "../../components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../components/ui/tabs"
import { useAuth } from "../../context/auth-context"
import { Button } from "../../components/ui/button"
import { Input } from "../../components/ui/input"
import { Label } from "../../components/ui/label"
import { Avatar, AvatarFallback, AvatarImage } from "../../components/ui/avatar"
import { Pencil } from "lucide-react"
import { TopNav } from "@/components/top-nav"

export default function TenantSettingsPage() {
  const { user } = useAuth()
  const [activeTab, setActiveTab] = useState("profile")

  // Mock profile data
  const [profileData, setProfileData] = useState({
    name: user?.name || "Abay Bus Admin",
    email: user?.email || "tenant@abaybus.com",
    username: "abaybus",
    password: "••••••••",
    dateOfBirth: "25 January 2002",
    branchAddress: "Akaki Kality, Addis Ababa, Ethiopia",
    personalAddress: "Lideta, Addis Ababa, Ethiopia",
    city: "Addis Ababa",
    postalCode: "1000",
    country: "Ethiopia",
  })

  return (
    <Sidebar>

      <div className="flex flex-col">
        <TopNav />
        <header className="sticky top-0 z-10 flex h-16 items-center gap-4 border-b bg-background px-6">
          <div className="flex flex-1 items-center gap-4">
            <h1 className="text-xl font-semibold">Settings</h1>
          </div>
        </header>
        <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
          <Tabs defaultValue="profile" className="space-y-4">
            <TabsList>
              <TabsTrigger value="profile" onClick={() => setActiveTab("profile")}>
                Edit Profile
              </TabsTrigger>
              <TabsTrigger value="preferences" onClick={() => setActiveTab("preferences")}>
                Preferences
              </TabsTrigger>
              <TabsTrigger value="security" onClick={() => setActiveTab("security")}>
                Security
              </TabsTrigger>
            </TabsList>
            <TabsContent value="profile" className="space-y-4">
              <Card>
                <CardContent className="p-6">
                  <div className="flex flex-col gap-6">
                    <div className="flex items-center gap-4">
                      <div className="relative">
                        <Avatar className="h-24 w-24">
                          <AvatarImage src={user?.avatar || "/placeholder.svg"} alt={user?.name} />
                          <AvatarFallback className="text-2xl">{user?.name?.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <Button
                          size="icon"
                          variant="outline"
                          className="absolute bottom-0 right-0 h-8 w-8 rounded-full bg-primary text-primary-foreground"
                        >
                          <Pencil className="h-4 w-4" />
                          <span className="sr-only">Change avatar</span>
                        </Button>
                      </div>
                    </div>
                    <div className="grid gap-6 md:grid-cols-2">
                      <div className="space-y-2">
                        <Label htmlFor="name">Your Name</Label>
                        <Input
                          id="name"
                          value={profileData.name}
                          onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="username">User Name</Label>
                        <Input
                          id="username"
                          value={profileData.username}
                          onChange={(e) => setProfileData({ ...profileData, username: e.target.value })}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="email">Email</Label>
                        <Input
                          id="email"
                          type="email"
                          value={profileData.email}
                          onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="password">Password</Label>
                        <Input
                          id="password"
                          type="password"
                          value={profileData.password}
                          onChange={(e) => setProfileData({ ...profileData, password: e.target.value })}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="dob">Date of Birth</Label>
                        <Input
                          id="dob"
                          value={profileData.dateOfBirth}
                          onChange={(e) => setProfileData({ ...profileData, dateOfBirth: e.target.value })}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="branchAddress">Branch Address</Label>
                        <Input
                          id="branchAddress"
                          value={profileData.branchAddress}
                          onChange={(e) => setProfileData({ ...profileData, branchAddress: e.target.value })}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="personalAddress">Personal Address</Label>
                        <Input
                          id="personalAddress"
                          value={profileData.personalAddress}
                          onChange={(e) => setProfileData({ ...profileData, personalAddress: e.target.value })}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="city">City</Label>
                        <Input
                          id="city"
                          value={profileData.city}
                          onChange={(e) => setProfileData({ ...profileData, city: e.target.value })}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="postalCode">Postal Code</Label>
                        <Input
                          id="postalCode"
                          value={profileData.postalCode}
                          onChange={(e) => setProfileData({ ...profileData, postalCode: e.target.value })}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="country">Country</Label>
                        <Input
                          id="country"
                          value={profileData.country}
                          onChange={(e) => setProfileData({ ...profileData, country: e.target.value })}
                        />
                      </div>
                    </div>
                    <div className="flex justify-end">
                      <Button className="bg-primary text-primary-foreground">Save</Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="preferences" className="space-y-4">
              <Card>
                <CardContent className="p-6">
                  <div className="h-[400px] flex items-center justify-center">
                    <p className="text-muted-foreground">Preferences settings will be displayed here</p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="security" className="space-y-4">
              <Card>
                <CardContent className="p-6">
                  <div className="h-[400px] flex items-center justify-center">
                    <p className="text-muted-foreground">Security settings will be displayed here</p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </main>
        <footer className="border-t py-4 text-center text-sm text-muted-foreground">
          <p>Powered By Addis Systems</p>
        </footer>
      </div>
    </Sidebar>
  )
}
