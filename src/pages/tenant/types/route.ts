export interface Route {
  _id: string;
  from: string;
  to: string;
  status: string;
  selected: boolean;
  routeName?: string;
  sideNo: string;
  duration: string;
  departureTime: string;
  arrivalTime: string;
  distance: string;
  price: number;
  ticketsSold: number;
  totalTickets: number;
  ticketsAvailable: number;
  driver: string;
  assistant?: string;
  vendor: string;
  totalPayment: number;
  // Raw ISO strings for accurate time calculations
  _rawDepartureTime?: string;
  _rawArrivalTime?: string;
  passengers: {
    name: string;
    scale: number;
    phone: string;
    status: string;
  }[];
}

export interface RouteDetails {
  _id: string;
  sideNo: string;
  from: string;
  to: string;
  duration: string;
  departureTime: string;
  arrivalTime: string;
  distance: string;
  price: number;
  ticketsSold: number;
  totalTickets: number;
  ticketsAvailable: number;
  driver: string;
  assistant?: string;
  vendor: string;
  totalPayment: number;
  status: string;
  passengers: {
    name: string;
    scale: number;
    phone: string;
    status: string;
  }[];
}

export interface BusModel {
  id: string;
  name: string;
  capacity: number;
}

export interface Bus {
  id: string;
  plateNumber: string;
  sideNumber: string;
  modelId: string;
}

// Backend API types
export interface CreateRouteRequest {
  busId: string;
  plateNumber: string;
  sideNumber: string;
  driver: string;
  assistant?: string;
  routeName: string;
  from: string;
  to: string;
  price: number;
  distance: number;
  departureTime: string;
  arrivalTime: string;
  duration: string;
}

export interface RouteBooking {
  _id: string;
  routeId: string;
  passengerName: string;
  passengerPhone: string;
  ticketCount: number;
  totalAmount: number;
  status: "booked" | "pending" | "canceled";
  createdAt: string;
}
