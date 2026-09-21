/* eslint-disable @typescript-eslint/no-explicit-any */

import { createClient, RedisClientType } from "redis";
import { envVars } from "../config/env.js";

class RedisService {
    private client: RedisClientType | null = null;
    private connectionPromise: Promise<void> | null = null;

    private getClient(): RedisClientType {
        if (!this.client) {
            const redisUrl = envVars.REDIS_URL;

            if (!redisUrl) {
                throw new Error("REDIS_URL is not configured");
            }

            this.client = createClient({
                url: redisUrl,
            });

            this.client.on("error", (error) => {
                console.error("Redis Client Error:", error);
            });

            this.client.on("connect", () => {
                console.log("Redis Client Connected");
            });

            this.client.on("ready", () => {
                console.log("Redis Client Ready");
            });

            this.client.on("end", () => {
                console.log("Redis Client Disconnected");
            });

            this.client.on("reconnecting", () => {
                console.log("Redis Client Reconnecting");
            });
        }

        return this.client;
    }

    async connect(): Promise<void> {
        const client = this.getClient();

        if (client.isReady) {
            return;
        }

        // Prevent multiple simultaneous connections
        if (!this.connectionPromise) {
            this.connectionPromise = client
                .connect()
                .then(() => {
                    console.log("Redis connected successfully");
                })
                .catch((error) => {
                    console.error("Failed to connect to Redis:", error);
                    this.connectionPromise = null;
                    throw error;
                });
        }

        await this.connectionPromise;
    }

    async get(key: string): Promise<string | null> {
        try {
            await this.connect();

            return await this.getClient().get(key);
        } catch (error) {
            console.error("Redis GET error:", error);
            return null;
        }
    }

    async set(
        key: string,
        value: any,
        ttlInSeconds: number
    ): Promise<void> {
        try {
            await this.connect();

            const stringValue =
                typeof value === "string"
                    ? value
                    : JSON.stringify(value);

            await this.getClient().set(key, stringValue, {
                EX: ttlInSeconds,
            });
        } catch (error) {
            console.error("Redis SET error:", error);
        }
    }

    async update(
        key: string,
        value: any,
        ttlInSeconds: number
    ): Promise<void> {
        await this.set(key, value, ttlInSeconds);
    }

    async delete(key: string): Promise<void> {
        try {
            await this.connect();

            await this.getClient().del(key);
        } catch (error) {
            console.error("Redis DELETE error:", error);
        }
    }

    async isAvailable(): Promise<boolean> {
        try {
            await this.connect();

            await this.getClient().ping();

            return true;
        } catch (error) {
            console.error("Redis PING error:", error);
            return false;
        }
    }

    async disconnect(): Promise<void> {
        if (this.client?.isOpen) {
            await this.client.quit();
        }

        this.connectionPromise = null;
    }
}

export const redisService = new RedisService();