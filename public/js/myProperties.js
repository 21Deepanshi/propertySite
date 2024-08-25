// document.addEventListener('DOMContentLoaded', function () {

//     const propertyForm = document.getElementById('propertyForm');
//     const propertiesDiv = document.getElementById('properties');
//     const addPropertyOuterDiv = document.getElementById('addNewPropertyOuterDiv');
//     const cancelAddPropertyButton = document.getElementById('cancelAddProperty');
//     const openAddPropertyDiv = document.getElementById('openAddPropertyDiv');
//     const addNewPropertyButton = document.getElementById('addNewPropertyButton');

//     let editIndex = -1; // Index of property being edited

//     displayProperties();

//     // function to open add property div
//     openAddPropertyDiv.addEventListener('click', function () {
//         openAddPropertyDiv.style.display = 'none';
//         addNewPropertyButton.value = 'Add Property';
//         addPropertyOuterDiv.style.display = 'block';
//         resetForm();
//         addPropertyOuterDiv.scrollIntoView({behavior: 'smooth'});
//         editIndex = -1; // Reset edit mode
//     });
    
//     // function to close add property div
//     cancelAddPropertyButton.addEventListener('click', closeAddProperty);

//     function closeAddProperty() {
//         addPropertyOuterDiv.style.display = 'none';
//         openAddPropertyDiv.style.display = 'block';
//     }
    
//     propertyForm.addEventListener('submit', function (e) {
//         e.preventDefault();
//         saveProperty();
//         openAddPropertyDiv.style.display = 'block';
//     });

//     async function saveProperty() {
//         const name = document.getElementById('propertyNameInput').value;
//         const address = document.getElementById('propertyAddressInput').value;
//         const city = document.getElementById('propertyCityInput').value;
//         const province = document.getElementById('propertyProvinces').value;
//         const area = document.getElementById('propertAreaInput').value;
//         const type = document.getElementById('propertyTypeInput').value;
//         const capacity = document.getElementById('propertyMaxOccupancyInput').value;
//         const parking = document.querySelector('input[name="parking"]:checked')?.value === 'yes';
//         const publicTransport = document.querySelector('input[name="transport"]:checked')?.value === 'yes';
//         const availability = document.querySelector('input[name="availability"]:checked')?.value === 'yes';
//         const rentalTerm = document.getElementById('rentalTermSelect').value;
//         const price = document.getElementById('propertyPriceInput').value;
//         const imageFile = document.getElementById('propertyImageInput').files[0]; // Get the image file
//         const userId = null; // Assuming userId is filled server-side by a cookie
//         let propertyId = Date.now();
//                 if(editIndex > -1)
//         {
//             // since we are editing a property the propertyId can be updated to the editIndex which now updates to the propertyId of the property being edited.
//             propertyId = parseInt(editIndex);

//         }
//         // now when we create the "new" property if it was an edit the propertyId will be unchanged.
//         const property = {
//             name, address, city, province, area, type, capacity, parking, publicTransport, availability, rentalTerm, price, imageFile, userId, propertyId
//         };

//         if (editIndex > -1) 
//         {
//             propertyId = parseInt(editIndex);
//             await fetch('/myProperties', {
//                 method: 'PUT',
//                 headers: {
//                     'Content-Type': 'application/json'
//                 },
//                 body: JSON.stringify(property)
//             })
//             .then(response => {

//                 // once client has received "OK" status re-display myProperty data
//                 if(response.status === 201)
//                 {
//                     //display Properties again
//                     resetForm();
//                     closeAddProperty();
//                     displayProperties();
//                 }
//                 // https://www.reddit.com/r/reactjs/comments/14j76b4/is_there_a_way_to_get_the_text_from/
//                 else if (response.status === 400)
//                 {
//                     response.text()
//                     .then(json => {
//                         alert(json);
//                     });
//                 }


                
//             })
//             .catch(error => {
                
//                 console.error('Error: Updating Property was unsuccessful.' + error);

//             });

//         } else 
//         {
//             await fetch('/myProperties', {
//                 method: 'POST',
//                 headers: {
//                     'Content-Type': 'application/json'
//                 },
//                 body: JSON.stringify(property)
//             })
//             .then(response => {

//                 if(response.status === 201)
//                 {
//                     //display Properties again
//                     resetForm();
//                     closeAddProperty();
//                     displayProperties();
//                 }
//             })
//             .catch(error => console.error('Error: Adding Property was unsuccessful.' + error));
           
