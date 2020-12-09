import { PermissionResources } from "./Permission";



export const Modules = {
    FINANCE: "Finance",
    PROJECT: "Project",
    INVENTORY: "Inventory",
    EQUIPMENT: "Equipment",
    HUMAN_RESOURCE: "Human Resource",
    IAM: "Identity and Access Management",
};

/**
 * Module to Permission Mapping
 */
export const ModuleToPermissionMapping: any = [
    {
        module: Modules.IAM,
        permissions: [
            PermissionResources.USER,
            PermissionResources.ROLE,
            PermissionResources.PERMISSION,
        ]
    },
    {
        module: Modules.INVENTORY,
        permissions: [
            PermissionResources.CATEGORY,
            PermissionResources.SUPPLIER,
            PermissionResources.SUBCATEGORY,
            PermissionResources.MANUFACTURER,
            PermissionResources.UNIT_OF_MEASUREMENT,
        ]
    }
];