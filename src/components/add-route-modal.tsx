"use client"

import type React from "react"

import { useState } from "react"
import { X, Plus, Trash2 } from "lucide-react"

interface AddRouteModalProps {
  isOpen: boolean
  onClose: () => void
}

export default function AddRouteModal({ isOpen, onClose }: AddRouteModalProps) {
  const [formData, setFormData] = useState({
    from: "",
    to: "",
    routeId: "",
    sideNo: "",
    eta: "",
    departureDate: "",
    departureTime: "",
    arrivalDate: "",
    arrivalTime: "",
    distance: "",
    price: "",
    totalTickets: "",
    status: "on-the-way",
  })

  const [drivers, setDrivers] = useState([{ name: "", phone: "", image: "/placeholder.svg?height=50&width=50" }])
  const [vendors, setVendors] = useState([{ name: "", phone: "", image: "/placeholder.svg?height=50&width=50" }])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleDriverChange = (index: number, field: string, value: string) => {
    const newDrivers = [...drivers]
    newDrivers[index] = { ...newDrivers[index], [field]: value }
    setDrivers(newDrivers)
  }

  const handleVendorChange = (index: number, field: string, value: string) => {
    const newVendors = [...vendors]
    newVendors[index] = { ...newVendors[index], [field]: value }
    setVendors(newVendors)
  }

  const addDriver = () => {
    setDrivers([...drivers, { name: "", phone: "", image: "/placeholder.svg?height=50&width=50" }])
  }

  const removeDriver = (index: number) => {
    if (drivers.length > 1) {
      setDrivers(drivers.filter((_, i) => i !== index))
    }
  }

  const addVendor = () => {
    setVendors([...vendors, { name: "", phone: "", image: "/placeholder.svg?height=50&width=50" }])
  }

  const removeVendor = (index: number) => {
    if (vendors.length > 1) {
      setVendors(vendors.filter((_, i) => i !== index))
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Here you would typically send the data to your backend
    console.log({ ...formData, drivers, vendors })
    onClose()
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
              <h3 className="text-lg font-medium mb-4">Route Information</h3>
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
                    <label className="block text-sm text-gray-400 mb-1">Route ID</label>
                    <input
                      type="text"
                      name="routeId"
                      value={formData.routeId}
                      onChange={handleChange}
                      className="w-full bg-[#2a2a2a] border border-gray-700 rounded-md px-3 py-2 text-white"
                      placeholder="e.g. 380424"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-400 mb-1">Side No</label>
                    <input
                      type="text"
                      name="sideNo"
                      value={formData.sideNo}
                      onChange={handleChange}
                      className="w-full bg-[#2a2a2a] border border-gray-700 rounded-md px-3 py-2 text-white"
                      placeholder="e.g. 4040"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm text-gray-400 mb-1">ETA (hours)</label>
                  <input
                    type="text"
                    name="eta"
                    value={formData.eta}
                    onChange={handleChange}
                    className="w-full bg-[#2a2a2a] border border-gray-700 rounded-md px-3 py-2 text-white"
                    placeholder="e.g. 4 hr."
                    required
                  />
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
                      name="departureTime"
                      value={formData.departureTime}
                      onChange={handleChange}
                      className="w-full bg-[#2a2a2a] border border-gray-700 rounded-md px-3 py-2 text-white"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm text-gray-400 mb-1">Arrival Date</label>
                    <input
                      type="date"
                      name="arrivalDate"
                      value={formData.arrivalDate}
                      onChange={handleChange}
                      className="w-full bg-[#2a2a2a] border border-gray-700 rounded-md px-3 py-2 text-white"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-400 mb-1">Arrival Time</label>
                    <input
                      type="time"
                      name="arrivalTime"
                      value={formData.arrivalTime}
                      onChange={handleChange}
                      className="w-full bg-[#2a2a2a] border border-gray-700 rounded-md px-3 py-2 text-white"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm text-gray-400 mb-1">Distance (KM)</label>
                    <input
                      type="text"
                      name="distance"
                      value={formData.distance}
                      onChange={handleChange}
                      className="w-full bg-[#2a2a2a] border border-gray-700 rounded-md px-3 py-2 text-white"
                      placeholder="e.g. 320 KM"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-400 mb-1">Price (ETB)</label>
                    <input
                      type="text"
                      name="price"
                      value={formData.price}
                      onChange={handleChange}
                      className="w-full bg-[#2a2a2a] border border-gray-700 rounded-md px-3 py-2 text-white"
                      placeholder="e.g. 800"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm text-gray-400 mb-1">Total Tickets</label>
                  <input
                    type="number"
                    name="totalTickets"
                    value={formData.totalTickets}
                    onChange={handleChange}
                    className="w-full bg-[#2a2a2a] border border-gray-700 rounded-md px-3 py-2 text-white"
                    placeholder="e.g. 52"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm text-gray-400 mb-1">Status</label>
                  <select
                    name="status"
                    value={formData.status}
                    onChange={handleChange}
                    className="w-full bg-[#2a2a2a] border border-gray-700 rounded-md px-3 py-2 text-white"
                    required
                  >
                    <option value="on-the-way">On the way</option>
                    <option value="tomorrow">Tomorrow</option>
                    <option value="2-days-left">2 Days Left</option>
                    <option value="4-days-left">4 Days Left</option>
                    <option value="passed">Passed</option>
                  </select>
                </div>
              </div>
            </div>

            <div>
              <div className="mb-6">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-medium">Drivers</h3>
                  <button type="button" onClick={addDriver} className="flex items-center gap-1 text-sm text-[#e9d758]">
                    <Plus size={16} /> Add Driver
                  </button>
                </div>

                {drivers.map((driver, index) => (
                  <div key={index} className="mb-4 p-4 border border-gray-700 rounded-md">
                    <div className="flex justify-between mb-3">
                      <h4 className="font-medium">Driver {index + 1}</h4>
                      {drivers.length > 1 && (
                        <button type="button" onClick={() => removeDriver(index)} className="text-red-500">
                          <Trash2 size={16} />
                        </button>
                      )}
                    </div>
                    <div className="flex items-center gap-4 mb-3">
                      <div className="relative w-12 h-12 rounded-full overflow-hidden bg-gray-700">
                        <img src={driver.image || "/placeholder.svg"} alt="Driver"  className="object-cover" />
                      </div>
                      <button type="button" className="text-xs text-[#e9d758] underline">
                        Upload Photo
                      </button>
                    </div>
                    <div className="space-y-3">
                      <div>
                        <label className="block text-sm text-gray-400 mb-1">Name</label>
                        <input
                          type="text"
                          value={driver.name}
                          onChange={(e) => handleDriverChange(index, "name", e.target.value)}
                          className="w-full bg-[#2a2a2a] border border-gray-700 rounded-md px-3 py-2 text-white"
                          placeholder="e.g. Solomon Belay"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm text-gray-400 mb-1">Phone</label>
                        <input
                          type="text"
                          value={driver.phone}
                          onChange={(e) => handleDriverChange(index, "phone", e.target.value)}
                          className="w-full bg-[#2a2a2a] border border-gray-700 rounded-md px-3 py-2 text-white"
                          placeholder="e.g. 0974150725"
                          required
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div>
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-medium">Ticket Vendors</h3>
                  <button type="button" onClick={addVendor} className="flex items-center gap-1 text-sm text-[#e9d758]">
                    <Plus size={16} /> Add Vendor
                  </button>
                </div>

                {vendors.map((vendor, index) => (
                  <div key={index} className="mb-4 p-4 border border-gray-700 rounded-md">
                    <div className="flex justify-between mb-3">
                      <h4 className="font-medium">Vendor {index + 1}</h4>
                      {vendors.length > 1 && (
                        <button type="button" onClick={() => removeVendor(index)} className="text-red-500">
                          <Trash2 size={16} />
                        </button>
                      )}
                    </div>
                    <div className="flex items-center gap-4 mb-3">
                      <div className="relative w-12 h-12 rounded-full overflow-hidden bg-gray-700">
                        <img src={vendor.image || "/placeholder.svg"} alt="Vendor" className="object-cover" />
                      </div>
                      <button type="button" className="text-xs text-[#e9d758] underline">
                        Upload Photo
                      </button>
                    </div>
                    <div className="space-y-3">
                      <div>
                        <label className="block text-sm text-gray-400 mb-1">Name</label>
                        <input
                          type="text"
                          value={vendor.name}
                          onChange={(e) => handleVendorChange(index, "name", e.target.value)}
                          className="w-full bg-[#2a2a2a] border border-gray-700 rounded-md px-3 py-2 text-white"
                          placeholder="e.g. Yodit Tamirat"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm text-gray-400 mb-1">Phone</label>
                        <input
                          type="text"
                          value={vendor.phone}
                          onChange={(e) => handleVendorChange(index, "phone", e.target.value)}
                          className="w-full bg-[#2a2a2a] border border-gray-700 rounded-md px-3 py-2 text-white"
                          placeholder="e.g. 0974150725"
                          required
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-gray-800">
            <button type="button" onClick={onClose} className="px-4 py-2 bg-[#2a2a2a] rounded-md text-white">
              Cancel
            </button>
            <button type="submit" className="px-4 py-2 bg-[#e74c3c] rounded-md text-white">
              Add Route
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
