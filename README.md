# Phonebook App

This is the backend of the Phonebook App – a simple RESTful API built with **Node.js** and **Express**. It allows users to manage a list of contacts with names and phone numbers.

## Features

- View all contacts
- Add a new contact
- Delete a contact
- Update contact information

## Technologies Used

- Node.js
- Express

## Live Demo

The app is deployed and available here:  
👉 [https://phonebook-app-karq.onrender.com/](https://phonebook-app-karq.onrender.com/)

## API Endpoints

- `GET /api/persons` – Get all contacts  
- `POST /api/persons` – Add a new contact  
- `DELETE /api/persons/:id` – Delete a contact  
- `PUT /api/persons/:id` – Update a contact  
- `GET /info` – Show total number of contacts and current time

## Installation (for local development)

```bash
git clone https://github.com/inga-divra/phonebook-app.git
cd phonebook-app
npm install
npm start
