const request = require('request');

const url = 'https://api.darksky.net/forecast/6138e559f7e067e66df761fdf35f1579/37.8267,-122.4233?units=si';

const forecast = (latitude, longitude, callback) => {
    const url = 'https://api.darksky.net/forecast/6138e559f7e067e66df761fdf35f1579/' + encodeURIComponent(latitude) + ',' + encodeURIComponent(longitude) + '?units=si';
    request({
        'url': url,
        'json': true
    }, (error, response) => {
        if (error) {
            callback("Unable to connect to weather service", undefined);
        } else if (response.body.error) {
            callback(undefined, {
                'error': response.body.error,
                'http_code': response.body.code
            });
        } else {
            callback(undefined, response.body.currently);
        }
    });
}

module.exports = forecast;