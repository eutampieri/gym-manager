const Client = require('../models/clientModel');
const Trainer = require('../models/trainerModel');

exports.authenticate = async (req, res) => {
    const { username, password } = req.body;

    try {
        const client = await Client.findOne({username: username}, null, null).exec();
        if (client && client.password === password) {
            return res.redirect(`/clientManager.html?username=${username}`);
        }

        // Check if the username matches a trainer
        const trainer = await Trainer.findOne({username: username}, null, null).exec();
        if (trainer && trainer.password === password) {
            return res.redirect(`/trainerManager.html?username=${username}`);
        }

        if (username === 'admin' && password === 'admin') {
            return res.redirect(`/adminManager.html`); // Redirect to the adminManager page
        }

        // Redirect to the login page with a query parameter to indicate failure
        res.redirect(`/login.html?error=true`);
    } catch (error) {
        console.error('Error during authentication:', error);
        res.status(500).send('Error during authentication');
    }
};
