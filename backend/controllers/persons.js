const personsRouter = express.Router()
const Person = require('../models/person')

// Get ALL PERSONS
personsRouter.get('/', (req, res) => {
  Person.find({}).then((persons) => {
    res.json(persons)
  })
})

// Create NEW PERSON/CONTACT
personsRouter.post('/', (req, res, next) => {
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
personsRouter.put('/:id', (req, res, next) => {
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
personsRouter.get('/:id', (req, res, next) => {
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
personsRouter.get('/info', (req, res, next) => {
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
personsRouter.delete('/:id', (req, res, next) => {
  Person.findByIdAndDelete(req.params.id)
    .then(() => {
      res.status(204).end()
    })
    .catch((error) => next(error))
})

module.exports = personsRouter
