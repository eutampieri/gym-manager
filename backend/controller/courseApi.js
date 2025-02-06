import Client from '../models/clientModel.js';
import Course from '../models/courseModel.js';
import Trainer from '../models/trainerModel.js';
import idProjection from './idProjection.js';

// RESTFUL CRUD API WITH LOCK FOR MUTUAL EXCLUSION MANAGEMENT
// Mongoose functions are CRUD

export default class API {
    static async createCourse(req, res) {

        const course = req.body;
        const idTrainer = req.body.trainer;
        try {
            const courseAlreadyPresent = await Course.findOne({ name: req.body.name }, idProjection(Course), null).exec();
            if (!courseAlreadyPresent) {
                const newCourse = await Course.create(course, null);
                res.status(201).json({ message: 'Course created successfully' });
                // Aggiunge la sessione al Trainer
                await Trainer.updateOne(
                    { _id: idTrainer },
                    { $push: { courses: newCourse._id } }
                );

            }
            else {
                res.status(500).json({ message: "Course already present" });
            }
        } catch (error) {
            res.status(400).json({ message: error.message });
        } finally {
        }
    }

    static async fetchAllCourses(req, res) {
        console.log("fetchAllCourses");
        try {
            const course = await Course.find({}, idProjection(Course), null).exec();
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
            const course = await Course.findById(id, idProjection(Course), null).exec();
            res.status(200).json(course);
        } catch (error) {
            res.status(404).json({ message: error.message });
        } finally {
        }
    }

    static async fetchCourseByName(req, res) {
        console.log("fetchCourseByName");
        const name = req.params.name;
        try {
            const course = await Course.find({ name: name }, idProjection(Course), null);
            res.status(200).json(course);
        } catch (error) {
            res.status(404).json({ message: error.message });
        } finally {
        }
    }

