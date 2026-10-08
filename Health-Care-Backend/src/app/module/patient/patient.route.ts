import { Router } from "express";
import { Role } from "../../../generated/prisma/enums.js";
import { multerUpload } from "../../config/multer.config.js";
import { checkAuth } from "../../middleware/checkAuth.js";
import { validateRequest } from "../../middleware/validateRequest.js";
import { PatientController } from "./patient.controller.js";
import { updateMyPatientProfileMiddleware } from "./patient.middlewares.js";
import { PatientValidation } from "./patient.validation.js";

const router = Router();

router.get("/",
    checkAuth(Role.ADMIN, Role.SUPER_ADMIN),
    PatientController.getAllPatients
)

router.get("/:id",
    checkAuth(Role.ADMIN, Role.SUPER_ADMIN),
    PatientController.getPatientById
)

router.patch("/update-my-profile",
    checkAuth(Role.PATIENT, Role.ADMIN, Role.SUPER_ADMIN, Role.DOCTOR),
    multerUpload.fields([
        { name: "profilePhoto", maxCount: 1 },
        { name: "medicalReports", maxCount: 5 }
    ]),
    updateMyPatientProfileMiddleware,
    validateRequest(PatientValidation.updatePatientProfileZodSchema),
    PatientController.updateMyProfile
)

router.patch("/:id",
    checkAuth(Role.ADMIN, Role.SUPER_ADMIN),
    validateRequest(PatientValidation.updatePatientAdminZodSchema),
    PatientController.updatePatient
)

router.delete("/:id",
    checkAuth(Role.ADMIN, Role.SUPER_ADMIN),
    PatientController.deletePatient
)

export const PatientRoutes = router;