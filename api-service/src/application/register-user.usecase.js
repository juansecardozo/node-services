const User = require("../domain/users/user");

const init = ({
    usersRepository
}) => {
    const execute = async (options) => {
        const user = new User(options);
        return await usersRepository.createUser(user);
    }

    return {
        execute,
    }
}

module.exports.init = init;