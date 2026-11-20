"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { ArrowUpRight, Layers } from "lucide-react";
import {
  ThemeToggle,
  Heading,
  Title,
  Subtitle,
  Body,
  Caption,
  Code,
  Quote,
  Muted,
  GradientText,
  AnimatedText,
  Container,
  Section,
  Grid,
  Stack,
  Page,
  SidebarLayout,
  Tabs,
  Button,
  IconButton,
  SplitButton,
  CopyButton,
  AnimatedButton,
  Input,
  Textarea,
  PasswordInput,
  OTPInput,
  Checkbox,
  Switch,
  Slider,
  Select,
  MultiSelect,
  Autocomplete,
  DatePicker,
  TimePicker,
  FileUpload,
  ImageUpload,
  ColorPicker,
  MarkdownEditor,
  RichTextEditor,
  Card,
  StatisticCard,
  Table,
  DataTable,
  Avatar,
  Badge,
  Tag,
  Timeline,
  Accordion,
  Alert,
  Callout,
  Tooltip,
  Popover,
  HoverCard,
  Progress,
  CircularProgress,
  Skeleton,
  Separator,
  Calendar,
  Charts,
  MetricCards,
  ToastProvider,
  useToast,
  Dialog,
  Drawer,
  BottomSheet,
  ConfirmationDialog,
  DeleteDialog,
  ImageViewer,
  ChatWindow,
  StreamingResponse,
  CodeBlock,
  MessageBubble,
  ThinkingIndicator,
  TypingIndicator,
  ToolCallRenderer,
  ConversationSidebar,
  UserTable,
  RoleBadge,
  PermissionTable,
  AuditLogViewer,
  SystemStatus,
  Icons,
  cn,
  RevenueCards,
  PricingCard,
  SubscriptionCard,
  PlanComparison,
  CheckoutSummary,
  BillingHistory,
  UsageMeter,
  type Message,
  type ToolCall,
} from "@devlaunchkit/ui";

