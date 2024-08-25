// Sodv1201 Group project August 22, 2024 - Deepanshi, Kajal and Kailan 
const express = require('express');
const routes = require('./routes'); // Import the router module
const path = require('path'); // Make sure this line is present
// const multer = require('multer');
// const upload = multer({ dest: 'uploads/' });
const cookieParser = require('cookie-parser'); // Middleware to parse cookies


const app = express();
const PORT = 3000;

// always have this before the routes
app.use(express.static('public'));
app.use(express.json());
app.use(express.urlencoded({ extended: false}));
app.use(cookieParser());

// Use the router module for handling routes
app.use('/', routes);

const createAccountRoutes = require('./routes');
app.use('/api', createAccountRoutes);

// app.use((err, req, res, next) => {
//     if (err) {
//         res.status(400).send({ error: err.message });
//     } else {
//         next();
//     }
// });

// Serve static files from the 'uploads' directory
// app.use('/uploads', express.static(uploadDir));

// Serve static files from the 'uploads' directory
// app.use('/uploads', express.static('uploads'));

// Serve static files from the 'public' directory
app.use(express.static(path.join(__dirname, 'public')));

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.listen(PORT, (error) => {

    if(!error) 
    {
        console.log("Server is running and app is listening on port: " + PORT);
    }
    else
    {
        console.log("Error: " + error + "Server did not start.");
    }
});