/* Sodv1201 Group project August 22, 2024 - Deepanshi, Kajal and Kailan  */
const express = require('express');
const fs = require('fs');
const path = require('path');
const multer = require('multer');
const router = express.Router();
// const upload = multer({ dest: 'uploads/' }); // give the default name to the uploaded image

// Setup storage and file handling
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        const uploadDir = path.join(__dirname, 'uploads');
        cb(null, 'uploads/'); // This should match the static files path
        // Check if the 'uploads' directory exists; if not, create it
        if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir, { recursive: true });
        console.log('Uploads directory created');
    }
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname);
        // cb(null, file.originalname); // Save the file with its original name
    }
});

const upload = multer({ storage: storage }); //the file is saved with the userId name
// const upload = multer({ storage: storage });

const USERS_FILENAME = path.join(__dirname, 'data', 'users.json');
const PROPERTIES_FILENAME = path.join(__dirname, 'data', 'properties.json');
const { saveProperty, retrieveData } = require('./dataScripts');

router.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Define the upload route
router.post('/uploadImage', upload.single('image'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ success: false, message: 'No file uploaded' });
  }
  res.json({ success: true, filename: req.file.originalname });
});

// index / home page routes
/* ******************************************************************************* */
router.get('/', function(req, res){
    res.sendFile(path.join(__dirname, 'public', 'index.html'));

});


/* ******************************************************************************* */
/* END of index/home page Routes */


// my properties routes
/* ******************************************************************************* */
router.get('/myProperties', function(req, res) {
    res.sendFile(path.join(__dirname, 'public', 'pages', 'myProperties.html'));

});

router.post('/myProperties', upload.single('imageFileName'), function(req, res) 
{
    req.body.userId = parseInt(req.cookies.userId);
    // console.log("Req body: " + req.body.userId + "req cookies " + req.cookies.userId);
    saveProperty(req.body, PROPERTIES_FILENAME);
    console.log("save Property success");
    res.status(201).send();

});

router.put('/myProperties', upload.single('imageFileName'), function(req, res) 
{
    // pull all properties
    // userId is sent in as "null", so we need to update userId to be current requesting user
    req.body.userId = parseInt(req.cookies.userId);
    const properties = retrieveData(PROPERTIES_FILENAME);
    properties.then(
        function(resolve) {
            // find index of the property that matches the request update property
            let propertyIndex = resolve.findIndex(property => property.propertyId === parseInt(req.body.propertyId));
            // if found
            if(propertyIndex !== -1)
            {
                // resolve refers to property data array here. 
                // update property at correct index to the new information gathered in the PUT fetch
                resolve[propertyIndex] = req.body;
                // once the property data has been updated, save the newly updated array
                fs.writeFileSync(PROPERTIES_FILENAME, JSON.stringify(resolve, null, 2));
                console.log("Update successful");
                res.status(201).send();
            }
            else
            {
                console.log("Error: Property not found!");
                res.status(400).send("Property not found!");
            }
            
        }, 
        function(error) {

            console.log("Error retrieving property data");
            res.status(400).send("Error retrieving property data.");
    });
});

router.delete('/myProperties/:propertyId', function(req, res) 
{

    // console.log(req.params.propertyId);
    let propertyId = parseInt(req.params.propertyId);
    const properties = retrieveData(PROPERTIES_FILENAME);
    properties.then(
        function(resolve)
        {
            // find index of property to be deleted
            let propIndex = resolve.findIndex(property => property.propertyId === propertyId);
            if(propIndex === -1)
            {
                res.status(400).send("Property not found");
            }
            else
            {
                // remove property from array and save data
                resolve.splice(propIndex, 1);
                fs.writeFileSync(PROPERTIES_FILENAME, JSON.stringify(resolve, null, 2));
                // send success message
                res.status(201).send('Property deleted successfully');
            }

        },
        function(error)
        {
            console.log(error);
            res.status(400).send("Properties data not found");
        });


});

// userId here refers to the user cookie added in the fetch request
router.get('/myPropertiesData', function(req, res)
{
    
    let userId = parseInt(req.cookies.userId);
    // console.log(req.cookies.userId);
    const properties = retrieveData(PROPERTIES_FILENAME);
    properties.then(
        function(resolve)
        {
            // create a new array
            let myProperties = [];
            resolve.forEach(property => {

                // add properties only if the current userId matches
                if(property.userId === userId)
                {
                    myProperties.push(property);
                }
            });
            // return new array only. This ensures we avoid sending the entire database and only send the relevant data
            res.json(myProperties);
        },
        function(error)
        {
            console.log(error);
            res.status(400).send("Properties data not found");
        })

});
/* ******************************************************************************* */
/* END of my properties Routes*/

