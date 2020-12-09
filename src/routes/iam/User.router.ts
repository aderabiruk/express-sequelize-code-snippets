import passport from 'passport';
import express, { Router } from 'express';

import upload from '../../middlewares/upload/UploadImage';
import { UserTypeIDs } from '../../helpers/security/UserTypes';
import UserController from '../../controllers/iam/User.controller';
import { PermissionTypes, PermissionResources } from '../../helpers/security/Permission';
import { hasPermission, hasPermissions, hasUserType } from '../../middlewares/security/ACL';


let router: Router = express.Router();

router
    /**
     * Create User
     */
    .post("/", 
        passport.authenticate('jwt', {session: false}), 
        hasPermission({ type: PermissionTypes.CREATE, resource: PermissionResources.USER }, [ UserTypeIDs.SUPER_ADMINISTRATOR ]), 
        UserController.create)
    /**
     * Change Profile Picture
     */
    .post("/changeProfilePicture", 
        passport.authenticate('jwt', {session: false}), 
        upload.single("image"),
        UserController.changeProfilePicture)
    /**
     * Change Password
     */
    .post("/changePassword", 
        passport.authenticate('jwt', {session: false}), 
        UserController.changePassword)
    /**
     * Assign Role
     */
    .post("/assignRole", 
        passport.authenticate('jwt', {session: false}), 
        hasPermissions([
            { type: PermissionTypes.UPDATE, resource: PermissionResources.USER },
            { type: PermissionTypes.UPDATE, resource: PermissionResources.ROLE }
        ], [ UserTypeIDs.SUPER_ADMINISTRATOR ]), 
        UserController.assignRole)
    /**
     * Remove Role
     */
    .post("/removeRole", 
        passport.authenticate('jwt', {session: false}), 
        hasPermissions([
            { type: PermissionTypes.UPDATE, resource: PermissionResources.USER },
            { type: PermissionTypes.UPDATE, resource: PermissionResources.ROLE }
        ], [ UserTypeIDs.SUPER_ADMINISTRATOR ]), 
        UserController.removeRole)
    /**
     * Search Users
     */
    .post("/search", 
        passport.authenticate('jwt', {session: false}), 
        hasPermission({ type: PermissionTypes.READ, resource: PermissionResources.USER }, [ UserTypeIDs.SUPER_ADMINISTRATOR ]), 
        UserController.search)
    /**
     * Search Users
     */
    .post("/search/paginate", 
        passport.authenticate('jwt', {session: false}), 
        hasPermission({ type: PermissionTypes.READ, resource: PermissionResources.USER }, [ UserTypeIDs.SUPER_ADMINISTRATOR ]), 
        UserController.searchPaginate)
    /**
     * Activate User
     */
    .post("/:id/activate", 
        passport.authenticate('jwt', {session: false}), 
        hasPermission({ type: PermissionTypes.UPDATE, resource: PermissionResources.USER }, [ UserTypeIDs.SUPER_ADMINISTRATOR ]), 
        UserController.activateAccount)
    /**
     * Lock User
     */
    .post("/:id/lock", 
        passport.authenticate('jwt', {session: false}), 
        hasPermission({ type: PermissionTypes.UPDATE, resource: PermissionResources.USER }, [ UserTypeIDs.SUPER_ADMINISTRATOR ]), 
        UserController.lockAccount)
    /**
     * Deactivate User
     */
    .post("/:id/deactivate", 
        passport.authenticate('jwt', {session: false}), 
        hasPermission({ type: PermissionTypes.UPDATE, resource: PermissionResources.USER }, [ UserTypeIDs.SUPER_ADMINISTRATOR ]), 
        UserController.deactivateAccount)
    /**
     * Unlock User
     */
    .post("/:id/unlock", 
        passport.authenticate('jwt', {session: false}), 
        hasPermission({ type: PermissionTypes.UPDATE, resource: PermissionResources.USER }, [ UserTypeIDs.SUPER_ADMINISTRATOR ]), 
        UserController.unlockAccount)
    /**
     * Find User By ID
     */
    .get("/:id", 
        passport.authenticate('jwt', {session: false}), 
        hasPermission({ type: PermissionTypes.READ, resource: PermissionResources.USER }, [ UserTypeIDs.SUPER_ADMINISTRATOR ]), 
        UserController.findById)
    /**
     * Update User
     */
    .put("/:id", UserController.update);

export default router;