require('dotenv').config();
const express = require('express');
const app = express();
const mongoose = require('mongoose');
const morgan = require('morgan');
const path = require('path');
const Person = require('./models/person');

// Middleware
app.use(express.json());

morgan.token('body', (req, res) => {
  return JSON.stringify(req.body);
});

// Serve static files from the 'dist' directory
app.use(express.static(path.join(__dirname, 'dist')));

app.use(morgan('tiny'));
app.use(
  morgan(':method :url :status :res[content-length] - :response-time ms :body')
);

// Get ALL PERSONS
app.get('/api/persons', (req, res) => {
  Person.find({}).then((persons) => {
    res.json(persons);
  });
});

app.get('/api/persons', (req, res) => {
  res.json(persons);
});

app.get('/info', (req, res) => {
  const personsTotal = persons.length;
  const currentTime = new Date();
  res.send(`
        <p>Phonebook has info for ${personsTotal} people</p>
        <p>${currentTime}</p>
        `);
});

app.get('/api/persons/:id', (req, res) => {
  const id = req.params.id.toString();
  const person = persons.find((person) => person.id === id);
  if (person) {
    res.json(person);
  } else {
    res.status(404).end();
  }
});

app.delete('/api/persons/:id', (req, res) => {
  const id = req.params.id.toString();
  persons = persons.filter((person) => person.id !== id);
  res.status(204).end();
});

const generateId = () => {
  const id = Math.floor(Math.random() * 1000000);
  return String(id);
};

app.post('/api/persons', (req, res) => {
  const body = req.body;

  if (!body.name) {
    return res.status(400).json({
      error: 'name missing',
    });
  }

  if (!body.number) {
    return res.status(400).json({
      error: 'number missing',
    });
  }

  const notUniqueName = persons.some((person) => person.name === body.name);
  if (notUniqueName) {
    return res.status(400).json({
      error: 'name must be unique',
    });
  }

  const person = {
    name: body.name,
    number: body.number,
    id: generateId(),
  };

  persons = persons.concat(person);

  res.json(person);
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
