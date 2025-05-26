/* eslint-disable @typescript-eslint/no-unused-vars */
"use client"


import type React from "react"
import { useState, useEffect, useCallback } from "react"
import axios from "axios"
import { Plus, X, Bus, Download } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/hooks/use-toast"
import { Badge } from "@/components/ui/badge"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"

interface AmenityId {
  amenities: string[]
}

interface IBus {
  _id?: string
  capacity: number
  busModel: string
  tenantId?: string
  amenityId: AmenityId;
  moreInfo: {
    plateNumber: string
    sideNumber: string
    maintenanceStatus: string
  }[]
}


export default function BusesPage() {
  const { toast } = useToast()
  const [view, setView] = useState<"empty" | "form" | "list">("empty")
  const [busFleets, setBusFleets] = useState<IBus[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState<IBus>({
    capacity: 0,
    busModel: "",
    amenityId: {
      amenities: [],
    },
    moreInfo: [],
  })
  const [amenityInput, setAmenityInput] = useState("")
  const [busCount, setBusCount] = useState(1)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [initialLoad, setInitialLoad] = useState(true)


  // Memoized fetch function
  const fetchBuses = useCallback(async () => {
    try {
      setIsLoading(true)
      const response = await axios.get("https://n7gjzkm4-3002.euw.devtunnels.ms/api/buses", 
        { headers: { 
          Authorization: `Bearer ${localStorage.getItem("token")}`
         } }
      )
      if(response.status == 200) {
      setBusFleets(response.data.buses)
      setView(response.data.buses.length > 0 ? "list" : "empty")
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch buses",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
      setInitialLoad(false)
    }
  }, [toast])


  // Fetch buses on component mount only once
  useEffect(() => {
    if (initialLoad) {
      fetchBuses()
    }
  }, [fetchBuses, initialLoad])


  const handleAddAmenity = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && amenityInput.trim()) {
      e.preventDefault()
      if (!formData.amenityId.amenities.includes(amenityInput.trim())) {
        setFormData(prev => ({
          ...prev,
          amenityId: {
            ...prev.amenityId,
            amenities: [...prev.amenityId.amenities, amenityInput.trim()],
          },
          
        }))
      }
      setAmenityInput("")
    }
  }


  const handleRemoveAmenity = (amenity: string) => {
    setFormData(prev => ({
      ...prev,
      amenityId: {
        ...prev.amenityId,
        amenities: prev.amenityId.amenities.filter(a => a !== amenity),
      }
    }))
  }


  const handleBusCountChange = (value: number) => {
    setBusCount(value)


    setFormData(prev => {
      const newBuses = [...prev.moreInfo]
      if (value > newBuses.length) {
        for (let i = newBuses.length; i < value; i++) {
          newBuses.push({
            plateNumber: "",
            sideNumber: "",
            maintenanceStatus: "Excellent",
          })
        }
      } else if (value < newBuses.length) {
        newBuses.splice(value)
      }


      return {
        ...prev,
        moreInfo: newBuses,
      }
    })
  }


  const updateBusDetail = (index: number, field: string, value: string) => {
    setFormData(prev => {
      const updatedBuses = [...prev.moreInfo]
      updatedBuses[index] = {
        ...updatedBuses[index],
        [field]: value,
      }


      return {
        ...prev,
        moreInfo: updatedBuses,
      }
    })
  }


  const validateForm = () => {
    const newErrors: Record<string, string> = {}


    if (!formData.busModel.trim()) {
      newErrors.busModel = "Bus model is required"
    }


    if (formData.capacity <= 0) {
      newErrors.capacity = "Capacity must be greater than 0"
    }


    if (formData.amenityId.amenities.length === 0) {
      newErrors.amenities = "At least one amenity is required"
    }


    formData.moreInfo.forEach((bus, index) => {
      if (!bus.plateNumber.trim()) {
        newErrors[`plateNumber-${index}`] = "Plate number is required"
      }


      if (!bus.sideNumber.trim()) {
        newErrors[`sideNumber-${index}`] = "Side number is required"
      } else if (!/^\d{4}$/.test(bus.sideNumber)) {
        newErrors[`sideNumber-${index}`] = "Side number must be exactly 4 digits"
      }


      if (!bus.maintenanceStatus) {
        newErrors[`maintenanceStatus-${index}`] = "Maintenance status is required"
      }
    })


    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()


    if (!validateForm()) {
      return
    }


    try {
      setIsLoading(true)
      const response = await axios.post("https://n7gjzkm4-3002.euw.devtunnels.ms/api/buses", 
        {
          ...formData,
          amenities: formData.amenityId.amenities 
        }, 
        { headers: { 
          Authorization: `Bearer ${localStorage.getItem("token")}` ,
          "Content-Type": "application/json"
        } }
      )
      if (response.status !== 201) {
        throw new Error("Failed to add bus fleet")
      }
      setBusFleets(prev => {
        console.log({ addedBus : response.data.bus});
        return  [...prev, response.data.bus]})
      setFormData({
        capacity: 0,
        busModel: "",
        amenityId: {
          amenities: [],
        },
        moreInfo: [],
      })
      setBusCount(1)
      setView("list")


      toast({
        title: "Success!",
        description: "Bus fleet has been successfully added.",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add bus fleet",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }


  const exportToJson = () => {
    if (busFleets.length === 0) {
      toast({
        title: "No data to export",
        description: "There are no bus fleets to export.",
        variant: "destructive",
      })
      return
    }


    const dataStr = JSON.stringify(busFleets, null, 2)
    const dataUri = `data:application/json;charset=utf-8,${encodeURIComponent(dataStr)}`
   
    const exportFileDefaultName = `bus-fleets-${new Date().toISOString().slice(0, 10)}.json`
   
    const linkElement = document.createElement('a')
    linkElement.setAttribute('href', dataUri)
    linkElement.setAttribute('download', exportFileDefaultName)
    linkElement.click()
   
    toast({
      title: "Export successful",
      description: "Your bus fleet data has been exported as JSON.",
    })
  }


  const renderEmptyState = () => (
    <div className="flex flex-col items-center justify-center h-[60vh] text-center">
      <div className="mb-6 p-6 bg-muted rounded-full">
        <Bus className="h-12 w-12 text-muted-foreground" />
      </div>
      <h2 className="text-2xl font-bold mb-2">No buses available</h2>
      <p className="text-muted-foreground mb-6 max-w-md">
        You haven't added any buses to your fleet yet. Start by adding your first bus.
      </p>
      <Button size="lg" onClick={() => setView("form")} disabled={isLoading}>
        <Plus className="mr-2 h-4 w-4" /> Add First Bus
      </Button>
    </div>
  )


  const renderBusForm = () => (
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
                onChange={(e) => setFormData(prev => ({ ...prev, busModel: e.target.value }))}
                disabled={isLoading}
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
                onChange={(e) => setFormData(prev => ({ ...prev, capacity: Number.parseInt(e.target.value) || 0 }))}
                disabled={isLoading}
              />
              {errors.capacity && <p className="text-sm text-destructive">{errors.capacity}</p>}
            </div>
          </div>


          <div className="space-y-2">
            <Label htmlFor="amenities">Amenities*</Label>
            <div className="relative">
              <div className="flex flex-wrap gap-2 mb-2">
                {formData.amenityId.amenities.map((amenity, index) => (
                  <Badge
                    key={index}
                    variant="secondary"
                    className="px-2 h-6 text-xs flex items-center"
                  >
                    {amenity}
                    <button
                      type="button"
                      onClick={() => handleRemoveAmenity(amenity)}
                      className="ml-1 text-muted-foreground hover:text-foreground"
                      disabled={isLoading}
                    >
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
                disabled={isLoading}
              />
            </div>
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
              onChange={(e) => handleBusCountChange(Number.parseInt(e.target.value) || 1)}
              disabled={isLoading}
            />
          </div>


          {busCount > 0 && (
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Individual Bus Details*</h3>
              <Accordion type="multiple" className="w-full">
                {Array.from({ length: busCount }).map((_, index) => (
                  <AccordionItem key={index} value={`bus-${index}`}>
                    <AccordionTrigger className="hover:bg-muted px-4 rounded-md">
                      <span>Bus #{index + 1} Details</span>
                    </AccordionTrigger>
                    <AccordionContent className="px-4 pt-4">
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor={`plateNumber-${index}`}>Plate Number*</Label>
                          <Input
                            id={`plateNumber-${index}`}
                            required
                            placeholder="e.g. ABC-123"
                            value={formData.moreInfo[index]?.plateNumber || ""}
                            onChange={(e) => updateBusDetail(index, "plateNumber", e.target.value)}
                            disabled={isLoading}
                          />
                          {errors[`plateNumber-${index}`] && (
                            <p className="text-sm text-destructive">{errors[`plateNumber-${index}`]}</p>
                          )}
                        </div>


                        <div className="space-y-2">
                          <Label htmlFor={`sideNumber-${index}`}>Side Number*</Label>
                          <Input
                            id={`sideNumber-${index}`}
                            required
                            placeholder="e.g. 1234"
                            pattern="[0-9]{4}"
                            maxLength={4}
                            value={formData.moreInfo[index]?.sideNumber || ""}
                            onChange={(e) => {
                              const value = e.target.value.replace(/\D/g, "")
                              updateBusDetail(index, "sideNumber", value)
                            }}
                            disabled={isLoading}
                          />
                          {errors[`sideNumber-${index}`] && (
                            <p className="text-sm text-destructive">{errors[`sideNumber-${index}`]}</p>
                          )}
                        </div>


                        <div className="space-y-2">
                          <Label htmlFor={`maintenanceStatus-${index}`}>Maintenance Status*</Label>
                          <Select
                            value={formData.moreInfo[index]?.maintenanceStatus || "Excellent"}
                            onValueChange={(value) => updateBusDetail(index, "maintenanceStatus", value)}
                            disabled={isLoading}
                          >
                            <SelectTrigger id={`maintenanceStatus-${index}`}>
                              <SelectValue placeholder="Select status" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="Excellent">Excellent</SelectItem>
                              <SelectItem value="Good">Good</SelectItem>
                              <SelectItem value="Needs Repair">Needs Repair</SelectItem>
                            </SelectContent>
                          </Select>
                          {errors[`maintenanceStatus-${index}`] && (
                            <p className="text-sm text-destructive">{errors[`maintenanceStatus-${index}`]}</p>
                          )}
                        </div>
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </div>
          )}
        </CardContent>
        <CardFooter className="flex justify-end gap-2">
          {busFleets.length > 0 && (
            <Button variant="outline" type="button" onClick={() => setView("list")} disabled={isLoading}>
              Cancel
            </Button>
          )}
          <Button type="submit" disabled={isLoading}>
            {isLoading ? "Saving..." : "Save Bus Fleet"}
          </Button>
        </CardFooter>
      </Card>
    </form>
  )


  const renderBusList = () => (
    <div className="space-y-6 w-full">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Your Bus Fleet</h2>
        <div className="flex gap-2">
          <Button variant="outline" onClick={exportToJson} disabled={isLoading}>
            <Download className="mr-2 h-4 w-4" /> Export JSON
          </Button>
          <Button onClick={() => setView("form")} disabled={isLoading}>
            <Plus className="mr-2 h-4 w-4" /> Add New Bus
          </Button>
        </div>
      </div>


      {busFleets.length === 0 ? (
        renderEmptyState()
      ) : (
        <div className="space-y-6 w-full">
          {busFleets.map((fleet, fleetIndex) => (
            <Card key={fleetIndex} className="w-full">
              <CardHeader>
                <CardTitle>
                  {fleet.busModel} ({fleet.capacity} seats)
                </CardTitle>
                <div className="flex flex-wrap gap-2 mt-2">
                  {fleet.amenityId.amenities.map((amenity, index) => (
                    <Badge key={index} variant="secondary">
                      {amenity}
                    </Badge>
                  ))}
                </div>
              </CardHeader>
              <CardContent>
                <Accordion type="single" collapsible>
                  <AccordionItem value="buses">
                    <AccordionTrigger>
                      <span className="text-sm font-medium">
                        {fleet.moreInfo.length} {fleet.moreInfo.length === 1 ? "Bus" : "Buses"}
                      </span>
                    </AccordionTrigger>
                    <AccordionContent>
                      <div className="w-full overflow-auto">
                        <table className="w-full border-collapse">
                          <thead>
                            <tr className="border-b">
                              <th className="text-left p-3">Plate Number</th>
                              <th className="text-left p-3">Side Number</th>
                              <th className="text-left p-3">Maintenance Status</th>
                            </tr>
                          </thead>
                          <tbody>
                            {fleet.moreInfo.map((bus, busIndex) => (
                              <tr key={busIndex} className="border-b">
                                <td className="p-3">{bus.plateNumber}</td>
                                <td className="p-3">{bus.sideNumber}</td>
                                <td className="p-3">
                                  <Badge
                                    variant={
                                      bus.maintenanceStatus === "Excellent"
                                        ? "default"
                                        : bus.maintenanceStatus === "Good"
                                          ? "outline"
                                          : "destructive"
                                    }
                                  >
                                    {bus.maintenanceStatus}
                                  </Badge>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              </CardContent>
            </Card>
          ))}
        </div>
      )
}


      </div>
  )
     




  return (
    <div className="container mx-auto py-8 !w-[120%]">
      <h1 className="text-3xl font-bold mb-8 !w-[150%]">Buses Management</h1>


      {isLoading && view === "empty" ? (
        <div className="flex items-center justify-center h-[60vh]">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </div>
      ) : (
        <>
          {view === "empty" && busFleets.length === 0 && renderEmptyState()}
          {view === "form" && renderBusForm()}
          {view === "list" && renderBusList()}
        </>
      )}
    </div>
  )
}

