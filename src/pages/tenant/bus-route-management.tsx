"use client";

import { useState, useEffect, useCallback } from "react";
import type { Route } from "./types/route";
import RouteList from "@/components/route-list";
import RouteDetails from "@/components/route-details";
import AddRouteModal from "@/components/add-route-modal";
import { busAPI } from "@/lib/api";
// // Mock data with updated structure
// const initialRoutes: Route[] = [
//   {
//     _id: "09432-1",
//     from: "Hawassa",
//     to: "Addis Ababa",
//     status: "on-the-way",
//     selected: true,
//     sideNo: "4040",
//     duration: "4 hr.",
//     departureTime: "21/04/2025 04:00 AM",
//     arrivalTime: "21/04/2025 10:20 AM",
//     distance: "320 KM",
//     price: 800,
//     ticketsSold: 25,
//     totalTickets: 52,
//     ticketsAvailable: 27,
//     driver: "Solomon Belay",
//     assistant: "Abebe Kebede",
//     vendor: "Current User",
//     totalPayment: 20000,
//     passengers: [
//       {
//         name: "Liyu Yonas",
//         scale: 4,
//         phone: "0974150725",
//         status: "confirmed",
//       },
//       {
//         name: "Hanna Girma",
//         scale: 2,
//         phone: "0974150727",
//         status: "canceled",
//       },
//       {
//         name: "Abebe Kebede",
//         scale: 2,
//         phone: "0974150726",
//         status: "pending",
//       },
//       {
//         name: "Dawit Haile",
//         scale: 3,
//         phone: "0974150728",
//         status: "confirmed",
//       },
//       {
//         name: "Sara Tesfaye",
//         scale: 2,
//         phone: "0974150729",
//         status: "confirmed",
//       },
//     ],
//   },
//   {
//     _id: "09432-2",
//     from: "Hawassa",
//     to: "Addis Ababa",
//     status: "passed",
//     selected: false,
//     sideNo: "4041",
//     duration: "4 hr.",
//     departureTime: "20/04/2025 06:00 AM",
//     arrivalTime: "20/04/2025 12:20 PM",
//     distance: "320 KM",
//     price: 800,
//     ticketsSold: 30,
//     totalTickets: 52,
//     ticketsAvailable: 22,
//     driver: "Tadesse Bekele",
//     vendor: "Current User",
//     totalPayment: 24000,
//     passengers: [
//       {
//         name: "Kebede Alemu",
//         scale: 2,
//         phone: "0974150726",
//         status: "confirmed",
//       },
//       {
//         name: "Hanna Girma",
//         scale: 3,
//         phone: "0974150727",
//         status: "confirmed",
//       },
//       {
//         name: "Dawit Haile",
//         scale: 1,
//         phone: "0974150728",
//         status: "confirmed",
//       },
//     ],
//   },
//   {
//     _id: "09432-3",
//     from: "Hawassa",
//     to: "Addis Ababa",
//     status: "tomorrow",
//     selected: false,
//     sideNo: "4042",
//     duration: "4 hr.",
//     departureTime: "22/04/2025 04:00 AM",
//     arrivalTime: "22/04/2025 10:20 AM",
//     distance: "320 KM",
//     price: 800,
//     ticketsSold: 15,
//     totalTickets: 52,
//     ticketsAvailable: 37,
//     driver: "Solomon Belay",
//     vendor: "Current User",
//     totalPayment: 12000,
//     passengers: [
//       {
//         name: "Dawit Haile",
//         scale: 2,
//         phone: "0974150728",
//         status: "confirmed",
//       },
//       {
//         name: "Meron Tadesse",
//         scale: 1,
//         phone: "0974150730",
//         status: "pending",
//       },
//     ],
//   },
// ]

