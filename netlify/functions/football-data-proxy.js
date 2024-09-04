const axios = require('axios');

exports.handler = async function(event, context) {
  const API_KEY = process.env.FOOTBALL_DATA_API_KEY;
  const BASE_URL = 'https://api.football-data.org/v4';

  try {
    const response = await axios({
      method: event.httpMethod,
      url: `${BASE_URL}${event.path.replace('/api', '')}`,
      headers: {
        'X-Auth-Token': API_KEY
      }
    });

    return {
      statusCode: 200,
      body: JSON.stringify(response.data)
    };
  } catch (error) {
    return {
      statusCode: error.response?.status || 500,
      body: JSON.stringify(error.response?.data || {})
    };
  }
};