// Route to serve the properties data
router.get('/properties', function(req, res) {
    fs.readFile(PROPERTIES_FILENAME, 'utf8', (err, data) => {
        if (err) {
            console.error("Error reading properties data:", err);
            res.status(500).send("Error reading properties data.");
        } else {
            res.json(JSON.parse(data));
        }
    });
});

router.get('/properties', function(req, res) {
    const { availability, parking, transport, type, address, city, province, area, capacity, rentalTerm, price, search } = req.query;
    const properties = retrieveData(PROPERTIES_FILENAME);

    properties.then(function(propertyList) {
        let filteredProperties = propertyList;

        // Log retrieved properties for debugging
        console.log("Retrieved Properties:", propertyList);

        if (search) {
            filteredProperties = filteredProperties.filter(property =>
                property.name.toLowerCase().includes(search.toLowerCase()) ||
                property.address.toLowerCase().includes(search.toLowerCase()) ||
                property.city.toLowerCase().includes(search.toLowerCase())
            );
        }

        if (availability) {
            filteredProperties = filteredProperties.filter(property =>
                property.availability.toString() === availability.toLowerCase()  // Convert boolean to string
            );
        }

        if (parking) {
            filteredProperties = filteredProperties.filter(property =>
                property.parking.toString() === parking.toLowerCase()  // Convert boolean to string
            );
        }

        if (transport) {
            filteredProperties = filteredProperties.filter(property =>
                property.publicTransport.toString() === transport.toLowerCase()  // Convert boolean to string
            );
        }

        if (type) {
            filteredProperties = filteredProperties.filter(property =>
                property.type.toLowerCase().includes(type.toLowerCase())
            );
        }
        if (address) {
            filteredProperties = filteredProperties.filter(property =>
                property.address.toLowerCase().includes(address.toLowerCase())
            );
        }

        if (city) {
            filteredProperties = filteredProperties.filter(property =>
                property.city.toLowerCase().includes(city.toLowerCase())
            );
        }

        if (province) {
            filteredProperties = filteredProperties.filter(property =>
                property.province.toLowerCase().includes(province.toLowerCase())
            );
        }

        if (area) {
            filteredProperties = filteredProperties.filter(property =>
                property.area >= parseFloat(area)
            );
        }

        if (capacity) {
            filteredProperties = filteredProperties.filter(property =>
                property.capacity >= parseFloat(capacity)
            );
        }

        if (rentalTerm) {
            filteredProperties = filteredProperties.filter(property =>
                property.rentalTerm.toLowerCase().includes(rentalTerm.toLowerCase())
            );
        }

        if (price) {
            filteredProperties = filteredProperties.filter(property =>
                property.price <= parseFloat(price)
            );
        }
        // Log filtered properties for debugging
        console.log("Filtered Properties:", filteredProperties);

        res.json(filteredProperties);
    });
});

//end of advance filter

// profile routes
/* ******************************************************************************* */

router.get('/profile', function(req, res) 
{
    res.sendFile(path.join(__dirname, 'public', 'pages', 'profile.html'));

});

router.get('/getUser', function(req, res) 
{
    // gets requester cookie and verifies user
    let userId = parseInt(req.cookies.userId);
    if(req.cookies.userId)
    {
        
        const users = retrieveData(USERS_FILENAME);
        users.then(
            function(allUsers)
            {

                const user = allUsers.find(user => user.id === userId);
                if(user)
                {
                    // console.log(`user ${user.firstName} is logged in`);
                    res.json(user);
                }
                else
                {
                    res.status(400).send("User ID not found in data!");
                }
    
            }
        );
    }
    else 
    {
        res.status(400).send('User Not logged in!');
    }  


});

router.put('/profile', function(req, res)
{
    let userEmail = req.body.email;
    // add the userId via cookies, since the request body cannot contain an id as a user does not have access to this. 
    // this needs to be updated otherwise the updated user will have a null id
    req.body.id = parseInt(req.cookies.userId);
    let userId = parseInt(req.cookies.userId);
    const users = retrieveData(USERS_FILENAME);
    users.then(
        function(resolve) {

        // check if request email is already in use in user data
        let user = resolve.find(user => user.email.toLowerCase() === userEmail.toLowerCase());
        if(user)
        {
            // if email is in database AND it is not the current requesting user 
            // cancel update request and return
            // otherwise proceed because this means that the email in the user data belongs to the requester -- in other words they were not changing their email
            if(user.id !== req.body.id)
            {
                res.status(400).send("Email already in use! Please try another");
                return;
            }  
        }

        // find index of user within user data
        let userIndex = resolve.findIndex(user => user.id === userId)
        // -1 indicates that no user was found
        if(userIndex !== -1)
        {
            // since a user was found, update the data of the requesting user at appropriate index with req.body
            resolve[userIndex] = req.body;
            // update cookie to reflect new email
            res.cookie('userEmail', userEmail, {maxAge: 24 * 60 * 60 * 1000 }); // 1 day
             // save file - update success
            fs.writeFileSync(USERS_FILENAME, JSON.stringify(resolve, null, 2));
            console.log('update successful');
            res.status(201).send('update successful');

        }
        else
        {
            // otherwise -1 means no user was found and update cannot happen
            console.log("Error: User not found!");
            res.status(400).send("Error: User not found!");
        }

    }, function(error) {

        res.status(400).send("Error retrieving data!");
    });



});

