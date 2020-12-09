import async from "async";

import Messages from "../../errors/Messages";
import RoleDAL from "../../dals/iam/Role.dal";
import PermissionService from "./Permission.service";
import RolePermissionDAL from "../../dals/iam/RolePermission.dal";
import { Role, Permission, RolePermission } from "../../helpers/database/Sequelize";
import { IPaginationResponse, PaginationAdapter } from "../../helpers/adapters/Pagination";
import { Error, BadRequestError, InternalServerError, NotFoundError } from "../../errors/Errors";


class RoleService {
    
    /**
     * Create Role
     * 
     * @param {string}  name 
     * @param {string}  description 
     * @param {string}  created_by 
     */
    static create(name: string, description: string, created_by: number): Promise<Role> {
        return new Promise((resolve, reject) => {
            async.waterfall([
                (done: Function) => {
                    RoleDAL.findOne({ name: name }, [], [])
                        .then((result: Role) => {
                            if (result) {
                                resolve(result);
                            }
                            else {
                                done(null);
                            }
                        })
                        .catch((error: any) => reject(new BadRequestError(error)));
                },
                (done: Function) => {
                    RoleDAL.create(name, description, created_by)
                        .then((result: Role) => resolve(result))
                        .catch((error: any) => done(new BadRequestError(error)));
                }
            ], (error: Error) => {
                if (error) {
                    reject(error);
                }
            });
        });
    }

    /**
     * Assign Permission
     * 
     * @param {number} id 
     * @param {number} permission_id 
     */
    static assignPermission(id: string, permission_id: string, created_by: number): Promise<Role> {
        return new Promise((resolve, reject) => {
            async.waterfall([
                (done: Function) => {
                    RoleService.findById(id)
                        .then((result: Role) => {
                            if (result) {
                                done(null, result);
                            }
                            else {
                                done(new BadRequestError([
                                    { field: "role_id", message: Messages.ROLE_NOT_FOUND }
                                ]));
                            }
                        })
                        .catch((error: any) => done(error));
                },
                (role: Role, done: Function) => {
                    PermissionService.findById(permission_id)
                        .then((result: Permission) => {
                            if (result) {
                                done(null, role, result);
                            }
                            else {
                                done(new BadRequestError([
                                    { field: "permission_id", message: Messages.PERMISSION_NOT_FOUND }
                                ]));
                            }
                        })
                        .catch((error: any) => done(error));
                },
                (role: Role, permission: Permission, done: Function) => {
                    RolePermissionDAL.create(role.id, permission.id, created_by)
                        .then((result: RolePermission) => resolve(role))
                        .catch((error: any) => reject(new BadRequestError(error)));
                }
            ], (error: Error) => {
                if (error) {
                    reject(error);
                }
            });
        });
    }

    /**
     * Remove Permission
     * 
     * @param {number} id 
     * @param {number} permission_id` 
     */
    static removeRole(id: string, permission_id: string): Promise<boolean> {
        return new Promise((resolve, reject) => {
            async.waterfall([
                (done: Function) => {
                    RoleService.findById(id)
                        .then((result: Role) => {
                            if (result) {
                                done(null, result);
                            }
                            else {
                                done(new BadRequestError([
                                    { field: "role_id", message: Messages.ROLE_NOT_FOUND }
                                ]));
                            }
                        })
                        .catch((error: any) => done(error));
                },
                (role: Role, done: Function) => {
                    PermissionService.findById(permission_id)
                        .then((result: Permission) => {
                            if (result) {
                                done(null, role, result);
                            }
                            else {
                                done(new BadRequestError([
                                    { field: "permission_id", message: Messages.PERMISSION_NOT_FOUND }
                                ]));
                            }
                        })
                        .catch((error: any) => done(error));
                },
                (role: Role, permission: Permission, done: Function) => {
                    RolePermissionDAL.delete({ role_id: role.id, permission_id: permission.id })
                        .then((result: boolean) => resolve(result))
                        .catch((error: any) => reject(new BadRequestError(error)));
                }
            ], (error: Error) => {
                if (error) {
                    reject(error);
                }
            });
        });
    }

    /**
     * Find Many Roles
     * 
     * @param {any} query
     */
    static findMany(query: any): Promise<Role[]> {
        return new Promise((resolve, reject) => {
            RoleDAL.findMany(query, [], [])
                .then((result: Role[]) => resolve(result))
                .catch((error: any) => reject(new InternalServerError(error)));
        });
    }

    /**
     * Find Many Roles
     * 
     * @param {any}     query 
     * @param {number}  page
     * @param {number}  limit
     */
    static findManyPaginate(query: any, page: number = 1, limit: number = 25): Promise<IPaginationResponse> {
        return new Promise((resolve, reject) => {
            PaginationAdapter(RoleDAL, query, [], [], page, limit)
                .then((result: IPaginationResponse) => resolve(result))
                .catch((error: any) => reject(new InternalServerError(error)));
        });
    }

    /**
     * Find One Role
     * 
     * @param {any} query
     */
    static findOne(query: any): Promise<Role> {
        return new Promise((resolve, reject) => {
            RoleDAL.findOne(query, [], [])
                .then((result: Role) => resolve(result))
                .catch((error: any) => reject(new InternalServerError(error)));
        });
    }

    /**
     * Find Role By Id
     * 
     * @param {string} id
     */
    static findById(id: string): Promise<Role> {
        return new Promise((resolve, reject) => {
            RoleDAL.findOne({ id: id }, [], [])
                .then((result: Role) => resolve(result))
                .catch((error: any) => reject(new InternalServerError(error)));
        });
    }

    /**
     * Update Role
     * 
     * @param id 
     * @param payload 
     */
    static update(id: string, payload: any): Promise<Role> {
        return new Promise((resolve, reject) => {
            async.waterfall([
                (done: Function) => {
                    RoleService.findById(id)
                        .then((result: Role) => {
                            if (result) {
                                done(null, result);
                            }
                            else {
                                done(new NotFoundError(Messages.ROLE_NOT_FOUND));
                            }
                        })
                        .catch((error: any) => done(error));
                },
                (role: Role, done: Function) => {
                    RoleDAL.update(role, payload)
                        .then((result: Role) => resolve(result))
                        .catch((error: any) => done(new BadRequestError(error)));
                }
            ], (error: Error) => {
                if (error) {
                    reject(error);
                }
            });
        });
    }

    /**
     * Delete Role By Id
     * 
     * @param {string} id
     */
    static delete(id: string): Promise<number> {
        return new Promise((resolve, reject) => {
            RoleDAL.delete({ id: id })
                .then((result: number) => resolve(result))
                .catch((error: any) => reject(new InternalServerError(error)));
        });
    }
};

export default RoleService;