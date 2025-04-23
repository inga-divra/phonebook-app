const express = require('express')
const morgan = require('morgan')
const path = require('path')
const personsRouter = require('./controllers/persons')

const app = express()

// Middleware
app.use(express.json())

// Static files from dist
app.use(express.static(path.join(__dirname, 'dist')))

// Morgan for logs
morgan.token('body', (req) => JSON.stringify(req.body))
app.use(morgan('tiny'))
app.use(
  morgan(':method :url :status :res[content-length] - :response-time ms :body')
)

// Routes
app.use('/api/persons', personsRouter)

// Info route
const Person = require('./models/person')
app.get('/info', (req, res, next) => {
  Person.countDocuments({})
    .then((count) => {
      const date = new Date()
      res.send(`
        <p>Phonebook has info for ${count} people</p>
        <p>${date}</p>
      `)
    })
    .catch(next)
})

module.exports = app
