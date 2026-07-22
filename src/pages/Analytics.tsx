import { useEffect } from "react";
import { PageHeader } from "../components/layout/PageHeader";
import { Card } from "../components/ui/Card";
import { Badge } from "../components/ui/Badge";
import type { BadgeTone } from "../components/ui/Badge";
import { Sparkline } from "../components/ui/Sparkline";
import { ProgressBar } from "../components/ui/ProgressBar";
import { CardSkeleton } from "../components/ui/Skeleton";
import { ErrorState } from "../components/ui/ErrorState";
import { EmptyState } from "../components/ui/EmptyState";
import { useRevenueStore } from "../store/revenueStore";
import { useInvoicesStore } from "../store/invoicesStore";
import { useOrdersStore } from "../store/ordersStore";
import { formatCurrency } from "../utils/format";

const INVOICE_TONE: Record<string, BadgeTone> = { paid: "good", pending: "neutral", overdue: "critical" };

export function Analytics() {
  const revenueStatus = useRevenueStore((s) => s.status);
  const currentMonth = useRevenueStore((s) => s.currentMonth);
  const previousMonth = useRevenueStore((s) => s.previousMonth);
  const goal = useRevenueStore((s) => s.goal);
  const trend = useRevenueStore((s) => s.trend);
  const loadRevenue = useRevenueStore((s) => s.load);
  const hasRevenue = trend.length > 0;

  const invoicesStatus = useInvoicesStore((s) => s.status);
  const invoices = useInvoicesStore((s) => s.items);
  const loadInvoices = useInvoicesStore((s) => s.load);

  const ordersStatus = useOrdersStore((s) => s.status);
  const orders = useOrdersStore((s) => s.items);
  const loadOrders = useOrdersStore((s) => s.load);

  useEffect(() => {
    if (revenueStatus === "idle") loadRevenue();
  }, [revenueStatus, loadRevenue]);

  useEffect(() => {
    if (invoicesStatus === "idle") loadInvoices();
  }, [invoicesStatus, loadInvoices]);

  useEffect(() => {
    if (ordersStatus === "idle") loadOrders();
  }, [ordersStatus, loadOrders]);

  return (
    <div>
      <PageHeader title="Analytics" description="Revenue, invoices, and orders across your business." />

      <Card title="Revenue" subtitle="This month vs. last month">
        {revenueStatus === "loading" && <CardSkeleton lines={2} />}
        {revenueStatus === "error" && (
          <ErrorState title="Failed data synchronization" description="Analytics couldn't sync with your data sources." onRetry={loadRevenue} />
        )}
        {revenueStatus === "ready" && !hasRevenue && (
          <EmptyState icon="bar-chart" title="No revenue data yet" description="Connect a payment or ecommerce platform to start tracking revenue." />
        )}
        {revenueStatus === "ready" && hasRevenue && (
          <div className="analytics-revenue">
            <div>
              <p className="analytics-revenue__figure">{formatCurrency(currentMonth)}</p>
              <p className="record-row__subtitle">Goal: {formatCurrency(goal)}</p>
              <ProgressBar value={currentMonth} max={goal} label="Revenue goal progress" />
            </div>
            <Sparkline values={trend} width={220} height={64} positive={currentMonth >= previousMonth} />
          </div>
        )}
      </Card>

      <div className="page-grid section-spacing-top">
        <Card title="Invoices">
          {invoicesStatus === "loading" && <CardSkeleton lines={4} />}
          {invoicesStatus === "error" && <ErrorState onRetry={loadInvoices} />}
          {invoicesStatus === "ready" && invoices.length === 0 && (
            <EmptyState icon="dollar-sign" title="No invoices yet" description="Invoices will show up here once you create one." />
          )}
          {invoicesStatus === "ready" && invoices.length > 0 && (
            <ul className="record-list">
              {invoices.map((inv) => (
                <li key={inv.id} className="record-row">
                  <div className="record-row__main">
                    <p className="record-row__title">{inv.customerName}</p>
                    <p className="record-row__subtitle">Invoice {inv.id.replace("inv_", "#")}</p>
                  </div>
                  <div className="record-row__end">
                    <span className="record-row__amount">{formatCurrency(inv.amount)}</span>
                    <Badge tone={INVOICE_TONE[inv.status]}>{inv.status}</Badge>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </Card>
        <Card title="Recent orders">
          {ordersStatus === "loading" && <CardSkeleton lines={4} />}
          {ordersStatus === "error" && <ErrorState onRetry={loadOrders} />}
          {ordersStatus === "ready" && orders.length === 0 && (
            <EmptyState icon="dollar-sign" title="No orders yet" description="Orders will show up here once your store starts selling." />
          )}
          {ordersStatus === "ready" && orders.length > 0 && (
            <ul className="record-list">
              {orders.map((o) => (
                <li key={o.id} className="record-row">
                  <div className="record-row__main">
                    <p className="record-row__title">{o.customerName}</p>
                    <p className="record-row__subtitle">via {o.source}</p>
                  </div>
                  <span className="record-row__amount">{formatCurrency(o.amount)}</span>
                </li>
              ))}
            </ul>
          )}
        </Card>
      </div>
    </div>
  );
}
