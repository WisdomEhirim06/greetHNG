const express = require('express');
const axios = require('axios');
const app = express();
const port = process.env.PORT || 3000;

app.get('/api/hello', async (req, res) => {
    const visitorName = req.query.visitor_name;

    // Get client's IP address
    const clientIp = req.headers['x-forwarded-for'] || req.connection.remoteAddress;

    try {
        // Fetch client's location using IP address
        const ipInfo = await axios.get(`https://ipinfo.io/${clientIp}/json?token=YOUR_IPINFO_TOKEN`);
        const city = ipInfo.data.city;

        // Fetch the current temperature
        const weatherResponse = await axios.get(`https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=YOUR_OPENWEATHERMAP_API_KEY`);
        const temperature = weatherResponse.data.main.temp;

        res.json({
            client_ip: clientIp,
            location: city,
            greeting: `Hello, ${visitorName}!, the temperature is ${temperature} degrees Celsius in ${city}`
        });
    } catch (error) {
        res.status(500).json({ error: 'Something went wrong!' });
    }
});

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
})