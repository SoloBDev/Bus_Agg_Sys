"use client";

import type { RouteDetails } from "../pages/tenant/types/route";
import { Download, Filter, RefreshCw } from "lucide-react";
import { useState, useEffect } from "react";
import { busAPI } from "@/lib/api";

// interface RouteDetailsProps {
//   routeDetails: RouteDetailsType;
// }

// interface Booking {
//   _id: string;
//   routeId: string;
//   passengerName: string;
//   passengerPhone: string;
//   ticketCount: number;
//   totalAmount: number;
//   status: "booked" | "pending" | "canceled" | "attended" | "missed" | "refunded"
//   createdAt: string;
// }

export default function RouteDetails({routeId}: { routeId: string }) {
  console.log("RouteDetails component rendered with routeId:", routeId);
  const [passengerFilter, setPassengerFilter] = useState<string>("all");
  const [aggregatedRoute, setAggregatedRoute] = useState<RouteDetails | null>(
    null
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentTime, setCurrentTime] = useState(new Date());

  // Update current time every minute
  useEffect(() => {
    const timeInterval = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000); // Update every minute

    return () => clearInterval(timeInterval);
  }, [routeId]);

  // Calculate journey progress for on-the-way routes
  const getJourneyProgress = () => {
    if (!aggregatedRoute) return null;
    if (
      aggregatedRoute.status !== "on-the-way" ||
      !aggregatedRoute.departureTime ||
      !aggregatedRoute.arrivalTime
    ) {
      return null;
    }

    const departure = new Date(aggregatedRoute.departureTime);
    const arrival = new Date(aggregatedRoute.arrivalTime);
    const now = currentTime;

    const totalDuration = arrival.getTime() - departure.getTime();
    const elapsed = now.getTime() - departure.getTime();
    const progress = Math.max(
      0,
      Math.min(100, (elapsed / totalDuration) * 100)
    );

    const remainingTime = arrival.getTime() - now.getTime();
    const remainingHours = Math.floor(remainingTime / (1000 * 60 * 60));
    const remainingMinutes = Math.floor(
      (remainingTime % (1000 * 60 * 60)) / (1000 * 60)
    );

    return {
      progress,
      remainingHours,
      remainingMinutes,
      isOverdue: remainingTime < 0,
    };
  };

  const journeyProgress = getJourneyProgress();

  // Determine filter options based on route status
  const getFilterOptions = () => {
    if (!aggregatedRoute) return [];
    const isJourneyStarted =
      aggregatedRoute.status === "on-the-way" ||
      aggregatedRoute.status === "passed";

    if (isJourneyStarted) {
      return [
        { value: "all", label: "All" },
        { value: "attended", label: "Attended" },
        { value: "missed", label: "Missed" },
        { value: "refunded", label: "Refunded" },
      ];
    } else {
      return [
        { value: "all", label: "All" },
        { value: "booked", label: "Booked" },
        { value: "pending", label: "Pending" },
        { value: "canceled", label: "Canceled" },
      ];
    }
  };

  const filterOptions = getFilterOptions();

  // Fetch bookings from backend
  const fetchAggregatedRoute = async () => {
    if (!routeId) return;

    setLoading(true);
    setError(null);
    try {
      const response = await busAPI.getAggregatedRoute(routeId);
      setAggregatedRoute(response.data || response || []);
    } catch (error) {
      console.error("Error fetching bookings:", error);
      setError("Failed to fetch bookings");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // const fetchBookings = async () => {
    //   if (!routeDetails._id) return;

    //   setLoading(true);
    //   setError(null);
    //   try {
    //     const data = await busAPI.getAggregatedRoute(routeDetails._id);
    //     setAggregatedRoute(data.bookings || data || []);
    //   } catch (error) {
    //     console.error("Error fetching bookings:", error);
    //     setError("Failed to fetch bookings");
    //   } finally {
    //     setLoading(false);
    //   }
    // };

    fetchAggregatedRoute();
  }, [routeId]);

  // Reset filter when route status changes
  useEffect(() => {
    setPassengerFilter("all");
  }, [
    aggregatedRoute?.status,
    aggregatedRoute?._id,
    aggregatedRoute?.from,
    aggregatedRoute?.to,
  ]);

  // Use route passengers directly or convert bookings if needed
  if (!aggregatedRoute) {
    return (
      <div className='text-center py-4 text-gray-400'>
        Loading route details...
      </div>
    );
  }
  const passengers = aggregatedRoute.passengers.map((passenger, index) => ({
    orderNo: (index + 1).toString(),
    name: passenger.name,
    scale: passenger.scale,
    phone: passenger.phone,
    status: passenger.status,
    totalAmount: passenger.scale * aggregatedRoute.price,
  }));
  // : bookings.map((booking, index) => ({
  //     orderNo: (index + 1).toString(),
  //     name: booking.passengerName,
  //     scale: booking.ticketCount,
  //     phone: booking.passengerPhone,
  //     status: booking.status,
  //     totalAmount: booking.totalAmount,
  //   }));

  // Count passengers by status
  const getPassengerCounts = () => {
    const isJourneyStarted =
      aggregatedRoute.status === "on-the-way" ||
      aggregatedRoute.status === "passed";

    if (isJourneyStarted) {
      if (!aggregatedRoute) return null;

      return {
        attended: passengers.filter((p) => p.status === "attended").length,
        missed: passengers.filter((p) => p.status === "missed").length,
        refunded: passengers.filter((p) => p.status === "refunded").length,
      };
    } else {
      return {
        booked: passengers.filter((p) => p.status === "booked").length,
        pending: passengers.filter((p) => p.status === "pending").length,
        canceled: passengers.filter((p) => p.status === "canceled").length,
      };
    }
  };

  const passengerCounts = getPassengerCounts();

  // Count confirmed passengers and sum their scales for ticket calculations
  const confirmedPassengers = passengers.filter(
    (p) => p.status === "booked" || p.status === "attended"
  );
  const ticketsSold = confirmedPassengers.reduce((total, passenger) => {
    return total + passenger.scale;
  }, 0);

  const { totalTickets } = aggregatedRoute;
  const ticketsAvailable = totalTickets - ticketsSold;
  const soldPercentage = (ticketsSold / totalTickets) * 100;

  // Calculate total payment based on confirmed passengers
  const totalPayment = confirmedPassengers.reduce((total, passenger) => {
    return total + (passenger.totalAmount || 0);
  }, 0);

  // Filter passengers based on selected filter
  const filteredPassengers =
    passengerFilter === "all"
      ? passengers
      : passengers.filter((p) => p.status === passengerFilter);

  // CSV Export functionality
  const exportToCSV = () => {
    const headers = [
      "No",
      "Passenger Name",
      "Scale",
      "Phone No",
      "Payment Amount",
      "Status",
    ];

    const csvData = [
      headers,
      ...filteredPassengers.map((passenger) => [
        passenger.orderNo,
        passenger.name,
        passenger.scale.toString(),
        passenger.phone,
        `ETB ${passenger.totalAmount?.toFixed(2) || "0.00"}`,
        passenger.status,
      ]),
    ];

    const csvContent = csvData.map((row) => row.join(",")).join("\n");
    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `passengers-${aggregatedRoute._id}-${aggregatedRoute.from}-to-${aggregatedRoute.to}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className='flex-1 flex flex-col h-full'>
      {/* Sticky Header Section */}
      <div className='sticky top-0 z-10 bg-[#121212] border-b border-gray-800'>
        <div className='flex justify-between items-center mb-6'>
          <div>
            <h2 className='text-xl font-medium'>
              {aggregatedRoute.from} to {aggregatedRoute.to}
            </h2>
            {journeyProgress && (
              <div className='mt-2'>
                <div className='flex items-center gap-2 mb-1'>
                  <span className='text-sm text-gray-400'>
                    Journey Progress:
                  </span>
                  <span className='text-sm font-medium text-[#4caf50]'>
                    {journeyProgress.progress.toFixed(1)}%
                  </span>
                  {journeyProgress.isOverdue ? (
                    <span className='text-xs text-red-500 font-medium'>
                      OVERDUE
                    </span>
                  ) : (
                    <span className='text-xs text-blue-400'>
                      {journeyProgress.remainingHours}h{" "}
                      {journeyProgress.remainingMinutes}m remaining
                    </span>
                  )}
                </div>
                <div className='w-full h-2 bg-gray-700 rounded-full overflow-hidden'>
                  <div
                    className={`h-full transition-all duration-1000 ${
                      journeyProgress.isOverdue ? "bg-red-500" : "bg-[#4caf50]"
                    }`}
                    style={{
                      width: `${Math.min(100, journeyProgress.progress)}%`,
                    }}
                  ></div>
                </div>
              </div>
            )}
          </div>
          <span className='text-[#e9d758] font-medium'>
            ETB {aggregatedRoute.price}
          </span>
        </div>

        <div className='flex gap-8 mb-6'>
          <div className='flex items-center gap-3'>
            <div className='relative w-10 h-10 rounded-full overflow-hidden bg-gray-700'>
              <img
                src='/placeholder.svg?height=50&width=50'
                alt={aggregatedRoute.driver}
                className='object-cover'
              />
            </div>
            <div>
              <p className='font-normal'>{aggregatedRoute.driver}</p>
              <p className='text-xs text-gray-400'>Driver</p>
            </div>
          </div>
          {aggregatedRoute.assistant && (
            <div className='flex items-center gap-3'>
              <div className='relative w-10 h-10 rounded-full overflow-hidden bg-gray-700'>
                <img
                  src='/placeholder.svg?height=50&width=50'
                  alt={aggregatedRoute.assistant}
                  className='object-cover'
                />
              </div>
              <div>
                <p className='font-normal'>{aggregatedRoute.assistant}</p>
                <p className='text-xs text-gray-400'>Assistant</p>
              </div>
            </div>
          )}
        </div>

        <div className='border-t border-gray-800 pt-4'>
          <div className='grid grid-cols-6 gap-4 mb-6'>
            <div>
              <p className='text-[10px] text-gray-400'>route ID</p>
              <p className='font-light text-xs'>{aggregatedRoute._id}</p>
            </div>
            <div>
              <p className='text-[10px] text-gray-400'>Side No_</p>
              <p className='font-light text-xs'>{aggregatedRoute.sideNo}</p>
            </div>
            <div>
              <p className='text-[10px] text-gray-400'>Duration</p>
              <p className='font-light text-xs'>{aggregatedRoute.duration}</p>
            </div>
            <div>
              <p className='text-[10px] text-gray-400'>Departure Time</p>
              <p className='font-light text-xs text-[#e9d758]'>
                {aggregatedRoute.departureTime}
              </p>
            </div>
            <div>
              <p className='text-[10px] text-gray-400'>Arrival Time</p>
              <p className='font-light text-xs'>
                {aggregatedRoute.arrivalTime}
              </p>
            </div>
            <div>
              <p className='font-light text-xs'>
                {aggregatedRoute.distance} KM
              </p>
            </div>
          </div>

          <div className='grid grid-cols-3 gap-4 mb-6'>
            <div>
              <p className='text-sm text-gray-400 mb-2'>Ticket Status</p>
              <div>
                <div className='flex justify-between mb-1'>
                  <p className='font-medium'>
                    {ticketsSold}/{totalTickets} Tickets
                  </p>
                  <p className='text-sm text-gray-400'>
                    {ticketsAvailable} Available
                  </p>
                </div>
                <div className='w-full h-2 bg-gray-700 rounded-full overflow-hidden'>
                  <div
                    className='h-full bg-[#e9d758]'
                    style={{ width: `${soldPercentage}%` }}
                  ></div>
                </div>
                <div className='mt-2 text-xs text-gray-400'>
                  {soldPercentage.toFixed(1)}% capacity filled
                </div>
              </div>
            </div>

            <div>
              <p className='text-sm text-gray-400 mb-2'>
                Ticket vendor/operator
              </p>
              <div className='flex items-center gap-2'>
                <div className='relative w-8 h-8 rounded-full overflow-hidden bg-gray-700'>
                  <img
                    src='/placeholder.svg?height=50&width=50'
                    alt={aggregatedRoute.vendor}
                    className='object-cover'
                  />
                </div>
                <div>
                  <p className='text-sm font-medium'>
                    {aggregatedRoute.vendor}
                  </p>
                  <p className='text-xs text-[#e9d758]'>Route Creator</p>
                </div>
              </div>
            </div>

            <div>
              <p className='text-sm text-gray-400 mb-2'>Total Payment</p>
              <p className='font-medium text-[#e9d758] mb-2'>
                ETB {totalPayment.toFixed(2)}
              </p>
              <p className='text-xs text-gray-400'>
                Sum of confirmed payment amounts
              </p>
            </div>
          </div>

          <div className='mb-4'>
            <div className='flex justify-between items-center mb-2'>
              <div>
                <h3 className='font-medium'>Passenger lists</h3>
                <p className='text-sm text-gray-400'>
                  {aggregatedRoute.from} to {aggregatedRoute.to}
                </p>
                {error && <p className='text-sm text-red-500'>{error}</p>}
              </div>
              <div className='flex gap-2'>
                <button
                  onClick={fetchAggregatedRoute}
                  className='flex items-center gap-1 px-3 py-1.5 border border-gray-600 text-gray-300 rounded-md text-sm hover:bg-gray-800'
                  disabled={loading}
                >
                  <RefreshCw
                    className={`w-4 h-4 ${loading ? "animate-spin" : ""}`}
                  />
                  Refresh
                </button>
                <button
                  onClick={exportToCSV}
                  className='flex items-center gap-1 px-3 py-1.5 border border-[#e9d758] text-[#e9d758] rounded-md text-sm'
                >
                  <Download size={16} />
                  Export
                </button>
                <div className='relative'>
                  <select
                    value={passengerFilter}
                    onChange={(e) => setPassengerFilter(e.target.value)}
                    className='appearance-none flex items-center gap-1 px-3 py-1.5 border border-[#e9d758] text-[#e9d758] rounded-md text-sm bg-transparent pr-8'
                  >
                    {filterOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                        {option.value !== "all" &&
                          ` (${
                            passengerCounts &&
                            (passengerCounts[
                              option.value as keyof typeof passengerCounts
                            ] ||
                              0)
                          })`}
                      </option>
                    ))}
                  </select>
                  <Filter
                    size={16}
                    className='absolute right-2 top-1/2 transform -translate-y-1/2 pointer-events-none'
                  />
                </div>
              </div>
            </div>
            <div className='flex-1 overflow-y-auto px-6 pb-6'>
              {" "}
              {/* Added flex-1 and overflow-y-auto */}
              {loading ? (
                <div className='text-center py-4 text-gray-400'>
                  Loading bookings...
                </div>
              ) : (
                <PassengerTable
                  passengers={filteredPassengers}
                  routeId={aggregatedRoute._id}
                />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

interface PassengerTableProps {
  passengers: {
    orderNo: string;
    name: string;
    scale: number;
    phone: string;
    status: string;
    totalAmount?: number;
  }[];
  routeId: string;
}

function PassengerTable({ passengers }: PassengerTableProps) {
  return (
    <div className='overflow-x-auto'>
      <table className='w-full'>
        <thead>
          <tr className='text-left text-gray-400 text-sm'>
            <th className='pb-2 font-normal w-10'>
              <input
                type='checkbox'
                className='rounded bg-gray-700 border-gray-600'
              />
            </th>
            <th className='pb-2 font-normal'>No</th>
            <th className='pb-2 font-normal'>Passenger Name</th>
            <th className='pb-2 font-normal'>Scale</th>
            <th className='pb-2 font-normal'>phone no_</th>
            <th className='pb-2 font-normal'>Payment Amount</th>
            <th className='pb-2 font-normal'>Status</th>
          </tr>
        </thead>
        <tbody>
          {passengers.length > 0 ? (
            passengers.map((passenger, index) => (
              <tr
                key={index}
                className='border-t border-gray-800 hover:bg-gray-800 cursor-pointer'
              >
                <td className='py-3'>
                  <input
                    type='checkbox'
                    className='rounded bg-gray-700 border-gray-600'
                  />
                </td>
                <td className='py-3'>{passenger.orderNo}</td>
                <td className='py-3'>{passenger.name}</td>
                <td className='py-3'>{passenger.scale}</td>
                <td className='py-3'>{passenger.phone}</td>
                <td className='py-3 text-[#e9d758]'>
                  ETB {passenger.totalAmount?.toFixed(2) || "0.00"}
                </td>
                <td className='py-3'>
                  <span
                    className={`px-3 py-1 rounded-md text-xs ${
                      passenger.status === "booked" ||
                      passenger.status === "attended"
                        ? "bg-[#e9d758] bg-opacity-20 text-[#e9d758]"
                        : passenger.status === "pending"
                        ? "bg-blue-500 bg-opacity-20 text-blue-500"
                        : passenger.status === "missed"
                        ? "bg-orange-500 bg-opacity-20 text-orange-500"
                        : passenger.status === "refunded"
                        ? "bg-purple-500 bg-opacity-20 text-purple-500"
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
              <td colSpan={7} className='py-4 text-center text-gray-400'>
                No passengers found with the selected filter
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
