import async from "async";

import Messages from "../../errors/Messages";
import PermissionDAL from "../../dals/iam/Permission.dal";
import { Permission } from "../../helpers/database/Sequelize";
import { IPaginationResponse, PaginationAdapter } from "../../helpers/adapters/Pagination";
import { Error, BadRequestError, InternalServerError, NotFoundError } from "../../errors/Errors";


class PermissionService {
    
    /**
     * Create Permission
     * 
     * @param {string}      name 
     * @param {string}      type 
     * @param {string}      resource 
     * @param {string}      code 
     * @param {number}      created_by 
     */
    static create(name: string, type: string, resource: string, code: string, created_by: number): Promise<Permission> {
        return new Promise((resolve, reject) => {
            PermissionDAL.create(name, type, resource, code, created_by)
                .then((result: Permission) => resolve(result))
                .catch((error: any) => reject(new BadRequestError(error)));
        });
    }

    /**
     * Find Many Permissions
     * 
     * @param {any} query
     */
    static findMany(query: any): Promise<Permission[]> {
        return new Promise((resolve, reject) => {
            PermissionDAL.findMany(query, [], [])
                .then((result: Permission[]) => resolve(result))
                .catch((error: any) => reject(new InternalServerError(error)));
        });
    }

    /**
     * Find Many Permissions
     * 
     * @param {any}     query 
     * @param {number}  page
     * @param {number}  limit
     */
    static findManyPaginate(query: any, page: number = 1, limit: number = 25): Promise<IPaginationResponse> {
        return new Promise((resolve, reject) => {
            PaginationAdapter(PermissionDAL, query, [], [], page, limit)
                .then((result: IPaginationResponse) => resolve(result))
                .catch((error: any) => reject(new InternalServerError(error)));
        });
    }

    /**
     * Find Permission By Id
     * 
     * @param {string} id
     */
    static findById(id: string): Promise<Permission> {
        return new Promise((resolve, reject) => {
            PermissionDAL.findOne({ id: id }, [], [])
                .then((result: Permission) => resolve(result))
                .catch((error: any) => reject(new InternalServerError(error)));
        });
    }

    /**
     * Update Permission
     * 
     * @param id 
     * @param payload 
     */
    static update(id: string, payload: any): Promise<Permission> {
        return new Promise((resolve, reject) => {
            async.waterfall([
                (done: Function) => {
                    PermissionService.findById(id)
                        .then((result: Permission) => {
                            if (result) {
                                done(null, result);
                            }
                            else {
                                done(new NotFoundError(Messages.PERMISSION_NOT_FOUND));
                            }
                        })
                        .catch((error: any) => done(error));
                },
                (permission: Permission, done: Function) => {
                    PermissionDAL.update(permission, payload)
                        .then((result: Permission) => resolve(result))
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
     * Delete Permission By Id
     * 
     * @param {string} id
     */
    static delete(id: string): Promise<number> {
        return new Promise((resolve, reject) => {
            PermissionDAL.delete({ id: id })
                .then((result: number) => resolve(result))
                .catch((error: any) => reject(new InternalServerError(error)));
        });
    }
};

export default PermissionService;