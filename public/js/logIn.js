// Sodv1201 Group project August 22, 2024 - Deepanshi, Kajal and Kailan
document.addEventListener('DOMContentLoaded', () => {

    document.getElementById('userLogInForm').addEventListener('submit', async function(event) {
        event.preventDefault();
    
        const userEmail = document.getElementById('userEmailLogIn').value.trim().toLowerCase();
    
        await loginUser(userEmail);
        
    });

});

// Handle login form submission


async function loginUser(email) {
    try {
        const response = await fetch('/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email})
        });
        

        const data = await response.json();
        if (data.success) {
            console.log('Logged in user email:', data.email);
            // Update UI and redirect
            window.location.href = '/'; // Redirect to the home page or dashboard
            
        } else {
            console.error('Login failed:', data.message);
            document.getElementById('logInFailedOutput').textContent = 'Login failed: ' + data.message;
        }
    } catch (error) {
        console.error('Error during login:', error);
    }

}





