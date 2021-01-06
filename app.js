const express = require('express');
const app = express();
const stuffRoutes = require('./routes/sauce');
const mongoose = require('mongoose');
const userRoutes = require('./routes/user');
const path = require('path');
const  mongoSanitize  =  require('express-mongo-sanitize') ;

// connexion à la bd mongoose
mongoose.connect('mongodb+srv://will_60:A19082015T@cluster0.ckpyh.mongodb.net/projet6?retryWrites=true&w=majority',
  { useNewUrlParser: true,
    useUnifiedTopology: true })
  .then(() => console.log('Connexion à MongoDB réussie !'))
  .catch(() => console.log('Connexion à MongoDB échouée !'));

const bodyParser = require('body-parser');

// on déclare le header
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    next();
  });

// on déclare les chemins utilisés pour enregistrer les données correspondants
  app.use(bodyParser.json());
  app.use(mongoSanitize());
  app.use('/images', express.static(path.join(__dirname, 'images')));
  app.use('/api/auth', userRoutes);
  app.use('/api/sauces', stuffRoutes);


module.exports = app;
