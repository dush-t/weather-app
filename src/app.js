const path = require('path');
const express = require('express');
const hbs = require('hbs')

const forecast = require('./utils/forecast');
const geocode = require('./utils/geocode');

console.log(__dirname);
console.log(path.join(__dirname, '../public'));

const app = express();
const port = process.env.PORT || 3000;  // If no port variable is found in the environment.

// Define paths for Express config
const publicDirectoryPath = path.join(__dirname, '../public');
const viewsPath = path.join(__dirname, '../templates/views');
const partialsPath = path.join(__dirname, '../templates/partials');

// Setup handlebars engine and views location
app.set('view engine', 'hbs');
app.set('views', viewsPath);
hbs.registerPartials(partialsPath);

//  Setup static directory to serve
app.use(express.static(publicDirectoryPath));


app.get('', (req, res) => {

    res.render('index', {
        'title': 'Weather App',
        'name': 'Dushyant Yadav'
    });
});


app.get('/about', (req, res) => {

    res.render('about', {
        'title': 'About Me',
        'name': 'Dushyant Yadav'
    });
});


app.get('/help', (req, res) => {

    res.render('help', {
        'message': 'This is a help message right here',
        'title': 'Help',
        'name': 'Dushyant Yadav'
    });
});


app.get('/weather', (req, res) => {

    if (!req.query.address) {
        return res.send({
            'error': 'Please provide an address',
        })
    }

    geocode(req.query.address, (error, {latitude, longitude, location} = {}) => {
        if (error) {
            return res.send({
                'error': error
            });
        } else {
            forecast(latitude, longitude, (error, {temperature, precipProbability, error:dataError} = {}) => {
                if (error) {
                    res.send({
                        'error': error
                    });
                } else {
                    res.send({
                        'forecast': 'It is ' + temperature + ' degrees outside with ' + precipProbability + '% chance of rain',
                        'location': location,
                        'address': req.query.address,
                        'temperature': temperature,
                        'precipProbability': precipProbability
                    });
                }
            });
        }
    });
});


app.get('/products', (req, res) => {
    res.send({
        'products': []
    })
});



app.get('/help/*', (req, res) => {
    res.render('error404', {
        'title': 'It looks like a 404, sir',
        'message': 'Help article not found',
        'name': 'Dushyant Yadav'
    });
});

app.get('*', (req, res) => {
    res.render('error404', {
        'title': 'It looks like a 404, sir',
        'message': 'Page not found',
        'name': 'Dushyant Yadav'
    });
});

app.listen(port, () => {
    console.log('The server is online on port ' + port);
});