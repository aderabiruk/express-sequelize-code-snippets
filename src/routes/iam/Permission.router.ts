import passport from 'passport';
import express, { Router } from 'express';

import { hasPermission } from '../../middlewares/security/ACL';
import { UserTypeIDs } from '../../helpers/security/UserTypes';
import PermissionController from '../../controllers/iam/Permission.controller';
import { PermissionTypes, PermissionResources } from '../../helpers/security/Permission';

let router: Router = express.Router();

router
    /**
     * Create Permission
     */
    .post("/", 
        passport.authenticate('jwt', {session: false}), 
        hasPermission({ type: PermissionTypes.CREATE, resource: PermissionResources.PERMISSION }, [ UserTypeIDs.SUPER_ADMINISTRATOR ]), 
        PermissionController.create)
    /**
     * Search (No Pagination)
     */
    .post("/search", 
        passport.authenticate('jwt', {session: false}), 
        hasPermission({ type: PermissionTypes.READ, resource: PermissionResources.PERMISSION }, [ UserTypeIDs.SUPER_ADMINISTRATOR ]), 
        PermissionController.search)
    /**
     * Search Permissions
     */
    .post("/search/paginate", 
        passport.authenticate('jwt', {session: false}), 
        hasPermission({ type: PermissionTypes.READ, resource: PermissionResources.PERMISSION }, [ UserTypeIDs.SUPER_ADMINISTRATOR ]), 
        PermissionController.searchPaginate)
    /**
     * Find Permission By ID
     */
    .get("/:id", 
        passport.authenticate('jwt', {session: false}), 
        hasPermission({ type: PermissionTypes.READ, resource: PermissionResources.PERMISSION }, [ UserTypeIDs.SUPER_ADMINISTRATOR ]), 
        PermissionController.findById)
    /**
     * Update Permission
     */
    .put("/:id", 
        passport.authenticate('jwt', {session: false}), 
        hasPermission({ type: PermissionTypes.UPDATE, resource: PermissionResources.PERMISSION }, [ UserTypeIDs.SUPER_ADMINISTRATOR ]), 
        PermissionController.update);

export default router;