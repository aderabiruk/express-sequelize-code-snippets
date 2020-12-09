import { Op } from 'sequelize';
import evalidate from 'evalidate';
import { Request, Response } from 'express';

import Messages from '../../errors/Messages';
import { Permission, User } from "../../helpers/database/Sequelize";
import PermissionService from '../../services/iam/Permission.service';
import { IPaginationResponse } from '../../helpers/adapters/Pagination';
import { Error, BadRequestError, NotFoundError } from '../../errors/Errors';

class PermissionController {
    
    /**
     * Create Permission
     * 
     * @param {Request} request 
     * @param {Response} response 
     */
    static create(request: Request, response: Response, next: Function) {
        const Schema = new evalidate.schema({
            name: evalidate.string().required(Messages.PERMISSION_NAME_REQUIRED),
            code: evalidate.string().required(Messages.PERMISSION_CODE_REQUIRED),
            type: evalidate.string().required(Messages.PERMISSION_TYPE_REQUIRED),
            resource: evalidate.string().required(Messages.PERMISSION_RESOURCE_REQUIRED)
        });
        const result = Schema.validate(request.body);
        if (result.isValid) {
            let user_code = (<User> request.user).id;
            PermissionService.create(request.body.name, request.body.type, request.body.resource, request.body.code, user_code)
                .then((result: Permission) => {
                    response.status(200).json(result);
                })
                .catch((error: Error) => {
                    next(error);
                });
        }
        else {
            let error = new BadRequestError(result.errors);
            next(error);
        }
    }

    /**
     * Search Permissions
     * 
     * @param {Request} request 
     * @param {Response} response 
     */
    static search(request: Request, response: Response, next: Function) {
        let queries: any[] = [];
        if (request.body.payload?.query) {
            queries = [ ...queries, { name: { [Op.like]: `%${request.body.payload?.query}%` } } ];
        }
        let query = { [Op.and]: [ queries ] };
        PermissionService.findMany(query)
            .then((result: Permission[]) => response.json(result))
            .catch((error: Error) => { 
                next(error);
            });
    }

    /**
     * Search Permissions
     * 
     * @param {Request} request 
     * @param {Response} response 
     */
    static searchPaginate(request: Request, response: Response, next: Function) {
        let queries: any[] = [];
        if (request.body.payload?.query) {
            queries = [ ...queries, { name: { [Op.like]: `%${request.body.payload?.query}%` } } ];
        }
        let query = { [Op.and]: [ queries ] };

        let page = request.body.metadata?.page ? request.body.metadata?.page : 1;
        let limit = request.body.metadata?.limit ? request.body.metadata?.limit : 25;
        PermissionService.findManyPaginate(query, page, limit)
            .then((result: IPaginationResponse) => response.json(result))
            .catch((error: Error) => { 
                next(error);
            });
    }

    /**
     * Find Permission By Id
     * 
     * @param {Request} request 
     * @param {Response} response 
     */
    static findById(request: Request, response: Response, next: Function) {
        PermissionService.findById(request.params.id)
            .then((result: Permission) => {
                if (result) {
                    response.json(result)
                }
                else {
                    let error: Error = new NotFoundError(Messages.PERMISSION_NOT_FOUND);
                    response.status(error.statusCode).json(error.payload);
                }
            })
            .catch((error: Error) => { 
                next(error);
            });
    }

    /**
     * Update Permission
     * 
     * @param {Request} request 
     * @param {Response} response 
     */
    static update(request: Request, response: Response, next: Function) {
        PermissionService.update(request.params.id, request.body)
            .then((result: Permission) => response.json(result))
            .catch((error: Error) => { 
                next(error);
            });
    }
};

export default PermissionController;