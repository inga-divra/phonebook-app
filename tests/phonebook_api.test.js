const assert = require('node:assert')
const { test, after, beforeEach } = require('node:test')
const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../backend/app')
const Person = require('../backend/models/person')

const api = supertest(app)

const initialPersons = [
  { name: 'Peeter Ronneberg', number: '09-4567899' },
  { name: 'John Sture', number: '044-6543210' }
]

beforeEach(async () => {
  await Person.deleteMany({})
  await Person.insertMany(initialPersons)
})

test('all persons are returned', async () => {
  const response = await api.get('/api/persons')
  assert.strictEqual(response.body.length, initialPersons.length)
})

test('a specific person is within the returned persons', async () => {
  const response = await api.get('/api/persons')

  const names = response.body.map((person) => person.name)
  assert(names.includes('Peeter Ronneberg'))
})

test('another specific person is within the returned persons', async () => {
  const response = await api.get('/api/persons')

  const names = response.body.map((person) => person.name)
  assert(names.includes('John Sture'))
})

after(async () => {
  await mongoose.connection.close()
})
