const Client = require('../models/clientModel');
const Trainer = require('../models/trainerModel');
const Admin = require('../models/adminModel');
const jose = require('jose');
const idProjection = require('./idProjection');
const { JWT_KEY, ISSUER, AUDIENCE } = require('../utils');

const JWT_KEY = JWT_KEY

async function lookupUsername(username) {
    let result = { kind: null, data: null };
    const customer = await Client.findOne({ username: username }, idProjection(Client), null).exec();
    if (customer) {
        result.kind = "customer";
        result.data = customer;
        return result;
    }

    // Check if the username matches a trainer
    const trainer = await Trainer.findOne({ username: username }, idProjection(Trainer), null).exec();
    if (trainer) {
        result.kind = "trainer";
        result.data = trainer;
        return result;
    }

    const admin = await Admin.findOne({ username: username }, idProjection(Admin), null).exec();
    if (admin) {
        result.kind = "admin";
        result.data = admin;
        return result;
    }
}

exports.authenticate = async (req, res) => {
    const { username, password } = req.body;
    const token = {};

    try {
        const user = await lookupUsername(username);
        console.log(user);
        if (user.kind === null || user.data.password !== password) { // TODO salt and hash
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
            res.send(jwt);
        }
    } catch (error) {
        console.error('Error during authentication:', error);
        res.status(500).send('Error during authentication');
    }
};
