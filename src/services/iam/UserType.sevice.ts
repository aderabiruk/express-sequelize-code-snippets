import async from "async";

import Messages from "../../errors/Messages";
import UserTypeDAL from "../../dals/iam/UserType.dal";
import { UserType } from "../../helpers/database/Sequelize";
import { IPaginationResponse, PaginationAdapter } from "../../helpers/adapters/Pagination";
import { Error, BadRequestError, InternalServerError, NotFoundError } from "../../errors/Errors";


class UserTypeService {
    
    /**
     * Find or Create User Type
     * 
     * @param {string}  name 
     * @param {string}  description 
     * @param {string}  created_by 
     */
    static create(name: string, description: string, created_by: number): Promise<UserType> {
        return new Promise((resolve, reject) => {
            UserTypeDAL.create(name, description, created_by)
                .then((result: UserType) => resolve(result))
                .catch((error: any) => reject(new BadRequestError(error)));
        });
    }

    /**
     * Find Many User Types
     * 
     * @param {any} query
     */
    static findMany(query: any): Promise<UserType[]> {
        return new Promise((resolve, reject) => {
            UserTypeDAL.findMany(query, [], [])
                .then((result: UserType[]) => resolve(result))
                .catch((error: any) => reject(new InternalServerError(error)));
        });
    }

    /**
     * Find Many User Types
     * 
     * @param {any}     query 
     * @param {number}  page
     * @param {number}  limit
     */
    static findManyPaginate(query: any, page: number = 1, limit: number = 25): Promise<IPaginationResponse> {
        return new Promise((resolve, reject) => {
            PaginationAdapter(UserTypeDAL, query, [], [], page, limit)
                .then((result: IPaginationResponse) => resolve(result))
                .catch((error: any) => reject(new InternalServerError(error)));
        });
    }

    /**
     * Find One User Type
     * 
     * @param {any} query
     */
    static findOne(query: any): Promise<UserType> {
        return new Promise((resolve, reject) => {
            UserTypeDAL.findOne(query, [], [])
                .then((result: UserType) => resolve(result))
                .catch((error: any) => reject(new InternalServerError(error)));
        });
    }

    /**
     * Find User Type By Id
     * 
     * @param {string} id
     */
    static findById(id: string): Promise<UserType> {
        return new Promise((resolve, reject) => {
            UserTypeDAL.findOne({ id: id }, [], [])
                .then((result: UserType) => resolve(result))
                .catch((error: any) => reject(new InternalServerError(error)));
        });
    }

    /**
     * Update User Type
     * 
     * @param id 
     * @param payload 
     */
    static update(id: string, payload: any): Promise<UserType> {
        return new Promise((resolve, reject) => {
            async.waterfall([
                (done: Function) => {
                    UserTypeService.findById(id)
                        .then((result: UserType) => {
                            if (result) {
                                done(null, result);
                            }
                            else {
                                done(new NotFoundError(Messages.USER_TYPE_NOT_FOUND));
                            }
                        })
                        .catch((error: any) => done(error));
                },
                (UserType: UserType, done: Function) => {
                    UserTypeDAL.update(UserType, payload)
                        .then((result: UserType) => resolve(result))
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
     * Delete User Type By Id
     * 
     * @param {string} id
     */
    static delete(id: string): Promise<number> {
        return new Promise((resolve, reject) => {
            UserTypeDAL.delete({ id: id })
                .then((result: number) => resolve(result))
                .catch((error: any) => reject(new InternalServerError(error)));
        });
    }
};

export default UserTypeService;