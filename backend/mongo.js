const mongoose = require('mongoose');

if (process.argv.length < 3) {
  console.log('give password as argument');
  process.exit(1);
}

const password = process.argv[2];

const url = `mongodb+srv://ingady:${password}@nodeexpressprojects.shkmp.mongodb.net/phonebookApp?retryWrites=true&w=majority&appName=NodeExpressProjects`;

mongoose.set('strictQuery', false);
mongoose.connect(url);

// Schema
const personSchema = new mongoose.Schema({
  name: String,
  number: String,
});

// Model
const Person = mongoose.model('Person', personSchema);

// New person
const person = new Person({
  name: 'Arto Vihavainen',
  number: '040-1234556',
});

// Save and fetch
person.save().then(() => {
  console.log('person saved!');

  Person.find({}).then((result) => {
    result.forEach((person) => {
      console.log(person);
    });
    mongoose.connection.close();
  });
});
