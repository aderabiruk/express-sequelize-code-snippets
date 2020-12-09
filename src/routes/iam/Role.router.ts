import passport from 'passport';
import express, { Router } from 'express';

import { hasPermission } from '../../middlewares/security/ACL';
import { UserTypeIDs } from '../../helpers/security/UserTypes';
import RoleController from '../../controllers/iam/Role.controller';
import { PermissionTypes, PermissionResources } from '../../helpers/security/Permission';

let router: Router = express.Router();

router
    /**
     * Create Role
     */
    .post("/", 
        passport.authenticate('jwt', {session: false}), 
        hasPermission({ type: PermissionTypes.CREATE, resource: PermissionResources.ROLE }, [ UserTypeIDs.SUPER_ADMINISTRATOR ]), 
        RoleController.create)
    /**
     * Assign Permission
     */
    .post("/assignPermission", 
        passport.authenticate('jwt', {session: false}), 
        hasPermission({ type: PermissionTypes.UPDATE, resource: PermissionResources.ROLE }, [ UserTypeIDs.SUPER_ADMINISTRATOR ]), 
        RoleController.assignPermission)
    /**
     * Remove Permission
     */
    .post("/removePermission", 
        passport.authenticate('jwt', {session: false}), 
        hasPermission({ type: PermissionTypes.UPDATE, resource: PermissionResources.ROLE }, [ UserTypeIDs.SUPER_ADMINISTRATOR ]), 
        RoleController.removePermission)
    /**
     * Search (No Pagination)
     */
    .post("/search", 
        passport.authenticate('jwt', {session: false}), 
        hasPermission({ type: PermissionTypes.READ, resource: PermissionResources.ROLE }, [ UserTypeIDs.SUPER_ADMINISTRATOR ]), 
        RoleController.search)
    /**
     * Search Roles
     */
    .post("/search/paginate", 
        passport.authenticate('jwt', {session: false}), 
        hasPermission({ type: PermissionTypes.READ, resource: PermissionResources.ROLE }, [ UserTypeIDs.SUPER_ADMINISTRATOR ]), 
        RoleController.searchPaginate)
    /**
     * Find Role By ID
     */
    .get("/:id", 
        passport.authenticate('jwt', {session: false}), 
        hasPermission({ type: PermissionTypes.READ, resource: PermissionResources.ROLE }, [ UserTypeIDs.SUPER_ADMINISTRATOR ]), 
        RoleController.findById)
    /**
     * Update Role
     */
    .put("/:id", 
        passport.authenticate('jwt', {session: false}), 
        hasPermission({ type: PermissionTypes.UPDATE, resource: PermissionResources.ROLE }, [ UserTypeIDs.SUPER_ADMINISTRATOR ]), 
        RoleController.update);

export default router;