// Import required libraries.
const express = require('express');
const https = require('https');
const axios = require('axios');
const NodeCache = require('node-cache');

// Create an Express.js application.
const app = express();
const port = process.env.PORT || 3000;

// Define HTTP request headers.
const headers = { 'User-Agent': 'ip-info-api' };

// Create an HTTPS agent to handle secure requests.
const httpsAgent = new https.Agent({
  rejectUnauthorized: false
});

// Set up request options with headers and HTTPS agent.
const requestOptions = { headers: headers, httpsAgent: httpsAgent };

// Use the 'request-ip' library middleware to easily retrieve client IP addresses.
const requestIp = require('request-ip');
app.use(requestIp.mw());

// Create a cache using NodeCache for the 'mycountrycode' endpoint.
const myCountryCache = new NodeCache({ stdTTL: 60 }); // Cache mycountry info for 60 seconds.

// Create a cache using NodeCache for common country info.
const commonCountryCache = new NodeCache({ stdTTL: 60 }); // Cache common country info for 60 seconds.

// Function to retrieve country information based on the alpha code.
async function getCountryInfo(alphaCode) {
  try {
    // Check if the alpha code is 'Locale' (for local IP).
    if (alphaCode === 'Locale') {
      return null;
    }

    // Check if the alpha code is exactly 2 characters long.
    if (alphaCode.length !== 2) {
      throw new Error('Invalid country code. Country code should be exactly 2 characters.');
    }

    // Check the cache for country info using the alpha code.
    const cachedCountryInfo = commonCountryCache.get(alphaCode);

    if (cachedCountryInfo) {
      return cachedCountryInfo;
    }

    // Fetch country info based on the alpha code.
    const response = await axios.get(`https://restcountries.com/v2/alpha/${alphaCode}`, requestOptions);

    const countryInfo = response.data;

    if (countryInfo) {
      // Cache the country info.
      commonCountryCache.set(alphaCode, countryInfo);
    } else {
      throw new Error('Invalid response from the country info API');
    }

    return countryInfo;
  } catch (error) {
    console.error(error);
    return null;
  }
}

// Function to retrieve the client's IP address.
async function getClientIp(req) {
  if (req.headers['x-forwarded-for']) {
    const useReverseProxy = req.query.reverseProxy === 'true';
    const ips = req.headers['x-forwarded-for'].split(',');
    return ips[useReverseProxy ? ips.length - 1 : 0].trim();
  } else if (req.headers['x-real-ip']) {
    return req.headers['x-real-ip'];
  } else {
    // If the client IP is local, fetch the public IP using api.ipify.org.
    if (isLocalIp(req.clientIp)) {
      try {
        const response = await axios.get('https://api.ipify.org?format=json', requestOptions);

        if (response.data && response.data.ip) {
          return response.data.ip;
        }
      } catch (error) {
        console.error('Error fetching public IP:', error.message);
      }
    }

    return req.clientIp;
  }
}

// Function to determine if an IP address is local (localhost or a connected local network).
function isLocalIp(ipAddress) {
  if (
    ipAddress === '127.0.0.1' ||
    ipAddress === '0.0.0.0' ||
    ipAddress.startsWith('192.168.') ||
    ipAddress.startsWith('10.') ||
    ipAddress.startsWith('172.')
  ) {
    return true;
  }

  if (ipAddress === '::1' || ipAddress === '::ffff:127.0.0.1') {
    return true;
  }

  return false;
}

// Endpoint to retrieve the client's country code.
app.get('/mycountrycode', async (req, res) => {
  try {
    const ipAddress = await getClientIp(req);
    const response = await getCountryCode(ipAddress);
    res.send(response);
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
});

// Endpoint to retrieve the client's country info.
app.get('/mycountryinfo', async (req, res) => {
  try {
    const ipAddress = await getClientIp(req);
    const countryCode = await getCountryCode(ipAddress);
    const response = await getCountryInfo(countryCode);
    res.json(response);
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
});

// Endpoint to retrieve the public IP address of the client.
app.get('/myip', async (req, res) => {
  try {
    const ipAddress = await getClientIp(req);
    res.send(ipAddress);
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
});

// Endpoint to retrieve IP details including country code and country info.
app.get('/mydetails', async (req, res) => {
  try {
    const ipAddress = await getClientIp(req);
    const countryCode = await getCountryCode(ipAddress);
    const countryInfo = await getCountryInfo(countryCode);

    res.json({
      ip: ipAddress,
      countryCode: countryCode,
      countryInfo: countryInfo
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Endpoint to retrieve country information by alpha code.
app.get('/country/:alphaCode', async (req, res) => {
  try {
    const alphaCode = req.params.alphaCode;

    // Use the alpha code to fetch country information.
    const countryInfo = await getCountryInfo(alphaCode);

    if (!countryInfo) {
      res.status(404).json({ error: 'Country info not found' });
      return;
    }

    res.json(countryInfo);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Start the Express.js server.
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
