"use client";

import { cn } from "../utils/cn";
import { Check, ArrowRight, Download, Receipt } from "lucide-react";
import { Button } from "./button";
import { Progress } from "./data-display";

// PricingCard
export interface PricingPlan {
  name: string;
  price: string | number;
  period?: string;
  description: string;
  features: string[];
  buttonText?: string;
  popular?: boolean;
}

export function PricingCard({
  plan,
  onSelect,
  selected,
}: {
  plan: PricingPlan;
  onSelect?: () => void;
  selected?: boolean;
}) {
  return (
    <section
      className={cn(
        "flex flex-col justify-between gap-5 rounded-lg border border-slate-200 bg-white p-5 text-left dark:border-slate-800 dark:bg-slate-950",
        selected && "border-indigo-600 dark:border-indigo-400"
      )}
    >
      <div className="space-y-4">
        <div>
          <h2 className="text-base font-semibold tracking-tight">{plan.name}</h2>
          <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">{plan.description}</p>
        </div>
        <p className="flex items-baseline gap-1.5">
          <span className="text-3xl font-semibold tabular-nums tracking-tight">{plan.price}</span>
          {plan.period && (
            <span className="text-xs text-slate-600 dark:text-slate-400">/ {plan.period}</span>
          )}
        </p>
        <ul className="space-y-2 border-t border-slate-200 pt-3 dark:border-slate-800">
          {plan.features.map((feature) => (
            <li
              key={feature}
              className="flex items-start gap-2 text-sm text-slate-700 dark:text-slate-300"
            >
              <Check
                className="mt-0.5 size-4 shrink-0 text-indigo-600 dark:text-indigo-300"
                aria-hidden="true"
              />
              {feature}
            </li>
          ))}
        </ul>
      </div>
      {onSelect && (
        <Button
          type="button"
          aria-pressed={selected}
          onClick={onSelect}
          variant={(selected ?? plan.popular) ? "primary" : "outline"}
          className="w-full rounded-md"
        >
          {selected ? "Selected" : plan.buttonText || `Choose ${plan.name}`}
        </Button>
      )}
    </section>
  );
}

// SubscriptionCard
export interface Subscription {
  planName: string;
  status: "active" | "canceled" | "past_due";
  nextBillingDate: string;
  price: string;
}

export function SubscriptionCard({ sub, onManage }: { sub: Subscription; onManage?: () => void }) {
  return (
    <div className="p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 flex flex-col md:flex-row justify-between items-start md:items-center gap-6 text-left">
      <div className="space-y-1.5">
        <div className="flex items-center gap-2">
          <h4 className="font-bold text-lg leading-tight">{sub.planName} Plan</h4>
          <span
            className={cn(
              "px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider",
              sub.status === "active" && "bg-emerald-50 dark:bg-emerald-950/20 text-emerald-500",
              sub.status === "canceled" && "bg-slate-50 dark:bg-slate-900 text-slate-500",
              sub.status === "past_due" && "bg-amber-50 dark:bg-amber-950/20 text-amber-500"
            )}
          >
            {sub.status}
          </span>
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400">
          Your plan renews on{" "}
          <span className="font-bold text-slate-700 dark:text-slate-200">
            {sub.nextBillingDate}
          </span>{" "}
          for {sub.price}.
        </p>
      </div>
      <Button variant="secondary" onClick={onManage} size="sm" className="h-10">
        Manage Billing
      </Button>
    </div>
  );
}

// PlanComparison Grid
export interface FeatureComparison {
  name: string;
  starter: boolean | string;
  pro: boolean | string;
  enterprise: boolean | string;
}

