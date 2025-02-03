const Course = require('../models/courseModel');
const Client = require('../models/clientModel');
const Trainer = require('../models/trainerModel');

// RESTFUL CRUD API WITH LOCK FOR MUTUAL EXCLUSION MANAGEMENT
// Mongoose functions are CRUD

module.exports = class API {
    static async createCourse(req, res) {

        const course = req.body;
        const idTrainer = req.body.trainer;
        try {
            const courseAlreadyPresent= await Course.findOne({ name: req.body.name }, null, null).exec();
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
            const course = await Course.find({}, null, null).exec();
            res.status(200).json(course);
        } catch (error) {
            res.status(404).json({message: error.message});
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

    static async fetchCourseByName(req, res) {
        console.log("fetchCourseByName");
        const name = req.params.name;
        try {
            const course = await Course.find({name: name}, null, null);
            res.status(200).json(course);
        } catch (error) {
            res.status(404).json({ message: error.message });
        } finally {
        }
    }

    static async updateCourse(req, res) {
        const { description, schedule, capacity, trainer } = req.body;
        try {
        
            const updateFields = {};
            // Aggiunge solo i campi presenti nel body
            if (description) updateFields.description = description;
            if (schedule) updateFields.schedule = schedule;
            if (capacity) updateFields.capacity = capacity;
            //if (trainer) updateFields.trainer = trainer;
    
            // Se non ci sono campi da aggiornare, restituisci un errore
            if (Object.keys(updateFields).length === 0) {
                return res.status(400).json({ message: 'No fields to update' });
            }
    
            // Trova e aggiorna il corso
            const updatedCourse = await Course.findByIdAndUpdate(req.body._id, updateFields, { new: true });
    
            if (!updatedCourse) {
                return res.status(404).json({ message: "Course not found" });
            }
    
            res.status(200).json({ message: 'Course updated successfully', course: updatedCourse });
    
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }

    static async deleteCourse(req, res) {
        const courseId = req.params.id;
        try {
            // Trova la sessione prima di eliminarla per recuperare clientId e trainerId
            const course = await Course.findById(courseId);
                if (!course) {
                    return res.status(404).json({ message: "Course not found" });
                }
            await Course.findOneAndDelete({_id:courseId}, null);
            // Rimuove la sessione dal Trainer
            await Trainer.updateOne(
                { _id: course.trainer },
                { $pull: { courses: courseId } }
            );
            res.status(200).json({ message: 'Course deleted successfully' });
        } catch (error) {
            res.status(404).json({ message: error.message });
        } finally {
        }
    }
    static async createBooking(req, res) {
        try {
            const { clientId, dayOfWeek, startTime } = req.body;
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
            if (scheduleEntry.participants.some(participant => participant._id.toString() === clientId)) {
                return res.status(400).json({ message: 'Participant already exists in the course' });
            }
    
            // Controlla se ci sono posti disponibili
            if (scheduleEntry.availableSpots <= 0) {
                return res.status(400).json({ message: 'No available spots for this schedule' });
            }
    
            // Aggiungi il cliente ai partecipanti e decrementa availableSpot
            scheduleEntry.participants.push(clientId);
            scheduleEntry.availableSpots -= 1;
    
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
             const client = await Client.findOne({ _id: clientId }).populate('courses.course').exec();

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
            { _id: clientId },
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
            if (!scheduleEntry.participants.some(participant => participant._id.toString() === clientId)) {
                return res.status(400).json({ message: 'Participant not found in this course' });
            }
    
            // Rimuove il partecipante manualmente e aggiorna availableSpot
            scheduleEntry.participants = scheduleEntry.participants.filter(
            participant => participant._id.toString() !== clientId
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
            const client = await Client.findById(clientId);
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
                { _id: clientId },
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
    
    
//////////////////////////////////////////////////////////////////////////////
 

    static async fetchCourse_IdByName(req, res) {
        console.log("fetchCourse_IdByName");
        const name = req.params.courseName;
        try {
            const course = await Course.findOne({name: name}, null, null).exec();
            res.status(200).json(course._id);
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



    
    



  


    static async fetchCourseTrainer(req, res) {
        try {
            const name = req.params.courseName;
            const course = await Course.findOne({name: name}, null, null).populate('trainer').exec();
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
            const name = req.params.courseName;
            const course = await Course.findOne({name: name}, null, null).populate('participants').exec();
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
            const courseName = req.params.courseName;
            const username = req.params.username;
            const course = await Course.findOne({name: courseName}, null, null).populate('participants').exec();
            if (!course) {
                res.status(404).json({ message: 'Session not found' });
            }
            const indexToRemove = course.participants.findIndex(participant => participant.username === username);
            if (indexToRemove === -1) {
                return res.status(404).json({ message: 'Participant not found' });
            }
            course.participants.splice(indexToRemove, 1);
            course.capacity++;
            await Course.updateOne({name:courseName}, { $set:{ participants: course.participants, capacity: course.capacity }}, null);
            res.status(200).json({ message: 'Participant deleted successfully' });

        } catch (error) {
            res.status(500).json({ message: error.message });
        } finally {
        }
    }

    

    static async checkParticipantsByUsername(req, res) {
        try {
            const courseName = req.params.courseName;
            const username = req.params.username;
            const course = await Course.findOne({name: courseName}, null, null).populate('participants').exec();
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