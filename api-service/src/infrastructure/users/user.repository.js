const {toDomainModel} = require("../mapper");
const AccountDomainModel = require("../../domain/users/account")

const userStore = {
    async createUser({ id, email, role, password }) {
        const { User: userSchema } = this.getSchemas();
        const newUser = new userSchema({ id, email, role, password });
        const userDoc = await newUser.save();
        return toDomainModel(userDoc, AccountDomainModel);
    },

    async getUser({ email }) {
        const { User: userSchema } = this.getSchemas();
        const query = { email: email };
        const userDoc = await userSchema.findOne(query).exec();

        return toDomainModel(userDoc ? userDoc : {
            id: null,
            email: null,
            role: null,
            password: null,
        }, AccountDomainModel);
    }
}

module.exports.init = function init({ User }) {
    return Object.assign(Object.create(userStore), {
        getSchemas() {
            return {
                User,
            };
        },
    });
};