// Sodv1201 Group project August 22, 2024 - Deepanshi, Kajal and Kailan
document.addEventListener('DOMContentLoaded', function () {


    displayProperty();

    async function displayProperty()
    {

        const propertyDisplay = document.getElementById("propertyDisplay");
        const propertyNameTitle = document.getElementById("propertyNameTitle");
        const propertyNameHeader = document.getElementById("propertyNameHeader");

        let propertyId = parseInt(getIdFromUrl("propertyId"));
        let userId;

        await fetch(`/viewProperty/${propertyId}`)
        .then(response => response.json())
        .then(property => 
        {

            userId = property.userId;
            // alert(property.propertyId);
            const propertyDiv = document.createElement('div');
            propertyDiv.classList.add('innerPageContent3', 'dynamicallyCreatedDiv');
            propertyDiv.innerHTML = `
            <h2>${property.name}</h2>
            <p>${property.address}</p>
            <p>${property.city} ${property.province}</p>
            <p>${property.area} sq Meters, Max Occupants: ${property.capacity}</p>
            <p>Parking: ${property.parking ? 'Yes' : 'No'}</p>
            <p>Public Transport: ${property.publicTransport ? 'Yes' : 'No'}</p>
            <div>
                <h3>${property.type}</h3>
            </div>
            <div>
                <p>$${property.price} - ${property.rentalTerm}</p>
                <p>${property.availability ? 'Available Now' : 'Not Available'}</p>
            </div>
        `;

        propertyDisplay.appendChild(propertyDiv);


        propertyNameTitle.innerHTML = property.name + " Property Page";
        propertyNameHeader.innerHTML = property.name + " Property Page";
        
        });

        fetch(`/viewProperty/users/${userId}`)
        .then(response => response.json())
        .then(user => 
        {
            const userDiv = document.createElement('div');
            userDiv.classList.add('innerPageContent3', 'dynamicallyCreatedDiv');
            userDiv.innerHTML = `
            <h2>Owned By: ${user.firstName} ${user.lastName}</h2>
            <h3>Contact Information:</h3>
            <p>Email Address: ${user.email}</p>
            <p>Phone Number: ${user.phoneNumber}</p>

        `;

        propertyDisplay.appendChild(userDiv);


        });


    }



    function getIdFromUrl(IdName)
    {
        let name = IdName + "=";
        let url = window.location;
        url = url.toString();
        
        // find location in string of the search parameter
        let positionStart = url.indexOf(name);
        if(positionStart === -1)
        {
            return null;
        }
        else
        {

            // find the first & mark after the search parameter is found
            let positionEnd = (url.substring(positionStart)).indexOf("&") + positionStart;

            // slice string section containing ID of parameter
            // slice starts after the search name within url and ends at the question mark
            return url.slice((positionStart+name.length), positionEnd);
        }
        
    
    }




});