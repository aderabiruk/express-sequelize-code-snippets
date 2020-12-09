const Messages = {

    /**
     * General Error Messages
     */
    FILE_REQUIRED: "File is required!",
    NOT_IMPLEMENTED_ERROR: 'Not Implemented!',
    LANGUAGE_CODE_REQUIRED : "Locale required",
    SERVICE_UNAVAILABLE_ERROR: "Service Unavailable!",
    FORBIDDEN_ERROR: "Authorization Failure: You're not allowed!",
    INTERNAL_SERVER_ERROR: "Internal Error: Something went wrong!",
    IMAGE_INVALID_TYPE: "Only .png, .jpg and .jpeg format allowed!",
    UNAUTHORIZED_ERROR: "Authorization Failure: Incorrect credentials!",

    /**
     * IAM Module Errors
     */
    // User Related Error Messages
    USER_NOT_FOUND: "User not found!",
    USERNAME_REQUIRED: "Username is required!",
    PASSWORD_REQUIRED: "Password is required!",
    PASSWORD_INCORRECT: "Incorrect password!",
    USER_ALREADY_EXISTS: "User already exists",
    USER_NAME_REQUIRED: "User name is required!",
    USER_TYPE_REQUIRED: "User type is required!",
    USER_COMPANY_REQUIRED: "Company is required!",
    USER_PASSWORD_REQUIRED: "Password is required!",
    USER_USERNAME_REQUIRED: "Username is required!",
    NEW_PASSWORD_REQUIRED: "New password is required!",
    USER_COMPANY_TYPE_REQUIRED: "Company type is required",
    CURRENT_PASSWORD_REQUIRED: "Current password is required!",
    AUTHENTICATION_ERROR: "Login Failed: Invalid email or password!",
    ACCOUNT_INACTIVE: "Your account is not active! Please contact the system admin.",
    // User Type Related Error Messages
    USER_TYPE_NOT_FOUND: "User type not found!",
    USER_TYPE_NAME_REQUIRED: "User type name is required!",
    // Role Related Error Messages
    ROLE_NOT_FOUND: "Role not found",
    ROLE_NAME_REQUIRED: "Role is required",
    // Role Permission Related Error Messages
    ROLE_PERMISSION_NOT_FOUND: "Role permission not found",
    ROLE_PERMISSION_ROLE_REQUIRED: "Role is required",
    ROLE_PERMISSION_PERMISSION_REQUIRED: "Permission is required",
    // Permission Related Error Messages
    PERMISSION_NOT_FOUND: "Permission not found",
    PERMISSION_NAME_REQUIRED: "Permission name is required",
    PERMISSION_CODE_REQUIRED: "Permission code is required",
    PERMISSION_TYPE_REQUIRED: "Permission type is required",
    PERMISSION_RESOURCE_REQUIRED: "Resource is required",
    // Policy Related Error Messages
    POLICY_NOT_FOUND: "Policy not found",
    POLICY_USER_REQUIRED: "User is required",
    POLICY_ROLE_REQUIRED: "Role is required",

};

export default Messages;