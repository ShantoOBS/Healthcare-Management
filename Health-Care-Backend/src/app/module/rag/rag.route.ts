import { Router } from "express";
import { RagController } from "./rag.controller.js";
import { Role } from "../../../generated/prisma/browser.js";
import { checkAuth } from "../../middleware/checkAuth.js";
const router = Router();

router.get("/stats", checkAuth(Role.SUPER_ADMIN,Role.ADMIN), RagController.getStats);

//index doctors data
router.post("/ingest-doctors", checkAuth(Role.SUPER_ADMIN,Role.ADMIN), RagController.ingestDoctors);

// query rag
router.post("/query", RagController.queryRag);

export const RagRoutes = router;