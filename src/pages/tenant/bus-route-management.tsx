"use client";

import { useState } from "react";
import type { Route } from "./types/route";
import RouteList from "@/components/route-list";
import RouteDetails from "@/components/route-details";
import AddRouteModal from "@/components/add-route-modal";
// Mock data to match the screenshot
const mockRoutes: Route[] = [
  {
    id: "09432",
    from: "Hawassa",
    to: "Addis Ababa",
    status: "on-the-way",
    selected: false,
  },
  {
    id: "09432",
    from: "Hawassa",
    to: "Addis Ababa",
    status: "on-the-way",
    selected: false,
  },
  {
    id: "09432",
    from: "Hawassa",
    to: "Addis Ababa",
    status: "tomorrow",
    selected: true,
  },
  {
    id: "09432",
    from: "Hawassa",
    to: "Addis Ababa",
    status: "2-days-left",
    selected: false,
  },
  {
    id: "09432",
    from: "Gondar",
    to: "Addis Ababa",
    status: "4-days-left",
    selected: false,
  },
  {
    id: "09432",
    from: "Hawassa",
    to: "Addis Ababa",
    status: "4-days-left",
    selected: false,
  },
  {
    id: "09432",
    from: "Hawassa",
    to: "Addis Ababa",
    status: "passed",
    selected: false,
  },
  {
    id: "09432",
    from: "Hawassa",
    to: "Addis Ababa",
    status: "passed",
    selected: false,
  },
];

// Selected route details to match the screenshot
const selectedRouteDetails = {
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
      orderNo: "024756",
      name: "Liyu Yonas",
      scale: "4 passangers",
      phone: "0974150725",
      status: "confirmed",
    },
    {
      orderNo: "024756",
      name: "Liyu Yonas",
      scale: "4 passangers",
      phone: "0974150725",
      status: "confirmed",
    },
  ],
};

export default function BusRouteManagement() {
  const [activeTab, setActiveTab] = useState("all");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  return (
    <div className='flex flex-col h-screen'>
      <header className='flex justify-between items-center p-4 border-b border-gray-800 -mt-10'>
        <h1 className='!text-2xl font-medium '>Routes</h1>
        <div className='flex gap-2'>
          <button className='flex items-center gap-1 px-3  bg-[#2a2a2a] rounded-md text-sm'>
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
          <button className='flex items-center gap-1 px-3 py-1.5 bg-[#2a2a2a] rounded-md text-sm'>
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
        <RouteList
          routes={mockRoutes}
          activeTab={activeTab}
          setActiveTab={setActiveTab}
        />
        <RouteDetails routeDetails={selectedRouteDetails} />
      </div>
      <AddRouteModal isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)} />
    </div>
  );
}
