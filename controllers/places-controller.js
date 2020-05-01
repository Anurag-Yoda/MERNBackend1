const uuid =  require('uuid/v4');


const DUMMY_DATA = [
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

const getPlaceByUserId = (req, res, next) => {
  const userId = req.params.uid;
  const place = DUMMY_DATA.find((u) => {
    return u.creator === userId;
  });
  if (!place) {
    const error = new Error("could not find the place for the user id");
    error.code = 404;
    return next(error);
  }

  res.json({ place: place });
};

const createPlace = (req, res, next) => {
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

exports.getPlaceById = getPlaceById;
exports.getPlaceByUserId = getPlaceByUserId;
exports.createPlace = createPlace;
