const usersRepositoryFactory = require('../../src/infrastructure/users/user.repository');
const tokenRepositoryFactory = require('../../src/infrastructure/tokens/token.repository');
const loginUserUseCaseFactory = require('../../src/application/login-user.usecase');
const User = require("../../src/domain/users/user");
const Account = require("../../src/domain/users/account");
const Token = require("../../src/domain/tokens/token");
const {WrongPasswordException} = require("../../src/common/exceptions/wrong-password");
const {UserNotFoundException} = require("../../src/common/exceptions/user-not-found");

const usersRepository = usersRepositoryFactory.init({});
const tokenRepository = tokenRepositoryFactory.init();
let loginUserUseCase = loginUserUseCaseFactory.init({
    usersRepository,
    tokenRepository
});

const password = 'aSimplePassword';
const rawUser = {
    email: 'user@example.com',
    password: password,
    role: 'user',
};
const user = new User(rawUser);
const account = new Account(user);
const rawToken = {
    accessToken: "",
    expiresIn: 1,
    tokenType: "",
    roles: [
        'user'
    ],
};

describe('Get stats stock use case test', () => {

    test('should return token', async () => {
        jest.spyOn(usersRepository, 'getUser').mockImplementation(() => Promise.resolve(account));
        jest.spyOn(tokenRepository, 'createUserToken').mockImplementation(() => new Token(rawToken));

        const result = await loginUserUseCase.execute(rawUser);

        expect(result).toStrictEqual({
            account: account,
            token: new Token(rawToken)
        });
    });

    test('should throw wrong password exception', async () => {
        jest.spyOn(usersRepository, 'getUser').mockImplementation(() => Promise.resolve(account));

        rawUser.password = 'password';
        expect(async () => loginUserUseCase.execute(rawUser))
            .rejects.toThrow(WrongPasswordException);
    });

    test('should throw user not found exception', async () => {
        jest.spyOn(usersRepository, 'getUser').mockImplementation(() => Promise.resolve(new Account({
            id: null,
            email: null,
            role: null,
            password: null,
        })));

        rawUser.password = 'password';
        expect(async () => loginUserUseCase.execute(rawUser))
            .rejects.toThrow(UserNotFoundException);
    });
});