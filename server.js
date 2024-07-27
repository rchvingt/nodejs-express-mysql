require("dotenv").config();

const express = require("express");
const app = express();
const cors = require("cors");

// set port, listen for requests
const PORT = process.env.PORT;

var corsOptions = {
	origin: "http://localhost:3001",
	credentials: true, //access-control-allow-credentials:true
	optionSuccessStatus: 200,
};

// middleware
app.use(cors(corsOptions));

// parse requests of content-type - application/json
app.use(express.json());

// parse requests of content-type - application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: true }));

// simple route
app.get("/", (req, res) => {
	res.json({ message: "Calendar App" });
});

require("./app/routes/routes.js")(app);

app.listen(PORT, () => {
	console.log(`Server is running on port ${PORT}.`);
});
