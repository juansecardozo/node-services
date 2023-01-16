const {WrongPasswordException} = require("../common/exceptions/wrong-password");
const {UserNotFoundException} = require("../common/exceptions/user-not-found");

const init = ({
    usersRepository,
    tokenRepository,
}) => {
    const execute = async ({ email, password }) => {
        const account = await usersRepository.getUser({ email });

        if (!account.id) {
            throw new UserNotFoundException('User not found');
        }

        if (!account.comparePassword(password)) {
            throw new WrongPasswordException('Wrong password');
        }

        const token = tokenRepository.createUserToken(account);

        return { token, account };
    }

    return {
        execute
    }
}

module.exports.init = init;