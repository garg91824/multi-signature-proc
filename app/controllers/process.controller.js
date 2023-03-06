const db = require("../models");
const Processes = db.processes;
const Op = db.Sequelize.Op;
const nodemailer = require('nodemailer');
const Users = db.users;

// Create a new Process
exports.create = async(req, res) => {
    try {
     // Get process data from request body
     const { creatorId, participantIds, commentVisibilityIds } = req.body;
    // Validate request
    if (!req.body.creatorId || !req.body.participantIds || !req.body.commentVisibilityIds) {
        res.status(400).send({
        message: "creatorId or participantIds or commentVisibilityIds can not be empty!"
        });
        return;
    }
     // Generate process ID
     const processId = Math.floor(Math.random() * 100000);
    // password  and other secrets can we stored in aws secrets manager and can be accessed from there.
     const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: 'web3superuser@gmail.com',
          pass: '',
        },
      });
  
      for (const participantId of participantIds) {
        const processParticipantRow = {
            processId: processId,
            creatorId: creatorId,
            participantId: participantId,
            canViewComment: commentVisibilityIds.includes(participantId),
            signedOff: false,
            comment: null,
            picture: null
        };
        await Processes.create(processParticipantRow);
        const user = await Users.findOne({ where: {loginId: participantId} })

        const mailOptions = {
          from: 'web3superuser@gmail.com',
          to: user.email,
          subject: 'New multi-signature process created',
          text: `Dear ${user.name}, a new multi-signature process has been created and requires your sign-off.`,
        };
  
        await transporter.sendMail(mailOptions);
      }
    
      res.status(201).json({ message: 'Multi-signature process created successfully', processId });
    } catch (err) {
        // Handle errors
        console.error(err);
        res.status(500).json({ message: 'Internal server error' });
      }
    
  };
  
  //Sign Off a process
exports.signOff = async(req, res) => {
    try {
    const { processId, participantId, comment } = req.body;
    const picture = req.file.path;
    //update the values
    await Processes.update({comment: comment, picture: picture, signedOff: true},
      {where : {processId: processId, participantId: participantId}})


     // Send web notification to the creator
  const payload = JSON.stringify({ message: 'A user signed off.' });
  webpush.sendNotification(creator.rows[0].subscription, payload);

  const usersNotSigned = await Processes.findAll({where : {processId: processId, signedOff: false}});
  const allParticipantIds =  await Processes.findAll({where : {processId: processId}, attributes: ['participantId']});

  if(usersNotSigned.length === 0)
  {
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: 'web3superuser@gmail.com',
          pass: '',
        },
      });
        const emails = await Users.findAll({ where: {loginId : {[Op.or]: allParticipantIds}}, attributes: ['email']})

        const mailOptions = {
          from: 'your_email_address',
          to: emails,
          subject: 'Multi-signature process completed',
          text: `Dear users, the multi-signature process has been completed successfully.`,
        };

        await transporter.sendMail(mailOptions);
  }
  res.status(201).json({ message: 'Signed-off successfully' });
} catch (err) {
    // Handle errors
    console.error(err);
    res.status(500).json({ message: 'Internal server error' });
  }

};
 