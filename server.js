const express = require('express');

const app = express();

app.get('/', (req, res) => res.send('API Running'));

// This gets the environment port when deployed to heroku, or it will run on port 5000 by default
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
