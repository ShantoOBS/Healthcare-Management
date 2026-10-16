import { parseCookie } from "cookie";
import { Server as HttpServer } from "http";
import { Server } from "socket.io";
import { NotificationType, Role, UserStatus } from "../../generated/prisma/enums.js";
import { envVars } from "../config/env.js";
import { prisma } from "./prisma.js";
import { jwtUtils } from "../utils/jwt.js";

const DOCTOR_CREATED_EVENT = "notification:doctor-created";
const patientRoom = (userId: string) => `patient:${userId}`;

let notificationServer: Server | undefined;

export const initializeNotificationSocket = (httpServer: HttpServer) => {
    notificationServer = new Server(httpServer, {
        cors: {
            origin: [envVars.FRONTEND_URL, envVars.BETTER_AUTH_URL, "http://localhost:3000"],
            credentials: true,
        },
    });

    notificationServer.use(async (socket, next) => {
        const cookieHeader = socket.handshake.headers.cookie;
        const accessToken = cookieHeader ? parseCookie(cookieHeader).accessToken : undefined;

        if (!accessToken) {
            return next(new Error("Unauthorized"));
        }

        const token = jwtUtils.verifyToken(accessToken, envVars.ACCESS_TOKEN_SECRET);
        const userId = token.data?.userId;
        if (!token.success || token.data?.role !== Role.PATIENT || typeof userId !== "string") {
            return next(new Error("Unauthorized"));
        }

        const patient = await prisma.user.findFirst({
            where: { id: userId, role: Role.PATIENT, status: UserStatus.ACTIVE, isDeleted: false },
            select: { id: true },
        });
        if (!patient) {
            return next(new Error("Unauthorized"));
        }

        socket.data.userId = patient.id;
        next();
    });

    notificationServer.on("connection", (socket) => {
        socket.join(patientRoom(socket.data.userId));

        socket.on("notifications:list", async (respond: (items: object[]) => void) => {
            try {
                const items = await prisma.notification.findMany({
                    where: { userId: socket.data.userId },
                    orderBy: { createdAt: "desc" },
                    take: 20,
                });
                respond(items.map(({ id, title, message, createdAt, readAt }) => ({
                    id,
                    title,
                    message,
                    createdAt: createdAt.toISOString(),
                    readAt: readAt?.toISOString() ?? null,
                })));
            } catch (error) {
                console.error("Failed to load notifications:", error);
                respond([]);
            }
        });

        socket.on("notifications:read", async (id: string) => {
            try {
                await prisma.notification.updateMany({
                    where: { id, userId: socket.data.userId, readAt: null },
                    data: { readAt: new Date() },
                });
            } catch (error) {
                console.error("Failed to mark notification as read:", error);
            }
        });
    });
};

export const notifyPatientsDoctorCreated = async (doctorName: string) => {
    const patients = await prisma.user.findMany({
        where: { role: Role.PATIENT, status: UserStatus.ACTIVE, isDeleted: false },
        select: { id: true },
    });

    const title = "New doctor available";
    const message = `${doctorName} has joined DocLink.`;
    const notifications = await prisma.$transaction(patients.map((patient) =>
        prisma.notification.create({
            data: {
                userId: patient.id,
                type: NotificationType.DOCTOR_CREATED,
                title,
                message,
            },
        }),
    ));

    for (const notification of notifications) {
        notificationServer?.to(patientRoom(notification.userId)).emit(DOCTOR_CREATED_EVENT, {
            id: notification.id,
            title: notification.title,
            message: notification.message,
            createdAt: notification.createdAt.toISOString(),
            readAt: null,
        });
    }
};