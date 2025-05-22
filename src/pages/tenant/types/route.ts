export interface Route {
   id: string
   from: string
   to: string
   status: string
   selected: boolean
   routeId: string
   sideNo: string
   eta: string
   departureTime: string
   arrivalTime: string
   distance: string
   price: string
   ticketsSold: number
   totalTickets: number
   ticketsAvailable: number
   drivers: {
     name: string
     phone: string
     image: string
   }[]
   vendors: {
     name: string
     phone: string
     image: string
   }[]
   payments: {
     total: string
     breakdown: {
       type: string
       amount: string
     }[]
   }
   passengers: {
     orderNo: string
     name: string
     scale: string
     phone: string
     status: string
   }[]
 
 }
 
 export interface RouteDetails {
   routeId: string
   sideNo: string
   from: string
   to: string
   eta: string
   departureTime: string
   arrivalTime: string
   distance: string
   price: string
   ticketsSold: number
   totalTickets: number
   ticketsAvailable: number
   drivers: {
     name: string
     phone: string
     image: string
   }[]
   vendors: {
     name: string
     phone: string
     image: string
   }[]
   payments: {
     total: string
     breakdown: {
       type: string
       amount: string
     }[]
   }
   passengers: {
     orderNo: string
     name: string
     scale: string
     phone: string
     status: string
   }[]
 }
 