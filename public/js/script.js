// Sodv1201 Group project August 22, 2024 - Deepanshi, Kajal and Kailan
document.addEventListener("DOMContentLoaded", () => {
    fetchProperties();

    let searchTab = document.getElementById("searchTab");
    let advancedSearchFilters = document.getElementById("advancedSearchFilters");

    // the search filters adjusts into a clickable icon for small screens so that it does not take up the entire view
    // here on mouseleave the filter window collapses into the small icon again
     advancedSearchFilters.addEventListener("mouseleave", function() {

        if(window.innerWidth <= 701)
        {
            {
                advancedSearchFilters.style.display = "none";
                advancedSearchFilters.style.position = "fixed";
                
            }
        }
    });
    
    searchTab.addEventListener("click", function() {
    
        
        advancedSearchFilters.style.display = "flex";
        advancedSearchFilters.style.position = "fixed";
    
    });

    // alert(window.innerWidth);
    window.onresize = displaySearchFilters;
    // brings the search window back if screen size is increased again.
    // I had a bug where after display was set to none through javascript it would no longer revert back based on screen size
    function displaySearchFilters()
    {
        // https://developer.mozilla.org/en-US/docs/Web/API/Window/innerWidth
        if(window.innerWidth > 701)
        {
            
            
            if(advancedSearchFilters.style.display === "none")
            {
                advancedSearchFilters.style.display = "flex";
                advancedSearchFilters.style.position = "absolute";
            }
        }
        else
        {
            if(advancedSearchFilters.style.display === "flex")
            {
                advancedSearchFilters.style.display = "none";
                advancedSearchFilters.style.position = "fixed";
            }
            
        }
    }



});



let allProperties = [];

function fetchProperties() {
    fetch('/properties')
        .then(response => response.json())
        .then(data => {
            allProperties = data;
            displayProperties(allProperties);
        })
        .catch(error => console.error("Error fetching properties:", error));
}

function displayProperties(properties) {
    const resultsContainer = document.getElementById('resultsContainer');
    resultsContainer.innerHTML = '';

    properties.forEach(property => {
        const propertyDiv = document.createElement('div');
        // create event listener to provide a link to view each property
        propertyDiv.addEventListener("click", function(){
            viewProperty(property.propertyId, property.userId)
        });
        // propertyDiv.classList.add('property-item');
        propertyDiv.classList.add('innerPageContent3', 'dynamicallyCreatedDiv', 'mouseHover');
        propertyDiv.innerHTML = `
            <h3>${property.name}</h3>
            <p>${property.address}, ${property.city}, ${property.province}</p>
            <div>
                <p>Type: ${property.type}</p>
            </div>
            <p>Area: ${property.area} sqft</p>
            <p>Capacity: ${property.capacity}</p>
            <p>Parking: ${property.parking ? 'Yes' : 'No'}</p>
            <p>Public Transport: ${property.publicTransport ? 'Yes' : 'No'}</p>
            <div>
                <p>Price: $${property.price} - ${property.rentalTerm}</p>
                <p>Availability: ${property.availability ? 'Available' : 'Unavailable'}</p>
            </div>
            
        `;
        resultsContainer.appendChild(propertyDiv);
    });
}

function viewProperty(propertyId, userId)
{
    window.location.href = "/viewProperty?propertyId=" + propertyId + "&";
}

function performSearch() {
    const searchInput = document.getElementById('searchInput').value.trim().toLowerCase();
    
    // Filter properties based on various fields
    const filteredProperties = allProperties.filter(property => 
        property.name.toLowerCase().includes(searchInput) ||
        property.address.toLowerCase().includes(searchInput) ||
        property.city.toLowerCase().includes(searchInput) ||
        property.province.toLowerCase().includes(searchInput) ||
        property.area.toLowerCase().includes(searchInput) ||
        property.type.toLowerCase().includes(searchInput) ||
        property.rentalTerm.toLowerCase().includes(searchInput) ||
        property.capacity.toLowerCase().includes(searchInput) ||
        (property.price && property.price.toLowerCase().includes(searchInput)) || // Adjust if price is a number
        (property.availability && property.availability.toString().toLowerCase().includes(searchInput)) // Adjust for boolean
    );
    
    displayProperties(filteredProperties);
}

