const jwt = require('jsonwebtoken');

function generateAccessToken(request) {

    const secrets = request.webtaskContext.secrets;

    const expiresIn = '1 hour';
    const audience = secrets.JWT_AUDIENCE;
    const issuer = secrets.JWT_ISSUER;
    const secret = secrets.JWT_SIGNING_KEY;

    const token = jwt.sign({}, secret, {
        expiresIn: expiresIn,
        audience: audience,
        issuer: issuer,
        subject: request.user.id.toString()
    });

    return token;
}

module.exports = {
    generateAccessToken: generateAccessToken
}
