const axios = require('axios');

exports.handler = async function(event, context) {
  console.log('Event:', JSON.stringify(event));
  console.log('Context:', JSON.stringify(context));
  const API_KEY = process.env.FOOTBALL_DATA_API_KEY;
  const BASE_URL = 'https://api.football-data.org/v4';

  try {
    const response = await axios({
      method: event.httpMethod,
      url: `${BASE_URL}${event.path.replace('/api', '')}`,
      params: event.queryStringParameters,
      headers: {
        'X-Auth-Token': API_KEY
      }
    });

    return {
      statusCode: 200,
      body: JSON.stringify(response.data)
    };
  } catch (error) {
    console.error('Proxy error:', error.response ? error.response.data : error.message);
    return {
      statusCode: error.response?.status || 500,
      body: JSON.stringify(error.response?.data || {})
    };
  }
};