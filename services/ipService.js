const axios = require('axios');
// Use the 'request-ip' library middleware to easily retrieve client IP addresses.
const requestIp = require('request-ip');

function configure(app) {
    app.use(requestIp.mw());
}

async function getClientIp(req) {
    let ipAddress = requestIp.getClientIp(req);

    if (isLocalIp(ipAddress)) {
        const responses = await Promise.allSettled([
            axios.get(`https://api.ipify.org`),
            axios.get(`https://ipinfo.io/ip`)
        ]);

        for (let i = 0; i < responses.length; i++) {
            if (responses[i].status === "fulfilled") {
                ipAddress = responses[i].value.data;
                break;
            }
        }
    }

    return ipAddress;
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

module.exports = {
    configure,
    getClientIp
};