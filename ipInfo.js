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

// Create a cache for storing IP information with a TTL of 1 hour.
const myIpCache = new NodeCache({ stdTTL: 60 * 60 });

// Create a cache using NodeCache for the 'mycountrycode' endpoint.
const myCountryCache = new NodeCache({ stdTTL: 60 * 60 });

// Create a cache using NodeCache for common country info.
const commonCountryCache = new NodeCache({ stdTTL: 60 * 60 });

/**
 * Function to fetch the country code based on the IP address.
 * @param {string} ipAddress - The IP address to fetch the country code for.
 * @returns {Promise<string|null>} - A Promise that resolves to the country code or null if not found.
 */
async function getCountryCode(ipAddress) {
  try {
    // Check the cache for the IP address.
    const cachedCountry = myCountryCache.get(ipAddress);

    if (cachedCountry) {
      return cachedCountry;
    } else {
      // First, try to fetch city info from https://ipapi.co
      const ipapiResponse = await axios.get(`https://ipapi.co/${ipAddress}/country`, requestOptions);

      if (ipapiResponse.status === 200 && ipapiResponse.data) {
        // Cache the city info.
        myCountryCache.set(ipAddress, ipapiResponse.data);
        return ipapiResponse.data;
      }

      // If ipapi.co request fails, try to fetch city info from https://ipinfo.io
      const ipinfoResponse = await axios.get(`https://ipinfo.io/${ipAddress}/country`, requestOptions);

      if (ipinfoResponse.status === 200 && ipinfoResponse.data) {
        // Cache the city info.
        myCountryCache.set(ipAddress, ipinfoResponse.data);
        return ipinfoResponse.data;
      }

      // If both requests fail, return null
      return null;
    }
  } catch (error) {
    console.error(error);
    return null;
  }
}

/**
 * Function to retrieve country information based on the alpha code.
 * @param {string} alphaCode - The alpha code of the country to fetch information for.
 * @returns {Promise<Object|null>} - A Promise that resolves to the country information object or null if not found.
 */
async function getCountryInfo(alphaCode) {
  try {
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

/**
 * Function to retrieve the client's IP address.
 * @param {Object} req - The Express.js request object.
 * @returns {Promise<string>} - A Promise that resolves to the client's IP address.
 */
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

/**
 * Function to determine if an IP address is local (localhost or a connected local network).
 * @param {string} ipAddress - The IP address to check.
 * @returns {boolean} - Returns true if the IP is local, otherwise false.
 */
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

/**
 * Function to fetch IP information including city, region, country, postal, timezone, and org.
 * @param {string} ipAddress - The IP address to fetch information for.
 * @returns {Promise<Object|null>} - A Promise that resolves to the IP information object or null if not found.
 */
async function getIpInfo(ipAddress) {
  try {
    // Check the cache for the IP address.
    const cachedIp = myIpCache.get(ipAddress);

    if (cachedIp) {
      return cachedIp;
    }

    // First, try to fetch IP info from https://ipinfo.io
    const ipinfoResponse = await axios.get(`https://ipinfo.io/${ipAddress}/json`, requestOptions);
    let data;

    if (ipinfoResponse.status === 200 && ipinfoResponse.data) {
      // Cache the IP info.
      data = ipinfoResponse.data;
    }

    // If ipinfo.io request fails, try to fetch IP info from https://ipapi.co
    const ipapiResponse = await axios.get(`https://ipapi.co/${ipAddress}/json`, requestOptions);

    if (ipapiResponse.status === 200 && ipapiResponse.data) {
      // Cache the IP info.
      data = ipapiResponse.data;
    }
	
	const response = {
      ip: ipAddress,
      city: data.city,
      region: data.region,
      country: data.country,
      postal: data.postal,
      timezone: data.timezone,
      org: data.org
    };

    myIpCache.set(ipAddress, response);

    return response;
  } catch (error) {
    console.error(error);
    return null;
  }
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
app.get('/mycountry', async (req, res) => {
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
    const response = await getIpInfo(ipAddress);

    res.json(response);
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
