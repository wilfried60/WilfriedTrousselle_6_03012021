const Sauce = require('../models/sauce');
const fs = require('fs');

// on créé une nouvelle sauce avec de l'utilisateur
exports.createSauce = (req, res, next) => {
    const sauceObject = JSON.parse(req.body.sauce);
    delete sauceObject._id;
    const sauce = new Sauce ({
        ...sauceObject,
        likes  : 0,
        dislikes : 0,
        usersLiked : [],
        usersDisliked :[],
        imageUrl:`${req.protocol}://${req.get('host')}/images/${req.file.filename}`,

    });
    sauce.save()
      .then(() =>{
          res.status(201).json({ message : 'Sauce enregistré!'})

      })
      .catch((error)=>{
          res.status(400).json({error})
      });

}

// on récupère la sauce de l'utilisateur 
exports.getOneSauce = (req, res, next )=>{
    Sauce.findOne({_id : req.params.id})
           .then(sauce => res.status(200).json(sauce))
           .catch( (error)=> {
               res.status(404).json({error});
           });

};

// on modifie une sauce avec l'id de l'utilisateur
exports.modifyOneSauce = (req, res, next)=>{
    const sauceObject = req.file?
    {
        ...JSON.parse(req.body.sauce),
        imageUrl:`${req.protocol}://${req.get('host')}/images/${req.file.filename}`

    }:{...req.body}
    Sauce.updateOne({_id: req.params.id }, {...sauceObject, _id: req.params.id})
          .then( ()=> res.status(200).json({message : 'sauce modifiée!'}))
          .catch( (error)=>{ res.status(400).json({error})});

};

// on supprime une sauce avec l'id de l'utilisateur
exports.deleteOneSauce = (req, res, next)=>{
    Sauce.findOne({_id : req.params.id})
        .then( sauce => {
            const filename = sauce.imageUrl.split('/images/')[1]
            fs.unlink(`images/${filename}`, ()=>{
              Sauce.deleteOne( {_id: req.params.id})
                .then(()=> res.status(200).json({message : 'Sauce supprimée!'}))
                .catch((error)=>{ res.status(400).json({error})});
            })
        })
        .catch((error)=>{ res.status(500).json({error})});
   
};

// on récupère toute les sauces
exports.getAllSauce = (req, res ,next )=>{
    Sauce.find()
       .then(sauces =>{
          res.status(200).json(sauces) 
       })
       .catch((error)=>{
           res.status(400).json({error})
       });   
};


// on récupère les likes / dislikes
exports.likeSauce = (req, res, next)=>{
    Sauce.findOne({_id: req.params.id})
        .then((sauce) =>{
            if( req.body.like > 0 && !sauce.usersLiked.includes(req.body.userId)){
                Sauce.updateOne({ _id: req.params.id },{ $inc: { likes: 1 }, $push: {usersLiked: req.body.userId} })
                  .then(()=> res.status(200).json({message : 'Le like est bien ajouté!'}))
                  .catch((error)=>{ res.status(400).json({error })});
            } else if (req.body.like < 0 && !sauce.usersDisliked.includes(req.body.userId)) {
                Sauce.updateOne({ _id: req.params.id },{ $inc: { dislikes: 1 }, $push: {usersDisliked: req.body.userId} })
                   .then(()=> res.status(200).json({message : 'le dislike est bien ajouté!'}))
                   .catch((error)=>{ res.status(400).json({error})});
            } else if (req.body.like === 0){
                if (sauce.usersLiked.includes(req.body.userId)){
                    Sauce.updateOne({ _id: req.params.id },{ $inc: { likes: -1 }, $pull: {usersLiked: req.body.userId} })
                      .then(()=> res.status(200).json({message : 'like est bien supprimé!'}))
                      .catch((error)=>{ res.status(400).json({error})});
                } else if (sauce.usersDisliked.includes(req.body.userId)){
                    Sauce.updateOne({ _id: req.params.id },{ $inc: { dislikes: -1 }, $pull: {usersDisliked: req.body.userId} })
                       .then(()=> res.status(200).json({message : 'dislike est bien supprimé!'}))
                       .catch((error)=>{ res.status(400).json({error})});
                 }}})
        .catch((error)=>{ res.status(400).json({error})})};