//         }
//     }

//     function displayProperties() {
//         propertiesDiv.innerHTML = '';

//         fetch(`/myPropertiesData`)
//             .then(response => response.json())
//             .then(properties => {
//                 properties.forEach((property) => {
//                     const propertyDiv = document.createElement('div');
//                     propertyDiv.classList.add('innerPageContent3', 'dynamicallyCreatedDiv');
//                     propertyDiv.innerHTML = `
//                         <h2>${property.name}</h2>
//                         <p>${property.address}</p>
//                         <p>${property.city} ${property.province}</p>
//                         <p>${property.area} sq Meters, Max Occupants: ${property.capacity}</p>
//                         <p>Parking: ${property.parking ? 'Yes' : 'No'}</p>
//                         <p>Public Transport: ${property.publicTransport ? 'Yes' : 'No'}</p>
//                         <div>
//                             <p>Type: ${property.type}</p>
//                         </div>
//                         <div>
//                             <p>$${property.price} - ${property.rentalTerm}</p>
//                             <p>${property.availability ? 'Available Now' : 'Not Available'}</p>
//                         </div>  
//                         ${property.image ? `<img src="${property.image}" alt="Property Image" style="max-width: 100%; height: auto;">` : ''}
//                         <button class="edit-button standardButton" propertyId="${property.propertyId}">Edit</button>
//                         <button class="remove-button standardButton" propertyId="${property.propertyId}">Remove</button>
//                     `;
//                     propertiesDiv.appendChild(propertyDiv);
//                 });

//                 document.querySelectorAll('.edit-button').forEach((button) => {
//                     button.addEventListener('click', function () {
//                         editIndex = this.getAttribute('propertyId');
//                         populateForm(properties.find(p => p.propertyId == editIndex));
//                         addPropertyOuterDiv.style.display = 'block';
//                         openAddPropertyDiv.style.display = 'none';
//                         addNewPropertyButton.value = "Edit Property";
//                         addPropertyOuterDiv.scrollIntoView({behavior: 'smooth'});
//                     });
//                 });

//                 document.querySelectorAll('.remove-button').forEach(button => {
//                     button.addEventListener('click', function () {
//                         deleteProperty(this.getAttribute('propertyId'));
//                     });
//                 });
//             })
//             .catch(error => console.error('Error fetching data ' + error));
//     }

//     async function deleteProperty(propertyId) {
//         if (confirm('Are you sure you want to permanently delete this property?')) {
//             const response = await fetch(`/myProperties/${propertyId}`, { method: 'DELETE' });

//             if (response.ok) {
//                 alert('Property deleted successfully.');
//                 displayProperties();
//             } else {
//                 const errorText = await response.text();
//                 alert(`Error: ${errorText}`);
//             }
//         }
//     }

//     function resetForm() {
//         document.getElementById('propertyNameInput').value = '';
//         document.getElementById('propertyAddressInput').value = '';
//         document.getElementById('propertyCityInput').value = '';
//         document.getElementById('propertyProvinces').value = '';
//         document.getElementById('propertAreaInput').value = '';
//         document.getElementById('propertyTypeInput').value = '';
//         document.getElementById('propertyMaxOccupancyInput').value = '';
//         document.querySelectorAll('input[name="parking"]').forEach(radio => radio.checked = false);
//         document.querySelectorAll('input[name="transport"]').forEach(radio => radio.checked = false);
//         document.querySelectorAll('input[name="availability"]').forEach(radio => radio.checked = false);
//         document.getElementById('rentalTermSelect').value = '';
//         document.getElementById('propertyPriceInput').value = '';
//     }

//     function populateForm(property) {
//         document.getElementById('propertyNameInput').value = property.name;
//         document.getElementById('propertyAddressInput').value = property.address;
//         document.getElementById('propertyCityInput').value = property.city;
//         document.getElementById('propertyProvinces').value = property.province;
//         document.getElementById('propertAreaInput').value = property.area;
//         document.getElementById('propertyTypeInput').value = property.type;
//         document.getElementById('propertyMaxOccupancyInput').value = property.capacity;
//         document.querySelector(`input[name="parking"][value="${property.parking ? 'yes' : 'no'}"]`).checked = true;
//         document.querySelector(`input[name="transport"][value="${property.publicTransport ? 'yes' : 'no'}"]`).checked = true;
//         document.querySelector(`input[name="availability"][value="${property.availability ? 'yes' : 'no'}"]`).checked = true;
//         document.getElementById('rentalTermSelect').value = property.rentalTerm;
//         document.getElementById('propertyPriceInput').value = property.price;
//     }
// });

