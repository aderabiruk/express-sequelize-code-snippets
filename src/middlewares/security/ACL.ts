import async from 'async';
import { Request, Response } from 'express';

import { ForbiddenError } from '../../errors/Errors';
import { Permission } from '../../helpers/database/Sequelize';
import { extractPermissions } from '../../helpers/security/Permission';

export type PermissionType = {
    type: string;
    resource: string;
}

/**
 * Check If User has a Permission
 * 
 * @param {PermissionType}  permission
 * @param {number[]}        userTypes   Overrides permissions
 */
export const hasPermission = (permission: PermissionType, userTypes?: number[]) => {
    return async (request: Request, response: Response, next: Function) => {
        let user: any = request.user;
        if (userTypes && userTypes.length > 0 && userTypes.includes(user.user_type_id)) {
            next();
        }
        else {
            let permissions: Permission[] = await extractPermissions(user.roles);
            let status = permissions.filter((record: Permission) => record.type === permission.type && record.resource === permission.resource );
            if (status.length > 0) {
                next();
            }
            else {
                next(new ForbiddenError());
            }
        }
    };
};

/**
 * Check If User has a Permissions
 * 
 * @param {Arrays}      permissions
 * @param {number[]}    userTypes       Overrides permissions
 */
export const hasPermissions = (permissions: PermissionType[], userTypes?: number[]) => {
    return async (request: Request, response: Response, next: Function) => {
        let user: any = request.user;
        if (userTypes && userTypes.length > 0 && userTypes.includes(user.user_type_id)) {
            next();
        }
        else {
            let user_permissions: Permission[] = await extractPermissions(user.roles);
            async.eachSeries(permissions, (permission: PermissionType, callback: Function) => {
                let status = user_permissions.filter((record: Permission) => record.type === permission.type && record.resource === permission.resource );
                if (status.length > 0) {
                    callback();
                }
                else {
                    callback(new ForbiddenError());
                }
            }, (error) => {
                if (error) {
                    next(error);
                }
                else {
                    next();
                }
            });        
        }
    };
};

/**
 * Check User Type
 * 
 * @param {number[]} userTypes
 */
export const hasUserType = (userTypes: number[]) => {
    return async (request: Request, response: Response, next: Function) => {
        let user: any = request.user;
        if (userTypes.includes(user.user_type_id)) {
            next();
        }
        else {
            next(new ForbiddenError());
        }
    };
};
