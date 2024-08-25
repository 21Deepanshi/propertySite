// Sodv1201 Group project August 22, 2024 - Deepanshi, Kajal and Kailan
document.addEventListener('DOMContentLoaded', function () {
    

    const profileContainer = document.getElementById('profileContainer');
    const Editbutton = document.getElementById("editProfileButton");
    const cancelEditButton = document.getElementById("cancelEditProfile");
    Editbutton.addEventListener("click", editProfile);
    displayUser();
    
    
async function displayUser()
{
    let currentUser = await getCurrentUser();
    
    profileContainer.innerHTML = '';
    profileContainer.innerHTML = `
        <h3>Name: ${currentUser.firstName} ${currentUser.lastName}</h3>
        <br>
        <p>Email: ${currentUser.email}</p>
        <br>
        <p>Phone: ${currentUser.phoneNumber}</p>
        <br>
        <p>City: ${currentUser.city}</p>
        <br>
        <p>Province: ${currentUser.province}</p>
        <br>
        <p>Role: ${currentUser.role}</p>                
    
    `;

    //this adds a link to the nav bar to view properties but only in the case that a user is the owner. Otherwise only the home page is there
    Editbutton.style.display = 'block'
    cancelEditButton.style.display = 'none';
    
}


async function editProfile()
{
    let currentUser = await getCurrentUser();
    profileContainer.innerHTML = `
        <div class="editProfileInputs">
            <label>First Name: &nbsp;</label><input id="firstNameInput" value="${currentUser.firstName}">
        </div>
        <br>
        <div class="editProfileInputs">
            <label>Last Name: &nbsp;</label><input id="lastNameInput" value="${currentUser.lastName}">
        </div>
        <br>
        <div class="editProfileInputs">
            <label>Email: &nbsp;</label><input id="emailInput" value="${currentUser.email}">
        </div>
        <br>
        <div class="editProfileInputs">
            <label>Phone: &nbsp;</label><input id="phoneInput" value="${currentUser.phoneNumber}"</input>
        </div>
        <br>
        <div class="editProfileInputs">
            <label>City: &nbsp;</label><input id="cityInput" value="${currentUser.city}"</label>
        </div>
        <br>
        <div class="editProfileInputs">
            <label>Province: &nbsp;</label><input id="provinceInput" value="${currentUser.province}"</label>
        </div>
        <br>
        <button class="standardButton" id="saveProfileButton">Save Changes</button>

       
    
    `;
    document.getElementById("saveProfileButton").addEventListener("click", saveProfile);
    Editbutton.style.display = 'none'
    cancelEditButton.style.display = 'block';
    cancelEditButton.addEventListener("click", displayUser);

}


async function saveProfile()
{

   
    let currentUser = await getCurrentUser();
    
    let id = currentUser.id;
    let firstName = document.getElementById("firstNameInput").value;
    let lastName = document.getElementById("lastNameInput").value;
    let email = (document.getElementById("emailInput").value).toLowerCase();
    let phoneNumber = document.getElementById("phoneInput").value;
    let city = document.getElementById("cityInput").value;
    let province = document.getElementById("provinceInput").value;
    let role = currentUser.role;
    const updatedUser = {id, firstName, lastName, email, phoneNumber, city, province, role}
    
    await fetch('/profile', {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(updatedUser)

    })
    .then (response => {

        if(response.status === 201)
        {
            displayUser();
        }
        else if(response.status === 400)
        {
            response.text()
            .then(json => {
                alert(json);
            });
        }
    })
    .catch(error => alert("Error: " + error));

}


});
