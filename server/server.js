//libraries required
const express = require("../node_modules/express");
const mongoose = require("../node_modules/mongoose");
const path = require("path");

//local required
const app = express();

// BodyParser Middleware
app.use(express.json());

// DB Config
const db = require('./config/keys').mongoURI;

// Connect to Mongo
mongoose
	.connect(db,{useNewUrlParser: true,useUnifiedTopology: true, useCreateIndex: true} )
	.then(() => console.log('MongoDB Connected...'))
	.catch(err=> console.log(err))

//Use Routes
app.use('/api/items', require('./routes/api/items'));
app.use('/api/users', require('./routes/api/users'));

// Serve static assets if in production
if (process.env.NODE_ENV === 'production' ){
	//Set static folder
	app.use(express.static('client/build'));
	app.get('*', (req,res) => {
		res.sendFile(
			path.resolve(__dirname, 'client', 'build', 'index.html'))		
	})
}

const port = process.env.PORT || 5000;

app.listen(port, () => console.log(`Server started on port ${port} `))
