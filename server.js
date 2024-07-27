require("dotenv").config();

const express = require("express");
const app = express();
const cors = require("cors");
// set port, listen for requests
const PORT = process.env.PORT || 3000;

// List of allowed origins
const allowedOrigins = [
	"http://localhost:3001", // Local development
	"https://calendar-event-client.vercel.app", // Deployed frontend
];

// CORS options
const corsOptions = {
	origin: function (origin, callback) {
		// Allow requests with no origin (like mobile apps or curl requests)
		if (!origin) return callback(null, true);
		if (allowedOrigins.includes(origin)) {
			return callback(null, true);
		} else {
			return callback(new Error("Not allowed by CORS"));
		}
	},
	credentials: true, //access-control-allow-credentials:true
	optionsSuccessStatus: 200,
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
