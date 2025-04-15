const mongoose = require('mongoose');

if (process.argv.length < 3) {
  console.log('give password as argument');
  process.exit(1);
}

const password = process.argv[2];

const url = `mongodb+srv://ingady:${password}@nodeexpressprojects.shkmp.mongodb.net/phonebookApp?retryWrites=true&w=majority&appName=NodeExpressProjects`;

mongoose.set('strictQuery', false);

mongoose
  .connect(url)
  .then(() => {
    // Schema
    const personSchema = new mongoose.Schema({
      name: String,
      number: String,
    });

    // Model
    const Person = mongoose.model('Person', personSchema);

    // If only the password is provided, display all people in the phonebook
    if (process.argv.length === 3) {
      Person.find({}).then((result) => {
        console.log('phonebook:');
        result.forEach((person) => {
          console.log(`${person.name} ${person.number}`);
        });
        mongoose.connection.close();
      });
    }

    // If a name and a number are provided, add a new person to the phonebook
    if (process.argv.length === 5) {
      const name = process.argv[3];
      const number = process.argv[4];

      const person = new Person({ name, number });

      person.save().then(() => {
        console.log(`added ${name} number ${number} to phonebook`);
        mongoose.connection.close();
      });
    }
  })
  .catch((err) => {
    console.error('Error connecting to MongoDB:', err);
    process.exit(1);
  });