    static async updateCourse(req, res) {
        const { _id, description, schedule, capacity, trainer } = req.body;

        try {
            // Trova il corso esistente per confrontare il trainer originale
            const existingCourse = await Course.findById(_id);
            if (!existingCourse) {
                return res.status(404).json({ message: "Course not found" });
            }

            const updateFields = {};
            if (description) updateFields.description = description;
            if (schedule) updateFields.schedule = schedule;
            if (capacity) updateFields.capacity = capacity;
            if (trainer) updateFields.trainer = trainer;

            // Se non ci sono campi da aggiornare, restituisci un errore
            if (Object.keys(updateFields).length === 0) {
                return res.status(400).json({ message: 'No fields to update' });
            }

            // Controlla se il trainer è cambiato
            if (trainer && trainer !== existingCourse.trainer.toString()) {
                // Rimuove il corso dall'array courses del trainer precedente
                await Trainer.updateOne(
                    { _id: existingCourse.trainer },
                    { $pull: { courses: _id } }
                );

                // Aggiunge il corso all'array courses del nuovo trainer
                await Trainer.updateOne(
                    { _id: trainer },
                    { $addToSet: { courses: _id } } // Evita duplicati con $addToSet
                );
            }

            // Aggiorna il corso nel database
            const updatedCourse = await Course.findByIdAndUpdate(_id, updateFields, { new: true });

            res.status(200).json({ message: 'Course updated successfully', course: updatedCourse });

        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }


    static async deleteCourse(req, res) {
        const courseId = req.params.id;
        try {
            // Trova il corso prima di eliminarlo per recuperare clientId e trainerId
            const course = await Course.findById(courseId);
            if (!course) {
                return res.status(404).json({ message: "Course not found" });
            }

            // Rimuove l'intero oggetto dall'array courses dei Client che erano iscritti
            await Client.updateMany(
                { 'courses.course': courseId },
                { $pull: { courses: { course: courseId } } } // Rimuove tutto l'oggetto con course, dayOfWeek e startTime
            );

            // Rimuove il corso dall'array courses del Trainer
            await Trainer.updateOne(
                { _id: course.trainer },
                { $pull: { courses: courseId } }
            );

            // Elimina il corso dal database
            await Course.findOneAndDelete({ _id: courseId });

            res.status(200).json({ message: 'Course deleted successfully, removed from clients and trainer' });

        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }

    static async createBooking(req, res) {
        try {
            const { clientId, dayOfWeek, startTime } = req.body;
            const safeClientId = req.user.role === "admin" ? clientId : req.user.id;
            const courseId = req.params.id;

            // Trova il corso con il nome specificato e popola i partecipanti
            const course = await Course.findOne({ _id: courseId })
                .populate('schedule.participants')
                .exec();

            if (!course) {
                return res.status(404).json({ message: 'Course not found' });
            }

            // Trova la schedule entry per il giorno e l'orario specificati
            const scheduleEntry = course.schedule.find(entry =>
                entry.dayOfWeek === dayOfWeek && entry.startTime === startTime
            );

            if (!scheduleEntry) {
                return res.status(404).json({ message: 'No schedule found for the specified day and time' });
            }

            // Controlla se il cliente è già iscritto al corso
            if (scheduleEntry.participants.some(participant => participant._id.toString() === safeClientId)) {
                return res.status(400).json({ message: 'Participant already exists in the course' });
            }

            // Controlla se ci sono posti disponibili
            if (scheduleEntry.availableSpots - scheduleEntry.participants.length <= 0) {
                return res.status(400).json({ message: 'No available spots for this schedule' });
            }

            // Aggiungi il cliente ai partecipanti e decrementa availableSpot
            scheduleEntry.participants.push(safeClientId);

            // Aggiorna il corso con le nuove informazioni
            await Course.updateOne(
                { _id: course._id, schedule: { $elemMatch: { dayOfWeek, startTime } } },
                {
                    $set: {
                        "schedule.$.participants": scheduleEntry.participants,
                        "schedule.$.availableSpots": scheduleEntry.availableSpots
                    }
                }
            );


            // Trova il client con l'ID specificato
            const client = await Client.findOne({ _id: safeClientId }).populate('courses.course').exec();

            if (!client) {
                return res.status(404).json({ message: 'Client not found' });
            }

            // Controlla se il corso è già presente nel client (stesso ID, giorno e orario)
            const courseExists = client.courses.some(c =>
                c.course.toString() === course._id.toString() &&
                c.dayOfWeek === dayOfWeek &&
                c.startTime === startTime
            );

            if (courseExists) {
                return res.status(400).json({ message: 'Course already added to client at this time' });
            }

            // Aggiunge il corso con i dettagli specifici
            client.courses.push({
                course: course._id,
                dayOfWeek: dayOfWeek,
                startTime: startTime
            });

            // Aggiorna il client con il nuovo corso
            await Client.updateOne(
                { _id: safeClientId },
                { $set: { courses: client.courses } }
            );

            res.status(200).json({ message: 'Course added successfully' });

        }

        catch (error) {
            res.status(500).json({ message: error.message });
        } finally {
        }
    }

    static async deleteBooking(req, res) {
        try {
            const { clientId, dayOfWeek, startTime } = req.body;
            const safeClientId = req.user.role === "admin" ? clientId : req.user.id;
            const courseId = req.params.id;

            // Trova il corso con il nome specificato
            const course = await Course.findOne({ _id: courseId })
                .populate('schedule.participants')
                .exec();

            if (!course) {
                return res.status(404).json({ message: 'Course not found' });
            }

            // Trova l'entry giusta nella `schedule`
            const scheduleEntry = course.schedule.find(entry =>
                entry.dayOfWeek === dayOfWeek && entry.startTime === startTime
            );

            if (!scheduleEntry) {
                return res.status(404).json({ message: 'No schedule found for the specified day and time' });
            }

            // Controlla se il partecipante è registrato
            if (!scheduleEntry.participants.some(participant => participant._id.toString() === safeClientId)) {
                return res.status(400).json({ message: 'Participant not found in this course' });
            }

            // Rimuove il partecipante manualmente e aggiorna availableSpot
            scheduleEntry.participants = scheduleEntry.participants.filter(
                participant => participant._id.toString() !== safeClientId
            );
            scheduleEntry.availableSpots += 1;

            // Aggiorna il corso nel database
            await Course.updateOne(
                { _id: course._id, schedule: { $elemMatch: { dayOfWeek, startTime } } },
                {
                    $set: {
                        "schedule.$.participants": scheduleEntry.participants,
                        "schedule.$.availableSpots": scheduleEntry.availableSpots
                    }
                }
            );

            // Trova il client e rimuove il corso dal suo elenco
            const client = await Client.findById(safeClientId);
            if (!client) {
                return res.status(404).json({ message: 'Client not found' });
            }

            client.courses = client.courses.filter(courseEntry =>
                !(courseEntry.course.toString() === course._id.toString() &&
                    courseEntry.dayOfWeek === dayOfWeek &&
                    courseEntry.startTime === startTime)
            );


            // Aggiorna il client con il nuovo array `courses`
            await Client.updateOne(
                { _id: safeClientId },
                { $set: { courses: client.courses } }
            );

            res.status(200).json({ message: 'Booking deleted successfully' });

        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }

    static async fetchCourseBookings(req, res) {
        console.log("fetchCourseBookings");
        const id = req.params.id;
        try {
            const course = await Course.findById(id)
                .populate('schedule.participants', 'username')
                .select('schedule') // Seleziona solo il campo schedule
                .exec();
            if (!course) {
                return res.status(404).json({ message: "Course not found" });
            }
            // Mappa i dati per restituire solo i campi richiesti
            const formattedSchedule = course.schedule.map(course => ({
                dayOfWeek: course.dayOfWeek,
                startTime: course.startTime,
                participants: course.participants, // Include i dettagli dei partecipanti popolati
                availableSpots: course.availableSpots
            }));
            res.status(200).json(formattedSchedule);
        } catch (error) {
            res.status(404).json({ message: error.message });
        } finally {
        }
    }
}