import _ from 'lodash';
import async from "async";
import config from 'config';
import { Transaction } from 'sequelize';

import RoleService from "./Role.service";
import Messages from "../../errors/Messages";
import UserDAL from "../../dals/iam/User.dal";
import UserTypeService from "./UserType.sevice";
import PolicyDAL from "../../dals/iam/Policy.dal";
import { comparePassword, hash } from "../../helpers/security/Security";
import { PaginationAdapter, IPaginationResponse } from "../../helpers/adapters/Pagination";
import { Error, BadRequestError, InternalServerError, NotFoundError } from "../../errors/Errors";
import { User, Role, Policy, UserType, Permission, sequelize } from "../../helpers/database/Sequelize";



class UserService {
    
    /**
     * Create User
     * 
     * @param {string}          user_type_id 
     * @param {string}          name 
     * @param {string}          username 
     * @param {string}          password 
     * @param {string}          email 
     * @param {string}          profile_picture 
     * @param {string}          created_by
     * @param {Transaction}     transaction 
     */
    static create(user_type_id: string, name: string, username: string, password: string, email: string, profile_picture: string, created_by: number, transaction?: Transaction): Promise<User> {
        return new Promise((resolve, reject) => {
            async.waterfall([
                (done: Function) => {
                    UserService.findOne({ username: username })
                        .then((result: User) => {
                            if (result) {
                                done(new BadRequestError([
                                    { field: "username", message: Messages.USER_ALREADY_EXISTS }
                                ]));
                            }
                            else {
                                done(null);
                            }
                        })
                        .catch((error: any) => done(error));
                },
                (done: Function) => {
                    UserTypeService.findById(user_type_id)
                        .then((result: UserType) => {
                            if (result) {
                                done(null, result);
                            }
                            else {
                                done(new BadRequestError([
                                    { field: "user_type_id", message: Messages.USER_TYPE_NOT_FOUND }
                                ]));
                            }
                        })
                        .catch((error: any) => done(error));
                },
                (userType: UserType, done: Function) => {
                    hash(password.toString(), config.get("security.hash.saltRound"))
                        .then((hash) => {
                            done(null, userType, hash);
                        })
                        .catch((error) => {
                            done(new BadRequestError([ error ]));
                        });
                },
                (userType: UserType, hash: string, done: Function) => {
                    UserDAL.create(userType.id, name, username, hash, email, profile_picture, created_by, transaction)
                        .then((result: User) => resolve(result))
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
     * Activate User
     * 
     * @param {string} code 
     */
    static activate(code: string): Promise<User> {
        return new Promise((resolve, reject) => {
            async.waterfall([
                (done: Function) => {
                    UserService.findOne({ code: code })
                        .then((result: User) => {
                            if (result) {
                                done(null, result);
                            }
                            else {
                                done(new NotFoundError(Messages.USER_NOT_FOUND));
                            }
                        })
                        .catch((error: any) => done(error));
                },
                (user: User, done: Function) => {
                    UserDAL.update(user, { is_active: true })
                        .then((result: User) => resolve(result))
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
     * Deactivate User
     * 
     * @param {string} code 
     */
    static deactivate(code: string): Promise<User> {
        return new Promise((resolve, reject) => {
            async.waterfall([
                (done: Function) => {
                    UserService.findOne({ code: code })
                        .then((result: User) => {
                            if (result) {
                                done(null, result);
                            }
                            else {
                                done(new NotFoundError(Messages.USER_NOT_FOUND));
                            }
                        })
                        .catch((error: any) => done(error));
                },
                (user: User, done: Function) => {
                    UserDAL.update(user, { is_active: false })
                        .then((result: User) => resolve(result))
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
     * Lock User
     * 
     * @param {string} code 
     */
    static lock(code: string): Promise<User> {
        return new Promise((resolve, reject) => {
            async.waterfall([
                (done: Function) => {
                    UserService.findOne({ code: code })
                        .then((result: User) => {
                            if (result) {
                                done(null, result);
                            }
                            else {
                                done(new NotFoundError(Messages.USER_NOT_FOUND));
                            }
                        })
                        .catch((error: any) => done(error));
                },
                (user: User, done: Function) => {
                    UserDAL.update(user, { is_locked: true })
                        .then((result: User) => resolve(result))
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
     * Unlock User
     * 
     * @param {string} code 
     */
    static unlock(code: string): Promise<User> {
        return new Promise((resolve, reject) => {
            async.waterfall([
                (done: Function) => {
                    UserService.findOne({ code: code })
                        .then((result: User) => {
                            if (result) {
                                done(null, result);
                            }
                            else {
                                done(new NotFoundError(Messages.USER_NOT_FOUND));
                            }
                        })
                        .catch((error: any) => done(error));
                },
                (user: User, done: Function) => {
                    UserDAL.update(user, { is_locked: false })
                        .then((result: User) => resolve(result))
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
     * Assign Role
     * 
     * @param {string} code 
     * @param {string} role_id 
     * @param {string} created_by 
     */
    static assignRole(code: string, role_id: string, created_by: number): Promise<User> {
        return new Promise((resolve, reject) => {
            async.waterfall([
                (done: Function) => {
                    UserService.findOne({ code: code })
                        .then((result: User) => {
                            if (result) {
                                done(null, result);
                            }
                            else {
                                done(new NotFoundError(Messages.USER_NOT_FOUND));
                            }
                        })
                        .catch((error: any) => done(error));
                },
                (user: User, done: Function) => {
                    RoleService.findById(role_id)
                        .then((result: Role) => {
                            if (result) {
                                done(null, user, result);
                            }
                            else {
                                done(new BadRequestError([
                                    { field: "role_id", message: Messages.ROLE_NOT_FOUND }
                                ]));
                            }
                        })
                        .catch((error: any) => done(error));
                },
                (user: User, role: Role, done: Function) => {
                    PolicyDAL.create(role.id, user.id, created_by)
                        .then((result: Policy) => resolve(user))
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
     * Remove Role
     * 
     * @param {string} code 
     * @param {string} role_id 
     */
    static removeRole(code: string, role_id: string): Promise<boolean> {
        return new Promise((resolve, reject) => {
            async.waterfall([
                (done: Function) => {
                    UserService.findOne({ code: code })
                        .then((result: User) => {
                            if (result) {
                                done(null, result);
                            }
                            else {
                                done(new NotFoundError(Messages.USER_NOT_FOUND));
                            }
                        })
                        .catch((error: any) => done(error));
                },
                (user: User, done: Function) => {
                    RoleService.findById(role_id)
                        .then((result: Role) => {
                            if (result) {
                                done(null, user, result);
                            }
                            else {
                                done(new BadRequestError([
                                    { field: "role_id", message: Messages.ROLE_NOT_FOUND }
                                ]));
                            }
                        })
                        .catch((error: any) => done(error));
                },
                (user: User, role: Role, done: Function) => {
                    PolicyDAL.delete({ user_id: user.id, role_id: role.id })
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
     * Change Password
     * 
     * @param {string} code 
     * @param {string} currentPassword 
     * @param {string} newPassword 
     */
    static changePassword(code: string, currentPassword: string, newPassword: string): Promise<User> {
        return new Promise((resolve, reject) => {
            async.waterfall([
                (done: Function) => {
                    UserService.findOne({ code: code })
                        .then((result: User) => {
                            if (result) {
                                done(null, result);
                            }
                            else {
                                done(new NotFoundError(Messages.USER_NOT_FOUND));
                            }
                        })
                        .catch((error: any) => done(error));
                },
                (user: User, done: Function) => {
                    comparePassword(currentPassword, user.password)
                        .then((isMatch: boolean) => {
                            if (isMatch) {
                                done(null, user);
                            }
                            else {
                                done(new BadRequestError([
                                    { field: "current_password", message: Messages.PASSWORD_INCORRECT }
                                ]));
                                done(new NotFoundError(Messages.USER_NOT_FOUND));
                            }
                        })
                        .catch((error: any) => done(new InternalServerError(error)));
                },
                (user: User, done: Function) => {
                    hash(newPassword, config.get("security.hash.saltRound"))
                        .then((hash: string) => {
                            done(null, user, hash);
                        })
                        .catch((error: any) => {
                            done(new BadRequestError([ error ]));
                        });
                },
                (user: User, hash: string, done: Function) => {
                    UserDAL.update(user, { password: hash })
                        .then((user: User) => {
                            resolve(user);
                        })
                        .catch((error) => {
                            done(new BadRequestError([ error ]));
                        });
                }
            ], (error: Error) => {
                if (error) {
                    reject(error);
                }
            });
        });
    }

    /**
     * Find Many Users
     * 
     * @param {any} query
     */
    static findMany(query: any): Promise<User[]> {
        return new Promise((resolve, reject) => {
            UserDAL.findMany(query, [], [ Role ])
                .then((result: User[]) => resolve(result))
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
            PaginationAdapter(UserDAL, query, [], [ Role ], page, limit)
                .then((result: IPaginationResponse) => resolve(result))
                .catch((error: any) => reject(new InternalServerError(error)));
        });
    }

    /**
     * Find One User
     * 
     * @param {any} query
     */
    static findOne(query: any): Promise<User> {
        return new Promise((resolve, reject) => {
            UserDAL.findOne(query, [], [ { model: Role, include: [ Permission ] } ])
                .then((result: User) => resolve(result))
                .catch((error: any) => reject(new InternalServerError(error)));
        });
    }

    /**
     * Find One User
     * 
     * @param {any} query
     */
    static findUserWithPermissions(query: any): Promise<User> {
        return new Promise((resolve, reject) => {
            UserDAL.findOne(query, [], [ { model: Role, include: [ Permission ] } ])
                .then((result: User) => resolve(result))
                .catch((error: any) => reject(new InternalServerError(error)));
        });
    }

    /**
     * Find User By Id
     * 
     * @param {string} id
     */
    static findById(id: string): Promise<User> {
        return new Promise((resolve, reject) => {
            UserDAL.findOne({ id: id }, [], [ Role ])
                .then((result: User) => resolve(result))
                .catch((error: any) => reject(new InternalServerError(error)));
        });
    }

    /**
     * Update User
     * 
     * @param id 
     * @param payload 
     */
    static update(id: string, payload: any): Promise<User> {
        return new Promise((resolve, reject) => {
            async.waterfall([
                (done: Function) => {
                    UserService.findById(id)
                        .then((result: User) => {
                            if (result) {
                                done(null, result);
                            }
                            else {
                                done(new NotFoundError(Messages.USER_NOT_FOUND));
                            }
                        })
                        .catch((error: any) => done(error));
                },
                (user: User, done: Function) => {
                    UserDAL.update(user, payload)
                        .then((result: User) => resolve(result))
                        .catch((error: any) => done(new BadRequestError(error)));
                }
            ], (error: Error) => {
                if (error) {
                    console.log(error);
                    reject(error);
                }
            });
        });
    }

    /**
     * Delete User By Id
     * 
     * @param {string} id
     */
    static delete(id: string): Promise<number> {
        return new Promise((resolve, reject) => {
            UserDAL.delete({ id: id })
                .then((result: number) => resolve(result))
                .catch((error: any) => reject(new InternalServerError(error)));
        });
    }

};

export default UserService;