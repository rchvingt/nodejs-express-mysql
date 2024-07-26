module.exports = (app) => {
	const eventcal = require("../controllers/controllers.js");

	var router = require("express").Router();

	// Create a new events calendar
	router.post("/", eventcal.create);

	// Retrieve all events calendar
	router.get("/", eventcal.findAll);

	// Retrieve eventsData
	router.get("/events", eventcal.eventsData);

	// Retrieve all users
	router.get("/users", eventcal.findAllUsers);

	// Retrieve events by selected persons
	router.post("/persons", eventcal.findByPersons);

	// Retrieve a single events calendar with id
	router.get("/:id", eventcal.findOne);

	// Retrieve events by user ID
	router.get("/user/:userId", eventcal.findByUserIds);

	// Update a events calendar with id
	router.put("/:id", eventcal.update);

	// Delete a events calendar with id
	router.delete("/:id", eventcal.delete);

	// Route to check event clash
	router.post("/check-event-clash", eventcal.checkEventClash);

	app.use("/api/calendars", router);
};
