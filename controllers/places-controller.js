const uuid =  require('uuid/dist/v4');
const {validationResult} = require('express-validator');

let DUMMY_DATA = [
  {
    id: "p1",
    title: "Taj mahal",
    creator: "u1",
  },
];

const getPlaceById = (req, res, next) => {
  const placeId = req.params.pid;
  const place = DUMMY_DATA.find((p) => {
    return p.id === placeId;
  });

  if (!place) {
  }

  res.json({ place: place });
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

const createPlace = (req, res, next) => {

  const errors = validationResult(req);

  if(!errors.isEmpty()){
    const error = new Error('Invalid Input');
    throw error;
  }


  const { title, description, coordinates, address, creator } = req.body;
  const createdPlace = {
    id:uuid(),
    title,
    description,
    location: coordinates,
    address,
    creator,
  };

  DUMMY_DATA.push(createdPlace);
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
