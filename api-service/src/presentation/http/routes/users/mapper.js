const UserResponse = require('./response');

const toResponseModel = function toResponseModel(userDoc) {
    return new UserResponse({ ...userDoc });
};

module.exports = {
    toResponseModel,
};
