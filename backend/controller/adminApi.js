import Admin from '../models/adminModel.js';
import idProjection from './idProjection.js';
import { hash } from '@node-rs/argon2';

export default class API {
    static async createAdmin(req, res) {
        const admin = req.body;
        admin.password = await hash(admin.password);
        try {
            const adminAlreadyPresent = await Admin.findOne({ username: req.body.username }, idProjection(Admin), null).exec();
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
            const admin = await Admin.find({}, idProjection(Admin, new Set(["password"])), null).exec();
            res.status(200).json(admin);

        } catch (error) {
            res.status(404).json({ message: error.message })
        } finally {
        }

    }
    static async fetchAdminByUsername(req, res) {
        const username = req.params.username;
        try {
            const admin = await Admin.findOne({ username: username }, idProjection(Admin, new Set(["password"])), null).exec();
            res.status(200).json(admin);
        } catch (error) {
            res.status(404).json({ message: error.message });
        } finally {
        }
    }
    static async fetchAdminBy_Id(req, res) {
        const id = req.params.id;
        try {
            const admin = await Admin.findOne({ _id: id }, idProjection(Admin, new Set(["password"])), null).exec();
            res.status(200).json(admin);
        } catch (error) {
            res.status(404).json({ message: error.message });
        } finally {
        }
    }
    static async updateAdmin(req, res) {
        const id = req.body.id;
        const admin = req.body;

        try {
            const updatedAdmin = {};

            // Check and add non-empty fields to the update object
            if (admin.password) updatedAdmin.password = await hash(admin.password);
            if (admin.hasFullPrivileges !== undefined) updatedAdmin.hasFullPrivileges = admin.hasFullPrivileges;
            if (admin.username) updatedAdmin.username = admin.username;
            if (admin.firstName) updatedAdmin.firstName = admin.firstName;
            if (admin.lastName) updatedAdmin.lastName = admin.lastName;

            // Perform the update only if there are fields to update
            if (Object.keys(updatedAdmin).length > 0) {
                await Admin.updateOne({ _id: id }, updatedAdmin, null);
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
            await Admin.findOneAndDelete({ _id: id }, null);
            res.status(200).json({ message: 'Admin deleted successfully' });
        } catch (error) {
            res.status(404).json({ message: error.message });
        } finally {
        }
    }
}