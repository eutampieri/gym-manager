const Client = require('../models/clientModel');
const Trainer = require('../models/trainerModel');
const { createSecretKey } = require('crypto');
const jose = require('jose');

const JWT_KEY = createSecretKey(process.env.JWT_KEY || "secret");

async function lookupUsername(username) {
    let result = { kind: null, data: null };
    const customer = await Client.findOne({ username: username }, null, null).exec();
    if (customer) {
        result.kind = "customer";
        result.data = customer;
        return result;
    }

    // Check if the username matches a trainer
    const trainer = await Trainer.findOne({ username: username }, null, null).exec();
    if (trainer) {
        result.kind = "trainer";
        result.data = trainer;
        return result;
    }

    if (username === 'admin') {
        result.kind = "admin";
        result.data = {
            username: "admin",
            password: "admin"
        };
        return result;
    }
    return result;
}

exports.authenticate = async (req, res) => {
    const { username, password } = req.body;
    const token = {};

    try {
        const user = await lookupUsername(username);
        if (user.kind === null || user.data.password !== password) { // TODO salt and hash
            res.status(401).send("Unauthorized");
        } else {
            token.role = user.kind;
            token.username = user.data.username;
            token.profile = user.data;
            const jwt = await new jose.SignJWT(token) // details to  encode in the token
                .setProtectedHeader({
                    alg: 'HS256'
                }) // algorithm
                .setIssuedAt()
                .setIssuer(process.env.JWT_ISSUER || "iss") // issuer
                .setAudience(process.env.JWT_AUDIENCE || "aud") // audience
                .setExpirationTime("1 day") // FIXME sketchy
                .sign(JWT_KEY);
            res.send(jwt);
        }
    } catch (error) {
        console.error('Error during authentication:', error);
        res.status(500).send('Error during authentication');
    }
};
