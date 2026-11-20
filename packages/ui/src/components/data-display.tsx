"use client";

import { cn } from "../utils/cn";
import { HTMLAttributes, ReactNode, forwardRef, useState } from "react";
import * as AccordionPrimitive from "@radix-ui/react-accordion";
import * as AvatarPrimitive from "@radix-ui/react-avatar";
import * as TooltipPrimitive from "@radix-ui/react-tooltip";
import * as PopoverPrimitive from "@radix-ui/react-popover";
import {
  Info,
  AlertTriangle,
  CheckCircle2,
  TrendingUp,
  TrendingDown,
  ChevronDown,
} from "lucide-react";

// Card Components
export interface CardProps extends HTMLAttributes<HTMLDivElement> {
  glass?: boolean;
}

export function Card({ glass = false, className, children, ...props }: CardProps) {
  return (
    <div
      className={cn(
        "flex min-w-0 flex-col gap-4 rounded-lg border border-slate-200 bg-white p-4 text-left dark:border-slate-800 dark:bg-slate-950 sm:p-5",
        glass && "bg-white/70 dark:bg-slate-950/60 backdrop-blur-md",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}

export function CardHeader({ className, children, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "flex flex-col gap-1 border-b border-slate-100 dark:border-slate-900 pb-3",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}

export function CardTitle({ className, children, ...props }: HTMLAttributes<HTMLHeadingElement>) {
  return (
    <h3
      className={cn(
        "text-base font-semibold tracking-tight text-slate-900 dark:text-slate-50",
        className
      )}
      {...props}
    >
      {children}
    </h3>
  );
}

export function CardDescription({
  className,
  children,
  ...props
}: HTMLAttributes<HTMLParagraphElement>) {
  return (
    <p className={cn("text-sm text-slate-600 dark:text-slate-400", className)} {...props}>
      {children}
    </p>
  );
}

export function CardContent({ className, children, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn("text-sm text-slate-700 dark:text-slate-350 leading-relaxed", className)}
      {...props}
    >
      {children}
    </div>
  );
}

export function CardFooter({ className, children, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "flex items-center justify-between border-t border-slate-100 dark:border-slate-900 pt-3",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}

// StatisticCard
export interface StatisticCardProps extends CardProps {
  title: string;
  value: string | number;
  delta?: { value: string | number; trend: "up" | "down" };
  description?: string;
  icon?: ReactNode;
}

export function StatisticCard({
  title,
  value,
  delta,
  description,
  icon,
  className,
  ...props
}: StatisticCardProps) {
  return (
    <Card className={cn("p-5 justify-between relative overflow-hidden", className)} {...props}>
      <div className="flex justify-between items-start">
        <span className="text-sm font-bold text-slate-500 dark:text-slate-400">{title}</span>
        {icon && <div className="text-slate-400">{icon}</div>}
      </div>
      <div className="flex items-baseline gap-2.5 my-2">
        <span className="text-3xl font-black tracking-tight">{value}</span>
        {delta && (
          <span
            className={cn(
              "inline-flex items-center gap-0.5 px-2 py-0.5 rounded-full text-xs font-bold",
              delta.trend === "up"
                ? "bg-emerald-50 dark:bg-emerald-950/20 text-emerald-600"
                : "bg-red-50 dark:bg-red-950/20 text-red-600"
            )}
          >
            {delta.trend === "up" ? (
              <TrendingUp className="w-3 h-3" />
            ) : (
              <TrendingDown className="w-3 h-3" />
            )}
            {delta.value}
          </span>
        )}
      </div>
      {description && <span className="text-xs text-slate-400">{description}</span>}
    </Card>
  );
}

// Badge Component
export interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: "primary" | "secondary" | "danger" | "success" | "warning";
}

export function Badge({ variant = "secondary", className, children, ...props }: BadgeProps) {
  const variantClasses = {
    primary:
      "bg-indigo-50 dark:bg-indigo-950/30 text-indigo-700 dark:text-indigo-400 border border-indigo-100 dark:border-indigo-900/30",
    secondary:
      "bg-slate-100 dark:bg-slate-900 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-800",
    danger:
      "bg-red-50 dark:bg-red-950/20 text-red-700 dark:text-red-400 border border-red-100 dark:border-red-900/30",
    success:
      "bg-emerald-50 dark:bg-emerald-950/20 text-emerald-700 dark:text-emerald-400 border border-emerald-100 dark:border-emerald-900/30",
    warning:
      "bg-amber-50 dark:bg-amber-950/20 text-amber-800 dark:text-amber-400 border border-amber-100 dark:border-amber-900/30",
  };

  return (
    <span
      className={cn(
        "inline-flex items-center rounded-md px-2 py-0.5 text-xs font-medium",
        variantClasses[variant],
        className
      )}
      {...props}
    >
      {children}
    </span>
  );
}

// Tag
export function Tag({ className, children, ...props }: HTMLAttributes<HTMLSpanElement>) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-semibold bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400",
        className
      )}
      {...props}
    >
      {children}
    </span>
  );
}

