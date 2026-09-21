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
    metadata?: {
        name?: string;
        [key: string]: unknown;
    };
    sourceType?: string;
}

export interface IRagQueryData {
    answer: any;
    sources: IRagSource[];
    contextUsed: string;
}

export interface IIngestDoctorsData {
    success: boolean;
    message: string;
    indexedCount: number;
}

// ─── Service Functions ────────────────────────────────────────────────────────

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
