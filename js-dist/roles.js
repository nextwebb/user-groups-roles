"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const privileges = require("./privileges");
const util_1 = require("util");
class Roles extends privileges.Privileges {
    constructor(dbPath = "./json") {
        super(dbPath);
    }
    validate_role(role) {
        // this check for duplicate roles entry
        // return the role if found or return false if not found
        let crutTable = this.get_roles_table();
        for (let index = 0; index < crutTable.length; index++) {
            if (crutTable[index][0] == role) {
                return [index, crutTable[index]];
            }
        }
        return false; // this will allow new role entry
    }
    validate_privileges(privileges) {
        // this validate array of privileges
        // throws error if privilege is not declered in privileges.json table
        let validPrivilege;
        for (let index = 0; index < privileges.length; index++) {
            validPrivilege = this.validate_single_privilege(privileges[index][0]);
            if (validPrivilege == false) {
                throw new Error(validPrivilege + " is invalid privilege");
            }
        }
    }
    get_role_privilegs(role) {
        // this return the array of privileges declered for roles.json
        // return false if role is nor found
        let crutTable = this.get_roles_table();
        for (let index = 0; index < crutTable.length; index++) {
            if (crutTable[index][0] == role) {
                return crutTable[index];
            }
        }
        return false;
    }
    role_insert(role, privileges) {
        // insert one row
        /*
         author : [
                 ["create_voucher",  true],
                 [edit_voucher",  false],
                 ["delete_voucher",  true],
                 ["change_date", 0]
                 ]
         */
        if (util_1.isUndefined(role) || role == "") {
            throw new Error("role field is compulsory"); // role can nor be empty
        }
        if (util_1.isUndefined(privileges) || privileges.length == 0) {
            throw new Error("Privileges can not be empty"); // privileges can not be empty
        }
        // check for valid role to prevent duplicate enty
        if (this.validate_role(role) != false) {
            throw new Error(role + " this is duplicate entry, suggested to use update for modifications");
        }
        // check valid privileges
        this.validate_privileges(privileges);
        super.role_insert(role, privileges);
    }
    role_update(newRole, newPrivileges, oldRole) {
        // updates one row
        if (util_1.isUndefined(newRole) || newRole === "") {
            throw new Error("newRole can not be empty"); //checking empty newRole   
        }
        if (util_1.isUndefined(newPrivileges) || newPrivileges.length == 0) {
            throw new Error("newPrevileges cannot zero length array"); //checking for zero length newPrivileges
        }
        if (util_1.isUndefined(oldRole) || oldRole === "") {
            throw new Error("oldRole can not empty"); //checking for empty old role
        }
        // validate newRole (prvents duplicate role)
        // check for valid role to prevent duplicate enty
        if ((this.validate_role(newRole) != false) && (newRole != oldRole)) {
            throw new Error(newRole + " this is duplicate entry not allowed");
        }
        // check valid privileges
        this.validate_privileges(newPrivileges);
        // check for valid newPrivilages
        super.role_update(newRole, newPrivileges, oldRole);
        // update users.json roles by changes in roles.json role names
        let userRolesTable = this.update_role_of_users_table_by_roles_update(newRole, oldRole);
        this.users_full_table_update(userRolesTable);
    }
    update_role_of_users_table_by_roles_update(newRole, oldRole) {
        // this updates users.json table for roles updateing in roles.json
        // cascading effect
        if (util_1.isUndefined(newRole) || newRole == "") {
            throw new Error("newRole can not be empty");
        }
        if (util_1.isUndefined(oldRole) || oldRole == "") {
            throw new Error("oldRole can not be empty");
        }
        let curTable = this.get_users_table();
        for (let index = 0; index < curTable.length; index++) {
            if (curTable[index][1] == oldRole) {
                curTable[index][1] = newRole;
            }
        }
        return curTable;
    }
    role_delete(role) {
        // deletes single row
        super.role_delete(role);
    }
}
exports.Roles = Roles;
