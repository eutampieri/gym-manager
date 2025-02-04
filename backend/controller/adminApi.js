const Admin = require('../models/adminModel');
const Client = require('../models/clientModel');
const Course = require('../models/courseModel');
const Trainer = require('../models/trainerModel');
const Session = require('../models/sessionModel');
module.exports = class API {
    static async createAdmin(req, res) {
        const admin = req.body;
        try {
            const adminAlreadyPresent = await Admin.findOne({ username: req.body.username }, null, null).exec();
            if (!adminAlreadyPresent) {
                await Admin.create(admin, null);
                res.status(201).json({ message: 'Admin created successfully' });
            }
            else {
                res.status(500).json({ message: "Username already present" });
            }
        } catch (error) {
            res.status(400).json({ message: error.message });
        } finally {
        }
    }

    static async fetchAllAdmins(req, res) {
        try {
                const admin = await Admin.find({}, null, null).exec();
                res.status(200).json(admin);

        } catch (error) {
            res.status(404).json({ message: error.message })
        } finally {
        }

    }
    static async fetchAdminByUsername(req, res) {
        const username = req.params.username;
        try {
            const admin = await Admin.findOne({username: username}, null, null).exec();
            res.status(200).json(admin);
        } catch (error) {
            res.status(404).json({ message: error.message });
        } finally {
        }
    }
    static async fetchAdminBy_Id(req, res) {
        const id = req.params.id;
        try {
            const admin = await Admin.findOne({_id: id}, null, null).exec();
            res.status(200).json(admin);
        } catch (error) {
            res.status(404).json({ message: error.message });
        } finally {
        }
    }
    static async updateAdmin(req, res) {
        const username = req.body.username;
        const { password, hasFullPrivileges } = req.body; // Extract the fields to update

        try {
            const updateFields = {}; // Object that will contain only the fields to update

            // Check and add non-empty fields to the update object
            if (password) updateFields.password = password;
            if (hasFullPrivileges !== undefined) updateFields.hasFullPrivileges = hasFullPrivileges;
            
            // Perform the update only if there are fields to update
            if (Object.keys(updateFields).length > 0) {
                await Admin.updateOne({ username: username }, updateFields, null);
                res.status(200).json({ message: 'Admin updated successfully' });
            } else {
                res.status(400).json({ message: 'No fields to update' });
            }
        } catch (error) {
            res.status(404).json({ message: error.message });
        } finally {
        }
    
    }
    
    static async deleteAdmin(req, res) {
            const id = req.params.id;
            try {
                await Admin.findOneAndDelete({_id:id}, null);
                res.status(200).json({ message: 'Admin deleted successfully' });
            } catch (error) {
                res.status(404).json({ message: error.message });
            } finally {
            }
    }

    ///////////////////////////////////////////////////////////////////////////////////////////////////

    static async fetchAdmin_IdByUsername(req, res) {
            try {
                const username = req.params.username;
                const admin = await Admin.findOne({username: username}, null, null).exec();
                if (!admin) {
                    return res.status(404).json({ message: 'Admin not found' });
                }
                res.status(200).json(admin._id);
            } catch (error) {
                res.status(500).json({ message: error.message });
    
            } finally {
            }
    }
    
}