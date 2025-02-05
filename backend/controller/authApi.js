const Client = require('../models/clientModel');
const Trainer = require('../models/trainerModel');
const Admin = require('../models/adminModel');
const jose = require('jose');
const idProjection = require('./idProjection');
const { JWT_KEY, ISSUER, AUDIENCE } = require('../utils');
const { verify } = require('@node-rs/argon2');

async function lookupUsername(username) {
    const models = [
        { model: Client, kind: 'customer' },
        { model: Trainer, kind: 'trainer' },
        { model: Admin, kind: 'admin' },
    ];

    for (const { model, kind } of models) {
        const result = await model.findOne({ username }, idProjection(model), null).exec();
        if (result) {
            return { kind, data: result };
        }
    }

    return { kind: null, data: null };
}

exports.authenticate = async (req, res) => {
    const { username, password } = req.body;
    const token = {};

    try {
        const user = await lookupUsername(username);
        if (user.kind === null || !await verify(user.password, password)) {
            res.status(401).send("Unauthorized");
        } else {
            token.role = user.kind;
            token.username = user.data.username;
            token.profile = user.data;
            token.profile.password = undefined;
            token.profile.sessions = undefined;
            token.profile.courses = undefined;
            const jwt = await new jose.SignJWT(token) // details to  encode in the token
                .setProtectedHeader({
                    alg: 'HS256'
                }) // algorithm
                .setIssuedAt()
                .setIssuer(ISSUER) // issuer
                .setAudience(AUDIENCE) // audience
                .setExpirationTime("1 day") // FIXME sketchy
                .sign(JWT_KEY);
            res.contentType("text/plain").send(jwt);
        }
    } catch (error) {
        console.error('Error during authentication:', error);
        res.status(500).send('Error during authentication');
    }
};
