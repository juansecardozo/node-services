const {ROLES} = require("../../common/constants");
const { v4: UUIDv4 } = require('uuid');
const {InvalidArgumentException} = require("../../common/exceptions/invalid-argument");
const bcrypt = require("bcryptjs");

class User {
     constructor({ email, password, role }) {
        this.#validEmail(email);
        this.#validRole(role);
        this.#validPassword(password);
        this.id = UUIDv4();
        this.email = email;
        this.password = this.#hashPassword(password);
        this.role = role;
        Object.freeze(this);
    }

    #hashPassword(password) {
        const salt = bcrypt.genSaltSync(10);
        return bcrypt.hashSync(password, salt);
    }

    #validEmail(email) {
        const regex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
        if (!regex.test(email)) {
            throw new InvalidArgumentException(`User email <${email}> is not a valid email`);
        }
    }

    #validPassword(password) {
         if (password.length < 8) {
             throw new InvalidArgumentException(`User password <${password}> must have at least 8 characters`);
         }
    }

    #validRole(role) {
        if (!ROLES.includes(role)) {
            throw new InvalidArgumentException(`User role <${role}> is not a valid role`);
        }
    }

}

module.exports = User;