document.addEventListener('DOMContentLoaded', function () {

    const propertyForm = document.getElementById('propertyForm');
    const propertiesDiv = document.getElementById('properties');
    const addPropertyOuterDiv = document.getElementById('addNewPropertyOuterDiv');
    const cancelAddPropertyButton = document.getElementById('cancelAddProperty');
    const openAddPropertyDiv = document.getElementById('openAddPropertyDiv');
    const addNewPropertyButton = document.getElementById('addNewPropertyButton');

    let editIndex = -1; // Index of property being edited

    displayProperties();

    // Function to open add property div
    openAddPropertyDiv.addEventListener('click', function () {
        openAddPropertyDiv.style.display = 'none';
        addNewPropertyButton.value = 'Add Property';
        addPropertyOuterDiv.style.display = 'block';
        resetForm();
        addPropertyOuterDiv.scrollIntoView({behavior: 'smooth'});
        editIndex = -1; // Reset edit mode
    });
    
    // Function to close add property div
    cancelAddPropertyButton.addEventListener('click', closeAddProperty);

    function closeAddProperty() {
        addPropertyOuterDiv.style.display = 'none';
        openAddPropertyDiv.style.display = 'block';
    }
    
    propertyForm.addEventListener('submit', async function (e) {
        e.preventDefault();
        await saveProperty();
        openAddPropertyDiv.style.display = 'block';
    });

    async function saveProperty() {
        
        const name = document.getElementById('propertyNameInput').value;
        const address = document.getElementById('propertyAddressInput').value;
        const city = document.getElementById('propertyCityInput').value;
        const province = document.getElementById('propertyProvinces').value;
        const area = document.getElementById('propertAreaInput').value;
        const type = document.getElementById('propertyTypeInput').value;
        const capacity = document.getElementById('propertyMaxOccupancyInput').value;
        const parking = document.querySelector('input[name="parking"]:checked')?.value === 'yes';
        const publicTransport = document.querySelector('input[name="transport"]:checked')?.value === 'yes';
        const availability = document.querySelector('input[name="availability"]:checked')?.value === 'yes';
        const rentalTerm = document.getElementById('rentalTermSelect').value;
        const price = document.getElementById('propertyPriceInput').value;
        const imageFile = document.getElementById('propertyImageInput').files[0]; // Get the image file
        const userId = null; // Assuming userId is filled server-side by a cookie
        let propertyId = Date.now();
        if (editIndex > -1) {
            propertyId = parseInt(editIndex);
        }

        const property = {
            name,
            address,
            city,
            province,
            area,
            type,
            capacity,
            parking,
            publicTransport,
            availability,
            rentalTerm,
            price,
            // imageFileName: '', // Leave empty for now
            imageFileName: imageFile ? imageFile.name : '', // Save image file name
            userId,
            propertyId
        };

        // Handle image file upload
        if (imageFile) {
            const formData = new FormData();
            formData.append('image', imageFile);
            await fetch('/uploadImage', {
                method: 'POST',
                body: formData
            })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    // Image uploaded successfully
                    // property.imageFileName = data.filename; // Use the unique filename
                    displayImage(data.filename);
                    console.log('Image uploaded successfully.');
                    // const imageUrl = `/uploads/${data.filename}`; //change uploads to images(img)
                } else {
                    throw new Error('Image upload failed.');
                }
            })
            .catch(error => console.error('Error: ' + error));
        }

        if (editIndex > -1) {
            await fetch('/myProperties', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(property)
            })
            .then(response => {
                if (response.status === 201) {
                    resetForm();
                    closeAddProperty();
                    displayProperties();
                } else if (response.status === 400) {
                    response.text().then(json => alert(json));
                }
            })
            .catch(error => console.error('Error: Updating Property was unsuccessful.' + error));
        } else {
            await fetch('/myProperties', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(property)
            })
            .then(response => {
                if (response.status === 201) {
                    resetForm();
                    closeAddProperty();
                    displayProperties();
                }
            })
            .catch(error => console.error('Error: Adding Property was unsuccessful.' + error));
        }
    }

    function displayProperties() {
        propertiesDiv.innerHTML = '';

        fetch(`/myPropertiesData`)
            .then(response => response.json())
            .then(properties => {
                properties.forEach((property) => {
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
                            <p>Type: ${property.type}</p>
                        </div>
                        <div>
                            <p>$${property.price} - ${property.rentalTerm}</p>
                            <p>${property.availability ? 'Available Now' : 'Not Available'}</p>
                        </div>
                        ${property.imageFileName ? `<img src="/uploads/${property.imageFileName}" alt="Property Image" style="max-width: 100%; height: auto;">` : ''}
                        <button class="edit-button standardButton" propertyId="${property.propertyId}">Edit</button>
                        <button class="remove-button standardButton" propertyId="${property.propertyId}">Remove</button>
                    `;
                    propertiesDiv.appendChild(propertyDiv);
                });

                document.querySelectorAll('.edit-button').forEach((button) => {
                    button.addEventListener('click', function () {
                        editIndex = this.getAttribute('propertyId');
                        populateForm(properties.find(p => p.propertyId == editIndex));
                        addPropertyOuterDiv.style.display = 'block';
                        openAddPropertyDiv.style.display = 'none';
                        addNewPropertyButton.value = "Edit Property";
                        addPropertyOuterDiv.scrollIntoView({behavior: 'smooth'});
                    });
                });

                document.querySelectorAll('.remove-button').forEach(button => {
                    button.addEventListener('click', function () {
                        deleteProperty(this.getAttribute('propertyId'));
                    });
                });
            })
            .catch(error => console.error('Error fetching data ' + error));
    }

    async function deleteProperty(propertyId) {
        if (confirm('Are you sure you want to permanently delete this property?')) {
            const response = await fetch(`/myProperties/${propertyId}`, { method: 'DELETE' });

            if (response.ok) {
                alert('Property deleted successfully.');
                displayProperties();
            } else {
                const errorText = await response.text();
                alert(`Error: ${errorText}`);
            }
        }
    }

    function resetForm() {
        document.getElementById('propertyNameInput').value = '';
        document.getElementById('propertyAddressInput').value = '';
        document.getElementById('propertyCityInput').value = '';
        document.getElementById('propertyProvinces').value = '';
        document.getElementById('propertAreaInput').value = '';
        document.getElementById('propertyTypeInput').value = '';
        document.getElementById('propertyMaxOccupancyInput').value = '';
        document.querySelectorAll('input[name="parking"]').forEach(radio => radio.checked = false);
        document.querySelectorAll('input[name="transport"]').forEach(radio => radio.checked = false);
        document.querySelectorAll('input[name="availability"]').forEach(radio => radio.checked = false);
        document.getElementById('rentalTermSelect').value = '';
        document.getElementById('propertyPriceInput').value = '';
        document.getElementById('propertyImageInput').value = ''; // Clear image input
    }

    function populateForm(property) {
        document.getElementById('propertyNameInput').value = property.name;
        document.getElementById('propertyAddressInput').value = property.address;
        document.getElementById('propertyCityInput').value = property.city;
        document.getElementById('propertyProvinces').value = property.province;
        document.getElementById('propertAreaInput').value = property.area;
        document.getElementById('propertyTypeInput').value = property.type;
        document.getElementById('propertyMaxOccupancyInput').value = property.capacity;
        document.querySelector(`input[name="parking"][value="${property.parking ? 'yes' : 'no'}"]`).checked = true;
        document.querySelector(`input[name="transport"][value="${property.publicTransport ? 'yes' : 'no'}"]`).checked = true;
        document.querySelector(`input[name="availability"][value="${property.availability ? 'yes' : 'no'}"]`).checked = true;
        document.getElementById('rentalTermSelect').value = property.rentalTerm;
        document.getElementById('propertyPriceInput').value = property.price;
        document.getElementById('propertyImageInput').value = ''; // No need to set image input
    }

    //display image
    function displayImage(imageFileName) {
        const imageUrl = `/uploads/${imageFileName}`; // Construct the image URL
        console.log("Image URL: ", imageUrl); // Debug: log the image URL
        const imgElement = document.createElement('img');
        imgElement.src = imageUrl;
        imgElement.alt = "Uploaded Image";
        imgElement.style.maxWidth = '100%';
        imgElement.style.height = 'auto';
        
        const imageContainer = document.getElementById('imageContainer');
        imageContainer.appendChild(imgElement); // Append the image to the container
    }
});


