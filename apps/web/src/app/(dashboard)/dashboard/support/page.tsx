"use client";

import { useState } from "react";
import Link from "next/link";
import { PageContainer, ContentWrapper, PageHeader, SettingsCard } from "@devlaunchkit/ui";
import { HelpCircle, Mail, MessageSquare } from "lucide-react";

export default function SupportPage() {
  const [preview, setPreview] = useState<{ subject: string; message: string } | null>(null);
  return (
    <PageContainer>
      <ContentWrapper>
        <PageHeader
          title="Support Desk"
          description="Find documentation or preview a support request."
        />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="rounded-xl border border-neutral-200 dark:border-neutral-800 p-5 bg-white dark:bg-neutral-900 space-y-3">
            <HelpCircle className="h-6 w-6 text-indigo-600" />
            <h3 className="text-xs font-bold text-neutral-900 dark:text-white">
              Knowledgebase Docs
            </h3>
            <p className="text-xs text-neutral-500">
              Read setup guidelines, provider comparative tables, and RBAC instructions.
            </p>
          </div>

          <div className="rounded-xl border border-neutral-200 dark:border-neutral-800 p-5 bg-white dark:bg-neutral-900 space-y-3">
            <MessageSquare className="h-6 w-6 text-emerald-600" />
            <h3 className="text-xs font-bold text-neutral-900 dark:text-white">Developer Chat</h3>
            <p className="text-xs text-neutral-500">
              Find community feedback and discussions on GitHub.
            </p>
            <a
              href="https://github.com/rmncore/DevLaunchKit/discussions"
              className="inline-block text-sm font-medium text-indigo-700 underline dark:text-indigo-300"
            >
              Browse discussions
            </a>
          </div>

          <div className="rounded-xl border border-neutral-200 dark:border-neutral-800 p-5 bg-white dark:bg-neutral-900 space-y-3">
            <Mail className="h-6 w-6 text-purple-600" />
            <h3 className="text-xs font-bold text-neutral-900 dark:text-white">Email Assistance</h3>
            <p className="text-xs text-neutral-500">
              Preview the information that would be included in a support ticket.
            </p>
          </div>
        </div>

        <SettingsCard
          title="Preview a support request"
          description="This workspace is a demo. Submitted text stays on this page."
        >
          <form
            className="max-w-lg space-y-4"
            onSubmit={(event) => {
              event.preventDefault();
              const values = new FormData(event.currentTarget);
              const subject = String(values.get("subject") ?? "").trim();
              const message = String(values.get("message") ?? "").trim();
              if (subject && message) setPreview({ subject, message });
            }}
          >
            <div>
              <label
                htmlFor="support-subject"
                className="block text-sm font-medium text-neutral-700 dark:text-neutral-300"
              >
                Subject
              </label>
              <input
                type="text"
                id="support-subject"
                name="subject"
                required
                maxLength={120}
                placeholder="Database configuration help"
                className="mt-1.5 w-full rounded-lg border border-neutral-200 dark:border-neutral-800 bg-transparent px-3.5 py-2 text-xs outline-none focus:border-indigo-500"
              />
            </div>
            <div>
              <label
                htmlFor="support-message"
                className="block text-sm font-medium text-neutral-700 dark:text-neutral-300"
              >
                Message
              </label>
              <textarea
                id="support-message"
                name="message"
                required
                maxLength={2000}
                placeholder="Explain the error message details..."
                className="mt-1.5 w-full rounded-lg border border-neutral-200 dark:border-neutral-800 bg-transparent px-3.5 py-2 text-xs outline-none focus:border-indigo-500 h-28"
              />
            </div>
            <button
              type="submit"
              className="rounded-lg bg-indigo-600 hover:bg-indigo-500 px-3.5 py-2 text-xs font-semibold text-white transition-colors"
            >
              Preview request
            </button>
          </form>
          {preview && (
            <div
              role="status"
              className="mt-4 max-w-lg rounded-lg bg-neutral-100 p-4 text-sm dark:bg-neutral-800"
            >
              <p className="font-semibold [overflow-wrap:anywhere]">{preview.subject}</p>
              <p className="mt-1 whitespace-pre-wrap [overflow-wrap:anywhere]">{preview.message}</p>
            </div>
          )}
        </SettingsCard>
      </ContentWrapper>
    </PageContainer>
  );
}
