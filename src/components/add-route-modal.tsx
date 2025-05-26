"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { X } from "lucide-react"
import { busAPI } from "@/lib/api"
import type { Route } from "@/pages/tenant/types/route"

interface BusFleet {
  _id: string
  capacity: number
  busModel: string
  amenityId: {
    amenities: string[]
  }
  moreInfo: {
    plateNumber: string
    sideNumber: string
    maintenanceStatus: string
  }[]
}

interface AddRouteModalProps {
  isOpen: boolean
  onClose: () => void
  onAddRoute: (newRoute: Omit<Route, "_id" | "selected" | "status">) => void
}

export default function AddRouteModal({ isOpen, onClose, onAddRoute }: AddRouteModalProps) {
  const [busFleets, setBusFleets] = useState<BusFleet[]>([])
  const [selectedBusFleet, setSelectedBusFleet] = useState<string>("")
  const [selectedBus, setSelectedBus] = useState<string>("")
  const [loading, setLoading] = useState(false)

  // Form data matching backend structure
  const [formData, setFormData] = useState({
    busId: "",
    plateNumber: "",
    sideNumber: "",
    driver: "",
    assistant: "",
    from: "",
    to: "",
    price: 0,
    distance: 0,
    departureTime: "",
    arrivalTime: "",
    duration: "",
    departureDate: "",
    departureTimeOnly: "",
  })

  // Fetch bus fleets from backend
  useEffect(() => {
    const fetchBusFleets = async () => {
      if (!isOpen) return

      try {
        setLoading(true)
        const response = await busAPI.getBuses()
        setBusFleets(response.buses || [])
      } catch (error) {
        console.error("Error fetching bus fleets:", error)
        alert("Failed to fetch bus data. Please try again.")
      } finally {
        setLoading(false)
      }
    }

    fetchBusFleets()
  }, [isOpen])

  // Get available buses from selected fleet
  const getAvailableBuses = () => {
    const selectedFleet = busFleets.find((fleet) => fleet._id === selectedBusFleet)
    return selectedFleet?.moreInfo || []
  }

  // Update form data when bus is selected
  useEffect(() => {
    if (selectedBus && selectedBusFleet) {
      const selectedFleet = busFleets.find((fleet) => fleet._id === selectedBusFleet)
      const bus = selectedFleet?.moreInfo.find((b) => b.sideNumber === selectedBus)

      if (bus && selectedFleet) {
        setFormData((prev) => ({
          ...prev,
          busId: selectedFleet._id,
          plateNumber: bus.plateNumber,
          sideNumber: bus.sideNumber,
        }))
      }
    }
  }, [selectedBus, selectedBusFleet, busFleets])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target

    setFormData((prev) => {
      const newData = {
        ...prev,
        [name]: name === "price" || name === "distance" ? Number.parseFloat(value) || 0 : value,
      }

      // Calculate arrival time and duration when departure changes
      if (name === "departureDate" || name === "departureTimeOnly") {
        const { arrivalTime, duration } = calculateArrivalAndDuration(
          newData.departureDate,
          newData.departureTimeOnly,
          newData.distance.toString(),
        )

        return {
          ...newData,
          departureTime: `${newData.departureDate}T${newData.departureTimeOnly}:00`,
          arrivalTime,
          duration,
        }
      }

      if (name === "distance") {
        const { arrivalTime, duration } = calculateArrivalAndDuration(
          newData.departureDate,
          newData.departureTimeOnly,
          value,
        )

        return {
          ...newData,
          arrivalTime,
          duration,
        }
      }

      return newData
    })
  }

  const calculateArrivalAndDuration = (departureDate: string, departureTime: string, distance: string) => {
    if (!departureDate || !departureTime || !distance) {
      return { arrivalTime: "", duration: "" }
    }

    // Calculate duration based on distance (assuming average speed of 80 km/h)
    const distanceNum = Number.parseFloat(distance)
    const durationHours = distanceNum / 80
    const hours = Math.floor(durationHours)
    const minutes = Math.round((durationHours - hours) * 60)

    // Create departure datetime
    const departureDateTime = new Date(`${departureDate}T${departureTime}:00`)

    // Add duration to get arrival time
    const arrivalDateTime = new Date(departureDateTime.getTime() + durationHours * 60 * 60 * 1000)

    return {
      arrivalTime: arrivalDateTime.toISOString(),
      duration: `${hours} hours ${minutes} minutes`,
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      setLoading(true)

      // Get current operator ID
      const operatorId = localStorage.getItem("operatorId") || "current-operator"

      // Prepare data for backend
      const routeData = {
        busId: formData.busId,
        plateNumber: formData.plateNumber,
        sideNumber: formData.sideNumber,
        driver: formData.driver,
        assistant: formData.assistant,
        routeName: `${formData.from}-${formData.to}`,
        from: formData.from,
        to: formData.to,
        price: formData.price,
        distance: formData.distance,
        departureTime: formData.departureTime,
        arrivalTime: formData.arrivalTime,
        duration: formData.duration,
        operatorId: operatorId,
      }

      // Send to backend
      const createdRoute = await busAPI.createRoute(routeData)

      // Get selected fleet for capacity
      const selectedFleet = busFleets.find((fleet) => fleet._id === selectedBusFleet)

      // Convert backend response to frontend format
      const newRoute: Omit<Route, "_id" | "selected" | "status"> = {
        from: createdRoute.from,
        to: createdRoute.to,
        routeName: `${createdRoute.from}-${createdRoute.to}`,
        sideNo: createdRoute.sideNumber,
        duration: formData.duration,
        departureTime: formatDateTime(createdRoute.departureTime),
        arrivalTime: formatDateTime(createdRoute.arrivalTime),
        distance: createdRoute.distance,
        price: createdRoute.price,
        ticketsSold: 0,
        totalTickets: selectedFleet?.capacity || 52,
        ticketsAvailable: selectedFleet?.capacity || 52,
        driver: createdRoute.driver,
        assistant: createdRoute.assistant,
        vendor: "Current User",
        totalPayment: 0,
        passengers: [],
      }

      onAddRoute(newRoute)
      resetForm()
      onClose()

      // Show success message
      alert("Route created successfully!")
    } catch (error) {
      console.error("Error creating route:", error)
      alert("Failed to create route. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  const formatDateTime = (isoString: string) => {
    const date = new Date(isoString)
    const day = date.getDate().toString().padStart(2, "0")
    const month = (date.getMonth() + 1).toString().padStart(2, "0")
    const year = date.getFullYear()
    const hours = date.getHours()
    const minutes = date.getMinutes().toString().padStart(2, "0")
    const ampm = hours >= 12 ? "PM" : "AM"
    const hour12 = hours % 12 || 12

    return `${day}/${month}/${year} ${hour12}:${minutes} ${ampm}`
  }

  const resetForm = () => {
    setFormData({
      busId: "",
      plateNumber: "",
      sideNumber: "",
      driver: "",
      assistant: "",
      from: "",
      to: "",
      price: 0,
      distance: 0,
      departureTime: "",
      arrivalTime: "",
      duration: "",
      departureDate: "",
      departureTimeOnly: "",
    })
    setSelectedBusFleet("")
    setSelectedBus("")
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black bg-opacity-50 backdrop-blur-sm" onClick={onClose}></div>
      <div className="relative bg-[#1a1a1a] rounded-lg w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-[#1a1a1a] z-10 flex justify-between items-center p-4 border-b border-gray-800">
          <h2 className="text-xl font-medium">Add New Route</h2>
          <button onClick={onClose} className="p-1 rounded-full hover:bg-gray-800">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6">
          <div className="grid grid-cols-2 gap-6 mb-6">
            <div>
              <h3 className="text-lg font-medium mb-4">Bus Selection</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm text-gray-400 mb-1">Bus Fleet Model</label>
                  <select
                    value={selectedBusFleet}
                    onChange={(e) => {
                      setSelectedBusFleet(e.target.value)
                      setSelectedBus("")
                    }}
                    className="w-full bg-[#2a2a2a] border border-gray-700 rounded-md px-3 py-2 text-white"
                    required
                    disabled={loading}
                  >
                    <option value="">Select Bus Fleet</option>
                    {busFleets.map((fleet) => (
                      <option key={fleet._id} value={fleet._id}>
                        {fleet.busModel} (Capacity: {fleet.capacity}) - {fleet.moreInfo.length} buses
                      </option>
                    ))}
                  </select>
                  {loading && <p className="text-xs text-gray-500 mt-1">Loading bus fleets...</p>}
                </div>

                <div>
                  <label className="block text-sm text-gray-400 mb-1">Select Bus</label>
                  <select
                    value={selectedBus}
                    onChange={(e) => setSelectedBus(e.target.value)}
                    className="w-full bg-[#2a2a2a] border border-gray-700 rounded-md px-3 py-2 text-white"
                    disabled={!selectedBusFleet || loading}
                    required
                  >
                    <option value="">Select Bus</option>
                    {getAvailableBuses().map((bus) => (
                      <option key={bus.sideNumber} value={bus.sideNumber}>
                        {bus.plateNumber} - Side No: {bus.sideNumber} ({bus.maintenanceStatus})
                      </option>
                    ))}
                  </select>
                </div>

                {selectedBus && selectedBusFleet && (
                  <div className="p-3 bg-gray-800 rounded-md">
                    <p className="text-sm text-gray-400">Selected Bus Details:</p>
                    <p className="text-sm">Plate: {formData.plateNumber}</p>
                    <p className="text-sm">Side Number: {formData.sideNumber}</p>
                    <p className="text-sm">Model: {busFleets.find((f) => f._id === selectedBusFleet)?.busModel}</p>
                    <p className="text-sm">
                      Capacity: {busFleets.find((f) => f._id === selectedBusFleet)?.capacity} seats
                    </p>
                  </div>
                )}
              </div>

              <h3 className="text-lg font-medium mb-4 mt-6">Route Information</h3>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm text-gray-400 mb-1">From</label>
                    <input
                      type="text"
                      name="from"
                      value={formData.from}
                      onChange={handleChange}
                      className="w-full bg-[#2a2a2a] border border-gray-700 rounded-md px-3 py-2 text-white"
                      placeholder="e.g. Hawassa"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-400 mb-1">To</label>
                    <input
                      type="text"
                      name="to"
                      value={formData.to}
                      onChange={handleChange}
                      className="w-full bg-[#2a2a2a] border border-gray-700 rounded-md px-3 py-2 text-white"
                      placeholder="e.g. Addis Ababa"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm text-gray-400 mb-1">Distance (KM)</label>
                    <input
                      type="number"
                      name="distance"
                      value={formData.distance || ""}
                      onChange={handleChange}
                      className="w-full bg-[#2a2a2a] border border-gray-700 rounded-md px-3 py-2 text-white"
                      placeholder="e.g. 320"
                      min={"1"}
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-400 mb-1">Price (ETB)</label>
                    <input
                      type="number"
                      name="price"
                      value={formData.price || ""}
                      onChange={handleChange}
                      className="w-full bg-[#2a2a2a] border border-gray-700 rounded-md px-3 py-2 text-white"
                      placeholder="e.g. 800"
                      min={"1"}
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm text-gray-400 mb-1">Departure Date</label>
                    <input
                      type="date"
                      name="departureDate"
                      value={formData.departureDate}
                      onChange={handleChange}
                      className="w-full bg-[#2a2a2a] border border-gray-700 rounded-md px-3 py-2 text-white"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-400 mb-1">Departure Time</label>
                    <input
                      type="time"
                      name="departureTimeOnly"
                      value={formData.departureTimeOnly}
                      onChange={handleChange}
                      className="w-full bg-[#2a2a2a] border border-gray-700 rounded-md px-3 py-2 text-white"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm text-gray-400 mb-1">Duration (Auto-calculated)</label>
                    <input
                      type="text"
                      value={formData.duration}
                      className="w-full bg-[#2a2a2a] border border-gray-700 rounded-md px-3 py-2 text-white bg-opacity-50"
                      disabled
                      placeholder="Will be calculated"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-400 mb-1">Arrival Time (Auto-calculated)</label>
                    <input
                      type="text"
                      value={formData.arrivalTime ? new Date(formData.arrivalTime).toLocaleString() : ""}
                      className="w-full bg-[#2a2a2a] border border-gray-700 rounded-md px-3 py-2 text-white bg-opacity-50"
                      disabled
                      placeholder="Will be calculated"
                    />
                  </div>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-medium mb-4">Staff Information</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm text-gray-400 mb-1">Driver Name</label>
                  <input
                    type="text"
                    name="driver"
                    value={formData.driver}
                    onChange={handleChange}
                    className="w-full bg-[#2a2a2a] border border-gray-700 rounded-md px-3 py-2 text-white"
                    placeholder="e.g. Solomon Belay"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm text-gray-400 mb-1">Assistant Name (Optional)</label>
                  <input
                    type="text"
                    name="assistant"
                    value={formData.assistant}
                    onChange={handleChange}
                    className="w-full bg-[#2a2a2a] border border-gray-700 rounded-md px-3 py-2 text-white"
                    placeholder="e.g. Abebe Kebede"
                  />
                </div>
              </div>

              <div className="mt-6 p-4 border border-gray-700 rounded-md bg-gray-800">
                <h4 className="font-medium mb-3">Route Creator (Vendor)</h4>
                <div className="flex items-center gap-4">
                  <div className="relative w-12 h-12 rounded-full overflow-hidden bg-gray-700">
                    <img src="/placeholder.svg?height=50&width=50" alt="Current User" className="object-cover" />
                  </div>
                  <div>
                    <p className="font-medium">Current User</p>
                    <p className="text-sm text-gray-400">Primary ticket vendor</p>
                    <p className="text-xs text-gray-500">Will be set as route vendor</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-gray-800">
            <button type="button" onClick={onClose} className="px-4 py-2 bg-[#2a2a2a] rounded-md text-white">
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-[#e74c3c] rounded-md text-white"
              disabled={!selectedBus || loading}
            >
              {loading ? "Creating..." : "Add Route"}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
