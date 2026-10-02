import { Router } from "express";
import { Role } from "../../../generated/prisma/enums.js";
import { checkAuth } from "../../middleware/checkAuth.js";
import { validateRequest } from "../../middleware/validateRequest.js";
import { UserController } from "./user.controller.js";
import { createAdminZodSchema, createDoctorZodSchema } from "./user.validation.js";
import { multerUpload } from "../../config/multer.config.js";
import { createDoctorProfilePhotoMiddleware } from "./user.middlewares.js";




const router = Router();


router.post("/create-doctor",
    multerUpload.single("file"),
    createDoctorProfilePhotoMiddleware,

    //     (req: Request, res: Response, next: NextFunction) => {

    //     const parsedResult = createDoctorZodSchema.safeParse(req.body);

    //     if (!parsedResult.success) {
    //         next(parsedResult.error)
    //     }

    //     //sanitizing the data
    //     req.body = parsedResult.data;

    //     next()

    // }, 
    
    validateRequest(createDoctorZodSchema),

    UserController.createDoctor);


router.post("/create-admin",
    checkAuth(Role.SUPER_ADMIN),
    validateRequest(createAdminZodSchema),
    UserController.createAdmin);

export const UserRoutes = router;