/* Configurazione dei middleware: Utilizza i middleware per registrare le richieste, analizzare il corpo delle richieste JSON e URL-encoded, analizzare i cookie delle richieste e gestire i file statici.
Configurazione delle route: Configura le route utilizzando i percorsi specificati (/courses, /trainers, /clients) e associa ciascuna di queste route ai rispettivi moduli di gestione (coursesRouter, trainersRouter, clientsRouter).
Avvio del server: Avvia il server Express su una porta specifica (porta 3000 di default).*/

// Importiamo i moduli necessari

const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const mongoose = require('mongoose')
const logger = require('morgan');
const createError = require('http-errors');
const cookieParser = require('cookie-parser');
const { DocumentBuilder } = require('express-openapi-generator');
const fs = require('fs');


const documentBuilder = DocumentBuilder.initializeDocument({
  openapi: '3.0.1',
  info: {
    title: 'Gym backend',
    version: '1',
  },
  paths: {}, // You don't need to include any path objects, those will be generated later
});

// Inizializziamo l'applicazione Express
const app = express();

// Configuriamo i middleware
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('uploads'));
app.use(bodyParser.urlencoded({ extended: true }));
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
app.use(express.static(path.join(__dirname, '../frontend/dist')));

//Route per servire index.html quando si accede a "/"
app.get('/', function (req, res) {
  res.sendFile(path.join(__dirname, '../frontend/dist', 'index.html'));
});

const uri = 'mongodb://localhost:27017/gym';
// Connessione al database
mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log('Connection to database successful');
  })
  .catch((error) => {
    console.error('Errore connecting to the database:', error.message);
  });


// Definiamo i percorsi per i moduli di gestione della palestra
const clients = require('./routes/clientRoutes');
const courses = require('./routes/courseRoutes');
const trainers = require('./routes/trainerRoutes');
const sessions = require('./routes/sessionRoutes');
const admins = require('./routes/adminRoutes');
const auth = require('./routes/authRoutes');



// Configuriamo i percorsi
// ad esempio app.use('/trainers', trainersRouter);
//indica che tutte le route definite nel modulo trainersRouter
//saranno raggiungibili attraverso l'URL base /trainers.
app.use('/courses', courses);
app.use('/trainers', trainers);
app.use('/customers', clients);
app.use('/sessions', sessions);
app.use('/admins', admins);
app.use('/auth', auth);



// Avviamo il server su una porta specifica
//  Il server Express viene avviato su una porta specifica,
//  che è definita come variabile di ambiente process.env.PORT o come porta predefinita 3000.
const port = process.env.PORT || 3000;
if (process.env.GENERATE_OPENAPI !== undefined) {
  documentBuilder.generatePathsObject(app);
  fs.writeFileSync("openapi.json", JSON.stringify(documentBuilder.build()));
} else {
  app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
  });
}
