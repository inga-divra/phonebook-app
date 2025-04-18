require('dotenv').config()
const express = require('express')
const app = express()
const morgan = require('morgan')
const path = require('path')
const Person = require('./models/person')

// Middleware
app.use(express.json())

morgan.token('body', (req) => {
  return JSON.stringify(req.body)
})

// Serve static files from the 'dist' directory
app.use(express.static(path.join(__dirname, 'dist')))

app.use(morgan('tiny'))
app.use(
  morgan(':method :url :status :res[content-length] - :response-time ms :body')
)

// Get ALL PERSONS
app.get('/api/persons', (req, res) => {
  Person.find({}).then((persons) => {
    res.json(persons)
  })
})

// Create NEW PERSON/CONTACT
app.post('/api/persons', (req, res, next) => {
  const body = req.body

  if (!body.name) {
    return res.status(400).json({ error: 'name missing' })
  }

  if (!body.number) {
    return res.status(400).json({ error: 'number missing' })
  }

  const person = new Person({
    name: body.name,
    number: body.number
  })

  person
    .save()
    .then((savedPerson) => {
      res.json(savedPerson)
    })
    .catch((error) => next(error))
})

//UPDATE Person
app.put('/api/persons/:id', (req, res, next) => {
  const { name, number } = req.body

  Person.findById(req.params.id)
    .then((person) => {
      if (!person) {
        return res.status(404).end()
      }

      person.name = name
      person.number = number

      return person.save().then((updatedPerson) => {
        res.json(updatedPerson)
      })
    })
    .catch((error) => next(error))
})

//Get SINGLE PERSON
app.get('/api/persons/:id', (req, res, next) => {
  Person.findById(req.params.id)
    .then((person) => {
      if (person) {
        res.json(person)
      } else {
        res.status(404).end()
      }
    })
    .catch((error) => next(error))
})

//GET INFO
app.get('/info', (req, res, next) => {
  Person.countDocuments({})
    .then((personsTotal) => {
      const currentTime = new Date()
      res.send(`
        <p>Phonebook has info for ${personsTotal} people</p>
        <p>${currentTime}</p>
      `)
    })
    .catch((error) => next(error))
})

// DELETE Person/Contact
app.delete('/api/persons/:id', (req, res, next) => {
  Person.findByIdAndDelete(req.params.id)
    .then(() => {
      res.status(204).end()
    })
    .catch((error) => next(error))
})

// Middleware for handling errors
const errorHandler = (error, request, response, next) => {
  //console.error(error.message);

  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' })
  } else if (error.name === 'ValidationError') {
    return response.status(400).json({ error: error.message })
  }

  next(error)
}

app.use(errorHandler)

// Middleware for handling unknown endpoints
const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}
app.use(unknownEndpoint)

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
