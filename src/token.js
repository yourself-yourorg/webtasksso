const jwt = require('jsonwebtoken');

const LG = console.log;

function generateAccessToken(request) {

    const secrets = request.webtaskContext.secrets;

    const expiresIn = secrets.JWT_EXPIRY;
    const audience = secrets.JWT_AUDIENCE;
    const issuer = secrets.JWT_ISSUER;
    const secret = secrets.JWT_SIGNING_KEY;
    const user = request.user;
    delete user.providers;

    const token = jwt.sign(user, secret, {
        expiresIn: expiresIn,
        audience: audience,
        issuer: issuer,
        subject: request.user.id.toString()
    });

    LG(`---- expiry :: ${expiresIn}`);
    LG(token);
    LG('----');
    return token;
}

module.exports = {
    generateAccessToken: generateAccessToken
}
