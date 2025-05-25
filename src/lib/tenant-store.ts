import { create } from "zustand"
import { persist } from "zustand/middleware"

export interface Tenant {
  id: string
  busBrandName: string
  tinNumber: string
  contactPhone: string
  contactEmail: string
  address: string
  logo?: string
  supportDocument?: string
  operatorName: string
  email: string
  phone: string
  status: "pending" | "active" | "suspended"
  routes: number
  buses: number
  revenue: string
  joinDate: string
  registrationDate: string
  operators: number
}

export interface Notification {
  id: string
  title: string
  message: string
  date: string
  type: "tenant_registration" | "tenant_approved" | "tenant_rejected" | "general"
  isRead: boolean
  tenantId?: string
  redirectTo?: string
}

interface TenantStore {
  tenants: Tenant[]
  notifications: Notification[]
  addTenant: (
    tenant: Omit<
      Tenant,
      "id" | "status" | "routes" | "buses" | "revenue" | "joinDate" | "registrationDate" | "operators"
    >,
  ) => void
  approveTenant: (tenantId: string) => void
  rejectTenant: (tenantId: string) => void
  suspendTenant: (tenantId: string) => void
  deleteTenant: (tenantId: string) => void
  markNotificationAsRead: (notificationId: string) => void
  getUnreadNotifications: () => Notification[]
  getPendingTenants: () => Tenant[]
  getActiveTenants: () => Tenant[]
  getSuspendedTenants: () => Tenant[]
}

export const useTenantStore = create<TenantStore>()(
  persist(
    (set, get) => ({
      tenants: [
        {
          id: "1",
          busBrandName: "Abay Bus",
          tinNumber: "TIN001234567",
          contactPhone: "+251911123456",
          contactEmail: "info@abaybus.com",
          address: "Addis Ababa, Ethiopia",
          operatorName: "John Doe",
          email: "john@abaybus.com",
          phone: "+251911123456",
          status: "active",
          routes: 12,
          buses: 24,
          revenue: "ETB 1,234,567",
          joinDate: "Jan 15, 2023",
          registrationDate: "Jan 10, 2023",
          operators: 3,
        },
        {
          id: "2",
          busBrandName: "Selam Bus",
          tinNumber: "TIN001234568",
          contactPhone: "+251911123457",
          contactEmail: "info@selambus.com",
          address: "Bahir Dar, Ethiopia",
          operatorName: "Jane Smith",
          email: "jane@selambus.com",
          phone: "+251911123457",
          status: "active",
          routes: 8,
          buses: 16,
          revenue: "ETB 987,654",
          joinDate: "Mar 22, 2023",
          registrationDate: "Mar 18, 2023",
          operators: 2,
        },
      ],
      notifications: [
        {
          id: "1",
          title: "System Update",
          message: "New features have been added to the dashboard",
          date: new Date().toISOString(),
          type: "general",
          isRead: true,
        },
      ],

      addTenant: (tenantData) => {
        const newTenant: Tenant = {
          ...tenantData,
          id: Date.now().toString(),
          status: "pending",
          routes: 0,
          buses: 0,
          revenue: "ETB 0",
          joinDate: "",
          registrationDate: new Date().toLocaleDateString(),
          operators: 1,
        }

        const notification: Notification = {
          id: Date.now().toString(),
          title: "New Tenant Registration",
          message: `${tenantData.busBrandName} has registered and is waiting for approval`,
          date: new Date().toISOString(),
          type: "tenant_registration",
          isRead: false,
          tenantId: newTenant.id,
          redirectTo: "/admin/tenants?tab=pending-approval",
        }
        

        set((state) => ({
          tenants: [...state.tenants, newTenant],
          notifications: [notification, ...state.notifications],
        }))
        
      },

      

      approveTenant: (tenantId) => {
        set((state) => {
          const updatedTenants = state.tenants.map((tenant) =>
            tenant.id === tenantId
              ? {
                  ...tenant,
                  status: "active" as const,
                  joinDate: new Date().toLocaleDateString(),
                  // Simulate some initial data when approved
                  routes: Math.floor(Math.random() * 5) + 1,
                  buses: Math.floor(Math.random() * 10) + 5,
                  revenue: `ETB ${(Math.random() * 500000 + 100000).toLocaleString()}`,
                }
              : tenant,
          )

          const tenant = state.tenants.find((t) => t.id === tenantId)
          const notification: Notification = {
            id: Date.now().toString(),
            title: "Tenant Approved",
            message: `${tenant?.busBrandName} has been approved and activated`,
            date: new Date().toISOString(),
            type: "tenant_approved",
            isRead: false,
            tenantId,
          }

          

          return {
            tenants: updatedTenants,
            notifications: [notification, ...state.notifications],
          }
        })
      },
      

      rejectTenant: (tenantId) => {
        set((state) => {
          const updatedTenants = state.tenants.map((tenant) =>
            tenant.id === tenantId ? { ...tenant, status: "suspended" as const } : tenant,
          )

          const tenant = state.tenants.find((t) => t.id === tenantId)
          const notification: Notification = {
            id: Date.now().toString(),
            title: "Tenant Rejected",
            message: `${tenant?.busBrandName} registration has been rejected`,
            date: new Date().toISOString(),
            type: "tenant_rejected",
            isRead: false,
            tenantId,
          }

          return {
            tenants: updatedTenants,
            notifications: [notification, ...state.notifications],
          }
        })
      },

      suspendTenant: (tenantId) => {
        set((state) => ({
          tenants: state.tenants.map((tenant) =>
            tenant.id === tenantId ? { ...tenant, status: "suspended" as const } : tenant,
          ),
        }))
      },

      deleteTenant: (tenantId) => {
        set((state) => ({
          tenants: state.tenants.filter((tenant) => tenant.id !== tenantId),
        }))
      },

      markNotificationAsRead: (notificationId) => {
        set((state) => ({
          notifications: state.notifications.map((notification) =>
            notification.id === notificationId ? { ...notification, isRead: true } : notification,
          ),
        }))
      },

      getUnreadNotifications: () => {
        return get().notifications.filter((n) => !n.isRead)
      },

      getPendingTenants: () => {
        return get().tenants.filter((t) => t.status === "pending")
      },

      getActiveTenants: () => {
        return get().tenants.filter((t) => t.status === "active")
      },

      getSuspendedTenants: () => {
        return get().tenants.filter((t) => t.status === "suspended")
      },
    }),
    {
      name: "tenant-store",
    },
  ),
)