export function PlanComparison({ features }: { features: FeatureComparison[] }) {
  function featureValue(value: boolean | string) {
    if (typeof value === "string") return value;
    return value ? "Included" : "—";
  }

  return (
    <div className="overflow-x-auto rounded-lg border border-slate-200 bg-white text-sm dark:border-slate-800 dark:bg-slate-950">
      <table className="w-full min-w-[26rem] border-collapse text-left">
        <caption className="border-b border-slate-200 px-4 py-3 text-left text-base font-semibold dark:border-slate-800">
          Compare plans
        </caption>
        <thead className="border-b border-slate-200 bg-slate-50 text-slate-700 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300">
          <tr>
            {["Feature", "Starter", "Pro", "Enterprise"].map((heading) => (
              <th key={heading} scope="col" className="px-4 py-2 font-medium">
                {heading}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
          {features.map((feature) => (
            <tr key={feature.name}>
              <th scope="row" className="px-4 py-2.5 font-medium">
                {feature.name}
              </th>
              <td className="px-4 py-2.5">{featureValue(feature.starter)}</td>
              <td className="px-4 py-2.5">{featureValue(feature.pro)}</td>
              <td className="px-4 py-2.5">{featureValue(feature.enterprise)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// CheckoutSummary
export interface CheckoutItem {
  name: string;
  price: number;
}

export function CheckoutSummary({
  items,
  discount = 0,
  onCheckout,
  buttonText = "Proceed to payment",
}: {
  items: CheckoutItem[];
  discount?: number;
  onCheckout?: () => void;
  buttonText?: string;
}) {
  const subtotal = items.reduce((sum, item) => sum + item.price, 0);
  const total = subtotal - discount;

  return (
    <div className="space-y-4 rounded-lg border border-slate-200 bg-white p-5 text-left dark:border-slate-800 dark:bg-slate-950">
      <h4 className="font-bold text-base border-b border-slate-200 dark:border-slate-800 pb-3">
        Checkout Summary
      </h4>
      <div className="space-y-2.5">
        {items.map((item, idx) => (
          <div
            key={idx}
            className="flex justify-between text-sm text-slate-700 dark:text-slate-300 font-semibold"
          >
            <span>{item.name}</span>
            <span className="font-mono">${item.price.toFixed(2)}</span>
          </div>
        ))}
      </div>

      <div className="border-t border-slate-200 dark:border-slate-800 pt-3.5 space-y-2 text-xs text-slate-500 dark:text-slate-400">
        <div className="flex justify-between">
          <span>Subtotal</span>
          <span className="font-mono">${subtotal.toFixed(2)}</span>
        </div>
        {discount > 0 && (
          <div className="flex justify-between text-emerald-500 font-bold">
            <span>Discount</span>
            <span className="font-mono">-${discount.toFixed(2)}</span>
          </div>
        )}
        <div className="flex justify-between text-sm font-semibold text-slate-900 dark:text-white pt-2">
          <span>Total</span>
          <span className="font-mono">${total.toFixed(2)}</span>
        </div>
      </div>

      <Button onClick={onCheckout} className="w-full mt-4 flex items-center justify-center gap-2">
        {buttonText} <ArrowRight className="w-4 h-4" aria-hidden="true" />
      </Button>
    </div>
  );
}

// BillingHistory
export interface Invoice {
  id: string;
  date: string;
  amount: string;
  status: string;
}

export function BillingHistory({
  invoices,
  onDownload,
}: {
  invoices: Invoice[];
  onDownload?: (id: string) => void;
}) {
  return (
    <div className="w-full border border-slate-200 dark:border-slate-800 rounded-lg bg-white dark:bg-slate-950 overflow-hidden text-left text-sm">
      <div className="p-4 bg-slate-50 dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 flex items-center gap-2 font-semibold text-slate-700 dark:text-slate-300">
        <Receipt className="w-4 h-4" /> Billing & Invoices
      </div>
      <div className="divide-y divide-slate-100 dark:divide-slate-900">
        {invoices.map((inv) => (
          <div
            key={inv.id}
            className="p-4 flex items-center justify-between hover:bg-slate-50/50 dark:hover:bg-slate-900/30 transition-colors"
          >
            <div className="space-y-1">
              <span className="font-bold font-mono">{inv.id}</span>
              <p className="text-xs text-slate-400 font-semibold">{inv.date}</p>
            </div>
            <div className="flex items-center gap-4">
              <span className="font-medium tabular-nums">{inv.amount}</span>
              <button
                type="button"
                aria-label={`Download invoice ${inv.id}`}
                onClick={() => onDownload?.(inv.id)}
                className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-900 text-slate-500 hover:text-slate-700 cursor-pointer"
              >
                <Download className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// UsageMeter
export function UsageMeter({
  label,
  value,
  max,
  unit = "",
}: {
  label: string;
  value: number;
  max: number;
  unit?: string;
}) {
  const percentage = (value / max) * 100;
  return (
    <div className="w-full space-y-2.5 text-left p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950">
      <div className="flex justify-between items-baseline">
        <span className="text-sm font-medium text-slate-600 dark:text-slate-400">{label}</span>
        <span className="text-xs font-bold font-mono">
          {value} / {max} {unit}
        </span>
      </div>
      <Progress value={percentage} />
    </div>
  );
}
