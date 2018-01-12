"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const crud = require("crud-json-array");
let crudPrivileges = new crud.CRUD(); //instance of class for privileges.json
let crudRoles = new crud.CRUD(); //instance of class for roles.json
let crudUsers = new crud.CRUD(); //instance of class for users.json
class Access {
    constructor(dbPath = "./json") {
        crudPrivileges.create_database(dbPath);
        crudPrivileges.create_table('privileges', ["privilege", "description", "defualt"]);
        crudRoles.create_database(dbPath);
        crudRoles.create_table("roles", ["role", "privileges"]);
        crudUsers.create_database(dbPath);
        crudUsers.create_table('users', ['user', 'role']);
    }
    /*
    =============
    user.json CRUD
    =============
    */
    user_insert(user, role) {
        // insert one row
        crudUsers.insert_one_row([user, role]);
    }
    user_update(newUser, NewRole, oldUser) {
        // updates one row
        crudUsers.update_one_row([newUser, NewRole], [0, oldUser]);
    }
    get_users_table() {
        return crudUsers.read_table_in_memory();
    }
    user_delete(user) {
        // delets one row
        crudUsers.delete_one_row([0, user]);
    }
    users_full_table_update(curTable) {
        // this updates the privileges.json in one short
        crudUsers.write_full_table_in_bulk(curTable);
    }
    /*
        ================
        roles.json CRUD
        ================
    */
    role_insert(role, privileges) {
        // insert one row
        crudRoles.insert_one_row([role, privileges]);
    }
    role_update(newRole, newPrivileges, oldRole) {
        // updates one row
        crudRoles.update_one_row([newRole, newPrivileges], [0, oldRole]);
    }
    get_roles_table() {
        // returns in memory table of roles.json
        return crudRoles.read_table_in_memory();
    }
    role_delete(role) {
        // deletes single row
        crudRoles.delete_one_row([0, role]);
    }
    roles_full_table_update(curTable) {
        // this updates the privileges.json in one short
        crudRoles.write_full_table_in_bulk(curTable);
    }
    /*
        =====================
        privileges.json CRUD
        =====================
    */
    privilege_insert(privilege, description, defualt) {
        // insert one row
        crudPrivileges.insert_one_row([privilege, description, defualt]);
    }
    privilege_update(newPrivilege, newDescription, newDefualt, oldPrivalge) {
        //update one privalage
        crudPrivileges.update_one_row([newPrivilege, newDescription, newDefualt], [0, oldPrivalge]);
    }
    get_privilege_table() {
        // gets privileges.json table from memory
        return crudPrivileges.read_table_in_memory();
    }
    privilege_delete(privilege) {
        // deletes one privilege
        crudPrivileges.delete_one_row([0, privilege]);
    }
    privileges_full_table_update(curTable) {
        // this updates the privileges.json in one short
        crudPrivileges.write_full_table_in_bulk(curTable);
    }
}
exports.Access = Access;
