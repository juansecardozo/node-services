const {UserDao} = require("../../../src/infrastructure/users/user.schema");
const db = {
    schemas: {
        User: UserDao
    },
}
const userRepositoryContainer = require('../../../src/infrastructure/users/user.repository');
const Account = require("../../../src/domain/users/account");
const userRepository = userRepositoryContainer.init(db.schemas);

const rawUser = {
    id: 45564165,
    email: 'user@example.com',
    password: 'password',
    role: 'user',
}
const account = new Account(rawUser);

describe('User repository test', () => {

    test('should create user', async () => {
        jest.spyOn(UserDao.prototype, 'save').mockImplementation(() => Promise.resolve(rawUser));

        const result = await userRepository.createUser(rawUser);

        expect(result).toStrictEqual(account);
    });

    test('should return user', async () => {
        jest.spyOn(db.schemas.User, 'findOne').mockImplementationOnce(() => ({
            exec: () => rawUser,
        }));

        const result = await userRepository.getUser({});

        expect(result).toStrictEqual(account);
    });

    test('should return null user', async () => {
        jest.spyOn(db.schemas.User, 'findOne').mockImplementationOnce(() => ({
            exec: () => null,
        }));

        const result = await userRepository.getUser({});

        expect(result).toStrictEqual(new Account({
            id: null,
            email: null,
            role: null,
            password: null,
        }));
    });
});