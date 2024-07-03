// Imports express and axios

const express = require('express');
const axios = require('axios');
const app = express();
const port = process.env.PORT || 3000;

// Route handler for GET requests to /api/hello
app.get('/api/hello', async (req, res) => {
    const visitorName = req.query.visitor_name;

    // Get client's IP address
    const clientIp = req.headers['x-forwarded-for'] || req.connection.remoteAddress;

    try {
        // Fetch client's location using IP address, got the address from IPinfo
        const ipInfo = await axios.get(`https://ipinfo.io/${clientIp}/json?token=5c3b85188c8028`);
        const city = ipInfo.data.city;

        // Fetch the current temperature, which i got from openweatherapi
        const weatherResponse = await axios.get(`https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=6534dc76151e04da24653f8e55d0056f`);
        const temperature = weatherResponse.data.main.temp;

        res.json({
            client_ip: clientIp,
            location: city,
            greeting: `Hello, ${visitorName}!, the temperature is ${temperature} degrees Celcius in ${city}`
        });
    } catch (error) {
        res.status(500).json({ error: 'Something went wrong!' });
    }
});

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
})