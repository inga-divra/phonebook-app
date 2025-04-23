const supertest = require('supertest')
const app = require('../backend/app')
const { test, after, beforeEach } = require('node:test')
const assert = require('node:assert')
const mongoose = require('mongoose')
const Person = require('../models/person')

const api = supertest(app)

const initialPersons = [
  { name: 'Arto Hellas', number: '040-123456' },
  { name: 'Ada Lovelace', number: '39-44-5323523' }
]

beforeEach(async () => {
  await Person.deleteMany({})
  await Person.insertMany(initialPersons)
})

test('all phonebook is returned', async () => {
  const response = await api.get('/api/persons') // убедись, что endpoint правильный
  assert.strictEqual(response.body.length, initialPersons.length)
})

after(async () => {
  await mongoose.connection.close()
})
