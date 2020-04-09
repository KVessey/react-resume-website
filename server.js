const express = require('express');
const connectDB = require('./config/db');

const app = express();

// Connect the database
connectDB();

//Init middleware
app.use(express.json({ extended: false }));

app.get('/', (req, res) => res.send('API Running'));

// Define Routes
// This uses the api/users js file in the routes directory so we can use this api functionality in our app
app.use('/api/users', require('./routes/api/users'));
app.use('/api/auth', require('./routes/api/auth'));
app.use('/api/profile', require('./routes/api/profile'));
app.use('/api/posts', require('./routes/api/posts'));

// This gets the environment port when deployed to heroku, or it will run on port 5000 by default
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
