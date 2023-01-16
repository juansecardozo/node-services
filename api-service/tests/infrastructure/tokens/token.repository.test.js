const tokenRepositoryContainer = require('../../../src/infrastructure/tokens/token.repository');
const Token = require("../../../src/domain/tokens/token");
const jwt = require("jsonwebtoken");
const {jwtSecret} = require("../../../src/config");
const {USER_TOKEN_EXPIRATION} = require("../../../src/common/constants");
const tokenRepository = tokenRepositoryContainer.init();

const rawUser = {
    id: 23123,
    role: 'user',
}
const token = new Token({
    accessToken: jwt.sign({
        id: 23123,
        roles: ['user'],
    }, jwtSecret, {
        expiresIn: USER_TOKEN_EXPIRATION,
    }),
    tokenType: 'Bearer',
    roles: ['user'],
    expiresIn: USER_TOKEN_EXPIRATION,
});
describe('Token repository test', () => {

    test('should create token', () => {
       const result = tokenRepository.createUserToken(rawUser);

       expect(result).toStrictEqual(token);
    });
});