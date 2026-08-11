const https = require('https');

module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  const { city } = req.query;
  if (!city) {
    res.status(400).json({ message: 'City is required' });
    return;
  }

  const apiKey = process.env.OPENWEATHER_API_KEY || '750f43b2d0eb991a1ccf0e59311c4f49';
  const url = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(city)}&appid=${apiKey}&units=metric`;

  https.get(url, (response) => {
    let data = '';

    response.on('data', (chunk) => {
      data += chunk;
    });

    response.on('end', () => {
      try {
        const parsed = JSON.parse(data);
        if (response.statusCode >= 400) {
          res.status(response.statusCode).json(parsed);
          return;
        }
        res.status(200).json(parsed);
      } catch (error) {
        res.status(500).json({ message: 'Failed to parse weather response' });
      }
    });
  }).on('error', () => {
    res.status(500).json({ message: 'Failed to fetch weather data' });
  });
};
