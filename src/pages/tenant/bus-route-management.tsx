"use client";

import { useState } from "react";
import type { Route } from "./types/route";
import RouteList from "@/components/route-list";
import RouteDetails from "@/components/route-details";
import AddRouteModal from "@/components/add-route-modal";

// Mock data with complete route details
const initialRoutes: Route[] = [
   {
     id: "09432-1",
     from: "Hawassa",
     to: "Addis Ababa",
     status: "on-the-way",
     selected: true,
     routeId: "380424",
     sideNo: "4040",
     eta: "4 hr.",
     departureTime: "21/04/2025 04:00 AM",
     arrivalTime: "21/04/2025 10:20 AM",
     distance: "320 KM",
     price: "ETB 800",
     ticketsSold: 25,
     totalTickets: 52,
     ticketsAvailable: 27,
     drivers: [
       {
         name: "Solomon Belay",
         phone: "0974150725",
         image: "/placeholder.svg?height=50&width=50",
       },
       {
         name: "Solomon Belay",
         phone: "0974150725",
         image: "/placeholder.svg?height=50&width=50",
       },
     ],
     vendors: [
       {
         name: "Yodit Tamirat",
         phone: "0974150725",
         image: "/placeholder.svg?height=50&width=50",
       },
       {
         name: "Yodit Tamirat",
         phone: "0974150725",
         image: "/placeholder.svg?height=50&width=50",
       },
     ],
     payments: {
       total: "ETB 20,000.00",
       breakdown: [
         { type: "cash", amount: "ETB 14,000" },
         { type: "mobile", amount: "ETB 6,000" },
       ],
     },
     passengers: [
       {
         orderNo: "024756",
         name: "Liyu Yonas",
         scale: "4 passangers",
         phone: "0974150725",
         status: "confirmed",
       },
       {
         orderNo: "024758",
        name: "Hanna Girma",
        scale: "1 passanger",
        phone: "0974150727",
        status: "canceled"
       },
       {
         orderNo: "024757",
         name: "Abebe Kebede",
         scale: "2 passangers",
         phone: "0974150726",
         status: "pending",
       },
     ],
   },
   {
     id: "09432-2",
     from: "Hawassa",
     to: "Addis Ababa",
     status: "on-the-way",
     selected: false,
     routeId: "380425",
     sideNo: "4041",
     eta: "4 hr.",
     departureTime: "21/04/2025 06:00 AM",
     arrivalTime: "21/04/2025 12:20 PM",
     distance: "320 KM",
     price: "ETB 800",
     ticketsSold: 15,
     totalTickets: 52,
     ticketsAvailable: 37,
     drivers: [
       {
         name: "Abebe Kebede",
         phone: "0974150726",
         image: "/placeholder.svg?height=50&width=50",
       },
     ],
     vendors: [
       {
         name: "Yodit Tamirat",
         phone: "0974150725",
         image: "/placeholder.svg?height=50&width=50",
       },
     ],
     payments: {
       total: "ETB 12,000.00",
       breakdown: [
         { type: "cash", amount: "ETB 8,000" },
         { type: "mobile", amount: "ETB 4,000" },
       ],
     },
     passengers: [
       {
         orderNo: "024757",
         name: "Kebede Alemu",
         scale: "2 passangers",
         phone: "0974150726",
         status: "confirmed",
       },
       {
         orderNo: "024758",
         name: "Hanna Girma",
         scale: "3 passangers",
         phone: "0974150727",
         status: "confirmed",
       },
       {
         orderNo: "024759",
         name: "Dawit Haile",
         scale: "2 passangers",
         phone: "0974150728",
         status: "pending",
       },
     ],
   },
   {
     id: "09432-3",
     from: "Hawassa",
     to: "Addis Ababa",
     status: "tomorrow",
     selected: false,
     routeId: "380426",
     sideNo: "4042",
     eta: "4 hr.",
     departureTime: "22/04/2025 04:00 AM",
     arrivalTime: "22/04/2025 10:20 AM",
     distance: "320 KM",
     price: "ETB 800",
     ticketsSold: 10,
     totalTickets: 52,
     ticketsAvailable: 42,
     drivers: [
       {
         name: "Solomon Belay",
         phone: "0974150725",
         image: "/placeholder.svg?height=50&width=50",
       },
     ],
     vendors: [
       {
         name: "Yodit Tamirat",
         phone: "0974150725",
         image: "/placeholder.svg?height=50&width=50",
       },
     ],
     payments: {
       total: "ETB 8,000.00",
       breakdown: [
         { type: "cash", amount: "ETB 5,000" },
         { type: "mobile", amount: "ETB 3,000" },
       ],
     },
     passengers: [
       {
         orderNo: "024759",
         name: "Dawit Haile",
         scale: "2 passangers",
         phone: "0974150728",
         status: "confirmed",
       },
     ],
   },
   {
     id: "09432-4",
     from: "Hawassa",
     to: "Addis Ababa",
     status: "2-days-left",
     selected: false,
     routeId: "380427",
     sideNo: "4043",
     eta: "4 hr.",
     departureTime: "23/04/2025 04:00 AM",
     arrivalTime: "23/04/2025 10:20 AM",
     distance: "320 KM",
     price: "ETB 800",
     ticketsSold: 5,
     totalTickets: 52,
     ticketsAvailable: 47,
     drivers: [
       {
         name: "Solomon Belay",
         phone: "0974150725",
         image: "/placeholder.svg?height=50&width=50",
       },
     ],
     vendors: [
       {
         name: "Yodit Tamirat",
         phone: "0974150725",
         image: "/placeholder.svg?height=50&width=50",
       },
     ],
     payments: {
       total: "ETB 4,000.00",
       breakdown: [
         { type: "cash", amount: "ETB 2,000" },
         { type: "mobile", amount: "ETB 2,000" },
       ],
     },
     passengers: [
       {
         orderNo: "024760",
         name: "Sara Tesfaye",
         scale: "1 passanger",
         phone: "0974150729",
         status: "confirmed",
       },
     ],
   },
   {
     id: "09432-5",
     from: "Gondar",
     to: "Addis Ababa",
     status: "4-days-left",
     selected: false,
     routeId: "380428",
     sideNo: "4044",
     eta: "6 hr.",
     departureTime: "25/04/2025 04:00 AM",
     arrivalTime: "25/04/2025 12:20 PM",
     distance: "450 KM",
     price: "ETB 1200",
     ticketsSold: 3,
     totalTickets: 52,
     ticketsAvailable: 49,
     drivers: [
       {
         name: "Tadesse Bekele",
         phone: "0974150730",
         image: "/placeholder.svg?height=50&width=50",
       },
     ],
     vendors: [
       {
         name: "Yodit Tamirat",
         phone: "0974150725",
         image: "/placeholder.svg?height=50&width=50",
       },
     ],
     payments: {
       total: "ETB 3,600.00",
       breakdown: [
         { type: "cash", amount: "ETB 1,200" },
         { type: "mobile", amount: "ETB 2,400" },
       ],
     },
     passengers: [
       {
         orderNo: "024761",
         name: "Henok Girma",
         scale: "1 passanger",
         phone: "0974150731",
         status: "confirmed",
       },
     ],
   },
 ]

