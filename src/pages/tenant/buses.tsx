"use client";

import type React from "react";
import { useState } from "react";
import { Plus, X, Bus, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { Badge } from "@/components/ui/badge";

interface IBus {
  capacity: number;
  busModel: string;
  amenities: string[];
  buses: {
    plateNumber: string;
    sideNumber: string;
    maintenanceStatus: string;
  }[];
}

export default function BusesPage() {
  const { toast } = useToast();
  const [view, setView] = useState<"empty" | "form" | "list">("empty");
  const [busFleets, setBusFleets] = useState<IBus[]>([]);
  const [formData, setFormData] = useState<IBus>({
    capacity: 0,
    busModel: "",
    amenities: [],
    buses: [],
  });
  const [amenityInput, setAmenityInput] = useState("");
  const [busCount, setBusCount] = useState(1);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleAddAmenity = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && amenityInput.trim()) {
      e.preventDefault();
      if (!formData.amenities.includes(amenityInput.trim())) {
        setFormData({
          ...formData,
          amenities: [...formData.amenities, amenityInput.trim()],
        });
      }
      setAmenityInput("");
    }
  };

  const handleRemoveAmenity = (amenity: string) => {
    setFormData({
      ...formData,
      amenities: formData.amenities.filter((a) => a !== amenity),
    });
  };

  const handleBusCountChange = (value: number) => {
    setBusCount(value);
    const newBuses = [...formData.buses];
    if (value > newBuses.length) {
      for (let i = newBuses.length; i < value; i++) {
        newBuses.push({
          plateNumber: "",
          sideNumber: "",
          maintenanceStatus: "Excellent",
        });
      }
    } else if (value < newBuses.length) {
      newBuses.splice(value);
    }
    setFormData({
      ...formData,
      buses: newBuses,
    });
  };

  const updateBusDetail = (index: number, field: string, value: string) => {
    const updatedBuses = [...formData.buses];
    updatedBuses[index] = {
      ...updatedBuses[index],
      [field]: value,
    };
    setFormData({
      ...formData,
      buses: updatedBuses,
    });
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.busModel.trim()) {
      newErrors.busModel = "Bus model is required";
    }
    if (formData.capacity <= 0) {
      newErrors.capacity = "Capacity must be greater than 0";
    }
    if (formData.amenities.length === 0) {
      newErrors.amenities = "At least one amenity is required";
    }
    formData.buses.forEach((bus, index) => {
      if (!bus.plateNumber.trim()) {
        newErrors[`plateNumber-${index}`] = "Plate number is required";
      }
      if (!bus.sideNumber.trim()) {
        newErrors[`sideNumber-${index}`] = "Side number is required";
      } else if (!/^\d{4}$/.test(bus.sideNumber)) {
        newErrors[`sideNumber-${index}`] = "Side number must be exactly 4 digits";
      }
      if (!bus.maintenanceStatus) {
        newErrors[`maintenanceStatus-${index}`] = "Maintenance status is required";
      }
    });
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      setBusFleets([...busFleets, formData]);
      setFormData({
        capacity: 0,
        busModel: "",
        amenities: [],
        buses: [],
      });
      setBusCount(1);
      setView("list");
      toast({
        title: "Success!",
        description: "Bus fleet has been successfully added.",
      });
    }
  };

  const exportToJson = () => {
    if (busFleets.length === 0) {
      toast({
        title: "No data to export",
        description: "There are no bus fleets to export.",
        variant: "destructive",
      });
      return;
    }
    const dataStr = JSON.stringify(busFleets, null, 2);
    const dataUri = `data:application/json;charset=utf-8,${encodeURIComponent(dataStr)}`;
    const exportFileDefaultName = `bus-fleets-${new Date().toISOString().slice(0, 10)}.json`;
    const linkElement = document.createElement("a");
    linkElement.setAttribute("href", dataUri);
    linkElement.setAttribute("download", exportFileDefaultName);
    linkElement.click();
    toast({
      title: "Export successful",
      description: "Your bus fleet data has been exported as JSON.",
    });
  };

  return (
    <div className="p-4">
      {view === "empty" && (
        <div className="flex flex-col items-center justify-center h-[60vh] text-center">
          <div className="mb-6 p-6 bg-muted rounded-full">
            <Bus className="h-12 w-12 text-muted-foreground" />
          </div>
          <h2 className="text-2xl font-bold mb-2">No buses available</h2>
          <p className="text-muted-foreground mb-6 max-w-md">
            You haven't added any buses to your fleet yet. Start by adding your first bus.
          </p>
          <Button size="lg" onClick={() => setView("form")}>
            <Plus className="mr-2 h-4 w-4" /> Add First Bus
          </Button>
        </div>
      )}

      {view === "form" && (
        <form onSubmit={handleSubmit}>
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Register New Bus Fleet</CardTitle>
              <CardDescription>Add details about your bus model and how many buses of this type you have.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="busModel">Bus Model*</Label>
                  <Input
                    id="busModel"
                    placeholder="e.g. Mercedes Benz"
                    value={formData.busModel}
                    onChange={(e) => setFormData({ ...formData, busModel: e.target.value })}
                  />
                  {errors.busModel && <p className="text-sm text-destructive">{errors.busModel}</p>}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="capacity">Capacity (Seats)*</Label>
                  <Input
                    id="capacity"
                    type="number"
                    min="1"
                    placeholder="e.g. 52"
                    value={formData.capacity || ""}
                    onChange={(e) => setFormData({ ...formData, capacity: parseInt(e.target.value) || 0 })}
                  />
                  {errors.capacity && <p className="text-sm text-destructive">{errors.capacity}</p>}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="amenities">Amenities*</Label>
                <div className="flex flex-wrap gap-2">
                  {formData.amenities.map((amenity, index) => (
                    <Badge key={index} variant="secondary" className="flex items-center gap-1">
                      {amenity}
                      <button type="button" onClick={() => handleRemoveAmenity(amenity)}>
                        <X className="h-3 w-3" />
                      </button>
                    </Badge>
                  ))}
                </div>
                <Input
                  id="amenities"
                  placeholder="Type amenity and press Enter (e.g. WiFi, USB, TV)"
                  value={amenityInput}
                  onChange={(e) => setAmenityInput(e.target.value)}
                  onKeyDown={handleAddAmenity}
                />
                {errors.amenities && <p className="text-sm text-destructive">{errors.amenities}</p>}
                <p className="text-sm text-muted-foreground">Press Enter to add an amenity</p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="busCount">Number of Buses*</Label>
                <Input
                  id="busCount"
                  type="number"
                  min="1"
                  placeholder="How many buses of this model?"
                  value={busCount}
                  onChange={(e) => handleBusCountChange(parseInt(e.target.value) || 1)}
                />
              </div>

              {formData.buses.map((bus, index) => (
                <Card key={index} className="p-4">
                  <h4 className="font-bold">Bus {index + 1}</h4>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <Label>Plate Number*</Label>
                      <Input
                        value={bus.plateNumber}
                        onChange={(e) => updateBusDetail(index, "plateNumber", e.target.value)}
                      />
                      {errors[`plateNumber-${index}`] && <p className="text-sm text-destructive">{errors[`plateNumber-${index}`]}</p>}
                    </div>
                    <div>
                      <Label>Side Number*</Label>
                      <Input
                        value={bus.sideNumber}
                        onChange={(e) => updateBusDetail(index, "sideNumber", e.target.value)}
                      />
                      {errors[`sideNumber-${index}`] && <p className="text-sm text-destructive">{errors[`sideNumber-${index}`]}</p>}
                    </div>
                    <div>
                      <Label>Maintenance Status*</Label>
                      <Select value={bus.maintenanceStatus} onValueChange={(val) => updateBusDetail(index, "maintenanceStatus", val)}>
                        <SelectTrigger><SelectValue placeholder="Select status" /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Excellent">Excellent</SelectItem>
                          <SelectItem value="Good">Good</SelectItem>
                          <SelectItem value="Needs Maintenance">Needs Maintenance</SelectItem>
                        </SelectContent>
                      </Select>
                      {errors[`maintenanceStatus-${index}`] && <p className="text-sm text-destructive">{errors[`maintenanceStatus-${index}`]}</p>}
                    </div>
                  </div>
                </Card>
              ))}
            </CardContent>
            <CardFooter className="flex justify-end">
              <Button type="submit">Save Fleet</Button>
            </CardFooter>
          </Card>
        </form>
      )}

      {view === "list" && (
        <div>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold">Bus Fleets</h2>
            <div className="flex gap-2">
              <Button onClick={() => setView("form")}>
                <Plus className="mr-2 h-4 w-4" /> Add Bus
              </Button>
              <Button variant="outline" onClick={exportToJson}>
                <Download className="mr-2 h-4 w-4" /> Export JSON
              </Button>
            </div>
          </div>
          {busFleets.map((fleet, i) => (
            <Card key={i} className="mb-4">
              <CardHeader>
                <CardTitle>{fleet.busModel}</CardTitle>
                <CardDescription>{fleet.capacity} seats • {fleet.amenities.join(", ")}</CardDescription>
              </CardHeader>
              <CardContent>
                {fleet.buses.map((bus, j) => (
                  <div key={j} className="border p-2 rounded mb-2">
                    <p><strong>Plate Number:</strong> {bus.plateNumber}</p>
                    <p><strong>Side Number:</strong> {bus.sideNumber}</p>
                    <p><strong>Maintenance Status:</strong> {bus.maintenanceStatus}</p>
                  </div>
                ))}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
