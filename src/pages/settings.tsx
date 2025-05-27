import React, { useEffect, useState } from "react";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

const SettingsPage: React.FC = () => {
  /* ----------------------------- profile state ----------------------------- */
  const [profile, setProfile] = useState({
    name: "",
    email: "",
    phone: "",
  });

  const handleProfileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setProfile((prev) => ({ ...prev, [name]: value }));
  };

  const saveProfile = () => {
    localStorage.setItem("profile", JSON.stringify(profile));
    alert("Profile updated ");
  };

  /* -------------------------- load persisted state ------------------------- */
  useEffect(() => {
    try {
      const storedProfile = JSON.parse(localStorage.getItem("profile") ?? "{}");
      setProfile((p) => ({ ...p, ...storedProfile }));
    } catch {
      /* ignore corrupted data */
    }
  }, []);

  /* ------------------------------------------------------------------------ */
  return (
    <div className="container mx-auto px-4 py-6 space-y-8">
      <h1 className="text-3xl font-semibold">Settings</h1>

      {/* ---------------------------- Edit profile --------------------------- */}
      <Card className="shadow-md">
        <CardHeader>
          <h2 className="text-xl font-medium">Edit Profile</h2>
        </CardHeader>
        <CardContent>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              saveProfile();
            }}
            className="grid grid-cols-1 md:grid-cols-2 gap-6"
          >
            <div>
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                name="name"
                placeholder="Your name"
                value={profile.name}
                onChange={handleProfileChange}
                required
              />
            </div>
            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                name="email"
                placeholder="you@example.com"
                value={profile.email}
                onChange={handleProfileChange}
                required
              />
            </div>
            <div>
              <Label htmlFor="phone">Phone</Label>
              <Input
                id="phone"
                name="phone"
                placeholder="+251-..."
                value={profile.phone}
                onChange={handleProfileChange}
              />
            </div>
            <div className="self-end md:col-span-2">
              <Button type="submit" className="w-full md:w-auto">
                Save Changes
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default SettingsPage;
