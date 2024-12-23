const Course = require('../models/courseModel');

// RESTFUL CRUD API WITH LOCK FOR MUTUAL EXCLUSION MANAGEMENT
// Mongoose functions are CRUD

module.exports = class API {

    static async fetchAllCourses(req, res) {
        console.log("fetchAllCourses");
        try {
            const course = await Course.find({}, null, null).exec();
            res.status(200).json(course);
        } catch (error) {
            res.status(404).json({message: error.message});
        } finally {
        }
    }

    static async isCourseIdPresent(req, res) {
        console.log("isCourseIdPresent");
        const id = req.params.id;
        try {
            const course = await Course.findOne({ id: id }, null, null).exec();
            if(course) {
                res.status(200).json(true);
            }
            else {
                res.status(200).json(false);
            }
        } catch (error) {
            res.status(404).json({message: error.message});
        } finally {
        }
    }

    static async fetchCourse_IdById(req, res) {
        console.log("fetchCourse_IdById");
        const id = req.params.id;
        try {
            const course = await Course.findOne({id: id}, null, null).exec();
            res.status(200).json(course._id);
        } catch (error) {
            res.status(404).json({ message: error.message });
        } finally {
        }
    }



    static async fetchCourseById(req, res) {
        console.log("fetchCourseById");
        const id = req.params.id;
        try {
            const course = await Course.findOne({id: id}, null, null).exec();
            res.status(200).json(course);
        } catch (error) {
            res.status(404).json({ message: error.message });
        } finally {
        }
    }

    static async fetchCourseBy_Id(req, res) {
        console.log("fetchCourseBy_Id");
        const id = req.params.id;
        try {
            const course = await Course.findById(id, null, null).exec();
            res.status(200).json(course);
        } catch (error) {
            res.status(404).json({ message: error.message });
        } finally {
        }
    }

    // returns all courses in the database that match the specified name
    static async fetchCoursesByName(req, res) {
        console.log("fetchCourseByName");
        const name = req.params.name;
        try {
            const course = await Course.find({name: name}, null, null).exec();
            res.status(200).json(course);
        } catch (error) {
            res.status(404).json({ message: error.message });
        } finally {
        }
    }
    // from an array of all course names
    static async fetchAllCoursesNames(req, res) {
        console.log("fetchAllCoursesNames");
        try {
            // uses the distinct() method of Mongoose to retrieve the unique names of courses from the 'name' property of the Course model
            const courseNames = await Course.distinct('name').exec();
            res.status(200).json(courseNames);
        } catch (error) {
            res.status(404).json({ message: error.message });
        } finally {
        }
    }

    static async createCourse(req, res) {

        const course = req.body;
        try {
            const courseAlreadyPresent= await Course.findOne({ id: req.body.id }, null, null).exec();
            if (!courseAlreadyPresent) {
                await Course.create(course, null);
                res.status(201).json({ message: 'Course created successfully' });

            }
            else {
                res.status(500).json({ message: "Course id already present" });
            }
        } catch (error) {
            res.status(400).json({ message: error.message });
        } finally {
        }
    }

    static async updateCourse(req, res) {
        const id = req.body.id;
        const { name, description, dayOfWeek, startTime, endTime, capacity, trainer } = req.body; // Estrai i campi da aggiornare
        try {
            const updateFields = {};
            // Check and add non-empty fields to the update object
            if (name) updateFields.name = name;
            if (description) updateFields.description = description;
            if (dayOfWeek) updateFields.dayOfWeek = dayOfWeek;
            if (startTime) updateFields.startTime = startTime;
            if (endTime) updateFields.endTime = endTime;
            if (capacity) updateFields.capacity = capacity;
            if (trainer) updateFields.trainer = trainer;

            // Perform the update only if there are fields to update
            if (Object.keys(updateFields).length > 0) {
                await Course.updateOne({ id: id }, updateFields, null);
                res.status(200).json({ message: 'Course updated successfully' });
            } else {
                res.status(400).json({ message: 'No fields to update' });
            }
        } catch (error) {
            res.status(404).json({ message: error.message });
        } finally {
        }
    }



    static async deleteCourse(req, res) {
        const courseId = req.body.id;
        try {
            await Course.findOneAndDelete({id:courseId}, null);
            res.status(200).json({ message: 'Course deleted successfully' });
        } catch (error) {
            res.status(404).json({ message: error.message });
        } finally {
        }
    }

    static async deleteCourseBy_Id(req, res) {
        const courseId = req.params.id;
        try {
            await Course.findOneAndDelete({_id:courseId}, null);
            res.status(200).json({ message: 'Course deleted successfully' });
        } catch (error) {
            res.status(404).json({ message: error.message });
        } finally {
        }
    }

    static async fetchCourseTrainer(req, res) {
        try {
            const id = req.params.id;
            const course = await Course.findOne({id: id}, null, null).populate('trainer').exec();
            if (!course) {
                return res.status(404).json({ message: 'Course not found' });
            }
            const trainer = course.trainer;
            res.status(200).json(trainer);
        } catch (error) {
            res.status(500).json({ message: error.message });
        } finally {
        }
    }

    static async fetchCourseParticipants(req, res) {
        try {
            const id = req.params.id;
            const course = await Course.findOne({id: id}, null, null).populate('participants').exec();
            if (!course) {
                return res.status(404).json({ message: 'Course not found' });
            }
            // Fetch the list of participants
            const participants = course.participants;
            res.status(200).json(participants);
        } catch (error) {
            res.status(500).json({ message: error.message });
        } finally {
        }
    }

    static async removeParticipantByUsername(req, res) {
        try {
            const courseId = req.params.id;
            const username = req.params.username;
            const course = await Course.findOne({id: courseId}, null, null).populate('participants').exec();
            if (!course) {
                res.status(404).json({ message: 'Session not found' });
            }
            const indexToRemove = course.participants.findIndex(participant => participant.username === username);
            if (indexToRemove === -1) {
                return res.status(404).json({ message: 'Participant not found' });
            }
            course.participants.splice(indexToRemove, 1);
            course.capacity++;
            await Course.updateOne({id:courseId}, { $set:{ participants: course.participants, capacity: course.capacity }}, null);
            res.status(200).json({ message: 'Participant deleted successfully' });

        } catch (error) {
            res.status(500).json({ message: error.message });
        } finally {
        }
    }

    static async addParticipantById(req, res) {

        try {
            const courseId = req.params.id;
            const clientId = req.params.clientId;

            let full = false;
            const course = await Course.findOne({id: courseId}, null, null).populate('participants').exec();
            if (!course) {
                res.status(404).json({ message: 'Course not found' });
            }
            // Check if the course is already present in the client's courses
            if (course.participants.some(participant => participant._id === parseInt(clientId))) {
                return res.status(400).json({ message: 'Participant already exists in the course' });
            }

             if(course.capacity>0) {
                        course.participants.push(clientId);
                        course.capacity--;
                        await Course.updateOne({id:courseId}, { $set:{ capacity: course.capacity, participants: course.participants }}, null);
                        res.status(200).json(full);
             }
             else {
                 full = true
                 return res.status(404).json(full);
             }

        } catch (error) {
            res.status(500).json({ message: error.message });
        } finally {
        }
    }

    static async checkParticipantsByUsername(req, res) {
        try {
            const courseId = req.params.id;
            const username = req.params.username;
            const course = await Course.findOne({id: courseId}, null, null).populate('participants').exec();
            if (!course) {
                return res.status(404).json({ message: 'Course not found' });
            }

            // Find the participant with the specified username
            const participantStatus = course.participants.some(participant => participant.username === username);
            res.status(200).json(participantStatus);

        } catch (error) {
            res.status(500).json({ message: error.message });
        } finally {
        }
    }

}