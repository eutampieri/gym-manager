/* Configurazione dei middleware: Utilizza i middleware per registrare le richieste, analizzare il corpo delle richieste JSON e URL-encoded, analizzare i cookie delle richieste e gestire i file statici.
Configurazione delle route: Configura le route utilizzando i percorsi specificati (/courses, /trainers, /clients) e associa ciascuna di queste route ai rispettivi moduli di gestione (coursesRouter, trainersRouter, clientsRouter).
Avvio del server: Avvia il server Express su una porta specifica (porta 3000 di default).*/

// Importiamo i moduli necessari

import express, { json, urlencoded, static as serveStatic } from 'express';
import { join } from 'path';
import { connect } from 'mongoose';
import logger from 'morgan';
import cookieParser from 'cookie-parser';
import expressOpenAPI from 'express-openapi-generator';
import { writeFileSync } from 'fs';
import { hash } from '@node-rs/argon2';
import Admin from './models/adminModel.js';
import idProjection from './controller/idProjection.js';
import { createSocketIoServer } from './controller/chat/index.js'


const documentBuilder = expressOpenAPI.DocumentBuilder.initializeDocument({
  openapi: '3.0.1',
  info: {
    title: 'Gym backend',
    version: '1',
  },
  paths: {}, // You don't need to include any path objects, those will be generated later
});
const __dirname = import.meta.dirname;

// Inizializziamo l'applicazione Express
const app = express();

// Configuriamo i middleware
app.set('views', join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(logger('dev'));
app.use(json());
app.use(urlencoded({ extended: true }));
app.use(serveStatic('uploads'));
app.use(urlencoded({ extended: true }));
app.use(cookieParser());

// Configuriamo Express per servire i file statici dalla directory 'public' come index.html login.html style.css
// Ad esempio, se hai un file style.css nella directory public, puoi accedervi nel tuo browser tramite http://localhost:port/style.css
//app.use(express.static(path.join(__dirname, 'public')));

// Definiamo una route per la radice del server, quando starto va direttamente in index.html
/*app.get('/', function(req, res) {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});
// Servire index.html dalla cartella frontend
app.get('/', function(req, res) {
  res.sendFile(path.resolve('../frontend/index.html'));
});*/
//Serviamo l'intera cartella frontend come cartella di file statici
app.use(serveStatic(join(__dirname, '../frontend/dist')));

//Route per servire index.html quando si accede a "/"
app.get('/', function (req, res) {
  res.sendFile(join(__dirname, '../frontend/dist', 'index.html'));
});

const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/gym';
// Connessione al database
connect(uri, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log('Connection to database successful');
    // Crea admin di default se non esiste
    createDefaultAdmin();
  })
  .catch((error) => {
    console.error('Errore connecting to the database:', error.message);
  });

// Funzione per creare l'admin di default
async function createDefaultAdmin() {
  try {
    const admins = await Admin.find({}, idProjection(Admin), null).exec();
    if (admins.length === 0) {
      const admin = new Admin({
        username: 'admin',
        password: await hash('admin'),
        firstName: 'admin',
        lastName: 'admin',
        hasFullPrivileges: true,
      });
      await Admin.create(admin, null);
      console.log('Admin di default creato con successo.');
    } else {
      console.log('Admin di default già esistente.');
    }
  } catch (error) {
    console.error('Errore nella creazione dell\'admin di default:', error);
  }
}


// Definiamo i percorsi per i moduli di gestione della palestra
import clients from './routes/clientRoutes.js';
import courses from './routes/courseRoutes.js';
import trainers from './routes/trainerRoutes.js';
import sessions from './routes/sessionRoutes.js';
import admins from './routes/adminRoutes.js';
import auth from './routes/authRoutes.js';



// Configuriamo i percorsi
// ad esempio app.use('/trainers', trainersRouter);
//indica che tutte le route definite nel modulo trainersRouter
//saranno raggiungibili attraverso l'URL base /trainers.
app.use('/api/courses', courses);
app.use('/api/trainers', trainers);
app.use('/api/customers', clients);
app.use('/api/sessions', sessions);
app.use('/api/admins', admins);
app.use('/api/auth', auth);


// Avviamo il server su una porta specifica
//  Il server Express viene avviato su una porta specifica,
//  che è definita come variabile di ambiente process.env.PORT o come porta predefinita 3000.
const port = process.env.PORT || 3000;
if (process.env.GENERATE_OPENAPI !== undefined) {
  documentBuilder.generatePathsObject(app);
  writeFileSync("openapi.json", JSON.stringify(documentBuilder.build()));
} else {
  const server = app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
  });
  app.locals.io = createSocketIoServer(server);
}
