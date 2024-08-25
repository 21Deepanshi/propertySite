// Sodv1201 Group project August 22, 2024 - Deepanshi, Kajal and Kailan

// COOKIEEEES https://www.w3schools.com/js/js_cookies.asp
// gives the user a cookie to track their id when they log in
// Event listener for logout button
document.addEventListener('DOMContentLoaded', function () {

    
    addMyPropertiesNav();
    
    checkUserLoggedIn();
    // document.getElementById("logoutButton").addEventListener("click", function() {
    //     clearCookies();
    //     window.location.href = "pages/logIn.html"; // Redirect to login page after logging out
    // });

    document.getElementById("LogoDiv").addEventListener("click", function() {


        window.location.href = "/";
    });

});


// Set user cookies
function setUserCookie(userEmail, userId) {
    let days = 1; // Cookie expiration in days
    const expireDate = new Date(); 
    expireDate.setTime(expireDate.getTime() + (days * 24 * 60 * 60 * 1000));
    const expires = "expires=" + expireDate.toUTCString();
    document.cookie = "userEmail=" + encodeURIComponent(userEmail) + ";" + expires + ";path=/";
    document.cookie = "userId=" + encodeURIComponent(userId) + ";" + expires + ";path=/";
    console.log("Cookies set: ", document.cookie);
}

// returns the users cookie by using the cookie name. Names used are:
// userEmail   (returns email address)
// userId      (returns unique user ID)
// Retrieve a user cookie by name
function getUserCookie(cname) {
    let name = cname + "=";
    let decodedCookie = decodeURIComponent(document.cookie);
    let cookieValues = decodedCookie.split(";");
    for (let i = 0; i < cookieValues.length; i++) {
        let c = cookieValues[i].trim();
        if (c.indexOf(name) === 0) {
            return c.substring(name.length, c.length);
        }
    }
    return "";
}


// Check if user is logged in
function checkUserLoggedIn() {

    console.log('All Cookies:', document.cookie); // Debug log for all cookies
    // Check if the user is logged in by checking the presence of the 'userEmail' cookie

    let userEmail = getUserCookie("userEmail");
    let loginButtonContainer = document.getElementById("loginButtonContainer");
    let logoutButtonContainer = document.getElementById("logoutButtonContainer");

    let createAccount = document.getElementById("createAccount");
    let profileLink = document.getElementById("profileLink");

    if (userEmail) {
        loginButtonContainer.style.display = "none";
        logoutButtonContainer.style.display = "block";

        createAccount.style.display = "none";
        profileLink.style.display = "block";
    } else {
        loginButtonContainer.style.display = "block";
        logoutButtonContainer.style.display = "none";
        
        createAccount.style.display = "block";
        profileLink.style.display = "none";
    }
}

// Clear all cookies
function clearCookies() {
    const expires = "expires=Thu, 01 Jan 1970 00:00:00 GMT";
    document.cookie.split(";").forEach(function(c) {
        let cookieName = c.trim().split("=")[0];
        document.cookie = `${cookieName}=; ${expires}; path=/`;
    });
}




// compares user cookie id with the id of all registered users, when the function finds a matching user it returns that user object, otherwise returns null. 
// this can be used to retrieve other user data based on the currently browsing user
// for instance getCurrentUser().phone
async function getCurrentUser()
{
    
    // console.log("test");
    let currentUser = await fetch(`/getUser`)
    .then(response => {
        if(response.status === 200)
        {
            return response.json();
        }
        else 
        {
            console.log("User not logged in or data not found.");
        }
    })
    .then(user => 
    {
        return user;
    });
    
    return currentUser; 
    
}


async function addMyPropertiesNav()
{

    let currentUser = await getCurrentUser();
    if (currentUser.role === 'Owner')
    {
        let navBar = document.getElementById('mainNav');
        let newLi = document.createElement('li');
        newLi.innerHTML = `
        <a href="/myProperties">My Properties</a>`;
        navBar.appendChild(newLi);
    }
   
    
}

async function logoutUser() {
   
    
    try {
        const response = await fetch('/logout', {
            method: 'POST',
            // credentials: 'include' // Ensure cookies are sent with the request
        });

        const data = await response.json();
        if (data.success) {
            console.log('Logged out successfully');
            // Redirect or update UI
            window.location.href = '/login'; // Or another page
        } else {
            console.error('Logout failed:', data.message);
        }
    } catch (error) {
        console.error('Error during logout:', error);
    }
}

