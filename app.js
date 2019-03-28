const express = require('express')
const mustacheExpress = require('mustache-express')
const bodyParser = require('body-parser')
var session = require('express-session')
const app = express()

app.use(session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: true
  }))

app.use(bodyParser.urlencoded({ extended: false }))

app.engine('mustache',mustacheExpress())
app.set('views','./views')
app.set('view engine','mustache')

let trips = []
let users = []
let persistedUser = {}

app.get('/',(req,res) => {
    res.render('index')
  })

app.get('/add-trip',(req,res) => {
res.render("add-trip", {tripList: persistedUser.userTrips})
})

app.get('/register', (req,res) => {
    res.render('register')
})

app.get('/login',(req,res) => {
    res.render('login')
})

app.get('/logout',(req,res) =>{
    res.render('logout')
})

app.post('/register', (req, res) => {
    let username = req.body.username
    let password = req.body.password

    let user = {username: username, password: password, userTrips: []}
    users.push(user)

    res.redirect('login')
})

app.post('/login',(req,res) => {

    let username = req.body.username
    let password = req.body.password
  
    persistedUser = users.find((user) => {
      return user.username == username && user.password == password
    })
  
    if(persistedUser) {
      // save username to the session
      if(req.session){
          req.session.username = persistedUser.username
          res.redirect('/')
      }
  
    } else {
      res.render('login',{message: 'Invalid Credentials!!'})
    }
  console.log(persistedUser)
  })

app.post('/add-trip',(req,res) => {

    let tripID = guid()

    let location = req.body.destination
    let image = req.body.image
    let departure = req.body.departure
    let returnDate = req.body.returnDate
  
    let trip = ({location: location, image: image, departure: departure, returnDate: returnDate, tripID: tripID})
   
   persistedUser.userTrips.push(trip)
  
    res.render('all-trips',{tripList: persistedUser.userTrips})
    console.log(persistedUser)
})

function guid(length) {
        if (!length) {
            length = 8
        }
        var str = ''
        for (var i = 1; i < length + 1; i = i + 8) {
            str += Math.random().toString(36).substr(2, 10)
        }
        return ('_' + str).substr(0, length)
}


    app.post('/logout', function(req, res, next) {
        if (req.session) {
          req.session.destroy(function(err) {
            if(err) {
              return next(err);
            } else {
              return res.redirect('/login');
            }
          });
        }
      })
 

app.post('/delete-trip',(req,res) => {
    let deleteTrip = req.body.tripID

    persistedUser.userTrips = persistedUser.userTrips.filter(function(trip) {
        return trip.tripID != deleteTrip
    })
    res.render('all-trips',{tripList: persistedUser.userTrips})
})  

app.get('/all-trips',(req,res) => {
    res.render('all-trips')
})

app.listen(3000,() => {
    console.log("Server is running...")
  })