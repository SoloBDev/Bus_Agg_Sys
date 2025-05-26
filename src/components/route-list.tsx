"use client"

import type { Route } from "../pages/tenant/types/route"

interface RouteListProps {
  routes: Route[]
  activeTab: string
  setActiveTab: (tab: string) => void
  onSelectRoute: (id: string) => void
}

export default function RouteList({ routes, activeTab, setActiveTab, onSelectRoute }: RouteListProps) {
   // Filter routes based on active tab
   const filteredRoutes = activeTab === "all" ? routes : routes.filter((route) => route.status === activeTab)
 
  return (
    <div className="w-[380px] border-r border-gray-900 overflow-y-auto">
      <div className="flex border-b border-gray-800 gap-2">
        <button
          className={`px-2 !text-sm !font-normal ${
            activeTab === "all" ? "border-b-2 border-[#e9d758] text-[#e9d758]" : "text-gray-400"
          }`}
          onClick={() => setActiveTab("all")}
        >
          All
        </button>
        <button
          className={`px-2 !text-sm !font-normal  ${
            activeTab === "on-the-way" ? "border-b-2 border-[#e9d758] text-[#e9d758]" : "text-gray-400"
          }`}
          onClick={() => setActiveTab("on-the-way")}
        >
          on-the-way
        </button>
        <button
          className={`px-2 !text-sm !font-normal ${
            activeTab === "by-district" ? "border-b-2 border-[#e9d758] text-[#e9d758]" : "text-gray-400"
          }`}
          onClick={() => setActiveTab("by-district")}
        >
          by district
        </button>
        <button
          className={`px-2 !text-sm !font-normal ${
            activeTab === "by-calendar" ? "border-b-2 border-[#e9d758] text-[#e9d758]" : "text-gray-400"
          }`}
          onClick={() => setActiveTab("by-calendar")}
        >
          by calendar
        </button>
      </div>

      <div className="divide-y divide-gray-800">
      {filteredRoutes.map((route) => (
          <RouteCard key={route._id} route={route} onSelect={() => onSelectRoute(route._id)} />
        ))}
      </div>
    </div>
  )
}

interface RouteCardProps {
   route: Route
   onSelect: () => void
 }

function RouteCard({ route, onSelect }: RouteCardProps) {
  return (
   <div
   className={`p-4 flex justify-between items-center cursor-pointer hover:bg-gray-800 ${
     route.selected ? "border-l-4 border-[#e9d758]" : ""
   }`}
   onClick={onSelect}
 >
      <div>
        <h3 className="font-medium">
          {route.from} to {route.to}
        </h3>
        <p className="text-sm text-gray-400">routeID {route._id}</p>
      </div>

      {route.status === "on-the-way" && (
        <span className="px-3 py-1 bg-[#4caf50] bg-opacity-20 text-[#09140a] rounded-md text-xs">on-the-way</span>
      )}

      {route.status === "tomorrow" && (
        <span className="px-3 py-1 bg-[#e9d758] bg-opacity-20 text-[#0b0b04] rounded-md text-xs">Tomorrow</span>
      )}

      {route.status === "2-days-left" && (
        <span className="px-3 py-1 bg-[#e9d758] bg-opacity-20 text-[#020100] rounded-md text-xs">2 Days Left</span>
      )}

      {route.status === "4-days-left" && (
        <span className="px-3 py-1 bg-[#e9d758] bg-opacity-20 text-[#181609] rounded-md text-xs">4 Days Left</span>
      )}

      {route.status === "passed" && (
        <span className="px-3 py-1 bg-gray-600 bg-opacity-20 text-gray-400 rounded-md text-xs">Passed</span>
      )}
    </div>
  )
}
