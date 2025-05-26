/* eslint-disable @typescript-eslint/prefer-as-const */
import { create } from "zustand";
import { persist } from "zustand/middleware";
import axios from 'axios';

const API_BASE_URL = 'http://localhost:3001/api/bus-tenant';

export interface Tenant {
  id: string
  _id?: string // MongoDB ID
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
  isLoading: boolean
  error: string | null
  fetchTenants: () => Promise<void>
  approveTenant: (tenantId: string) => Promise<void>
  rejectTenant: (tenantId: string) => Promise<void>
  suspendTenant: (tenantId: string) => Promise<void>
  deleteTenant: (tenantId: string) => Promise<void>
  markNotificationAsRead: (notificationId: string) => void
  getUnreadNotifications: () => Notification[]
  getPendingTenants: () => Tenant[]
  getActiveTenants: () => Tenant[]
  getSuspendedTenants: () => Tenant[]
}

export const useTenantStore = create<TenantStore>()(
  persist(
    (set, get) => ({
      tenants: [],
      notifications: [],
      isLoading: false,
      error: null,

      fetchTenants: async () => {
        set({ isLoading: true, error: null });
        try {
          const response = await axios.get(`${API_BASE_URL}`);
          set({ 
            tenants: response.data.map((tenant: any) => ({
              ...tenant,
              id: tenant._id || tenant.id, // Map _id to id for compatibility
            })),
            isLoading: false 
          });
        } catch (error) {
          set({ 
            error: 'Failed to fetch tenants',
            isLoading: false 
          });
          console.error('Error fetching tenants:', error);
        }
      },

      approveTenant: async (tenantId) => {
        set({ isLoading: true, error: null });
        try {
          await axios.patch(`${API_BASE_URL}/update-status/${tenantId}`, { status: 'active' });
          
          set((state) => {
            const updatedTenants = state.tenants.map((tenant) =>
              tenant.id === tenantId
                ? {
                    ...tenant,
                    status: "active" as "active",
                    registrationDate: new Date().toLocaleDateString(),
                    joinDate: new Date().toLocaleDateString(),
                  }
                : tenant
            );

            const tenant = state.tenants.find((t) => t.id === tenantId);
            const notification: Notification = {
              id: Date.now().toString(),
              title: "Tenant Approved",
              message: `${tenant?.busBrandName} has been approved and activated`,
              date: new Date().toISOString(),
              type: "tenant_approved",
              isRead: false,
              tenantId,
            };

            return {
              tenants: updatedTenants,
              notifications: [notification, ...state.notifications],
              isLoading: false
            };
          });
        } catch (error) {
          set({ 
            error: 'Failed to approve tenant',
            isLoading: false 
          });
          console.error('Error approving tenant:', error);
        }
      },

      rejectTenant: async (tenantId) => {
        set({ isLoading: true, error: null });
        try {
          await axios.patch(`${API_BASE_URL}/update-status/${tenantId}`, { status: 'suspended' });
          
          set((state) => {
            const updatedTenants = state.tenants.map((tenant) =>
              tenant.id === tenantId ? { ...tenant, status: "suspended" as "suspended" } : tenant
            );

            const tenant = state.tenants.find((t) => t.id === tenantId);
            const notification: Notification = {
              id: Date.now().toString(),
              title: "Tenant Rejected",
              message: `${tenant?.busBrandName} registration has been rejected`,
              date: new Date().toISOString(),
              type: "tenant_rejected",
              isRead: false,
              tenantId,
            };

            return {
              tenants: updatedTenants,
              notifications: [notification, ...state.notifications],
              isLoading: false
            };
          });
        } catch (error) {
          set({ 
            error: 'Failed to reject tenant',
            isLoading: false 
          });
          console.error('Error rejecting tenant:', error);
        }
      },

      suspendTenant: async (tenantId) => {
        set({ isLoading: true, error: null });
        try {
          await axios.patch(`${API_BASE_URL}/update-status/${tenantId}`, { status: 'suspended' });
          
          set((state) => ({
            tenants: state.tenants.map((tenant) =>
              tenant.id === tenantId ? { ...tenant, status: "suspended" } : tenant
            ),
            isLoading: false
          }));
        } catch (error) {
          set({ 
            error: 'Failed to suspend tenant',
            isLoading: false 
          });
          console.error('Error suspending tenant:', error);
        }
      },

      deleteTenant: async (tenantId) => {
        set({ isLoading: true, error: null });
        try {
          await axios.delete(`${API_BASE_URL}/${tenantId}`);
          set((state) => ({
            tenants: state.tenants.filter((tenant) => tenant.id !== tenantId),
            isLoading: false
          }));
        } catch (error) {
          set({ 
            error: 'Failed to delete tenant',
            isLoading: false 
          });
          console.error('Error deleting tenant:', error);
        }
      },

      markNotificationAsRead: (notificationId) => {
        set((state) => ({
          notifications: state.notifications.map((notification) =>
            notification.id === notificationId ? { ...notification, isRead: true } : notification
          ),
        }));
      },

      getUnreadNotifications: () => {
        return get().notifications.filter((n) => !n.isRead);
      },

      getPendingTenants: () => {
        return get().tenants.filter((t) => t.status === "pending");
      },

      getActiveTenants: () => {
        return get().tenants.filter((t) => t.status === "active");
      },

      getSuspendedTenants: () => {
        return get().tenants.filter((t) => t.status === "suspended");
      },
    }),
    {
      name: "tenant-store",
      partialize: (state) => ({ 
        notifications: state.notifications,
        // Don't persist tenants from local storage since we're using API now
      }),
    },
  ),
);