// Initialize EmailJS with your Service ID
emailjs.init('service_tqhn6bk');

// Mock user credentials (replace with your actual authentication logic)
const users = [
    { username: 'admin', password: 'password123' },
    { username: 'user', password: 'password456' }
];

// Function to simulate login authentication
function authenticate(username, password) {
    return users.find(user => user.username === username && user.password === password);
}

// Function to fetch weather data
function fetchWeatherData() {
    const apiKey = '918d4762593f410095f10042240207'; // Your OpenWeatherMap API key
    const city = 'Kelowna';
    const countryCode = 'CA';
    const apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city},${countryCode}&appid=${apiKey}`;

    return fetch(apiUrl)
        .then(response => response.json())
        .then(data => {
            return {
                weatherDescription: data.weather[0].description,
                temperature: data.main.temp,
                humidity: data.main.humidity
            };
        })
        .catch(error => {
            console.error('Error fetching weather data:', error);
            return null;
        });
}

// Function to send weather alert email
function sendWeatherAlertEmail(weatherDescription, temperature, humidity) {
    const params = {
        to_email: 'evan.degroot.network@outlook.com', // Update with recipient's email address
        from_name: 'Weather Alert Service',
        message: `
            Weather Alert for Kelowna, BC:
            Description: ${weatherDescription}
            Temperature: ${temperature} K
            Humidity: ${humidity}%
        `
    };

    // Send email using EmailJS
    emailjs.send('service_tqhn6bk', 'template_590983g', params)
        .then(function(response) {
            console.log('Email sent:', response);
            alert('Weather alert email sent successfully!');
        }, function(error) {
            console.error('Error sending email:', error);
            alert('Failed to send weather alert email. Please try again later.');
        });
}

// Login form submission
const loginForm = document.getElementById('loginForm');

loginForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const username = loginForm['username'].value;
    const password = loginForm['password'].value;

    // Simulate authentication (replace with actual logic)
    const authenticatedUser = authenticate(username, password);

    if (authenticatedUser) {
        // Redirect to control panel upon successful login
        window.location.href = 'control-panel.html';
    } else {
        alert('Invalid credentials. Please try again.');
    }
});

// Control panel page functionality
if (window.location.pathname === '/control-panel.html') {
    // Fetch weather data and display on control panel
    fetchWeatherData().then(weatherData => {
        if (weatherData) {
            const weatherDataElement = document.getElementById('weather-data');
            weatherDataElement.innerHTML = `
                <p><strong>Description:</strong> ${weatherData.weatherDescription}</p>
                <p><strong>Temperature:</strong> ${weatherData.temperature} K</p>
                <p><strong>Humidity:</strong> ${weatherData.humidity}%</p>
            `;
        }
    });

    // Send weather alert email button click handler
    document.getElementById('sendWeatherAlert').addEventListener('click', async () => {
        const weatherData = await fetchWeatherData();
        if (weatherData) {
            sendWeatherAlertEmail(weatherData.weatherDescription, weatherData.temperature, weatherData.humidity);
        }
    });

    // Sign out button click handler
    document.getElementById('signOut').addEventListener('click', () => {
        // Redirect to login page upon sign out
        window.location.href = 'index.html';
    });
}
