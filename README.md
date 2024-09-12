
# Clinic-Management-system(MERN Stack)

This fullstack MERN application enables seamless management of patients and doctors, with features like CRUD operations, search functionality, appointment booking, and prescription management. It ensures secure communication between doctors and receptionists using JWT authentication. Real-time updates keep schedules synchronized for efficient clinic operations.


## Installation

1.Clone the repository:

```bash
  git clone https://github.com/Kheria1509/clinic-.git
```
2.Navigate to the project folder:

```bash
  cd clinic
```
3.Navigate to the frontend folder:

```bash
  cd client
```
4.Navigate to the backend folder:

```bash
  cd server
```
5.Install dependencies for both client and server:

```bash
  npm install
```
6. Set up the MongoDB Database
- Create a MongoDB Atlas Account or Local Instance: You can either create an account on MongoDB Atlas to host your database in the cloud, or set up a local MongoDB instance on your machine.
- Create the Database: Once MongoDB is ready, create a database named clinic.
- Connect the Database: In the .env file located in the server folder, add the connection string for your MongoDB instance:

```bash
  DB_URL=mongodb://127.0.0.1:27017/clinic

```
- User Authentication Setup: In the user collection, which will be automatically created, add user credentials (email and password) for login functionality. This will allow secure authentication when accessing the system.

Start the application: You need to start the application in both server and client simultaneously By using the following command in both client and server folder npm start or write npm start in client and npm run dev in server.