export default function DemoPage() {
  const { showToast } = useToast();

  // Active Tab State
  const [activeTab, setActiveTab] = useState("dashboard");
  const [selectedPlan, setSelectedPlan] = useState("Pro");

  useEffect(() => {
    const openLinkedDemo = () => {
      const demo = window.location.hash.slice(1);
      if (demo === "dashboard" || demo === "playbook" || demo === "ai" || demo === "billing") {
        setActiveTab(demo);
      }
    };
    openLinkedDemo();
    window.addEventListener("hashchange", openLinkedDemo);
    return () => window.removeEventListener("hashchange", openLinkedDemo);
  }, []);

  // Input states
  const [otp, setOtp] = useState("");
  const [checked, setChecked] = useState(false);
  const [switchChecked, setSwitchChecked] = useState(true);
  const [sliderVal, setSliderVal] = useState([45]);
  const [selectVal, setSelectVal] = useState("pro");
  const [radioVal, setRadioVal] = useState("email");
  const [multiVal, setMultiVal] = useState(["react", "nextjs"]);
  const [autoVal, setAutoVal] = useState("usd");
  const [dateVal, setDateVal] = useState("2026-07-12");
  const [timeVal, setTimeVal] = useState("12:00");
  const [colorVal, setColorVal] = useState("#6366f1");

  // Dialog/Modal states
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [isViewerOpen, setIsViewerOpen] = useState(false);

  const [chatSessions, setChatSessions] = useState([
    { id: "setup", title: "Monorepo Setup Helper" },
    { id: "schema", title: "Drizzle Schema Design" },
  ]);
  const [activeChat, setActiveChat] = useState("setup");
  const [messagesByChat, setMessagesByChat] = useState<Record<string, Message[]>>({
    setup: [
      {
        id: "setup-intro",
        role: "assistant",
        content: "Send a message to preview a simulated workspace diagnostic.",
      },
    ],
    schema: [
      {
        id: "schema-intro",
        role: "assistant",
        content: "This sample conversation demonstrates a schema design workspace.",
      },
    ],
  });
  const [pendingChat, setPendingChat] = useState<string | null>(null);
  const [activeTools, setActiveTools] = useState<ToolCall[]>([]);
  const chatTimers = useRef<ReturnType<typeof setTimeout>[]>([]);
  const nextChatNumber = useRef(1);

  useEffect(() => () => chatTimers.current.forEach(clearTimeout), []);

  function startNewChat() {
    const number = nextChatNumber.current++;
    const id = `chat-${number}`;
    setChatSessions((previous) => [...previous, { id, title: `Untitled chat ${number}` }]);
    setActiveChat(id);
  }

  function appendMessage(chatId: string, message: Message) {
    setMessagesByChat((previous) => ({
      ...previous,
      [chatId]: [...(previous[chatId] ?? []), message],
    }));
  }

  function handleSendMessage(text: string) {
    if (pendingChat) return;
    const chatId = activeChat;
    const messageId = String(Date.now());
    appendMessage(chatId, { id: `${messageId}-user`, role: "user", content: text });
    setPendingChat(chatId);

    chatTimers.current = [
      setTimeout(
        () =>
          setActiveTools([
            { name: "verify_system_health", arguments: { demo: true }, status: "running" },
          ]),
        500
      ),
      setTimeout(() => {
        appendMessage(chatId, {
          id: `${messageId}-assistant`,
          role: "assistant",
          content:
            "Sample diagnostic complete. In a connected workspace, this is where service health and database latency would appear.",
        });
        setActiveTools([]);
        setPendingChat(null);
        chatTimers.current = [];
      }, 1600),
    ];
  }

  // Mock Data
  const pricingPlans = [
    {
      name: "Starter",
      price: "$0",
      period: "month",
      description: "Perfect for local bootstrapping and testing",
      features: [
        "1 Workspace project",
        "Single developer seat",
        "Local Sqlite support",
        "Community forums access",
      ],
    },
    {
      name: "Pro",
      price: "$49",
      period: "month",
      description: "Ideal for growing SaaS applications",
      features: [
        "Unlimited workspace projects",
        "5 Developer seats",
        "PostgreSQL database client",
        "Stripe payment integration wrapper",
        "Next.js 15 optimization presets",
      ],
      popular: true,
    },
    {
      name: "Enterprise",
      price: "$199",
      period: "month",
      description: "Scale globally with support",
      features: [
        "Unlimited everything",
        "Dedicated private registry support",
        "Supabase deployment hooks",
        "Advanced AI streaming tools",
        "24/7 Priority support",
      ],
    },
  ];

  const checkoutPlan = pricingPlans.find((plan) => plan.name === selectedPlan) ?? pricingPlans[1];
  const sampleInvoices = [
    { id: "INV-001", date: "July 12, 2026", amount: "$49.00", status: "paid" },
    { id: "INV-002", date: "June 12, 2026", amount: "$49.00", status: "paid" },
  ];

  function downloadSampleInvoice(id: string) {
    const invoice = sampleInvoices.find((row) => row.id === id);
    if (!invoice) return;
    const text = `Invoice,Date,Amount,Status\n${invoice.id},"${invoice.date}",${invoice.amount},${invoice.status}\n`;
    const url = URL.createObjectURL(new Blob([text], { type: "text/csv" }));
    const link = document.createElement("a");
    link.href = url;
    link.download = `${invoice.id}-sample.csv`;
    link.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  }

  const comparedFeatures = [
    { name: "Billed Monthly", starter: "$0", pro: "$49", enterprise: "$199" },
    { name: "Workspace seats", starter: "1 Seat", pro: "5 Seats", enterprise: "Unlimited" },
    {
      name: "Database support",
      starter: "Sqlite only",
      pro: "PostgreSQL",
      enterprise: "Multiple Pools",
    },
    { name: "Advanced AI Streaming", starter: false, pro: true, enterprise: true },
    {
      name: "SLA Support Guarantee",
      starter: false,
      status: "Community",
      pro: "Next business day",
      enterprise: "1 Hour SLA",
    },
  ];

  const mockUsers = [
    {
      id: "1",
      name: "Jane Cooper",
      email: "jane.c@devlaunchkit.com",
      role: "owner" as const,
      status: "active" as const,
    },
    {
      id: "2",
      name: "Cody Fisher",
      email: "cody.f@devlaunchkit.com",
      role: "admin" as const,
      status: "active" as const,
    },
    {
      id: "3",
      name: "Esther Howard",
      email: "esther.h@devlaunchkit.com",
      role: "member" as const,
      status: "pending" as const,
    },
    {
      id: "4",
      name: "Jenny Wilson",
      email: "jenny.w@devlaunchkit.com",
      role: "guest" as const,
      status: "suspended" as const,
    },
  ];

  const auditLogs = [
    {
      id: "AUD-920",
      timestamp: "2026-07-12 12:00:23",
      user: "jane.c@devlaunchkit.com",
      action: "workspace_build_triggered",
      resource: "packages/ui",
      ip: "192.168.1.42",
    },
    {
      id: "AUD-919",
      timestamp: "2026-07-12 11:58:12",
      user: "cody.f@devlaunchkit.com",
      action: "database_migration_applied",
      resource: "packages/database",
      ip: "192.168.1.13",
    },
    {
      id: "AUD-918",
      timestamp: "2026-07-12 11:34:00",
      user: "esther.h@devlaunchkit.com",
      action: "stripe_webhook_verified",
      resource: "packages/payments",
      ip: "192.168.1.9",
    },
  ];

  const demos = [
    { id: "dashboard", label: "Overview" },
    { id: "playbook", label: "UI Playbook" },
    { id: "ai", label: "AI Playground" },
    { id: "billing", label: "Billing & Checkout" },
  ] as const;

  return (
    <Page className="bg-background text-foreground">
      <header className="sticky top-0 z-40 border-b border-border bg-card">
        <div className="mx-auto grid max-w-7xl grid-cols-[1fr_auto] items-center gap-x-4 px-4 sm:px-6 lg:grid-cols-[auto_1fr_auto] lg:gap-x-10 lg:px-8">
          <Link
            href="/"
            className="inline-flex w-fit items-center gap-2.5 py-3 text-base font-semibold tracking-tight text-foreground"
          >
            <span className="grid size-8 place-items-center rounded-md bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900">
              <Layers className="size-5" aria-hidden="true" />
            </span>
            LaunchKit
          </Link>
          <div className="col-start-2 row-start-1 flex shrink-0 items-center gap-2 lg:col-start-3">
            <ThemeToggle />
            <Link
              href="/dashboard"
              className="inline-flex min-h-9 items-center gap-2 rounded-md border border-border px-3 text-sm font-semibold text-foreground hover:bg-muted"
            >
              Workspace <ArrowUpRight className="size-4" aria-hidden="true" />
            </Link>
          </div>
          <nav
            aria-label="Component demos"
            className="col-span-2 border-t border-border lg:col-span-1 lg:col-start-2 lg:row-start-1 lg:border-0"
          >
            <div className="grid grid-cols-2 gap-x-2 sm:flex sm:items-center sm:gap-x-5">
              {demos.map(({ id, label }) => (
                <button
                  key={id}
                  type="button"
                  aria-pressed={activeTab === id}
                  onClick={() => setActiveTab(id)}
                  className={cn(
                    "whitespace-nowrap border-b-2 px-2 py-2.5 text-left text-sm font-medium transition-colors lg:py-5",
                    activeTab === id
                      ? "border-indigo-600 text-indigo-700 dark:border-indigo-400 dark:text-indigo-300"
                      : "border-transparent text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white"
                  )}
                >
                  {label}
                </button>
              ))}
            </div>
          </nav>
        </div>
      </header>

      <main>
        <Container className="py-6 sm:py-9">
          {/* Render Active Tab */}

          {/* 1. Dashboard Tab */}
          {activeTab === "dashboard" && (
            <div className="space-y-6">
              <header className="flex flex-wrap items-end justify-between gap-3 border-b border-border pb-5 text-left">
                <div>
                  <h1 className="text-[clamp(1.75rem,4vw,2.5rem)] font-semibold tracking-tight text-foreground">
                    System dashboard
                  </h1>
                  <p className="mt-1.5 text-sm text-slate-600 dark:text-slate-400">
                    Sample traffic, service health, and audit logs.
                  </p>
                </div>
                <span className="text-sm text-slate-600 dark:text-slate-400">July 2026</span>
              </header>

              <dl className="grid grid-cols-2 overflow-hidden rounded-lg border border-border bg-card sm:grid-cols-4">
                {[
                  { title: "New signups", value: "2,482", note: "Up 12% from last week" },
                  { title: "Active sessions", value: "482", note: "Most recent reading" },
                  { title: "Page views", value: "45,200", note: "Last 24 hours" },
                  { title: "Average load time", value: "142 ms", note: "Last 24 hours" },
                ].map(({ title, value, note }, index) => (
                  <div
                    key={title}
                    className={cn(
                      "min-w-0 space-y-1 px-4 py-4 text-left sm:px-5",
                      index % 2 === 1 && "border-l border-border",
                      index >= 2 && "border-t border-border sm:border-t-0",
                      index === 2 && "sm:border-l"
                    )}
                  >
                    <dt className="text-sm font-medium text-slate-600 dark:text-slate-400">
                      {title}
                    </dt>
                    <dd className="text-[clamp(1.25rem,3vw,1.875rem)] font-semibold tabular-nums tracking-tight text-foreground">
                      {value}
                    </dd>
                    <dd className="text-xs leading-relaxed text-slate-600 dark:text-slate-400">
                      {note}
                    </dd>
                  </div>
                ))}
              </dl>

              <Grid cols={12} gap={6}>
                <div className="col-span-12 min-w-0 lg:col-span-8 space-y-6">
                  <Card>
                    <div className="flex flex-wrap items-baseline justify-between gap-2">
                      <h2 className="text-lg font-semibold tracking-tight text-foreground">
                        Traffic volume
                      </h2>
                      <p className="text-xs text-slate-600 dark:text-slate-400">
                        Requests, thousands · 30 days
                      </p>
                    </div>
                    <Charts
                      type="area"
                      labels={["Jul 1", "Jul 10", "Jul 20", "Jul 30"]}
                      ariaLabel="Sample traffic rose from 12,000 to 60,000 requests in July"
                      data={[12, 19, 3, 5, 2, 3, 24, 18, 30, 45, 38, 50, 42, 60]}
                    />
                  </Card>

                  {/* Audit Logs */}
                  <AuditLogViewer logs={auditLogs} />
                </div>

                <div className="col-span-12 min-w-0 lg:col-span-4 space-y-6">
                  {/* System health monitor */}
                  <SystemStatus
                    services={[
                      { name: "Web app", status: "operational", latency: "12ms" },
                      { name: "PostgreSQL", status: "operational", latency: "8ms" },
                      { name: "Stripe webhooks", status: "operational" },
                      { name: "Gemini gateway", status: "degraded", latency: "2.4s" },
                    ]}
                  />
                </div>
              </Grid>
            </div>
          )}

          {/* 2. UI Playbook Tab */}
          {activeTab === "playbook" && (
            <div className="space-y-8">
              <div className="text-left border-b border-slate-100 dark:border-slate-900 pb-4">
                <Heading
                  level={1}
                  className="m-0 text-[clamp(1.75rem,4vw,2.5rem)] font-semibold tracking-tight"
                >
                  UI Playbook
                </Heading>
                <Subtitle className="mt-1.5 text-sm text-slate-600 dark:text-slate-400">
                  Try the form controls, editors, and dialogs used in the starter kit.
                </Subtitle>
              </div>

              <Grid cols={12} gap={6}>
                {/* Left Column: Form Controls */}
                <div className="col-span-12 min-w-0 lg:col-span-8 space-y-6">
                  <Card className="text-left">
                    <Heading
                      level={4}
                      className="font-bold border-b border-slate-100 dark:border-slate-900 pb-3"
                    >
                      Form controls
                    </Heading>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                      <Input label="Name" placeholder="John Doe" />
                      <PasswordInput label="Workspace Password" placeholder="••••••••" />
                      <Select
                        label="Pricing Plan"
                        value={selectVal}
                        onValueChange={setSelectVal}
                        options={[
                          { label: "Starter Edition", value: "starter" },
                          { label: "Pro Edition", value: "pro" },
                          { label: "Enterprise Edition", value: "enterprise" },
                        ]}
                      />
                      <MultiSelect
                        label="Workspace stack"
                        selected={multiVal}
                        onChange={setMultiVal}
                        options={[
                          { label: "React 19", value: "react" },
                          { label: "Next.js 15", value: "nextjs" },
                          { label: "Tailwind v4", value: "tailwind" },
                          { label: "PostgreSQL", value: "postgres" },
                        ]}
                      />
                      <Autocomplete
                        label="Project Currency"
                        value={autoVal}
                        onValueChange={setAutoVal}
                        options={[
                          { label: "US Dollar (USD)", value: "usd" },
                          { label: "Euro (EUR)", value: "eur" },
                          { label: "British Pound (GBP)", value: "gbp" },
                        ]}
                      />
                      <DatePicker
                        label="Billing Period Start"
                        value={dateVal}
                        onChange={setDateVal}
                      />
                      <TimePicker label="Daily Backup Time" value={timeVal} onChange={setTimeVal} />
                      <ColorPicker
                        label="Brand Primary Color"
                        value={colorVal}
                        onChange={setColorVal}
                      />
                    </div>
                    <Separator className="my-4" />
                    <div className="space-y-4">
                      <div className="flex flex-wrap gap-6 items-center">
                        <Checkbox
                          id="demo-check"
                          checked={checked}
                          onCheckedChange={setChecked}
                          label="Accept workspace rules"
                        />
                        <Switch
                          checked={switchChecked}
                          onCheckedChange={setSwitchChecked}
                          label="Notify on CPU spikes"
                        />
                      </div>
                      <Slider
                        value={sliderVal}
                        onValueChange={setSliderVal}
                        label="Database pool usage limit"
                      />
                    </div>
                    <Separator className="my-4" />
                    <FileUpload label="Attach legal documents" />
                    <ImageUpload label="User Avatar Image" />
                  </Card>

                  {/* Markdown Editors */}
                  <Card>
                    <Heading
                      level={4}
                      className="font-bold border-b border-slate-100 dark:border-slate-900 pb-3"
                    >
                      Text editors
                    </Heading>
                    <MarkdownEditor label="Workspace Wiki (Markdown)" />
                    <RichTextEditor label="System Updates Broadcast (Rich Text)" />
                  </Card>
                </div>

                {/* Right Column: Buttons & Modal Triggers */}
                <div className="col-span-12 min-w-0 lg:col-span-4 space-y-6">
                  <Card>
                    <Heading
                      level={4}
                      className="font-bold border-b border-slate-100 dark:border-slate-900 pb-3"
                    >
                      Buttons
                    </Heading>
                    <div className="grid grid-cols-2 gap-2">
                      <Button variant="primary">Primary Button</Button>
                      <Button variant="secondary">Secondary Button</Button>
                      <Button variant="outline">Outline Button</Button>
                      <Button variant="ghost">Ghost Button</Button>
                      <Button variant="danger">Danger Button</Button>
                      <Button variant="success">Success Button</Button>
                      <Button loading variant="primary">
                        Loading State
                      </Button>
                      <div className="col-span-2 mt-1 flex flex-wrap gap-2.5">
                        <IconButton
                          icon={<Icons.Trash className="w-4 h-4 text-red-500" />}
                          aria-label="Delete"
                        />
                        <CopyButton value="LaunchKit token: 928X-10XW-909" />
                        <SplitButton options={["Trigger Cache Clear", "Force Database Sync"]}>
                          Actions Menu
                        </SplitButton>
                      </div>
                      <AnimatedButton className="col-span-2 w-full">Animated button</AnimatedButton>
                    </div>
                  </Card>

                  {/* Overlays / Modals Triggers */}
                  <Card className="text-left">
                    <Heading
                      level={4}
                      className="font-bold border-b border-slate-100 dark:border-slate-900 pb-3"
                    >
                      Dialogs and drawers
                    </Heading>
                    <Stack spacing={4} className="pt-2">
                      <Button variant="outline" onClick={() => setIsDialogOpen(true)}>
                        Open Standard Dialog
                      </Button>
                      <Button variant="outline" onClick={() => setIsDrawerOpen(true)}>
                        Open Right Drawer
                      </Button>
                      <Button variant="outline" onClick={() => setIsConfirmOpen(true)}>
                        Open Confirmation Dialog
                      </Button>
                      <Button variant="danger" onClick={() => setIsDeleteOpen(true)}>
                        Open Deletion Modal
                      </Button>
                    </Stack>

                    {/* Standard Dialog */}
                    <Dialog
                      open={isDialogOpen}
                      onOpenChange={setIsDialogOpen}
                      title="Standard Workspace Dialog"
                      description="Manage database node rules."
                    >
                      <p className="text-sm leading-relaxed text-slate-500">
                        Press Escape to close the dialog.
                      </p>
                    </Dialog>

                    {/* Drawer */}
                    <Drawer
                      open={isDrawerOpen}
                      onOpenChange={setIsDrawerOpen}
                      title="Sidebar Configurations Drawer"
                    >
                      <p className="text-sm text-slate-500">
                        Configure your local workspace folders, project dependencies, and
                        environment keys here.
                      </p>
                    </Drawer>

                    {/* Confirmation */}
                    <ConfirmationDialog
                      open={isConfirmOpen}
                      onOpenChange={setIsConfirmOpen}
                      title="Clear System Cache?"
                      message="Clearing the cache will cause momentary request latency spikes while resources reload."
                      onConfirm={() => showToast("System Cache Cleared", "success")}
                    />

                    {/* Deletion Dialog */}
                    <DeleteDialog
                      open={isDeleteOpen}
                      onOpenChange={setIsDeleteOpen}
                      onConfirm={() => showToast("Repository Deleted!", "error")}
                      itemName="LaunchKit"
                    />
                  </Card>
                </div>
              </Grid>
            </div>
          )}

          {/* 3. AI Chat Playground */}
          {activeTab === "ai" && (
            <div className="space-y-6">
              <div className="text-left border-b border-slate-100 dark:border-slate-900 pb-4">
                <Heading
                  level={1}
                  className="m-0 text-[clamp(1.75rem,4vw,2.5rem)] font-semibold tracking-tight"
                >
                  AI Chat Playground
                </Heading>
                <Subtitle className="mt-1.5 text-sm text-slate-600 dark:text-slate-400">
                  Try chat threads and simulated tool calls.
                </Subtitle>
              </div>

              <div className="flex min-w-0 flex-col overflow-hidden rounded-lg border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-950 md:h-[600px] md:flex-row">
                <ConversationSidebar
                  sessions={chatSessions.map((session) => ({
                    ...session,
                    active: session.id === activeChat,
                  }))}
                  onSelectSession={setActiveChat}
                  onNewChat={startNewChat}
                />
                <ChatWindow
                  key={activeChat}
                  title={chatSessions.find((session) => session.id === activeChat)?.title}
                  subtitle="Simulated assistant"
                  messages={messagesByChat[activeChat] ?? []}
                  onSendMessage={handleSendMessage}
                  loading={pendingChat === activeChat}
                  disabled={pendingChat !== null}
                  tools={pendingChat === activeChat ? activeTools : []}
                />
              </div>
            </div>
          )}

          {/* 4. Billing Tab */}
          {activeTab === "billing" && (
            <div className="space-y-6">
              <div className="text-left border-b border-slate-100 dark:border-slate-900 pb-4">
                <Heading
                  level={1}
                  className="m-0 text-[clamp(1.75rem,4vw,2.5rem)] font-semibold tracking-tight"
                >
                  Billing & Checkout
                </Heading>
                <Subtitle className="mt-1.5 text-sm text-slate-600 dark:text-slate-400">
                  Compare sample plans, view invoices, and preview checkout.
                </Subtitle>
              </div>

              {/* Pricing tier list */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {pricingPlans.map((plan) => (
                  <PricingCard
                    key={plan.name}
                    plan={plan}
                    selected={checkoutPlan.name === plan.name}
                    onSelect={() => setSelectedPlan(plan.name)}
                  />
                ))}
              </div>

              <Grid cols={12} gap={6}>
                <div className="col-span-12 min-w-0 lg:col-span-8 space-y-6">
                  {/* Plan comparison */}
                  <PlanComparison features={comparedFeatures} />

                  {/* Billing invoice list */}
                  <BillingHistory invoices={sampleInvoices} onDownload={downloadSampleInvoice} />
                </div>

                <div className="col-span-12 min-w-0 lg:col-span-4 space-y-6">
                  {/* Usage meter */}
                  <div className="space-y-4">
                    <UsageMeter
                      label="API requests this month"
                      value={6542}
                      max={10000}
                      unit="reqs"
                    />
                    <UsageMeter label="Storage quota" value={42} max={50} unit="GB" />
                  </div>

                  {/* Checkout summary */}
                  <CheckoutSummary
                    items={[
                      {
                        name: `${checkoutPlan.name} plan`,
                        price: Number(checkoutPlan.price.slice(1)),
                      },
                    ]}
                    buttonText="Preview checkout"
                    onCheckout={() =>
                      showToast(
                        `Checkout preview for ${checkoutPlan.name}. No payment was taken.`,
                        "info"
                      )
                    }
                  />
                </div>
              </Grid>
            </div>
          )}
        </Container>
      </main>
    </Page>
  );
}