//for update the price after sliding the values 
function updatePriceDisplay(value) {
    const priceDisplay = document.getElementById('priceDisplay');
    priceDisplay.textContent = `$${value}`;
}

//apply filter
function applyFilters() {
    // Retrieve filter values
    // const filterAvailability = document.getElementById('filterAvailability').value;
    // changed from .value to .checked
    const filterAvailabilityBoolean = document.getElementById('filterAvailability').checked;
    // const filterParking = document.getElementById('filterParking').value;
    // changed from .value to .checked
    const filterParkingBoolean = document.getElementById('filterParking').checked;

    // const filterTransport = document.getElementById('filterTransport').value;
    const filterTransportBoolean = document.getElementById('filterTransport').checked;

    const filterType = document.getElementById('filterType').value.toLowerCase();
    const filterAddress = document.getElementById('filterAddress').value.toLowerCase();
    const filterCity = document.getElementById('filterCity').value.toLowerCase();
    const filterProvince = document.getElementById('filterProvince').value.toLowerCase();
    const filterArea = document.getElementById('filterArea').value;
    const filterCapacity = document.getElementById('filterCapacity').value;
    const filterRentalTerm = document.getElementById('filterRentalTerm').value.toLowerCase();
    const filterPrice = document.getElementById('filterPrice').value;
    // Filter properties based on the selected filters
    const filteredProperties = allProperties.filter(property => {
        return (
            // change === from null to false
            (filterAvailabilityBoolean === false || property.availability === filterAvailabilityBoolean) &&
            // change === from null to false
            (filterParkingBoolean === false || property.parking === filterParkingBoolean) &&
            // change === from null to false
            (filterTransportBoolean === false || property.publicTransport === filterTransportBoolean) &&
            (filterType === "" || property.type.toLowerCase().includes(filterType)) &&
            (filterAddress === "" || property.address.toLowerCase().includes(filterAddress)) &&
            (filterCity === "" || property.city.toLowerCase().includes(filterCity)) &&
            (filterProvince === "" || property.province.toLowerCase().includes(filterProvince)) &&
            (filterArea === "" || property.area >= parseFloat(filterArea)) &&
            (filterCapacity === "" || property.capacity >= parseFloat(filterCapacity)) &&
            (filterRentalTerm === "" || property.rentalTerm.toLowerCase().includes(filterRentalTerm)) &&
            (filterPrice === "" || property.price <= parseFloat(filterPrice))
        );
    });

    // Display filtered properties
    displayProperties(filteredProperties);

    // NEED A METHOD FOR PHONE USERS -- Maybe an X appears on the window or instead of the magnifying glass to remove the window.********** 
    advancedSearchFilters.addEventListener("mouseleave", function() {

        if(window.innerWidth <= 701)
        {
            {
                advancedSearchFilters.style.display = "none";
                advancedSearchFilters.style.position = "fixed";
                
            }
        }
    });
    
    searchTab.addEventListener("click", function() {
    
        
        advancedSearchFilters.style.display = "flex";
        advancedSearchFilters.style.position = "fixed";
    
    });

    // alert(window.innerWidth);
    window.onresize = displaySearchFilters;
    // brings the search window back if screen size is increased again.
    // I had a bug where after display was set to none through javascript it would no longer revert back based on screen size
    function displaySearchFilters()
    {
        // https://developer.mozilla.org/en-US/docs/Web/API/Window/innerWidth
        if(window.innerWidth > 701)
        {
            
            
            if(advancedSearchFilters.style.display === "none")
            {
                advancedSearchFilters.style.display = "flex";
                advancedSearchFilters.style.position = "absolute";
            }
        }
        else
        {
            if(advancedSearchFilters.style.display === "flex")
            {
                advancedSearchFilters.style.display = "none";
                advancedSearchFilters.style.position = "fixed";
            }
            
        }
    }
}