const registerUserUseCaseFactory = require('../../src/application/register-user.usecase');
const usersRepositoryFactory = require('../../src/infrastructure/users/user.repository');
const User = require("../../src/domain/users/user");
const Account = require("../../src/domain/users/account");
const {InvalidArgumentException} = require("../../src/common/exceptions/invalid-argument");
const usersRepository = usersRepositoryFactory.init({});
const registerUserUseCase = registerUserUseCaseFactory.init({
    usersRepository
});

let rawUser = {
    email: 'user@example.com',
    password: 'password',
    role: 'user',
};
const user = new User(rawUser);
const account = new Account(user);

describe('Register user use case test', () => {
    beforeEach(() => {
        rawUser = {
            email: 'user@example.com',
            password: 'password',
            role: 'user',
        }
    });

    test('should register user', async () => {
        jest.spyOn(usersRepository, 'createUser').mockImplementation(() => Promise.resolve(new Account(user)));

        const result = await registerUserUseCase.execute(rawUser);

        expect(result).toStrictEqual(account);
    });

    test('should throw invalid argument exception on bad email', async () => {
        rawUser.email = '';

        expect(() => registerUserUseCase.execute(rawUser))
            .rejects.toThrow(new InvalidArgumentException('User email <> is not a valid email'));
    });

    test('should throw invalid argument exception on bad role', async () => {
        rawUser.role = '';

        expect(() => registerUserUseCase.execute(rawUser))
            .rejects.toThrow(new InvalidArgumentException('User role <> is not a valid role'));
    });

    test('should throw invalid argument exception on bad password', async () => {
        rawUser.password = '';

        expect(() => registerUserUseCase.execute(rawUser))
            .rejects.toThrow(new InvalidArgumentException('User password <> must have at least 8 characters'));
    });
});