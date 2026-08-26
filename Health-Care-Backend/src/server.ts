import app from "./app.js";
import { envVars } from "./app/config/env.js";
import { seedSuperAdmin } from "./app/utils/seed.js";

const bootstrap = async() => {
    try {
        await seedSuperAdmin();
        app.listen(envVars.PORT, () => {
            console.log(`Server is running on http://localhost:${envVars.PORT}`);
        });
    } catch (error) {
        console.error('Failed to start server:', error);
    }
}

bootstrap();