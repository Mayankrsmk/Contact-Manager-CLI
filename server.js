const express = require('express');
const { errorHandler } = require('./middleware/errorHandler');
const connectDB = require('./config/dbConnection');
const app = express();
const dotenv = require('dotenv').config();
connectDB();
const path = require('path');
const bodyParser = require('body-parser');
const { registerUser, loginUser } = require('./controllers/userController');
const port = process.env.PORT || 5000;

app.use(express.json());
app.use('/api/contacts', require('./routes/contactRoutes'));
app.use('/api/users', require('./routes/userRoutes'));
app.use(errorHandler);

app.use(bodyParser.urlencoded({ extended: true }));
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "/Views"));

app.get('/',(req,res)=>{
    res.render('login');
});

app.post('/register', registerUser,(req,res)=>[
    res.redirect('login')
]);

app.post('/login',loginUser);

app.listen(port,()=>{
    console.log(`Server listening on ${port}...`);
})