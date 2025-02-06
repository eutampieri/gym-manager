import Client from '../models/clientModel.js';
import Trainer from '../models/trainerModel.js';
import Admin from '../models/adminModel.js';
import { SignJWT } from 'jose';
import idProjection from './idProjection.js';
import { JWT_KEY, ISSUER, AUDIENCE } from '../utils.js';
import { verify } from '@node-rs/argon2';

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

export async function authenticate(req, res) {
    const { username, password } = req.body;
    const token = {};

    try {
        const user = await lookupUsername(username);
        if (user.kind === null || !await verify(user.data.password, password)) {
            res.status(401).send("Unauthorized");
        } else {
            token.role = user.kind;
            token.username = user.data.username;
            token.profile = user.data;
            token.profile.password = undefined;
            token.profile.sessions = undefined;
            token.profile.courses = undefined;
            const jwt = await new SignJWT(token) // details to  encode in the token
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
}
