const axios = require('axios');

exports.handler = async function(event, context) {
  console.log('Event:', JSON.stringify(event));
  console.log('Context:', JSON.stringify(context));
  const API_KEY = process.env.FOOTBALL_DATA_API_KEY;
  const BASE_URL = 'https://api.football-data.org/v4';

  try {
    const path = event.path.replace('/.netlify/functions/football-data-proxy', '');
    console.log('Making request to:', `${BASE_URL}${path}`);
    const response = await axios({
      method: event.httpMethod,
      url: `${BASE_URL}${path}`,
      params: event.queryStringParameters,
      headers: {
        'X-Auth-Token': API_KEY
      }
    });

    console.log('Proxy response status:', response.status);
    console.log('Proxy response headers:', response.headers);
    console.log('Proxy response data:', response.data);

    return {
      statusCode: 200,
      body: JSON.stringify(response.data)
    };
  } catch (error) {
    console.error('Proxy error:', error.response ? error.response.data : error.message);
    console.error('Full error object:', JSON.stringify(error, null, 2));
    return {
      statusCode: error.response?.status || 500,
      body: JSON.stringify({
        error: error.message,
        details: error.response?.data || {}
      })
    };
  }
};