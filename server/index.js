const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');
const dbConfig = require('./database/db');
const swaggerJSDoc = require('swagger-jsdoc')
const swaggerUi = require('swagger-ui-express')

// Like the one described here: https://swagger.io/specification/#infoObject
const swaggerOptions = {
    swaggerDefinition: {
        openapi: '3.0.0',
        explorer: true,
        info: {
            title: 'Diagram API',
            version: '1.0.0',
            description: 'Maria Diagram API Documentação',
            contact: {
                name: 'Maria Filipe Santos'
            },
            servers: ['http://localhost:4000'],
            host: 'localhost:4000',
            basePath: '/',
        },
    },
    schemes: [
        "https",
        "http"
    ],
    tags: [
        {
          name: "diagram",
          description: "Create and save Diagrams",
        },
        {
          name: "user",
          description: "Operations about user",
        }
    ],
    apis: ['./routes/api.routes.js'],
};

// Express APIs
const api = require('./routes/api.routes');

// MongoDB conection
mongoose.Promise = global.Promise;
mongoose.connect(dbConfig.db, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => {
    console.log('Database connected')
},
    error => {
        console.log("Database can't be connected: " + error)
});

// Remvoe MongoDB warning error
mongoose.set('useCreateIndex', true);


// Express settings
const app = express();

// Swagger Documentations
// Access http://localhost:4000/api-docs/
const swaggerDocs = swaggerJSDoc(swaggerOptions);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

// Server Express APIs Parser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: false
}));
app.use(cors());

// Serve static resources
app.use('/public', express.static('public'));

app.use('/api', api)

// Define PORT
const port = process.env.PORT || 4000;
const server = app.listen(port, () => {
    console.log('Connected to port ' + port)
})

// Express error handling
app.use((req, res, next) => {
    setImmediate(() => {
        next(new Error('Something went wrong'));
    });
});

app.use(function (err, req, res, next) {
    console.error(err.message);
    if (!err.statusCode) err.statusCode = 500;
    res.status(err.statusCode).send(err.message);
});