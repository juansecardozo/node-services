const bcrypt = require("bcryptjs");
const {WrongPasswordException} = require("../../common/exceptions/wrong-password");

class Account {
    constructor({ id, email, password, role }) {
        this.id = id;
        this.email = email;
        this.password = password;
        this.role = role;
        Object.freeze(this);
    }

    comparePassword(password) {
        return bcrypt.compareSync(password, this.password);
    }

}

module.exports = Account;