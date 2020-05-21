const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const router = express.Router();
const userSchema = require('../models/User');
const diagramSchema = require('../models/Diagram');
const authorize = require('../middlewares/auth');
const { check, validationResult } = require('express-validator');

// Registo
/**
 * @swagger
 * /register-user:
 *  post:
 *    description: Use to resgister a new user
 *    parameters:
 *      - name: user name
 *        in: name
 *        description: Name of the user
 *        required: true
 *      - email: user email
 *        in: email
 *        description: Email of the user
 *        required: true
 *      - password: user password
 *        in: password
 *        description: Password of the user
 *        required: true
 *    responses:
 *      '200':
 *        description: User successfully created!
 *      '500':
 *        description: Server Error! Something went wrong
 *    default:
 *      description: Unexpected error
 */
router.post('/register-user',
    [
        check('name')
            .not()
            .isEmpty()
            .isLength({ min: 3 })
            .withMessage('Name must be atleast 3 characters long'),
        check('email', 'Email is required')
            .not()
            .isEmpty(),
        check('password', 'Password should be between 5 to 8 characters long')
            .not()
            .isEmpty()
            .isLength({ min: 5, max: 8 })
    ],
    (req, res, next) => {
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            return res.status(422).jsonp(errors.array());
        }
        else {
            bcrypt.hash(req.body.password, 10).then((hash) => {
                const user = new userSchema({
                    name: req.body.name,
                    email: req.body.email,
                    password: hash
                });
                user.save().then((response) => {
                    res.status(201).json({
                        message: 'User successfully created!',
                        result: response
                    });
                }).catch(error => {
                    res.status(500).json({
                        error: error
                    });
                });
            });
        }
    });
    
// Login    
/**
 * @swagger
 * /signin:
 *    post:
 *      description: Use to login the users in the aplication
 *    parameters:
 *      - email: user email
 *        in: email
 *        description: Email of the user
 *        required: true
 *      - password: user password
 *        in: formData
 *        description: Password of the user
 *        required: true
 *    responses:
 *      '201':
 *        description: Authentication successed
 *      '401':
 *        description: Authentication failed
 *      '500':
 *        description: Server Error! Something went wrong
 *    default:
 *      description: Unexpected error
 */
router.post('/signin', (req, res, next) => {
    let getUser;
    userSchema.findOne({
        email: req.body.email
    }).then(user => {
        if (!user) {
            return res.status(401).json({
                message: 'Authentication failed'
            });
        }
        getUser = user;
        return bcrypt.compare(req.body.password, user.password);
    }).then(response => {
        if (!response) {
            return res.status(401).json({
                message: 'Authentication failed'
            });
        }
        let jwtToken = jwt.sign({
            email: getUser.email,
            userId: getUser._id
        }, 'longer-secret-is-better', {
            expiresIn: '1h'
        });
        res.status(200).json({
            token: jwtToken,
            expiresIn: 3600,
            data: getUser,
            message: 'Authentication successed'
        });
    }).catch(err => {
        return res.status(401).json({
            message: 'Authentication failed'
        });
    });
});

// Get Users
/**
 * @swagger
 * /user:
 *  get:
 *    description: Use to request a list of all users
 *    responses:
 *      '200':
 *        description: List of User successfully found
 *      '500':
 *        description: Server Error! Something went wrong
 *    default:
 *      description: Unexpected error
 */
router.route('/user').get(authorize, (req, res) => {
    userSchema.find((error, response) => {
        if (error) {
            return next(error)
        } else {
            res.status(200).json({
                data: response,
                message: 'List of User successfully found'
            })
        }
    })
})

// Get Single User
/**
 * @swagger
 * /user-profile/:id:
 *  get:
 *    description: Use to request a user profile by id
 *    parameters:
 *      - id: user id
 *        in: query
 *        description: Unique identifier of the user
 *        required: true
 *        schema:
 *          type: string
 *          format: string
 *    responses:
 *      '200':
 *        description: User Profile successfully found
 *      '500':
 *        description: Server Error! Something went wrong
 *    default:
 *      description: Unexpected error
 */
router.route('/user-profile/:id').get((req, res, next) => {
    userSchema.findById(req.params.id, (error, data) => {
        if (error) {
            return next(error);
        } else {
            res.status(200).json({
                data: data,
                message: 'User Profile successfully found'
            })
        }
    })
})

// Update User
/**
 * @swagger
 * /update-user/:id:
 *    put:
 *      description: Use to update an user
 *    parameters:
 *      - id: user id
 *        in: query
 *        description: Unique identifier of the user
 *        required: true
 *        schema:
 *          type: string
 *          format: string
 *    responses:
 *      '201':
 *        description: User successfully updated
 *      '500':
 *        description: Server Error! Something went wrong
 *    default:
 *      description: Unexpected error
 */
