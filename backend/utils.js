const { createSecretKey } = require('crypto');
const jose = require('jose');

module.exports.JWT_KEY = createSecretKey(process.env.JWT_KEY || "secret");
module.exports.ISSUER = process.env.JWT_ISSUER || "iss";
module.exports.AUDIENCE = process.env.JWT_AUDIENCE || "aud";
module.exports.createAuthMiddleware = (roles) => async function authMiddleware(req, res, next) {
    if (req.headers["authorization"] !== undefined) {
        let jwt = req.headers["authorization"].split(' ')[1];
        const { payload, _ } = await jose.jwtVerify(jwt, req.app.locals.JWKS, {
            issuer: module.exports.ISSUER,
            audience: [module.exports.AUDIENCE]
        }).catch((e) => { return { payload: { error: e }, protectedHeader: null }; });
        const jwt_payload = payload;
        if (jwt_payload.error === undefined && roles.has(jwt_payload.role)) {
            // JWT is still valid
            req.user = jwt_payload.profile
            req.user.role = jwt_payload.role;
        } else {
            res.contentType("text/plain").status(401).send(`Invalid token${jwt_payload.error === undefined ? "" : ": " + jwt_payload.error.code}`);
            return;
        }
    }
    next();
}