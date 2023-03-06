const db = require("../models");
const Users = db.users;
const Op = db.Sequelize.Op;
const { v4: uuidv4 } = require('uuid');

// Create and Save a new User
exports.create = async(req, res) => {
  // Validate request
  if (!req.body.name || !req.body.email) {
    res.status(400).send({
      message: "name or email can not be empty!"
    });
    return;
  }
  const existingUser = await Users.findOne({ where: {email: req.body.email} })
  if (existingUser) {
    res.status(400).send({
      message: "This email already exists!"
    });
    return;
  }
    // Generate internal login ID
  const loginId = uuidv4();
  // Create a User
  const user = {
    name: req.body.name,
    email: req.body.email,
    loginId: loginId
  };
   

  // Save user in the database
  Users.create(user)
    .then(data => {
      res.send({loginId});
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while creating the User."
      });
    });
};

// Retrieve all Users from the database.
exports.findAll = (req, res) => {
  Users.findAll()
    .then(data => {
      res.send(data);
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving users."
      });
    });
};