// Table & DataTable
export interface TableProps extends HTMLAttributes<HTMLTableElement> {
  headers: string[];
}

export function Table({ headers, className, children, ...props }: TableProps) {
  return (
    <div className="w-full overflow-x-auto border border-slate-200 dark:border-slate-800 rounded-2xl bg-white dark:bg-slate-950">
      <table className={cn("w-full border-collapse text-left text-sm", className)} {...props}>
        <thead className="bg-slate-50 dark:bg-slate-900/60 border-b border-slate-200 dark:border-slate-800 text-xs font-bold uppercase tracking-wider text-slate-500">
          <tr>
            {headers.map((h, i) => (
              <th key={i} className="px-6 py-3.5 font-bold">
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100 dark:divide-slate-900 text-slate-700 dark:text-slate-300">
          {children}
        </tbody>
      </table>
    </div>
  );
}

export interface DataTableProps<T> {
  headers: string[];
  data: T[];
  renderRow: (item: T, idx: number) => ReactNode;
}

export function DataTable({ headers, data, renderRow }: DataTableProps<any>) {
  return <Table headers={headers}>{data.map((item, idx) => renderRow(item, idx))}</Table>;
}

// Avatar
export interface AvatarProps {
  src?: string;
  alt?: string;
  fallback: string;
  className?: string;
}

export function Avatar({ src, alt, fallback, className }: AvatarProps) {
  return (
    <AvatarPrimitive.Root
      className={cn(
        "relative flex h-10 w-10 shrink-0 overflow-hidden rounded-full border border-slate-200 dark:border-slate-800 bg-slate-100 dark:bg-slate-900",
        className
      )}
    >
      <AvatarPrimitive.Image
        src={src}
        alt={alt}
        className="aspect-square h-full w-full object-cover"
      />
      <AvatarPrimitive.Fallback className="flex h-full w-full items-center justify-center rounded-full text-sm font-bold text-slate-600 dark:text-slate-400 select-none uppercase">
        {fallback.substring(0, 2)}
      </AvatarPrimitive.Fallback>
    </AvatarPrimitive.Root>
  );
}

// Timeline
export interface TimelineItem {
  title: string;
  time: string;
  description: string;
}

export function Timeline({ items }: { items: TimelineItem[] }) {
  return (
    <div className="space-y-6 pl-4 border-l border-slate-200 dark:border-slate-800 text-left relative">
      {items.map((item, idx) => (
        <div key={idx} className="relative space-y-1">
          <div className="absolute -left-[21px] top-1.5 w-2.5 h-2.5 rounded-full bg-indigo-500 border-2 border-white dark:border-slate-950" />
          <div className="flex justify-between items-baseline">
            <h4 className="font-bold text-sm text-slate-900 dark:text-white">{item.title}</h4>
            <span className="text-xs text-slate-400 font-mono font-semibold">{item.time}</span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400">{item.description}</p>
        </div>
      ))}
    </div>
  );
}

// Accordion
export interface AccordionItemProps {
  value: string;
  trigger: string;
  content: string;
}

export function Accordion({ items }: { items: AccordionItemProps[] }) {
  return (
    <AccordionPrimitive.Root
      type="single"
      collapsible
      className="w-full divide-y divide-slate-100 dark:divide-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden bg-white dark:bg-slate-950"
    >
      {items.map((item) => (
        <AccordionPrimitive.Item key={item.value} value={item.value} className="text-left">
          <AccordionPrimitive.Header>
            <AccordionPrimitive.Trigger className="flex w-full items-center justify-between px-6 py-4 font-bold text-sm hover:bg-slate-50 dark:hover:bg-slate-900/40 transition-colors group cursor-pointer">
              <span>{item.trigger}</span>
              <ChevronDown className="w-4 h-4 text-slate-400 group-data-[state=open]:rotate-180 transition-transform" />
            </AccordionPrimitive.Trigger>
          </AccordionPrimitive.Header>
          <AccordionPrimitive.Content className="px-6 pb-4 pt-1 text-sm text-slate-600 dark:text-slate-400 leading-relaxed overflow-hidden data-[state=closed]:animate-slide-up data-[state=open]:animate-slide-down">
            {item.content}
          </AccordionPrimitive.Content>
        </AccordionPrimitive.Item>
      ))}
    </AccordionPrimitive.Root>
  );
}

// Alert & Callout
export interface AlertProps {
  variant?: "info" | "warning" | "success" | "error";
  title: string;
  description?: string;
  className?: string;
}

export function Alert({ variant = "info", title, description, className }: AlertProps) {
  const icons = {
    info: <Info className="w-5 h-5 text-indigo-500" />,
    warning: <AlertTriangle className="w-5 h-5 text-amber-500" />,
    success: <CheckCircle2 className="w-5 h-5 text-emerald-500" />,
    error: <AlertTriangle className="w-5 h-5 text-red-500" />,
  };

  const bgClasses = {
    info: "bg-indigo-50/40 dark:bg-indigo-950/10 border-indigo-100 dark:border-indigo-900/30",
    warning: "bg-amber-50/45 dark:bg-amber-950/10 border-amber-100 dark:border-amber-900/30",
    success:
      "bg-emerald-50/40 dark:bg-emerald-950/10 border-emerald-100 dark:border-emerald-900/30",
    error: "bg-red-50/40 dark:bg-red-950/10 border-red-100 dark:border-red-900/30",
  };

  return (
    <div
      className={cn(
        "p-4 rounded-2xl border flex gap-3 text-left items-start",
        bgClasses[variant],
        className
      )}
    >
      <div className="shrink-0 mt-0.5">{icons[variant]}</div>
      <div className="space-y-1">
        <h5 className="font-bold text-sm text-slate-900 dark:text-white leading-none">{title}</h5>
        {description && (
          <p className="text-xs text-slate-500 dark:text-slate-450 leading-normal">{description}</p>
        )}
      </div>
    </div>
  );
}

export function Callout({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <div
      className={cn(
        "p-3 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-sm text-slate-700 dark:text-slate-350 text-left font-medium leading-relaxed",
        className
      )}
    >
      {children}
    </div>
  );
}

// Tooltip
export interface TooltipProps {
  content: string;
  children: ReactNode;
}

export function Tooltip({ content, children }: TooltipProps) {
  return (
    <TooltipPrimitive.Provider>
      <TooltipPrimitive.Root delayDuration={150}>
        <TooltipPrimitive.Trigger asChild>{children}</TooltipPrimitive.Trigger>
        <TooltipPrimitive.Portal>
          <TooltipPrimitive.Content className="z-50 overflow-hidden rounded-lg bg-slate-950 dark:bg-white text-white dark:text-slate-950 px-3 py-1.5 text-xs shadow-md border border-slate-900 dark:border-slate-100">
            {content}
            <TooltipPrimitive.Arrow className="fill-slate-950 dark:fill-white" />
          </TooltipPrimitive.Content>
        </TooltipPrimitive.Portal>
      </TooltipPrimitive.Root>
    </TooltipPrimitive.Provider>
  );
}

// Popover
export interface PopoverProps {
  trigger: ReactNode;
  children: ReactNode;
}

export function Popover({ trigger, children }: PopoverProps) {
  return (
    <PopoverPrimitive.Root>
      <PopoverPrimitive.Trigger asChild>{trigger}</PopoverPrimitive.Trigger>
      <PopoverPrimitive.Portal>
        <PopoverPrimitive.Content className="z-50 w-72 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 p-4 shadow-lg outline-none">
          {children}
        </PopoverPrimitive.Content>
      </PopoverPrimitive.Portal>
    </PopoverPrimitive.Root>
  );
}

// HoverCard (Simulated using Popover/Tooltip primitives simply)
export function HoverCard({ trigger, children }: PopoverProps) {
  return <Popover trigger={trigger}>{children}</Popover>;
}

// Progress Bar & CircularProgress
export function Progress({ value }: { value: number }) {
  return (
    <div className="w-full h-2 rounded-full bg-slate-100 dark:bg-slate-900 overflow-hidden border border-slate-200/40 dark:border-slate-800/40">
      <div
        className="bg-indigo-600 dark:bg-indigo-500 h-full rounded-full transition-all duration-300"
        style={{ width: `${Math.min(100, Math.max(0, value))}%` }}
      />
    </div>
  );
}

export function CircularProgress({
  value,
  size = 44,
  strokeWidth = 4,
}: {
  value: number;
  size?: number;
  strokeWidth?: number;
}) {
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const strokeDashoffset =
    circumference - (Math.min(100, Math.max(0, value)) / 100) * circumference;

  return (
    <div className="relative inline-flex items-center justify-center">
      <svg width={size} height={size} className="transform -rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          strokeWidth={strokeWidth}
          fill="transparent"
          className="stroke-slate-100 dark:stroke-slate-900"
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          strokeWidth={strokeWidth}
          fill="transparent"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          className="stroke-indigo-600 dark:stroke-indigo-500 transition-all duration-300"
          strokeLinecap="round"
        />
      </svg>
      <span className="absolute text-[10px] font-bold font-mono">{value}%</span>
    </div>
  );
}

// Skeleton Component
export function Skeleton({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn("animate-pulse rounded-lg bg-slate-200 dark:bg-slate-900", className)}
      {...props}
    />
  );
}

// Separator
export function Separator({ className }: { className?: string }) {
  return <hr className={cn("border-0 h-px bg-slate-100 dark:bg-slate-900", className)} />;
}

// Calendar Mock
export function Calendar({ className }: { className?: string }) {
  const days = Array(31)
    .fill(null)
    .map((_, i) => i + 1);
  return (
    <div
      className={cn(
        "p-4 border border-slate-200 dark:border-slate-800 rounded-2xl bg-white dark:bg-slate-950 w-fit",
        className
      )}
    >
      <div className="grid grid-cols-7 gap-1.5 text-center text-xs font-mono font-bold text-slate-500 mb-2">
        <span>Su</span>
        <span>Mo</span>
        <span>Tu</span>
        <span>We</span>
        <span>Th</span>
        <span>Fr</span>
        <span>Sa</span>
      </div>
      <div className="grid grid-cols-7 gap-1.5 text-sm font-semibold">
        {days.map((day) => (
          <button
            key={day}
            className="w-8 h-8 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-900 flex items-center justify-center focus:outline-none focus:ring-1 focus:ring-indigo-500 cursor-pointer"
          >
            {day}
          </button>
        ))}
      </div>
    </div>
  );
}

// SVG Charts
export function Charts({
  type = "line",
  data,
  labels,
  ariaLabel,
}: {
  type?: "line" | "bar" | "area";
  data: number[];
  labels?: string[];
  ariaLabel?: string;
}) {
  const values = data.filter(Number.isFinite);
  if (!values.length) {
    return (
      <p className="py-8 text-center text-sm text-slate-600 dark:text-slate-400">No chart data</p>
    );
  }

  const width = 480;
  const height = 180;
  const low = Math.min(...values, 0);
  const step = Math.max(1, Math.ceil((Math.max(...values, 0) - low) / 3));
  const high = low + 3 * step;
  const y = (value: number) => height - ((value - low) / (high - low)) * height;
  const baseline = y(0);
  const points = values.map((value, index) => ({
    x: values.length === 1 ? width / 2 : (index * width) / (values.length - 1),
    y: y(value),
  }));
  const line = points.map((point) => `${point.x},${point.y}`).join(" ");
  const ticks = [high, high - step, high - step * 2, low];

  return (
    <figure className="min-w-0" role="img" aria-label={ariaLabel ?? `${type} chart`}>
      <div className="flex gap-2">
        <div
          aria-hidden="true"
          className="flex h-36 shrink-0 flex-col justify-between text-right text-[11px] tabular-nums text-slate-600 dark:text-slate-400 sm:h-48"
        >
          {ticks.map((tick) => (
            <span key={tick}>
              {new Intl.NumberFormat("en", {
                notation: "compact",
                maximumFractionDigits: 1,
              }).format(tick)}
            </span>
          ))}
        </div>
        <svg
          viewBox={`0 0 ${width} ${height}`}
          preserveAspectRatio="none"
          aria-hidden="true"
          className="h-36 min-w-0 flex-1 overflow-visible sm:h-48"
        >
          {ticks.map((tick) => (
            <line
              key={tick}
              x1={0}
              x2={width}
              y1={y(tick)}
              y2={y(tick)}
              vectorEffect="non-scaling-stroke"
              className="stroke-slate-200 dark:stroke-slate-800"
            />
          ))}
          {type === "area" && points.length > 1 && (
            <polygon
              points={`${points[0].x},${baseline} ${line} ${points.at(-1)?.x},${baseline}`}
              className="fill-indigo-600/12 dark:fill-indigo-400/15"
            />
          )}
          {type !== "bar" && points.length > 1 && (
            <polyline
              points={line}
              fill="none"
              strokeWidth="2"
              strokeLinejoin="round"
              vectorEffect="non-scaling-stroke"
              className="stroke-indigo-600 dark:stroke-indigo-400"
            />
          )}
          {type !== "bar" && points.length === 1 && (
            <circle
              cx={points[0].x}
              cy={points[0].y}
              r="3"
              className="fill-indigo-600 dark:fill-indigo-400"
            />
          )}
          {type === "bar" &&
            values.map((value, index) => {
              const column = width / values.length;
              return (
                <rect
                  key={index}
                  x={column * (index + 0.18)}
                  width={column * 0.64}
                  y={Math.min(y(value), baseline)}
                  height={Math.abs(y(value) - baseline)}
                  className="fill-indigo-600 dark:fill-indigo-400"
                />
              );
            })}
        </svg>
      </div>
      {labels?.length ? (
        <div
          aria-hidden="true"
          className="mt-2 flex justify-between gap-1 pl-7 text-[11px] text-slate-600 dark:text-slate-400"
        >
          {labels.map((label, index) => (
            <span key={index}>{label}</span>
          ))}
        </div>
      ) : null}
    </figure>
  );
}

export function MetricCards({
  title,
  value,
  unit,
}: {
  title: string;
  value: string | number;
  unit?: string;
}) {
  return (
    <div className="flex flex-col gap-1 rounded-lg border border-slate-200 bg-white p-4 text-left dark:border-slate-800 dark:bg-slate-950">
      <span className="text-sm font-medium text-slate-600 dark:text-slate-400">{title}</span>
      <div className="flex items-baseline gap-1">
        <span className="text-2xl font-semibold tabular-nums tracking-tight">{value}</span>
        {unit && <span className="text-xs text-slate-400 font-medium">{unit}</span>}
      </div>
    </div>
  );
}
