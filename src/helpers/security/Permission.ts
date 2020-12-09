import _ from 'lodash';
import async from "async";
import { Permission, Role } from "../database/Sequelize";

/**
 * Extract Permissions for List of Roles
 * 
 * @param {Array} roles 
 */
export const extractPermissions = (roles: Role[]): Promise<Permission[]> => {
    return new Promise((resolve) => {
        let permissions: Permission[] = [];
        async.eachSeries(roles, (role: Role, callback: Function) => {
            permissions = [
                ...permissions,
                ...role.permissions
            ];
            callback();
        }, () => {
            resolve(permissions);
        });
    });
};


/**
 * Permission Typess
 */
export const PermissionTypes = {
    READ: "Read",
    CREATE: "Create",
    DELETE: "Delete",
    UPDATE: "Update",
    
    CHECK: "Check",
    APPROVE: "Approve"
};


/**
 * Permission Resources
 */
export const PermissionResources = {
    // Configuration Resources
    CATEGORY: "Category",
    SUPPLIER: "Supplier",
    ITEM_TYPE: "Item_Type",
    SUBCATEGORY: "Subcategory",
    MANUFACTURER: "Manufacturer",
    ITEM_TYPE_ATTRIBUTE: "Item Type Attribute",
    UNIT_OF_MEASUREMENT: "Uni Of Measurement",
    ITEM_TYPE_ATTRIBUTE_VALUE: "Item Type Attribute Value",
    
    // IAM Resources
    ROLE: "Role",
    USER: "User",
    PERMISSION: "Permission",

    // Inventory Resources
    ITEM: "Item",
    STORE: "Store",
    ITEM_STOCK: "Item Stock",
    STORE_RETURN: "Store Return",
    STORE_REQUEST: "Store Request",
    ITEM_VARIATION: "Item Variation",
    STORE_ISSUANCE: "Store Issuance",
    STORE_REQUEST_ITEM: "Store Request Item",

    // Organization Resources
    DEPARTMENT: "Department",
    SUBSIDIARY: "Subsidiary",
    ORGANIZATION: "Organization",

    // Project Resources
    PROJECT: "Project",
    PROJECT_TYPE: "Project_Type",
    PROJECT_TASK: "Project_Task",
    PROJECT_ACTIVITY: "Project_Activity"
};