export default function BusRouteManagement() {
  const [activeTab, setActiveTab] = useState("all");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [routes, setRoutes] = useState<Route[]>([]);
  const [selectedRouteId, setSelectedRouteId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [initialLoad, setInitialLoad] = useState(true);

  // Enhanced status calculation based on current time vs route times
  const calculateStatus = (departureTime: string, arrivalTime: string) => {
    if (!departureTime) return "active";

    const now = new Date();
    const departure = new Date(departureTime);
    const arrival = new Date(arrivalTime || departureTime);

    // If current time has passed arrival time, route is completed
    if (now > arrival) {
      return "passed";
    }

    // If current time is between departure and arrival, route is on the way
    if (now >= departure && now <= arrival) {
      return "on-the-way";
    }

    // Calculate days until departure for future routes
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const departureDate = new Date(departure);
    departureDate.setHours(0, 0, 0, 0);

    const diffTime = departureDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 1) return "tomorrow";
    if (diffDays === 2) return "2-days-left";
    if (diffDays <= 4) return "4-days-left";
    return "active";
  };

  // Fetch routes from backend
  const fetchRoutes = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      // Get current operator ID (you might want to get this from auth context)
      // const operatorId = localStorage.getItem("operatorId") || "current-operator"

      const data = await busAPI.getRoutes();

      // Convert backend routes to frontend format
      const formattedRoutes: Route[] = (data.routes || data || []).map(
        (route: any, index: number) => {
          const departureTime = formatDateTime(route.departureTime);
          const arrivalTime = formatDateTime(route.arrivalTime);

          return {
            _id: route._id,
            from: route.from,
            to: route.to,
            status:
              route.status ||
              calculateStatus(route.departureTime, route.arrivalTime),
            selected: index === 0,
            routeName: route.routeName || `${route.from}-${route.to}`,
            sideNo: route.sideNo || "0000",
            duration: route.duration || "4 hr.",
            departureTime,
            arrivalTime,
            distance: route.distance || 0,
            price: route.price || 0,
            ticketsSold: route.ticketsSold || 0,
            totalTickets: route.totalTickets || 52,
            ticketsAvailable: route.ticketsAvailable || 52,
            driver: route.driver || "Unknown Driver",
            assistant: route.assistant,
            vendor: route.vendor || "Current User",
            totalPayment: route.totalPayment || 0,
            passengers: route.passengers || [],
            // Store raw ISO strings for status calculations
            _rawDepartureTime: route.departureTime,
            _rawArrivalTime: route.arrivalTime,
          };
        }
      );

      setRoutes(formattedRoutes);
      if (formattedRoutes.length > 0 && !selectedRouteId) {
        setSelectedRouteId(formattedRoutes[0]._id);
      }
    } catch (error) {
      // Current error handling could be more specific
      console.error("Error fetching routes:", error);
      setError(
        error instanceof Error ? error.message : "Failed to fetch routes"
      );
    } finally {
      setLoading(false);
      setInitialLoad(false);
    }
  }, [selectedRouteId]);

  useEffect(() => {
    if (initialLoad) {
      fetchRoutes();
    }
  }, [fetchRoutes, initialLoad]);

  // Format datetime for display
  const formatDateTime = (isoString: string) => {
    if (!isoString) return "";

    const date = new Date(isoString);
    const day = date.getDate().toString().padStart(2, "0");
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const year = date.getFullYear();
    const hours = date.getHours();
    const minutes = date.getMinutes().toString().padStart(2, "0");
    const ampm = hours >= 12 ? "PM" : "AM";
    const hour12 = hours % 12 || 12;

    return `${day}/${month}/${year} ${hour12}:${minutes} ${ampm}`;
  };
  // Function to update route statuses automatically
  // Only update routes if status actually changed
  const updateRouteStatuses = () => {
    setRoutes((prevRoutes) =>
      prevRoutes.map((route) => {
        const newStatus = calculateStatus(
          route._rawDepartureTime || "",
          route._rawArrivalTime || ""
        );
        return newStatus !== route.status
          ? { ...route, status: newStatus }
          : route;
      })
    );
  };

  // Add useEffect for periodic status updates
  useEffect(() => {
    // Update statuses immediately when component mounts
    if (routes.length > 0) {
      updateRouteStatuses();
    }

    // Set up interval to check status every minute
    const statusInterval = setInterval(() => {
      updateRouteStatuses();
    }, 60000); // Check every minute

    return () => clearInterval(statusInterval);
  }, [routes.length]);

  // Find the selected route
  const selectedRoute =
    routes.find((route) => route._id === selectedRouteId) || routes[0];

  // Function to select a route
  const selectRoute = (id: string) => {
    setRoutes(
      routes.map((route) => ({
        ...route,
        selected: route._id === id,
      }))
    );
    setSelectedRouteId(id);
  };

  // Function to add a new route
  const addRoute = (newRoute: Omit<Route, "_id" | "selected" | "status">) => {
    // Refresh routes after adding
    fetchRoutes();
  };

  if (loading) {
    return (
      <div className='flex items-center justify-center h-screen bg-[#121212] text-white'>
        <div className='flex flex-col items-center gap-4'>
          <div className='animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#e9d758]'></div>
          <p className='text-gray-400'>Loading routes...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className='flex flex-col items-center justify-center h-screen bg-[#121212] text-white'>
        <p className='text-red-500 mb-4'>{error}</p>
        <button
          onClick={fetchRoutes}
          className='px-4 py-2 bg-[#e9d758] text-black rounded-md hover:bg-[#d0c14a]'
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className='flex flex-col h-screen'>
      <header className='flex justify-between items-center p-4 border-b border-gray-800 -mt-10'>
        <h1 className='!text-2xl font-medium '>Routes</h1>
        <div className='flex gap-2'>
          <button
            className='flex items-center gap-1 px-3 py-1.5 bg-[#2a2a2a] rounded-md text-sm'
            onClick={() => {
              const routeInfo = selectedRoute
                ? `${selectedRoute.from} to ${selectedRoute.to} - Departure: ${selectedRoute.departureTime}`
                : "No route selected";
              alert(`Sharing route: ${routeInfo}`);
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
            className='flex items-center gap-1 px-3 py-1.5 bg-[#2a2a2a] rounded-md text-sm'
            onClick={() => {
              if (selectedRoute) {
                const exportData = JSON.stringify(selectedRoute, null, 2);
                const blob = new Blob([exportData], {
                  type: "application/json",
                });
                const url = URL.createObjectURL(blob);
                const a = document.createElement("a");
                a.href = url;
                a.download = `route-${selectedRoute._id}.json`;
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);
                URL.revokeObjectURL(url);
              } else {
                alert("No route selected to export");
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
        <RouteList
          routes={routes}
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          onSelectRoute={selectRoute}
        />
        {selectedRoute && (
          <RouteDetails routeId={selectedRouteId ? selectedRouteId : "null"} />
        )}
      </div>
      <AddRouteModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onAddRoute={addRoute}
      />
    </div>
  );
}
