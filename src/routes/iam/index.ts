import { Router } from 'express';

import RoleRouter from "./Role.router";
import UserRouter from "./User.router";
import LoginRouter from "./Login.router";
import PermissionRouter from "./Permission.router";

let router: Router = Router();

router
    /**
     * Login Router
     */
    .use("/login", LoginRouter)
    /**
     * Role Router
     */
    .use("/roles", RoleRouter)
    /**
     * User Router
     */
    .use("/users", UserRouter)
    /**
     * Permission Router
     */
    .use("/permissions", PermissionRouter);
    

export default router;