export default function BusRouteManagement() {
  const [activeTab, setActiveTab] = useState("all");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [routes, setRoutes] = useState<Route[]>(initialRoutes)
  const [selectedRouteId, setSelectedRouteId] = useState<string>(initialRoutes[0].id)

  // Find the selected route
  const selectedRoute = routes.find((route) => route.id === selectedRouteId) || routes[0]

  // Function to select a route
  const selectRoute = (id: string) => {
    setRoutes(
      routes.map((route) => ({
        ...route,
        selected: route.id === id,
      })),
    )
    setSelectedRouteId(id)
  }

  // Function to add a new route
  const addRoute = (newRoute: Omit<Route, "id" | "selected" | "status">) => {
    // Generate a unique ID
    const id = `${newRoute.routeId}-${Date.now()}`

    // Calculate status based on departure date
    const status = calculateStatus(newRoute.departureTime)

    // Create the new route object
    const route: Route = {
      ...newRoute,
      id,
      selected: false,
      status,
    }

    // Add the new route to the end of the list
    setRoutes([...routes, route])
  }

  // Calculate status based on departure date
  const calculateStatus = (departureTime: string) => {
    // Extract date from the departure time string (format: "DD/MM/YYYY HH:MM AM/PM")
    const dateParts = departureTime.split(" ")[0].split("/")
    const departureDateStr = `${dateParts[2]}-${dateParts[1]}-${dateParts[0]}`
    const departureDate = new Date(departureDateStr)

    // Get today's date
    const today = new Date()
    today.setHours(0, 0, 0, 0)

    // Get tomorrow's date
    const tomorrow = new Date(today)
    tomorrow.setDate(tomorrow.getDate() + 1)

    // Calculate the difference in days
    const diffTime = departureDate.getTime() - today.getTime()
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

    // Determine status based on the difference in days
    if (diffDays < 0) return "passed"
    if (diffDays === 0) return "on-the-way"
    if (diffDays === 1) return "tomorrow"
    if (diffDays === 2) return "2-days-left"
    if (diffDays <= 4) return "4-days-left"
    return "4-days-left" // Default for dates more than 4 days away
  }

  return (
    <div className='flex flex-col h-screen'>
      <header className='flex justify-between items-center p-4 border-b border-gray-800 -mt-10'>
        <h1 className='!text-2xl font-medium '>Routes</h1>
        <div className='flex gap-2'>
        <button
            className="flex items-center gap-1 px-3 py-1.5 bg-[#2a2a2a] rounded-md text-sm"
            onClick={() => {
              // Share functionality - create a shareable link or text
              const routeInfo = selectedRoute
                ? `${selectedRoute.from} to ${selectedRoute.to} - Departure: ${selectedRoute.departureTime}`
                : "No route selected"
              alert(`Sharing route: ${routeInfo}`)
              // In a real app, this would open a share dialog or copy to clipboard
            }}
          >
            <svg
              xmlns='http://www.w3.org/2000/svg'
              width='12'
              height='12'
              viewBox='0 0 24 24'
              fill='none'
              stroke='currentColor'
              strokeWidth='2'
              strokeLinecap='round'
              strokeLinejoin='round'
              className='lucide lucide-share'
            >
              <path d='M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8' />
              <polyline points='16 6 12 2 8 6' />
              <line x1='12' y1='2' x2='12' y2='15' />
            </svg>
            <span className='text-sm font-light'>Share</span>
          </button>
          <button
            className="flex items-center gap-1 px-3 py-1.5 bg-[#2a2a2a] rounded-md text-sm"
            onClick={() => {
              // Export functionality - export route data
              if (selectedRoute) {
                const exportData = JSON.stringify(selectedRoute, null, 2)
                const blob = new Blob([exportData], { type: "application/json" })
                const url = URL.createObjectURL(blob)
                const a = document.createElement("a")
                a.href = url
                a.download = `route-${selectedRoute.routeId}.json`
                document.body.appendChild(a)
                a.click()
                document.body.removeChild(a)
                URL.revokeObjectURL(url)
              } else {
                alert("No route selected to export")
              }
            }}
          >
            <svg
              xmlns='http://www.w3.org/2000/svg'
              width='12'
              height='12'
              viewBox='0 0 24 24'
              fill='none'
              stroke='currentColor'
              strokeWidth='2'
              strokeLinecap='round'
              strokeLinejoin='round'
              className='lucide lucide-download'
            >
              <path d='M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4' />
              <polyline points='7 10 12 15 17 10' />
              <line x1='12' y1='15' x2='12' y2='3' />
            </svg>
            <span className='text-sm font-light'>Export</span>
          </button>
          <button
            className='flex items-center gap-1 px-4 py-1.5 !bg-[#e1ef46]/80 rounded-md text-sm text-gray-900'
            onClick={() => setIsAddModalOpen(true)}
          >
            <svg
              xmlns='http://www.w3.org/2000/svg'
              width='16'
              height='16'
              viewBox='0 0 24 24'
              fill='none'
              stroke='currentColor'
              strokeWidth='2'
              strokeLinecap='round'
              strokeLinejoin='round'
              className='lucide lucide-plus'
            >
              <line x1='12' y1='5' x2='12' y2='19' />
              <line x1='5' y1='12' x2='19' y2='12' />
            </svg>
            ADD
          </button>
        </div>
      </header>

      <div className='flex flex-1 overflow-hidden'>
      <RouteList routes={routes} activeTab={activeTab} setActiveTab={setActiveTab} onSelectRoute={selectRoute} />
        <RouteDetails routeDetails={selectedRoute} />
      </div>
      <AddRouteModal isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)} onAddRoute={addRoute} />
    </div>
  );
}