router.route('/update-user/:id').put((req, res, next) => {
    userSchema.updateOne(req.params.id, {
        $set: req.body
    }, (error, data) => {
        if (error) {
            console.log(error)
            return next(error);
        } else {
            res.json({
                data: data,
                message: 'User successfully updated'
            })
        }
    })
})

// Delete User
/**
 * @swagger
 * /delete-user/:id:
 *    delete:
 *      description: Use to delete an user
 *    parameters:
 *      - id: user id
 *        in: query
 *        description: Unique identifier of the user
 *        required: true
 *        schema:
 *          type: string
 *          format: string
 *    responses:
 *      '201':
 *        description: User successfully deleted
 *      '500':
 *        description: Server Error! Something went wrong
 *    default:
 *      description: Unexpected error
 */
router.route('/delete-user/:id').delete((req, res, next) => {
    userSchema.deleteOne(req.params.id, (error, data) => {
        if (error) {            
            return next(error);
        } else {
            res.status(200).json({
                data: data,
                message: 'User successfully deleted'
            })
        }
    })
})

// Get Diagram
/**
 * @swagger
 * /diagram:
 *  get:
 *    description: Use to request a list of all Diagrams
 *    responses:
 *      '200':
 *        description: List of Diagram successfully found
 *      '500':
 *        description: Server Error! Something went wrong
 *    default:
 *      description: Unexpected error
 */
router.route('/diagram').get(authorize, (req, res, next) => {
    diagramSchema.find({}, (error, diagrams) => {
        if (error) {
            console.log('Oh error ', next(error));
            return next(error)
        } else {
            res.status(200).json({
                data: diagrams,
                message: 'List of Diagram successfully found'
            })
        }
    })
})

// Save Diagram
/**
 * @swagger
 * /diagram:
 *    post:
 *      description: Use to submit a diagram to the MongoDB, if the diagram already have an id it is updated, else it saves and create new one Diagram.
 *    parameters:
 *      - id: id diagram
 *        in: query
 *        description: The data body of a diagram
 *        required: true
 *        schema:
 *          type: Object array
 *          format: object
 *      - data: data body
 *        in: query
 *        description: The data body of a diagram
 *        required: true
 *        schema:
 *          type: Object array
 *          format: object
 *    responses:
 *      '200':
 *        description: Diagrama criado com sucesso
 *      '201':
 *        description: Diagrama successfully updated
 *      '401':
 *        description: Authentication failed
 *      '500':
 *        description: Server Error! Something went wrong
 *    default:
 *      description: Unexpected error
 */
router.post('/diagram', async (req, res) => {
    console.log('Api salvar: ', req.body);
    const { id, orgItem, orgLink } = req.body;
    const diagram = new diagramSchema({
        orgItem: orgItem,
        orgLink: orgLink
    });
    try {
        if (req.body.id) {
            await diagramSchema.updateOne({'_id' : id},
                {$set: {orgItem: orgItem, orgLink: orgLink}},
                (error, data) => {
                if (error) {
                    console.log('updateOne Error: ', error);
                    return next(error);
                } else {
                    res.status(201).json({
                        message: 'Diagrama successfully updated!',
                        result: data
                    });
                }
            })
        } else {
            diagram.save().then((response) => {
                res.status(200).json({
                    message: 'Diagrama criado com sucesso!',
                    result: response
                });
            }).catch(error => {
                res.status(500).json({
                    error: error
                });
            });
        }
    } catch (error) {
        console.log('Api catch (error): ', error);
    }
})

// Delete Diagram
/**
 * @swagger
 * /delete/:id:
 *    delete:
 *      description: Use to delete an Diagram
 *    parameters:
 *      - id: diagram id
 *        in: query
 *        description: Unique identifier of the Diagram
 *        required: true
 *        schema:
 *          type: string
 *          format: string
 *    responses:
 *      '200':
 *        description: Diagrama deletado com sucesso!
 *      '500':
 *        description: Server Error! Something went wrong
 *    default:
 *      description: Unexpected error
 */
router.route('/delete/:id').delete(authorize, async (req, res, next) => {
    console.log('delete: ', req.params.id);
	let id = req.params.id;
    await diagramSchema.findOneAndDelete(req.params.id, { document: true }, (error, data) => {
        if (error) {
            return next(error);
        } else {
            res.status(200).json({
                message: 'Diagrama deletado com sucesso!',
                msg: data
            })
        }
    })
})

module.exports = router;