import { Router } from "express";
import { Role } from "../../../generated/prisma/enums.js";
import { checkAuth } from "../../middleware/checkAuth.js";
import { validateRequest } from "../../middleware/validateRequest.js";
import { DoctorController } from "./doctor.controller.js";
import { updateDoctorZodSchema } from "./doctor.validation.js";
import { multerUpload } from "../../config/multer.config.js";
import { doctorProfilePhotoMiddleware } from "./doctor.middlewares.js";

const router = Router();

router.get("/",
    // checkAuth(Role.ADMIN, Role.SUPER_ADMIN),
    DoctorController.getAllDoctors);
router.get("/:id",

    DoctorController.getDoctorById);

router.patch("/:id",
    checkAuth(Role.ADMIN, Role.SUPER_ADMIN,Role.DOCTOR),
    multerUpload.single("file"),
    doctorProfilePhotoMiddleware,
    validateRequest(updateDoctorZodSchema), DoctorController.updateDoctor);
    
router.delete("/:id",
    checkAuth(Role.ADMIN, Role.SUPER_ADMIN),
    DoctorController.deleteDoctor);

export const DoctorRoutes = router;