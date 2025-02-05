const { createSecretKey } = require('crypto');
const jose = require('jose');

const JWT_KEY = createSecretKey(process.env.JWT_KEY || "secret");
const ISSUER = process.env.JWT_ISSUER || "iss";
const AUDIENCE = process.env.JWT_AUDIENCE || "aud";

const createAuthMiddleware = (roles) => async function authMiddleware(req, res, next) {
    if (req.headers["authorization"] !== undefined) {
        let jwt = req.headers["authorization"].split(' ')[1];
        const { payload, _ } = await jose.jwtVerify(jwt, JWT_KEY, {
            issuer: ISSUER,
            audience: [AUDIENCE]
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
};

module.exports.JWT_KEY = JWT_KEY;
module.exports.ISSUER = ISSUER;
module.exports.AUDIENCE = AUDIENCE;
module.exports.createAuthMiddleware = createAuthMiddleware
module.exports.wrapMiddleware = (wrapping, wrapped) => (req, res, next) => wrapping(req, res, () => wrapped(req, res, next));
module.exports.customerAuth = createAuthMiddleware(new Set(["admin", "customer"]));
module.exports.adminAuth = createAuthMiddleware(new Set(["admin"]));
module.exports.trainerAuth = createAuthMiddleware(new Set(["admin", "trainer"]));
module.exports.anyAuth = createAuthMiddleware(new Set(["admin", "trainer", "customer"]));
