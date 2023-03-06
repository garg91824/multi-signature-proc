const multer = require('multer');

module.exports = app => {
    const users = require("../controllers/user.controller.js");
    const process = require("../controllers/process.controller.js");
    var router = require("express").Router();

    const upload = multer({
        storage: multer.diskStorage({
            destination: function (req, file, cb) {
                cb(null, 'uploads/');
            },
            filename: function (req, file, cb) {
                const fileExt = path.extname(file.originalname);
                const fileName = `${uuidv4()}${fileExt}`;
                cb(null, fileName);
            },
        }),
    });

   /**
    * @swagger
    * /api/user:
    *   get:
    *     summary: Retrieve a list of users
    *     description: Retrieve a list of users from JSONPlaceholder. Can be used to populate a list of users.
    *     responses:
    *       200:
    *         description: A list of users.
    */
    router.get("/user/", users.findAll);
    /**
    * @swagger
    * /api/user:
    *   post:
    *     summary: Create a user.
    *     requestBody:
    *       required: true
    *       content:
    *         application/json:
    *           schema:
    *             type: object
    *             properties:
    *               name:
    *                 type: string
    *                 description: The user's name
    *               email:
    *                 type: string
    *                 description: The user's email address
    *             example:
    *               name: John Doe
    *               email: john.doe@example.com
    *     responses:
    *       201:
    *         description: Created
    *         content:
    *           application/json:
    *             schema:
    *               type: object
    *               properties:
    *                 loginId:
    *                   type: string
    *                   description: The new user's ID
    *             example:
    *               loginId: 1234abcd
   */
    router.post("/user/", users.create);
    /**
    * @swagger
    * /api/process/sign-off:
    *   post:
    *     summary: Sign-off a process.
    *     consumes:
    *       - multipart/form-data
    *     parameters:
    *       - in: data
    *         name: processId
    *         type: string
    *         description: The process Id
    *       - in: formData
    *         name: participantId
    *         type: string
    *         description: The loginId of the user signing off
    *       - in: formData
    *         name: comment
    *         type: string
    *         description: The comment by the user
    *       - in: formData
    *         name: picture
    *         type: file
    *         description: The file to upload
    *     responses:
    *       200:
    *         description: Signed off successfully
   */
    router.post("/process/sign-off", upload.single('picture'), process.signOff);

    /**
    * @swagger
    * /api/process/create:
    *   post:
    *     summary: Create a process.
    *     requestBody:
    *       required: true
    *       content:
    *         application/json:
    *           schema:
    *             type: object
    *             properties:
    *               participantIds:
    *                 type: array
    *                 items:
    *                   type: string
    *               commentVisibilityIds:
    *                 type: array
    *                 items:
    *                   type: string
    *               creatorId:
    *                 type: string
    *             required:
    *               - participantIds
    *     responses:
    *       200:
    *         description: Process created
   */
    router.post("/process/create", process.create);
    app.use("/api", router);
};
