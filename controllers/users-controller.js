const uuid = require("uuid/dist/v4");
const {validationResult} = require('express-validator');

let DUMMY_DATA = [
  {
    id: "a1",
    name: "Anurag",
    email: "test@test.com",
    password: "tester",
  },
];

const getUsers = (req, res, next) => {
  res.json({ users: DUMMY_DATA });
};

const signup = (req, res, next) => {
    const errors = validationResult(req);

  if(!errors.isEmpty()){
    const error = new Error('Invalid Input');
    throw error;
  }
  const { name, email, password } = req.body;
    const hasUser =  DUMMY_DATA.find(u => u.email === email);
    if(hasUser){
        const error = new Error('User already Exists');
        throw error;
    }


  const createdUser = {
    id: uuid(),
    name,
    email,
    password,
  };
  DUMMY_DATA.push(createdUser);
  res.status(201).json({ user: createdUser });
};

const login = (req, res, next) => {
    
  const { email, password } = req.body;
  const identifiedUser = DUMMY_DATA.find((user) => user.email === email);
  if (!identifiedUser || identifiedUser.password === password) {
    const error = new Error("User not found, Please check credentials");
    error.code = 401;
    throw error;
  }
  res.json({ message: "Logged In" });
};

exports.getUsers = getUsers;
exports.signup = signup;
exports.login = login;