/* ******************************************************************************* */
/* END of profile Routes */

// Log in routes
/* ******************************************************************************* */
const usersFilePath = path.join(__dirname, 'data','users.json'); 

// Serve the login page
router.get('/logIn', function(req, res) {
    res.sendFile(path.join(__dirname, 'public', 'pages', 'logIn.html'));
});

// Handle login
router.post('/login', (req, res) => {
    const {email} = req.body;

    if (!email) {
        return res.status(400).json({ message: 'Email is required' });
    }
    fs.readFile(usersFilePath, 'utf8', (err, data) => {
    if (err) {
        console.error('Error reading users file:', err);
        return res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
    else 
    {
        const users = JSON.parse(data);
        const user = users.find(u => u.email === email);
            
        if (user) {
            res.cookie('userEmail', user.email, {maxAge: 24 * 60 * 60 * 1000 }); // 1 day
            res.cookie('userId', user.id, {maxAge: 24 * 60 * 60 * 1000 }); // 1 day
            console.log('User logged in successfully:', user);
            return res.status(200).json({ success: true, email: user.email});
        } else {
            console.log('Login failed: Invalid email');
            return res.status(400).json({ success: false, message: 'Invalid email' });
        }
    }
    
});
});


// Logout Route
router.post('/logout', (req, res) => {
    const userEmail = req.cookies.userEmail;
    // const userId = req.cookies.userId;
    if (userEmail) {
        // Log the detailed information before logging out
        console.log("user logged out", userEmail);
        
        // Clear the cookies
        res.clearCookie('userEmail');
        res.clearCookie('userId');

        // Send the response
        res.status(200).json({ success: true, message: 'Logged out successfully' });
    } else {
        // If the userEmail or userId cookie doesn't exist, log that no user was logged in
        console.log('Logout attempted but no user was logged in or cookies were missing.');
        res.status(500).json({ success: false, message: 'No user was logged in' });
    }
});

/* ******************************************************************************* */
/* END of log in Routes */

// Create Account routes
/* ******************************************************************************* */

router.get('/createAccount', function(req, res) 
{
    res.sendFile(path.join(__dirname, 'public', 'pages', 'createAccount.html'));

});

// Handle form submission
router.post('/createAccount', (req, res) => {
    const { firstName, lastName, email, phoneNumber, city, province, role } = req.body;

    if (!firstName || !lastName || !email || !phoneNumber || !city || !province || !role) {
        return res.status(400).json({ message: 'All fields are required' });
    }

    const USER_FILENAME = path.join(__dirname, 'data', 'users.json');
   
    fs.readFile(USER_FILENAME, 'utf8', (err, data) => {
        let users = [];
        if (!err && data) {
            users = JSON.parse(data);
        }

        // Check if user with the same email already exists
        const existingUser = users.find(user => user.email.toLowerCase() === email.toLowerCase());
        if (existingUser) {
            return res.status(409).json({ message: 'User with this email already exists' });
        }

        // Add the new registration data with unique ID
        const newUser = {
            id: Date.now(), // Unique ID based on timestamp
            firstName,
            lastName,
            email,
            phoneNumber,
            city,
            province,
            role
        };

        users.push(newUser);

        fs.writeFile(USER_FILENAME, JSON.stringify(users, null, 2), (err) => {
            if (err) {
                return res.status(500).json({ message: 'Error saving registration' });
            }
            return res.status(200).json({ message: 'User Created Successfully', registrationData: newUser });
        });
    });
});

/* ******************************************************************************* */
/* END of Create Account Routes */


// View Property routes
/* ******************************************************************************* */

router.get('/viewProperty', function(req, res) 
{
    res.sendFile(path.join(__dirname, 'public', 'pages', 'viewProperty.html'));

});

router.get('/viewProperty/:propertyId', function(req, res)
{
    
    let propertyId = parseInt(req.params.propertyId);
    const properties = retrieveData(PROPERTIES_FILENAME);
    properties.then(
        function(allProperties)
        {            
            const property = allProperties.find(property => property.propertyId === propertyId);
            res.json(property);

            
        }
    )
    
});

router.get('/viewProperty/users/:userId', function(req, res)
{
    let userId = parseInt(req.params.userId);
    
    const users = retrieveData(USERS_FILENAME);
    users.then(
        function(allUsers)
        {
            
            const user = allUsers.find(user => user.id === userId);
            res.json(user);
        }
    );



});


/* ******************************************************************************* */
/* END of View Property Routes */

module.exports = router;
