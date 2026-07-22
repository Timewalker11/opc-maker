import { useTasksStore } from "../store/tasksStore";
import { useCalendarStore } from "../store/calendarStore";
import { useSocialStore } from "../store/socialStore";
import { useAlertsStore } from "../store/alertsStore";
import { useRevenueStore } from "../store/revenueStore";
import { useCustomersStore } from "../store/customersStore";
import { useInvoicesStore } from "../store/invoicesStore";
import { useOrdersStore } from "../store/ordersStore";
import { useCampaignsStore } from "../store/campaignsStore";
import { useFilesStore } from "../store/filesStore";

// Fills every dashboard domain with a fixed, realistic sample dataset -- each store's
// seedDemo() replaces its own items rather than appending, so running this more than once
// doesn't pile up duplicates.
export function seedDemoData(): void {
  useTasksStore.getState().seedDemo();
  useCalendarStore.getState().seedDemo();
  useSocialStore.getState().seedDemo();
  useAlertsStore.getState().seedDemo();
  useRevenueStore.getState().seedDemo();
  useCustomersStore.getState().seedDemo();
  useInvoicesStore.getState().seedDemo();
  useOrdersStore.getState().seedDemo();
  useCampaignsStore.getState().seedDemo();
  useFilesStore.getState().seedDemo();
}
