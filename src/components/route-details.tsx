"use client"


import type { RouteDetails as RouteDetailsType } from "../pages/tenant/types/route"
import { Download, Filter } from "lucide-react"
import { useState } from "react"

interface RouteDetailsProps {
  routeDetails: RouteDetailsType
}

export default function RouteDetails({ routeDetails }: RouteDetailsProps) {
   const [passengerFilter, setPassengerFilter] = useState<string>("all")

   // Count only confirmed passengers for ticket calculations
   const confirmedPassengers = routeDetails.passengers.filter((p) => p.status === "confirmed")
   const ticketsSold = confirmedPassengers.length
   const { totalTickets } = routeDetails
   const ticketsAvailable = totalTickets - ticketsSold
  const soldPercentage = (ticketsSold / totalTickets) * 100

    // Filter passengers based on selected filter
    const filteredPassengers =
    passengerFilter === "all"
      ? routeDetails.passengers
      : routeDetails.passengers.filter((p) => p.status === passengerFilter)


  return (
    <div className="flex-1 overflow-y-auto">
      <div className="px-6 py-2">
        <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-medium">
            {routeDetails.from} to {routeDetails.to}
          </h2>
          <span className="text-[#e9d758] font-medium">{routeDetails.price}</span>
        </div>

        <div className="flex gap-8 mb-6">
          {routeDetails.drivers.map((driver, index) => (
            <div key={index} className="flex items-center gap-3">
              <div className="relative w-10 h-10 rounded-full overflow-hidden bg-gray-700">
                <img src={driver.image || "/placeholder.svg"} alt={driver.name}  className="object-cover" />
              </div>
              <div>
                <p className="font-normal ">{driver.name}</p>
                <p className="text-xs text-gray-400">Driver/Assistant</p>
                
              </div>
            </div>
          ))}
        </div>

        <div className="border-t border-gray-800 pt-2">
          <div className="grid grid-cols-6 gap-4 mb-6">
            <div>
              <p className="text-[10px] text-gray-400">route ID</p>
              <p className="font-light text-xs">{routeDetails.routeId}</p>
            </div>
            <div>
              <p className="text-[10px] text-gray-400">Side No_</p>
              <p className="font-light text-xs">{routeDetails.sideNo}</p>
            </div>
            <div>
              <p className="text-[10px] text-gray-400">ETA</p>
              <p className="font-light text-xs">{routeDetails.eta}</p>
            </div>
            <div>
              <p className="text-[10px] text-gray-400">Departure Time</p>
              <p className="font-light text-xs text-[#e9d758]">{routeDetails.departureTime}</p>
            </div>
            <div>
              <p className="text-[10px] text-gray-400">Arrival Time</p>
              <p className="font-light text-xs">{routeDetails.arrivalTime}</p>
            </div>
            <div>
              <p className="text-[10px] text-gray-400">Distance(KM)</p>
              <p className="font-light text-xs">{routeDetails.distance}</p>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4 mb-6">
            <div>
              <p className="text-sm text-gray-400 mb-2">Ticket Sold</p>
              <div>
                <div className="flex justify-between mb-1">
                  <p className="font-medium">
                    {ticketsSold}/{totalTickets} Ticket
                  </p>
                  <p className="text-sm text-gray-400">{ticketsAvailable} tickets Available</p>
                </div>
                <div className="w-full h-2 bg-gray-700 rounded-full overflow-hidden">
                  <div className="h-full bg-[#e9d758]" style={{ width: `${soldPercentage}%` }}></div>
                </div>
              </div>
            </div>

            <div>
              <p className="text-sm text-gray-400 mb-2">Ticket vendors/operators</p>
              <div className="space-y-2">
                {routeDetails.vendors.map((vendor, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <div className="relative w-8 h-8 rounded-full overflow-hidden bg-gray-700">
                      <img src={vendor.image || "/placeholder.svg"} alt={vendor.name} className="object-cover" />
                    </div>
                    <div>
                      <p className="text-sm font-medium">{vendor.name}</p>
                      <p className="text-xs text-gray-400">{vendor.phone}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <p className="text-sm text-gray-400 mb-2">Current Payment report</p>
              <p className="font-medium text-[#e9d758] mb-2">{routeDetails.payments.total}</p>
              <div className="space-y-2">
                {routeDetails.payments.breakdown.map((payment, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-gray-700 flex items-center justify-center">
                      {payment.type === "cash" ? (
                        <span className="text-xs">💵</span>
                      ) : (
                        <span className="text-xs">📱</span>
                      )}
                    </div>
                    <p className="text-sm">{payment.amount}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="mb-4">
            <div className="flex justify-between items-center mb-2">
              <div>
                <h3 className="font-medium">Passenger lists</h3>
                <p className="text-sm text-gray-400">
                  {routeDetails.from} to {routeDetails.to}
                </p>
              </div>
              <div className="flex gap-2">
                <button className="flex items-center gap-1 px-3 py-1.5 border border-[#e9d758] text-[#e9d758] rounded-md text-sm">
                  <Download size={16} />
                  Export
                </button>
                <div className="relative">
                  <select
                    value={passengerFilter}
                    onChange={(e) => setPassengerFilter(e.target.value)}
                    className="appearance-none flex items-center gap-1 px-3 py-1.5 border border-[#e9d758] text-[#e9d758] rounded-md text-sm bg-transparent pr-8"
                  >
                    <option value="all">All</option>
                    <option value="confirmed">Confirmed</option>
                    <option value="pending">Pending</option>
                    <option value="canceled">Canceled</option>
                  </select>
                  <Filter
                    size={16}
                    className="absolute right-2 top-1/2 transform -translate-y-1/2 pointer-events-none"
                  />
                </div>
              </div>
            </div>

            <PassengerTable passengers={filteredPassengers} />
          </div>
        </div>
      </div>
    </div>
  )
}

interface PassengerTableProps {
  passengers: {
    orderNo: string
    name: string
    scale: string
    phone: string
    status: string
  }[]
}

function PassengerTable({ passengers }: PassengerTableProps) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="text-left text-gray-400 text-sm">
            <th className="pb-2 font-normal w-10">
              <input type="checkbox" className="rounded bg-gray-700 border-gray-600" />
            </th>
            <th className="pb-2 font-normal">Order No</th>
            <th className="pb-2 font-normal">Passenger Name</th>
            <th className="pb-2 font-normal">passenger Scale</th>
            <th className="pb-2 font-normal">phone no_</th>
            <th className="pb-2 font-normal">Status</th>
          </tr>
        </thead>
        <tbody>
        {passengers.length > 0 ? (
            passengers.map((passenger, index) => (
            <tr key={index} className="border-t border-gray-800 hover:bg-gray-800 cursor-pointer">
              <td className="py-3">
                <input type="checkbox" className="rounded bg-gray-700 border-gray-600" />
              </td>
              <td className="py-3">{passenger.orderNo}</td>
              <td className="py-3">{passenger.name}</td>
              <td className="py-3">{passenger.scale}</td>
              <td className="py-3">{passenger.phone}</td>
              <td className="py-3">
              <span
                    className={`px-3 py-1 rounded-md text-xs ${
                      passenger.status === "confirmed"
                        ? "bg-[#e9d758] bg-opacity-20 text-[#e9d758]"
                        : passenger.status === "pending"
                          ? "bg-blue-500 bg-opacity-20 text-blue-500"
                          : "bg-red-500 bg-opacity-20 text-red-500"
                    }`}
                  >
                  {passenger.status}
                  </span>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={6} className="py-4 text-center text-gray-400">
                No passengers found with the selected filter
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  )
}
