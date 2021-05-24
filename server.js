const express = require('express');
const connectDB = require('./config/db');
const app = express();



connectDB();



app.use(express.json({ extended: false}));

app.get('/', (req, res) =>res.send("welcome to FindMyPet App") )


app.use('/api/users', require('./routes/users'));
app.use('/api/auth', require('./routes/auth'));
app.use('/api/findmypetuser', require('./routes/findmypetuser'));


const PORT = process.env.PORT || 5000;


app.listen(PORT, () => console.log('Server Running'))