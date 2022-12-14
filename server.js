const express = require('express')
const mongoose = require('mongoose')
const bodyParser = require('body-parser')
const passport = require('passport')

// Routes
const users = require('./routes/api/user')
const profile = require('./routes/api/profile')
const posts = require('./routes/api/posts')

const app = express()
const port = process.env.PORT || 5000

// Body parser middleware
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

// Passport middleware
app.use(passport.initialize())

// Passport config Strategy
require('./config/passport')(passport)

// DB config
const db = require('./config/keys').mongoURI

//Connect to MongoDB
mongoose
  .connect(db)
  .then(() => console.log('MongoDB Connected'))
  .catch(err => console.log(err))

app.get('/', (req, res) => res.send('Hello'))

//Use routes 
app.use('/api/users', users)
app.use('/api/profile', profile)
app.use('/api/posts', posts)

app.listen(port, () => console.log(`Server running on port ${port}`))

