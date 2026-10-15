
"use client";

import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  getRagStatsService,
  ingestDoctorsService,
  queryRagService,
  type IRagQueryPayload,
} from "@/services/rag.services";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  BrainCircuit,
  Database,
  FileSearch,
  RefreshCw,
  Search,
  Sparkles,
} from "lucide-react";
import { FormEvent, useState } from "react";

const STATS_QUERY_KEY = ["admin-rag-stats"];
const STATS_STALE_TIME = 1000 * 60;

const getErrorMessage = (error: unknown, fallback: string) =>
  error instanceof Error ? error.message : fallback;

const formatAnswer = (answer: unknown) => {
  if (typeof answer === "string") return answer;
  if (answer === null || answer === undefined) return "No answer was returned.";

  try {
    return JSON.stringify(answer, null, 2);
  } catch {
    return String(answer);
  }
};

const formatUpdatedAt = (value?: string) => {
  if (!value) return "Not available";
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? "Not available" : date.toLocaleString();
};

const RagManagementPage = () => {
  const queryClient = useQueryClient();
  const [query, setQuery] = useState("");

  const statsQuery = useQuery({
    queryKey: STATS_QUERY_KEY,
    queryFn: getRagStatsService,
    staleTime: STATS_STALE_TIME,
  });

  const ingestMutation = useMutation({
    mutationFn: ingestDoctorsService,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: STATS_QUERY_KEY });
    },
  });

  const queryMutation = useMutation({
    mutationFn: (payload: IRagQueryPayload) => queryRagService(payload),
  });

  const stats = statsQuery.data?.data;
  const queryResult = queryMutation.data?.data;
  const sources = queryResult?.sources ?? [];
  const sourceTypeCount = Object.keys(stats?.sourceTypeBreakdown ?? {}).length;

  const handleQuerySubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const trimmedQuery = query.trim();
    if (!trimmedQuery) return;

    queryMutation.mutate({ query: trimmedQuery, limit: 5 });
  };

  return (
    <main className="doctor-management space-y-6">
      <header className="doctor-management-heading">
        <div className="doctor-management-mark" aria-hidden="true">
          <BrainCircuit />
        </div>
        <div className="min-w-0">
          <p className="doctor-management-eyebrow">Knowledge systems</p>
          <h1>RAG Management</h1>
          <p className="doctor-management-description">
            Monitor indexed knowledge and test retrieval answers.
          </p>
        </div>
        <Button
          type="button"
          onClick={() => ingestMutation.mutate()}
          disabled={ingestMutation.isPending}
          className="ml-auto shrink-0 bg-[#1f5c4b] text-white hover:bg-[#184b3d]"
        >
          {ingestMutation.isPending ? (
            <RefreshCw className="size-4 animate-spin" aria-hidden="true" />
          ) : (
            <Database className="size-4" aria-hidden="true" />
          )}
          {ingestMutation.isPending ? "Indexing doctors..." : "Re-index doctors"}
        </Button>
      </header>

      {ingestMutation.isSuccess && (
        <div className="rounded-md border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800" role="status">
          {ingestMutation.data.data.message} ({ingestMutation.data.data.indexedCount} doctors indexed)
        </div>
      )}
      {ingestMutation.isError && (
        <div className="rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700" role="alert">
          {getErrorMessage(ingestMutation.error, "Doctor data could not be indexed. Please try again.")}
        </div>
      )}

      <section className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4" aria-label="RAG index statistics">
        <article className="rounded-lg border border-[#dfeae6] bg-white p-4 shadow-sm">
          <div className="flex items-center justify-between gap-3 text-sm font-medium text-[#61736b]">
            <span>Active documents</span>
            <Database className="size-4 text-[#1f5c4b]" aria-hidden="true" />
          </div>
          <strong className="mt-3 block text-2xl font-semibold tabular-nums text-[#1a2d29]">
            {statsQuery.isLoading ? "—" : stats?.totalActiveDocuments?.toLocaleString() ?? "0"}
          </strong>
          <p className="mt-1 text-xs text-[#7a8c87]">Available to retrieval</p>
        </article>

        <article className="rounded-lg border border-[#dfeae6] bg-white p-4 shadow-sm">
          <div className="flex items-center justify-between gap-3 text-sm font-medium text-[#61736b]">
            <span>Doctor records</span>
            <BrainCircuit className="size-4 text-[#527f6c]" aria-hidden="true" />
          </div>
          <strong className="mt-3 block text-2xl font-semibold tabular-nums text-[#1a2d29]">
            {statsQuery.isLoading ? "—" : (stats?.sourceTypeBreakdown?.DOCTOR ?? 0).toLocaleString()}
          </strong>
          <p className="mt-1 text-xs text-[#7a8c87]">Indexed doctor entries</p>
        </article>

        <article className="rounded-lg border border-[#dfeae6] bg-white p-4 shadow-sm">
          <div className="flex items-center justify-between gap-3 text-sm font-medium text-[#61736b]">
            <span>Source types</span>
            <FileSearch className="size-4 text-[#608aa0]" aria-hidden="true" />
          </div>
          <strong className="mt-3 block text-2xl font-semibold tabular-nums text-[#1a2d29]">
            {statsQuery.isLoading ? "—" : sourceTypeCount.toLocaleString()}
          </strong>
          <p className="mt-1 text-xs text-[#7a8c87]">Distinct indexed categories</p>
        </article>

        <article className="rounded-lg border border-[#dfeae6] bg-white p-4 shadow-sm">
          <div className="flex items-center justify-between gap-3 text-sm font-medium text-[#61736b]">
            <span>Stats updated</span>
            <RefreshCw className="size-4 text-[#c79538]" aria-hidden="true" />
          </div>
          <strong className="mt-3 block truncate text-base font-semibold text-[#1a2d29]">
            {statsQuery.isLoading ? "Loading..." : formatUpdatedAt(stats?.timestamp)}
          </strong>
          <p className="mt-1 text-xs text-[#7a8c87]">Vector index snapshot</p>
        </article>
      </section>

      {statsQuery.isError && (
        <div className="flex flex-wrap items-center justify-between gap-3 rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700" role="alert">
          <span>{getErrorMessage(statsQuery.error, "RAG statistics could not be loaded.")}</span>
          <Button type="button" variant="outline" size="sm" onClick={() => void statsQuery.refetch()}>
            Retry
          </Button>
        </div>
      )}

      <section className="grid gap-5 xl:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)]">
        <div className="min-w-0 rounded-lg border border-[#dfeae6] bg-white p-5 shadow-sm sm:p-6">
          <div className="mb-5 flex items-start gap-3">
            <div className="grid size-9 shrink-0 place-items-center rounded-md bg-[#edf4f0] text-[#1f5c4b]">
              <Search className="size-4" aria-hidden="true" />
            </div>
            <div>
              <h2 className="text-base font-semibold text-[#1a2d29]">Retrieval playground</h2>
              <p className="mt-1 text-sm text-[#71827c]">Inspect an answer alongside its retrieved records.</p>
            </div>
          </div>

          <form onSubmit={handleQuerySubmit} className="space-y-3">
            <label htmlFor="rag-query" className="text-sm font-medium text-[#30443e]">
              Query
            </label>
            <Textarea
              id="rag-query"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Ask a question about indexed doctors and care services..."
              rows={4}
              className="min-h-28 resize-y border-[#dfeae6] bg-white text-sm text-[#1a2d29] placeholder:text-[#8a9993] focus-visible:border-[#1f5c4b] focus-visible:ring-[#1f5c4b]/20"
            />
            <div className="flex flex-wrap items-center justify-between gap-3">
              <span className="text-xs text-[#7a8c87]">Top 5 matching source chunks</span>
              <Button
                type="submit"
                disabled={!query.trim() || queryMutation.isPending}
                className="bg-[#1f5c4b] text-white hover:bg-[#184b3d]"
              >
                {queryMutation.isPending ? (
                  <RefreshCw className="size-4 animate-spin" aria-hidden="true" />
                ) : (
                  <Sparkles className="size-4" aria-hidden="true" />
                )}
                {queryMutation.isPending ? "Searching..." : "Run query"}
              </Button>
            </div>
          </form>

          {queryMutation.isError && (
            <p className="mt-4 rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700" role="alert">
              {getErrorMessage(queryMutation.error, "The RAG query failed. Please try again.")}
            </p>
          )}

          {queryMutation.isSuccess && (
            <div className="mt-5 space-y-4 border-t border-[#e8efeb] pt-5" aria-live="polite">
              <div className="flex items-center justify-between gap-3">
                <h3 className="text-sm font-semibold text-[#1a2d29]">Answer</h3>
                <span className="rounded-full bg-[#edf4f0] px-2.5 py-1 text-xs font-medium text-[#1f5c4b]">
                  {queryResult?.contextUsed ? "Context retrieved" : "No context used"}
                </span>
              </div>
              <div className="max-h-80 overflow-auto rounded-md bg-[#f7faf8] p-4 text-sm leading-6 text-[#30443e]">
                <p className="whitespace-pre-wrap">{formatAnswer(queryResult?.answer)}</p>
              </div>
            </div>
          )}
        </div>

        <div className="min-w-0 rounded-lg border border-[#dfeae6] bg-white p-5 shadow-sm sm:p-6">
          <div className="mb-5 flex items-start justify-between gap-3">
            <div className="flex items-start gap-3">
              <div className="grid size-9 shrink-0 place-items-center rounded-md bg-[#f4f5e9] text-[#827038]">
                <FileSearch className="size-4" aria-hidden="true" />
              </div>
              <div>
                <h2 className="text-base font-semibold text-[#1a2d29]">Retrieved sources</h2>
                <p className="mt-1 text-sm text-[#71827c]">
                  {queryMutation.isSuccess ? `${sources.length} matching chunks` : "Sources appear after a query."}
                </p>
              </div>
            </div>
            {queryMutation.isSuccess && (
              <Button
                type="button"
                variant="ghost"
                size="icon-sm"
                aria-label="Clear query results"
                title="Clear results"
                onClick={() => queryMutation.reset()}
              >
                ×
              </Button>
            )}
          </div>

          {queryMutation.isSuccess && sources.length === 0 ? (
            <div className="rounded-md border border-dashed border-[#dfeae6] px-4 py-8 text-center text-sm text-[#71827c]">
              No matching sources were returned.
            </div>
          ) : (
            <div className="space-y-3">
              {sources.map((source, index) => (
                <details key={source.id} className="group rounded-md border border-[#e4ece7] bg-white">
                  <summary className="flex cursor-pointer list-none items-center justify-between gap-3 p-3 [&::-webkit-details-marker]:hidden">
                    <span className="min-w-0">
                      <span className="block truncate text-sm font-medium text-[#1a2d29]">
                        {source.sourceLabel || source.metadata?.name || source.sourceType || `Source ${index + 1}`}
                      </span>
                      <span className="mt-1 block text-xs text-[#7a8c87]">
                        {source.sourceType || "Document"} · {Math.round(source.similarity * 100)}% match
                      </span>
                    </span>
                    <span className="shrink-0 text-xs font-medium text-[#1f5c4b] group-open:rotate-180" aria-hidden="true">
                      ▾
                    </span>
                  </summary>
                  <div className="border-t border-[#e8efeb] px-3 py-3">
                    <p className="whitespace-pre-wrap text-xs leading-5 text-[#52655e]">{source.content}</p>
                    <p className="mt-3 truncate font-mono text-[0.65rem] text-[#8a9993]">{source.id}</p>
                  </div>
                </details>
              ))}
            </div>
          )}

          {!queryMutation.isSuccess && !queryMutation.isPending && (
            <div className="flex min-h-48 flex-col items-center justify-center rounded-md border border-dashed border-[#dfeae6] px-4 text-center">
              <FileSearch className="size-7 text-[#9aaba3]" aria-hidden="true" />
              <p className="mt-3 text-sm font-medium text-[#52655e]">No retrieval results yet</p>
              <p className="mt-1 text-xs text-[#7a8c87]">Run a query to inspect source matches.</p>
            </div>
          )}

          {queryMutation.isPending && (
            <div className="flex min-h-48 items-center justify-center gap-2 text-sm text-[#71827c]" role="status">
              <RefreshCw className="size-4 animate-spin" aria-hidden="true" /> Retrieving sources...
            </div>
          )}
        </div>
      </section>
    </main>
  );
};

export default RagManagementPage;