const uuid =  require('uuid/dist/v4');
const {validationResult} = require('express-validator');
const Place = require('../models/place');

let DUMMY_DATA = [
  {
    id: "p1",
    title: "Taj mahal",
    creator: "u1",
  },
];

const getPlaceById = async (req, res, next) => {
  const placeId = req.params.pid;
  let place;
  try {
    place = await Place.findById(placeId);
  } catch (error) {

    return next(error);
  }
 if(!place){
   const error = new Error('Could not find the place ');
   error.code = 404;
   return next(error);
 }
 

  res.json({ place: place.toObject({getters: true}) });
};

const getPlacesByUserId = (req, res, next) => {
  const userId = req.params.uid;
  const places = DUMMY_DATA.filter((u) => {
    return u.creator === userId;
  });
  if (!places || places.length === 0) {
    const error = new Error("could not find the place for the user id");
    error.code = 404;
    return next(error);
  }

  res.json({ place: places });
};

const createPlace = async (req, res, next) => {

  const errors = validationResult(req);

  if(!errors.isEmpty()){
    const error = new Error('Invalid Input');
    throw error;
  }


  const { title, description, coordinates, address, creator } = req.body;
  const createdPlace = new Place({
    
    title,
    description,
    location: coordinates,
    address,
    image:'https://cdn.britannica.com/82/183382-050-D832EC3A/Detail-head-crown-Statue-of-Liberty-New.jpg',
    creator,
  });

  try {
    await createdPlace.save();
  } catch (error) {
    console.log(error);
    return next(error);
  }



  res.status(201).json({place: createdPlace});
};


const updatePlace = (req,res,next) => {
  const errors = validationResult(req);

  if(!errors.isEmpty()){
    const error = new Error('Invalid Input');
    throw error;
  }
  const { title, description } = req.body;
  
  const placeId = req.params.pid;
  const tobeupdatedPlace = {...DUMMY_DATA.find(p => p.id === placeId)} ;
  const placeIndex = DUMMY_DATA.findIndex(p => p.id === placeId);
  tobeupdatedPlace.title = title;
  tobeupdatedPlace.description = description;

  DUMMY_DATA[placeIndex] = tobeupdatedPlace;

  res.status(200).json({place: tobeupdatedPlace});


};

const deletePlace = (req, res, next) => {
  const placeId =req.params.pid;
  DUMMY_DATA = DUMMY_DATA.filter(p => p.id !== placeId);
  res.status(200).json({message: 'Place deleted'});
};



exports.getPlaceById = getPlaceById;
exports.getPlacesByUserId = getPlacesByUserId;
exports.createPlace = createPlace;
exports.deletePlace = deletePlace;
exports.updatePlace = updatePlace;
