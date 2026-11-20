"use client";

import { useState } from "react";
import { ContentWrapper, PageContainer, PageHeader, SettingsCard } from "@devlaunchkit/ui";
import { Copy, Eye, EyeOff, Plus, Trash } from "lucide-react";

interface SampleKey {
  id: number;
  name: string;
  value: string;
}

export default function ApiKeysPage() {
  const [keys, setKeys] = useState<SampleKey[]>([
    { id: 1, name: "Gateway example", value: "dlk_demo_gateway" },
    { id: 2, name: "Webhook example", value: "dlk_demo_webhook" },
  ]);
  const [nextId, setNextId] = useState(3);
  const [visibleKey, setVisibleKey] = useState<number | null>(null);
  const [status, setStatus] = useState("");

  function addKey() {
    setKeys((current) => [
      ...current,
      { id: nextId, name: `Sample key ${nextId}`, value: `dlk_demo_${nextId}` },
    ]);
    setNextId(nextId + 1);
    setStatus("Sample key added.");
  }

  async function copyKey(key: SampleKey) {
    try {
      await navigator.clipboard.writeText(key.value);
      setStatus(`Copied ${key.name}.`);
    } catch {
      setVisibleKey(key.id);
      setStatus("Clipboard unavailable. Copy the displayed value manually.");
    }
  }

  return (
    <PageContainer>
      <ContentWrapper>
        <PageHeader
          title="API credentials"
          description="Try the key management interface with sample values."
          actions={
            <button
              type="button"
              onClick={addKey}
              className="inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-indigo-500"
            >
              <Plus className="size-4" aria-hidden="true" /> Add sample key
            </button>
          }
        />
        <SettingsCard
          title="Sample keys"
          description="These values are for previewing the interface and cannot authorize API requests."
        >
          {keys.length === 0 && (
            <p className="text-sm text-neutral-600 dark:text-neutral-400">
              No sample keys. Add one to try the controls.
            </p>
          )}
          <ul className="divide-y divide-neutral-200 dark:divide-neutral-800">
            {keys.map((key) => (
              <li key={key.id} className="flex flex-wrap items-center justify-between gap-3 py-3">
                <div className="min-w-0">
                  <p className="text-sm font-semibold">{key.name}</p>
                  <code className="break-all text-xs text-neutral-600 dark:text-neutral-400">
                    {visibleKey === key.id ? key.value : "••••••••••••"}
                  </code>
                </div>
                <div className="flex gap-1">
                  <button
                    type="button"
                    aria-label={`${visibleKey === key.id ? "Hide" : "Show"} ${key.name}`}
                    onClick={() => setVisibleKey(visibleKey === key.id ? null : key.id)}
                    className="grid size-10 place-items-center rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800"
                  >
                    {visibleKey === key.id ? (
                      <EyeOff className="size-4" />
                    ) : (
                      <Eye className="size-4" />
                    )}
                  </button>
                  <button
                    type="button"
                    aria-label={`Copy ${key.name}`}
                    onClick={() => copyKey(key)}
                    className="grid size-10 place-items-center rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800"
                  >
                    <Copy className="size-4" />
                  </button>
                  <button
                    type="button"
                    aria-label={`Remove ${key.name}`}
                    onClick={() => {
                      setKeys((current) => current.filter((entry) => entry.id !== key.id));
                      setStatus(`Removed ${key.name}.`);
                    }}
                    className="grid size-10 place-items-center rounded-lg text-red-700 hover:bg-red-50 dark:text-red-300 dark:hover:bg-red-950/40"
                  >
                    <Trash className="size-4" />
                  </button>
                </div>
              </li>
            ))}
          </ul>
          <p className="text-sm text-neutral-600 dark:text-neutral-400" role="status">
            {status}
          </p>
        </SettingsCard>
      </ContentWrapper>
    </PageContainer>
  );
}
