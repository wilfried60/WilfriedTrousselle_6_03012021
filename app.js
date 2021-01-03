const express = require('express');

const app = express();

app.use((req, res, next)=>{
   console.log('requete reçu');
   next();
    });
    

app.use((req, res, next)=>{
res.json({message:'ça fonctionne'});
});

module.exports = app;