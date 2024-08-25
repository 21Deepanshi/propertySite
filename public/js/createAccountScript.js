// Sodv1201 Group project August 22, 2024 - Deepanshi, Kajal and Kailan
//Pattern for phone number
function formatPhoneNumber(input) {
            let value = input.value.replace(/\D/g, ''); // Remove non-digit characters
            if (value.length > 10) value = value.slice(0, 10); // Limit to 10 digits

            // Format the number
            if (value.length <= 3) {
                input.value = value;
            } else if (value.length <= 6) {
                input.value = value.slice(0, 3) + '-' + value.slice(3);
            } else {
                input.value = value.slice(0, 3) + '-' + value.slice(3, 6) + '-' + value.slice(6);
            }
}

document.getElementById("createNewUserForm").addEventListener("submit", function(event) {
    event.preventDefault(); // Prevent form submission

    // Get form values
    const firstName = document.getElementById("userFirstNameInput").value.trim();
    const lastName = document.getElementById("userLastNameInput").value.trim();
    // added to lower case to make sure all emails are consistent.
    // emails are not case sensitive
    const email = (document.getElementById("userEmailAddressInput").value.trim().toLowerCase());
    const phoneNumber = document.getElementById("userPhoneInput").value.trim();
    const city = document.getElementById("userCityInput").value.trim();
    const province = document.getElementById("userProvince").value;
    const role = document.querySelector('input[name="ownerRenter"]:checked')?.value;
    
    // Validate form inputs
    if (!firstName || !lastName || !email || !phoneNumber || !city || !province || !role) {
        return;
    }
   
    // Create registration object with unique ID
    const registrationDetails = {
        id: Date.now(), // Unique ID based on timestamp
        firstName: firstName,
        lastName: lastName,
        email: email,
        phoneNumber: phoneNumber,
        city: city,
        province: province,
        role: role
    };

    // Send registration data to the server
    fetch('/api/createAccount', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(registrationDetails)
    })
    .then(response => response.json())
    .then(data => {
        if (data.message === 'User Created Successfully') {
            // Optional: You can show an alert or other notification
            alert('Account created successfully!');

            // Clear form fields after submission
            clearFormFields();
            // redirect to login after account creation
            window.location.href = "/logIn";

        } else {
            alert(data.message);
        }
    })
    .catch(error => console.error('Error:', error));
});

// Function to clear form fields
function clearFormFields() {
    const form = document.getElementById("createNewUserForm");
    for (let element of form.elements) {
        switch (element.type) {
            case 'text':
            case 'email':
            case 'number':
            case 'textarea':
                element.value = '';
                break;
            case 'radio':
            case 'checkbox':
                element.checked = false;
                break;
            case 'select-one':
                element.selectedIndex = 0; // Sets to the first option
                break;
        }
    }
}
