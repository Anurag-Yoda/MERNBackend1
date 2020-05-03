const uuid = require("uuid/dist/v4");
const { validationResult } = require("express-validator");
const Place = require("../models/place");
const User = require("../models/user");
const mongoose = require("mongoose");

const getPlaceById = async (req, res, next) => {
  const placeId = req.params.pid;
  let place;
  try {
    place = await Place.findById(placeId);
  } catch (error) {
    return next(error);
  }
  if (!place) {
    const error = new Error("Could not find the place ");
    error.code = 404;
    return next(error);
  }

  res.json({ place: place.toObject({ getters: true }) });
};

const getPlacesByUserId = async (req, res, next) => {
  const userId = req.params.uid;
  let places;

  try {
    places = await Place.find({ creator: userId });
    console.log(places);
  } catch (error) {
    return next(error);
  }

  if (!places || places.length === 0) {
    const error = new Error("could not find the place for the user id");
    error.code = 404;
    return next(error);
  }

  res.json({ place: places.map((place) => place.toObject({ getters: true })) });
};

const createPlace = async (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    const error = new Error("Invalid Input");
    throw error;
  }

  const { title, description, coordinates, address, creator } = req.body;
  const createdPlace = new Place({
    title,
    description,
    location: coordinates,
    address,
    image:
      "https://cdn.britannica.com/82/183382-050-D832EC3A/Detail-head-crown-Statue-of-Liberty-New.jpg",
    creator,
  });
  let user;
  try {
    user = await User.findById(creator);
  } catch (error) {
    return next(error);
  }
  if (!user) {
    const error = new Error("Could not find the user for Provided it");
    return next(error);
  }

  try {
    const sess = await mongoose.startSession();
    sess.startTransaction();
    await createdPlace.save({ session: sess });
    user.places.push(createdPlace);
    await user.save({ session: sess });
    await sess.commitTransaction();
  } catch (error) {
    console.log(error);
    return next(error);
  }

  res.status(201).json({ place: createdPlace });
};

const updatePlace = async (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    const error = new Error("Invalid Input");
    throw error;
  }
  const { title, description } = req.body;

  const placeId = req.params.pid;

  let tobeupdatedPlace;

  try {
    tobeupdatedPlace = await Place.findById(placeId);
  } catch (error) {
    return next(error);
  }

  tobeupdatedPlace.title = title;
  tobeupdatedPlace.description = description;

  try {
    await tobeupdatedPlace.save();
  } catch (error) {
    return next(error);
  }

  res.status(200).json({ place: tobeupdatedPlace.toObject({ getters: true }) });
};

const deletePlace = async (req, res, next) => {
  const placeId = req.params.pid;
  let place;
  try {
    place = await Place.find.findById(placeId).populate("creator");
  } catch (error) {
    return next(error);
  }

  if (!place) {
    const error = new Error("Could not fetch the place");
    return next(error);
  }

  try {
    const sess = await mongoose.startSession();
    sess.startTransaction();
    await place.remove({ session: sess });
    place.creator.places.pull(place);
    await place.creator.save({ session: sess });
    await sess.commitTransaction();
  } catch (error) {
    return next(error);
  }

  res.status(200).json({ message: "Place deleted" });
};

exports.getPlaceById = getPlaceById;
exports.getPlacesByUserId = getPlacesByUserId;
exports.createPlace = createPlace;
exports.deletePlace = deletePlace;
exports.updatePlace = updatePlace;
