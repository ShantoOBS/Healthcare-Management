"use server";

import { httpClient } from "@/lib/axios/httpClient";

// ─── Request Types ────────────────────────────────────────────────────────────

export interface IRagQueryPayload {
    query: string;
    limit?: number;
    sourceType?: string;
}

// ─── Response Data Types ──────────────────────────────────────────────────────

export interface IRagSource {
    id: string;
    content: string;
    similarity: number;
    sourceLabel?: string;
    sourceId?: string;
    metadata?: {
        name?: string;
        [key: string]: unknown;
    };
    sourceType?: string;
}

export interface IRagQueryData {
    answer: unknown;
    sources: IRagSource[];
    contextUsed: boolean;
}

export interface IIngestDoctorsData {
    success: boolean;
    message: string;
    indexedCount: number;
}

export interface IRagStatsData {
    totalActiveDocuments: number;
    sourceTypeBreakdown: Record<string, number>;
    timestamp: string;
}

// ─── Service Functions ────────────────────────────────────────────────────────

/**
 * GET /rag/stats
 * Retrieves document counts and source types from the vector store.
 */
export const getRagStatsService = async () => {
    return httpClient.get<IRagStatsData>("/rag/stats");
};

/**
 * POST /rag/query
 * Sends a natural language query and returns an AI-generated answer.
 */
export const queryRagService = async (payload: IRagQueryPayload) => {
    const response = await httpClient.post<IRagQueryData>("/rag/query", payload);
    return response;
};

/**
 * POST /rag/ingest-doctors
 * Triggers ingestion (indexing) of all doctors into the vector store.
 */
export const ingestDoctorsService = async () => {
    const response = await httpClient.post<IIngestDoctorsData>("/rag/ingest-doctors", {});
    return response;
};
