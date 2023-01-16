const request = require('supertest');
const appContainer = require('../../../../../src/presentation/http/app');
const registerUserUseCaseContainer = require('../../../../../src/application/register-user.usecase');
const loginUserUseCaseContainer = require('../../../../../src/application/login-user.usecase');
const Account = require("../../../../../src/domain/users/account");
const {InvalidArgumentException} = require("../../../../../src/common/exceptions/invalid-argument");
const Token = require("../../../../../src/domain/tokens/token");
const {WrongPasswordException} = require("../../../../../src/common/exceptions/wrong-password");
const {UserNotFoundException} = require("../../../../../src/common/exceptions/user-not-found");

const loginUserUseCase = loginUserUseCaseContainer.init({});
const registerUserUseCase = registerUserUseCaseContainer.init({});
const app = appContainer.init({
    registerUserUseCase,
    loginUserUseCase,
});

const rawUser = {
    id: '2ea26e75-2ad4-485d-b1cf-6297083a3f0b',
    email: 'user@example.com',
    password: '$2a$10$70MHJ9T7UUkapEg.5IK6Du5MMhi9HiLliCOCeOhK2oX.BnlDAhV96',
    role: 'user',
};
const reducedUser = {
    email: 'user@example.com',
    role: 'user',
};
const rawToken = {
    accessToken: "",
    expiresIn: 1,
    tokenType: "",
    roles: [
        'user'
    ],
};

describe('Auth routes tests', () => {

    describe('POST /auth/register', () => {

        test('should return 200 and user', async () => {
            jest.spyOn(registerUserUseCase, 'execute')
                .mockImplementation(() => Promise.resolve(new Account(rawUser)));

            const res = await request(app).post('/auth/register');

            expect(res.statusCode).toEqual(200);
            expect(res.body).toEqual(reducedUser);
        });

        test('should return 400 and error message', async () => {
            jest.spyOn(registerUserUseCase, 'execute').mockImplementation(() => {
                throw new InvalidArgumentException('Invalid');
            });

            const res = await request(app).post('/auth/register');

            expect(res.statusCode).toEqual(400);
            expect(res.body).toEqual({
                message: 'Invalid'
            });
        });

        test('should return 500', async () => {
            jest.spyOn(registerUserUseCase, 'execute').mockImplementation(() => {
                throw new Error();
            });

            const res = await request(app).post('/auth/register');

            expect(res.statusCode).toEqual(500);
        });
    });

    describe('POST /auth/login', () => {

        test('should return 200 and token', async () => {
            jest.spyOn(loginUserUseCase, 'execute').mockImplementation(() => Promise.resolve({
                    token: new Token(rawToken),
                    user: new Account(rawUser),
                }));

            const res = await request(app).post('/auth/login');

            expect(res.statusCode).toEqual(200);
            expect(res.body).toEqual({
                token: new Token(rawToken),
                user: reducedUser,
            });
        });

        test('should return 401 and message', async () => {
            jest.spyOn(loginUserUseCase, 'execute').mockImplementation(() => {
                throw new WrongPasswordException('Wrong password');
            });

            const res = await request(app).post('/auth/login');

            expect(res.statusCode).toEqual(401);
            expect(res.body).toEqual({
                message: 'Wrong password',
            });
        });

        test('should return 404 and message', async () => {
            jest.spyOn(loginUserUseCase, 'execute').mockImplementation(() => {
                throw new UserNotFoundException('User not found');
            });

            const res = await request(app).post('/auth/login');

            expect(res.statusCode).toEqual(404);
            expect(res.body).toEqual({
                message: 'User not found',
            });
        });

        test('should return 500', async () => {
            jest.spyOn(loginUserUseCase, 'execute').mockImplementation(() => {
                throw new Error();
            });

            const res = await request(app).post('/auth/login');

            expect(res.statusCode).toEqual(500);
        });
    });
});