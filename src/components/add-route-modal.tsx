"use client";

import type React from "react";
import { useState } from "react";
import { X, Plus, Trash2 } from "lucide-react";
import type { Route } from "@/pages/tenant/types/route";

interface AddRouteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddRoute: (newRoute: Omit<Route, "id" | "selected" | "status">) => void;
}

export default function AddRouteModal({
  isOpen,
  onClose,
  onAddRoute,
}: AddRouteModalProps) {
  // Update the form state to remove status and add current user as vendor
  const [formData, setFormData] = useState({
    from: "",
    to: "",
    sideNo: "",
    eta: "",
    departureDate: "",
    departureTime: "",
    distance: "",
    price: "",
    totalTickets: "52",
  });

  // Add current user as vendor (in a real app, this would come from auth context)
  const currentUser = {
    name: "Current User",
    phone: "0974150725",
    image: "/placeholder.svg?height=50&width=50",
  };

  // Generate random 6-digit route ID
  const generateRouteId = () => {
    return Math.floor(100000 + Math.random() * 900000).toString();
  };

  // Calculate arrival date and time based on departure and ETA
  const calculateArrival = (
    departureDate: string,
    departureTime: string,
    etaHours: string
  ) => {
    if (!departureDate || !departureTime || !etaHours)
      return { arrivalDate: "", arrivalTime: "" };

    const [hours, minutes] = departureTime.split(":");
    const date = new Date(`${departureDate}T${hours}:${minutes}:00`);

    // Add ETA hours to departure
    date.setHours(date.getHours() + Number.parseInt(etaHours, 10));

    // Format arrival date and time
    const arrivalDate = date.toISOString().split("T")[0]; // YYYY-MM-DD
    const arrivalHours = date.getHours().toString().padStart(2, "0");
    const arrivalMinutes = date.getMinutes().toString().padStart(2, "0");
    const arrivalTime = `${arrivalHours}:${arrivalMinutes}`;

    return { arrivalDate, arrivalTime };
  };

  const [drivers, setDrivers] = useState([
    { name: "", phone: "", image: "/placeholder.svg?height=50&width=50" },
  ]);
  const [vendors, setVendors] = useState([
    { name: "", phone: "", image: "/placeholder.svg?height=50&width=50" },
  ]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    if (name === "sideNo") {
      const sideNoRegex = /^\d{0,4}$/;
      if (!sideNoRegex.test(value)) return;
    }

    setFormData((prev) => {
      const newData = { ...prev, [name]: value };

      // Calculate arrival date and time when departure or ETA changes
      if (
        name === "departureDate" ||
        name === "departureTime" ||
        name === "eta"
      ) {
        const { arrivalDate, arrivalTime } = calculateArrival(
          newData.departureDate,
          newData.departureTime,
          newData.eta
        );

        // Update form with calculated arrival
        if (arrivalDate && arrivalTime) {
          return {
            ...newData,
            arrivalDate,
            arrivalTime,
          };
        }
      }

      return newData;
    });
  };

  const handleDriverChange = (index: number, field: string, value: string) => {
    const newDrivers = [...drivers];
    newDrivers[index] = { ...newDrivers[index], [field]: value };
    setDrivers(newDrivers);
  };

  const handleVendorChange = (index: number, field: string, value: string) => {
    const newVendors = [...vendors];
    newVendors[index] = { ...newVendors[index], [field]: value };
    setVendors(newVendors);
  };

  const addDriver = () => {
    setDrivers([
      ...drivers,
      { name: "", phone: "", image: "/placeholder.svg?height=50&width=50" },
    ]);
  };

  const removeDriver = (index: number) => {
    if (drivers.length > 1) {
      setDrivers(drivers.filter((_, i) => i !== index));
    }
  };

  const addVendor = () => {
    setVendors([
      ...vendors,
      { name: "", phone: "", image: "/placeholder.svg?height=50&width=50" },
    ]);
  };

  const removeVendor = (index: number) => {
    if (vendors.length > 1) {
      setVendors(vendors.filter((_, i) => i !== index));
    }
  };

  const formatDateTime = (date: string, time: string) => {
    if (!date || !time) return "";

    // Convert date from YYYY-MM-DD to DD/MM/YYYY
    const [year, month, day] = date.split("-");
    const formattedDate = `${day}/${month}/${year}`;

    // Convert time from 24h to 12h format with AM/PM
    const [hours, minutes] = time.split(":");
    const hour = Number.parseInt(hours, 10);
    const ampm = hour >= 12 ? "PM" : "AM";
    const hour12 = hour % 12 || 12;
    const formattedTime = `${hour12}:${minutes} ${ampm}`;

    return `${formattedDate} ${formattedTime}`;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Here you would typically send the data to your backend
    const routeId = generateRouteId();

    // Format departure and arrival times
    const departureTime = formatDateTime(
      formData.departureDate,
      formData.departureTime
    );
    const { arrivalDate, arrivalTime } = calculateArrival(
      formData.departureDate,
      formData.departureTime,
      formData.eta
    );
    const formattedArrivalTime = formatDateTime(arrivalDate, arrivalTime);

    // Create the new route object
    const newRoute: Omit<Route, "id" | "selected" | "status"> = {
      from: formData.from,
      to: formData.to,
      routeId,
      sideNo: formData.sideNo.padStart(4, "0"), // Ensure 4 digits
      eta: `${formData.eta} hr.`,
      departureTime,
      arrivalTime: formattedArrivalTime,
      distance: `${formData.distance} KM`,
      price: `ETB ${formData.price}`,
      ticketsSold: 0,
      totalTickets: Number.parseInt(formData.totalTickets),
      ticketsAvailable: Number.parseInt(formData.totalTickets),
      drivers,
      vendors: [
        // Add current user as the vendor who created this route
        {
          name: currentUser.name,
          phone: currentUser.phone,
          image: currentUser.image,
        },
        ...vendors,
      ],
      payments: {
        total: "ETB 0.00",
        breakdown: [
          { type: "cash", amount: "ETB 0" },
          { type: "mobile", amount: "ETB 0" },
        ],
      },
      passengers: [], // Initially empty as passengers will book later
    };

    // Add the new route
    onAddRoute(newRoute);

    // Reset form and close modal
    resetForm();
    onClose();
  };
  const resetForm = () => {
    setFormData({
      from: "",
      to: "",
      sideNo: "",
      eta: "",
      departureDate: "",
      departureTime: "",
      distance: "",
      price: "",
      totalTickets: "52",
    });
    setDrivers([
      { name: "", phone: "", image: "/placeholder.svg?height=50&width=50" },
    ]);
    setVendors([
      { name: "", phone: "", image: "/placeholder.svg?height=50&width=50" },
    ]);
  };

  if (!isOpen) return null;

  return (
    <div className='fixed inset-0 z-50 flex items-center justify-center'>
      <div
        className='absolute inset-0 bg-black bg-opacity-50 backdrop-blur-sm'
        onClick={onClose}
      ></div>
      <div className='relative bg-[#1a1a1a] rounded-lg w-full max-w-4xl max-h-[90vh] overflow-y-auto'>
        <div className='sticky top-0 bg-[#1a1a1a] z-10 flex justify-between items-center p-4 border-b border-gray-800'>
          <h2 className='text-xl font-medium'>Add New Route</h2>
          <button
            onClick={onClose}
            className='p-1 rounded-full hover:bg-gray-800'
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className='p-6'>
          <div className='grid grid-cols-2 gap-6 mb-6'>
            <div>
              <h3 className='text-lg font-medium mb-4'>Route Information</h3>
              <div className='space-y-4'>
                <div className='grid grid-cols-2 gap-4'>
                  <div>
                    <label className='block text-sm text-gray-400 mb-1'>
                      From
                    </label>
                    <input
                      type='text'
                      name='from'
                      value={formData.from}
                      onChange={handleChange}
                      className='w-full bg-[#2a2a2a] border border-gray-700 rounded-md px-3 py-2 text-white'
                      placeholder='e.g. Hawassa'
                      required
                    />
                  </div>
                  <div>
                    <label className='block text-sm text-gray-400 mb-1'>
                      To
                    </label>
                    <input
                      type='text'
                      name='to'
                      value={formData.to}
                      onChange={handleChange}
                      className='w-full bg-[#2a2a2a] border border-gray-700 rounded-md px-3 py-2 text-white'
                      placeholder='e.g. Addis Ababa'
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className='block text-sm text-gray-400 mb-1'>
                    Side No (4 digits)
                  </label>
                  <input
                    type='text'
                    name='sideNo'
                    value={formData.sideNo}
                    onChange={handleChange}
                    className='w-full bg-[#2a2a2a] border border-gray-700 rounded-md px-3 py-2 text-white'
                    placeholder='e.g. 4040'
                    maxLength={4}
                    pattern='\d{4}'
                    title='Side number must be exactly 4 digits'
                    required
                  />
                  <p className='text-xs text-gray-500 mt-1'>
                    Must be exactly 4 digits
                  </p>
                </div>

                <div>
                  <label className='block text-sm text-gray-400 mb-1'>
                    ETA (hours)
                  </label>
                  <input
                    type='number'
                    name='eta'
                    value={formData.eta}
                    onChange={handleChange}
                    className='w-full bg-[#2a2a2a] border border-gray-700 rounded-md px-3 py-2 text-white'
                    placeholder='e.g. 4'
                    min={"1"}
                    required
                  />
                </div>

                <div className='grid grid-cols-2 gap-4'>
                  <div>
                    <label className='block text-sm text-gray-400 mb-1'>
                      Departure Date
                    </label>
                    <input
                      type='date'
                      name='departureDate'
                      value={formData.departureDate}
                      onChange={handleChange}
                      className='w-full bg-[#2a2a2a] border border-gray-700 rounded-md px-3 py-2 text-white'
                      required
                    />
                  </div>
                  <div>
                    <label className='block text-sm text-gray-400 mb-1'>
                      Departure Time
                    </label>
                    <input
                      type='time'
                      name='departureTime'
                      value={formData.departureTime}
                      onChange={handleChange}
                      className='w-full bg-[#2a2a2a] border border-gray-700 rounded-md px-3 py-2 text-white'
                      required
                    />
                  </div>
                </div>

                <div className='grid grid-cols-2 gap-4'>
                  <div>
                    <label className='block text-sm text-gray-400 mb-1'>
                      Arrival Date (Auto-calculated)
                    </label>
                    <input
                      type='date'
                      value={
                        calculateArrival(
                          formData.departureDate,
                          formData.departureTime,
                          formData.eta
                        ).arrivalDate
                      }
                      className='w-full bg-[#2a2a2a] border border-gray-700 rounded-md px-3 py-2 text-white bg-opacity-50'
                      disabled
                    />
                  </div>
                  <div>
                    <label className='block text-sm text-gray-400 mb-1'>
                      Arrival Time (Auto-calculated)
                    </label>
                    <input
                      type='time'
                      value={
                        calculateArrival(
                          formData.departureDate,
                          formData.departureTime,
                          formData.eta
                        ).arrivalTime
                      }
                      className='w-full bg-[#2a2a2a] border border-gray-700 rounded-md px-3 py-2 text-white bg-opacity-50'
                      disabled
                    />
                  </div>
                </div>

                <div className='grid grid-cols-2 gap-4'>
                  <div>
                    <label className='block text-sm text-gray-400 mb-1'>
                      Distance (KM)
                    </label>
                    <input
                      type='number'
                      name='distance'
                      value={formData.distance}
                      onChange={handleChange}
                      className='w-full bg-[#2a2a2a] border border-gray-700 rounded-md px-3 py-2 text-white'
                      placeholder='e.g. 320'
                      min={"1"}
                      required
                    />
                  </div>
                  <div>
                    <label className='block text-sm text-gray-400 mb-1'>
                      Price (ETB)
                    </label>
                    <input
                      type='number'
                      name='price'
                      value={formData.price}
                      onChange={handleChange}
                      className='w-full bg-[#2a2a2a] border border-gray-700 rounded-md px-3 py-2 text-white'
                      placeholder='e.g. 800'
                      min={"1"}
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className='block text-sm text-gray-400 mb-1'>
                    Total Tickets
                  </label>
                  <input
                    type='number'
                    name='totalTickets'
                    value={formData.totalTickets}
                    onChange={handleChange}
                    className='w-full bg-[#2a2a2a] border border-gray-700 rounded-md px-3 py-2 text-white'
                    placeholder='e.g. 52'
                    min={"26"}
                    required
                  />
                </div>

                <div>
                  <label className='block text-sm text-gray-400 mb-1'>
                    Status
                  </label>
                  <select
                    name='status'
                    value={formData.status}
                    onChange={handleChange}
                    className='w-full bg-[#2a2a2a] border border-gray-700 rounded-md px-3 py-2 text-white'
                    required
                  >
                    <option value='on-the-way'>On the way</option>
                    <option value='tomorrow'>Tomorrow</option>
                    <option value='2-days-left'>2 Days Left</option>
                    <option value='4-days-left'>4 Days Left</option>
                    <option value='passed'>Passed</option>
                  </select>
                </div>
              </div>
            </div>

            <div>
              <div className='mb-6'>
                <div className='flex justify-between items-center mb-4'>
                  <h3 className='text-lg font-medium'>Drivers</h3>
                  <button
                    type='button'
                    onClick={addDriver}
                    className='flex items-center gap-1 text-sm text-[#e9d758]'
                  >
                    <Plus size={16} /> Add Driver
                  </button>
                </div>

                {drivers.map((driver, index) => (
                  <div
                    key={index}
                    className='mb-4 p-4 border border-gray-700 rounded-md'
                  >
                    <div className='flex justify-between mb-3'>
                      <h4 className='font-medium'>Driver {index + 1}</h4>
                      {drivers.length > 1 && (
                        <button
                          type='button'
                          onClick={() => removeDriver(index)}
                          className='text-red-500'
                        >
                          <Trash2 size={16} />
                        </button>
                      )}
                    </div>
                    <div className='flex items-center gap-4 mb-3'>
                      <div className='relative w-12 h-12 rounded-full overflow-hidden bg-gray-700'>
                        <img
                          src={driver.image || "/placeholder.svg"}
                          alt='Driver'
                          className='object-cover'
                        />
                      </div>
                      <button
                        type='button'
                        className='text-xs text-[#e9d758] underline'
                      >
                        Upload Photo
                      </button>
                    </div>
                    <div className='space-y-3'>
                      <div>
                        <label className='block text-sm text-gray-400 mb-1'>
                          Name
                        </label>
                        <input
                          type='text'
                          value={driver.name}
                          onChange={(e) =>
                            handleDriverChange(index, "name", e.target.value)
                          }
                          className='w-full bg-[#2a2a2a] border border-gray-700 rounded-md px-3 py-2 text-white'
                          placeholder='e.g. Solomon Belay'
                          required
                        />
                      </div>
                      <div>
                        <label className='block text-sm text-gray-400 mb-1'>
                          Phone
                        </label>
                        <input
                          type='text'
                          value={driver.phone}
                          onChange={(e) =>
                            handleDriverChange(index, "phone", e.target.value)
                          }
                          className='w-full bg-[#2a2a2a] border border-gray-700 rounded-md px-3 py-2 text-white'
                          placeholder='e.g. 0974150725'
                          required
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div>
                <div className='flex justify-between items-center mb-4'>
                  <h3 className='text-lg font-medium'>
                    Additional Ticket Vendors
                  </h3>
                  <button
                    type='button'
                    onClick={addVendor}
                    className='flex items-center gap-1 text-sm text-[#e9d758]'
                  >
                    <Plus size={16} /> Add Vendor
                  </button>
                </div>

                {/* Display current user as primary vendor */}
                <div className='mb-4 p-4 border border-gray-700 rounded-md bg-gray-800'>
                  <h4 className='font-medium mb-3'>Primary Vendor (You)</h4>
                  <div className='flex items-center gap-4 mb-3'>
                    <div className='relative w-12 h-12 rounded-full overflow-hidden bg-gray-700'>
                      <img
                        src={currentUser.image || "/placeholder.svg"}
                        alt='Current User'
                        className='object-cover'
                      />
                    </div>
                    <div>
                      <p className='font-medium'>{currentUser.name}</p>
                      <p className='text-sm text-gray-400'>
                        {currentUser.phone}
                      </p>
                    </div>
                  </div>
                </div>
                {vendors.map((vendor, index) => (
                  <div
                    key={index}
                    className='mb-4 p-4 border border-gray-700 rounded-md'
                  >
                    <div className='flex justify-between mb-3'>
                      <h4 className='font-medium'>
                        Additional Vendor {index + 1}
                      </h4>
                      <button
                        type='button'
                        onClick={() => removeVendor(index)}
                        className='text-red-500'
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                    <div className='flex items-center gap-4 mb-3'>
                      <div className='relative w-12 h-12 rounded-full overflow-hidden bg-gray-700'>
                        <img
                          src={vendor.image || "/placeholder.svg"}
                          alt='Vendor'
                          className='object-cover'
                        />
                      </div>
                      <button
                        type='button'
                        className='text-xs text-[#e9d758] underline'
                      >
                        Upload Photo
                      </button>
                    </div>
                    <div className='space-y-3'>
                      <div>
                        <label className='block text-sm text-gray-400 mb-1'>
                          Name
                        </label>
                        <input
                          type='text'
                          value={vendor.name}
                          onChange={(e) =>
                            handleVendorChange(index, "name", e.target.value)
                          }
                          className='w-full bg-[#2a2a2a] border border-gray-700 rounded-md px-3 py-2 text-white'
                          placeholder='e.g. Yodit Tamirat'
                          required
                        />
                      </div>
                      <div>
                        <label className='block text-sm text-gray-400 mb-1'>
                          Phone
                        </label>
                        <input
                          type='text'
                          value={vendor.phone}
                          onChange={(e) =>
                            handleVendorChange(index, "phone", e.target.value)
                          }
                          className='w-full bg-[#2a2a2a] border border-gray-700 rounded-md px-3 py-2 text-white'
                          placeholder='e.g. 0974150725'
                          required
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className='flex justify-end gap-3 pt-4 border-t border-gray-800'>
            <button
              type='button'
              onClick={onClose}
              className='px-4 py-2 bg-[#2a2a2a] rounded-md text-white'
            >
              Cancel
            </button>
            <button
              type='submit'
              className='px-4 py-2 bg-[#e74c3c] rounded-md text-white'
            >
              Add Route
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
