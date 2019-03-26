const express = require('express')
const mustacheExpress = require('mustache-express')
const bodyParser = require('body-parser')
const app = express()

app.use(bodyParser.urlencoded({ extended: false }))

app.engine('mustache',mustacheExpress())
app.set('views','./views')
app.set('view engine','mustache')

let trips = []

app.get('/',(req,res) => {
    res.render('index')
  })

// app.get('/add-trip',(req,res) => {
// res.render("add-trip")
// })



app.post('/add-trip',(req,res) => {

    let tripID = guid()

    let location = req.body.destination
    let image = req.body.image
    let departure = req.body.departure
    let returnDate = req.body.returnDate
  
    let trip = { location: location, image: image, departure: departure, returnDate: returnDate, tripID: tripID}
    trips.push(trip)
  
    res.render('all-trips',{tripList: trips})
})

function guid(length) {
    // function (length) {
        if (!length) {
            length = 8
        }
        var str = ''
        for (var i = 1; i < length + 1; i = i + 8) {
            str += Math.random().toString(36).substr(2, 10)
        }
        return ('_' + str).substr(0, length)
    // }
}

 

app.post('/delete-trip',(req,res) => {
    let deleteTrip = req.body.tripID

    trips = trips.filter(function(trip) {
        return trip.tripID != deleteTrip
    })
    res.render('all-trips',{tripList: trips})
})  

app.get('/all-trips',(req,res) => {
    res.render('all-trips')
})

app.listen(3000,() => {
    console.log("Server is running...")
  })