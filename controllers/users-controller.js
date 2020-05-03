const uuid = require("uuid/dist/v4");
const { validationResult } = require("express-validator");
const User = require("../models/user");
const Place = require("../models/place");

let DUMMY_DATA = [
  {
    id: "a1",
    name: "Anurag",
    email: "test@test.com",
    password: "tester",
  },
];

const getUsers = async (req, res, next) => {
  
  let users;
  try {
    users = await User.find({},'-password');
  } catch (error) {
    console.log('error in all user find');
    return next(error);
  }


  res.json({ users: users.map(user => user.toObject({getters: true}))});
};

const signup = async (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    const error = new Error("Invalid Input");
    return next(error);
  }
  const { name, email, password} = req.body;
  let existingUser;
  try {
    existingUser = await User.findOne({ email: email });
  } catch (error) {
    return next(error);
  }

  if (existingUser) {
    const error = new Error("User already Exists");
    return next(error);
  }

  const createdUser = new User({
    name,
    email,
    image:"https://vignette.wikia.nocookie.net/godofwar/images/b/b3/Kratos_Mugshot.jpg/revision/latest?cb=20180826024705",
    password,
    places: [],
  });

  try {
    await createdUser.save();
  } catch (error) {
    return next(error);
  }

  res.status(201).json({ user: createdUser.toObject({getters:true}) });
};

const login = async (req, res, next) => {
  const { email, password } = req.body;
  let existingUser;
  try {
    existingUser = await User.findOne({ email: email });
  } catch (error) {
    console.log('error in find user');
    return next(error);
  }
  if (!existingUser || existingUser.password !== password) {
    const error = new Error("User not found, Please check credentials");
    error.code = 401;
    return next(error);
  }
  res.json({ message: "Logged In" });
};

exports.getUsers = getUsers;
exports.signup = signup;
exports.login = login;
