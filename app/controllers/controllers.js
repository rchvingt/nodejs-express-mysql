// UPDATE 300724: Updated `checkEventClash` method to handle event clash detection with and without an event ID.

const EventCal = require("../models/model.js");
const moment = require("moment");

// Function to convert time to 24-hour format
const convertTo24Hour = (time) => {
	return moment(time, "hh:mm:ss a").format("HH:mm:ss");
};

exports.checkEventClash = (req, res) => {
	const userId = req.body.user_id;
	const newEventStartTime = moment.utc(req.body.date_start + "T" + req.body.start_time).format();
	const newEventEndTime = moment.utc(req.body.date_end + "T" + req.body.end_time).format();
	const eventID = req.body.id;

	EventCal.checkEventClash(userId, newEventStartTime, newEventEndTime, eventID, (err, isClashing) => {
		if (err) {
			res.status(500).send({
				message: "Error checking event clash",
			});
			return;
		}

		res.send({ isClashing });
	});
};

// Create and Save a new events calendar
exports.create = (req, res) => {
	// Validate request
	if (!req.body) {
		res.status(400).send({
			message: "Content can not be empty!",
		});
		return;
	}

	// Create an events calendar
	const evecal = new EventCal({
		user_id: req.body.user_id,
		title: req.body.title,
		description: req.body.description,
		date_start: moment.utc(req.body.date_start).format("YYYY-MM-DD"),
		date_end: moment.utc(req.body.date_end).format("YYYY-MM-DD"),
		start_time: convertTo24Hour(req.body.start_time),
		end_time: convertTo24Hour(req.body.end_time),
	});

	// Check for event clash
	let userId = evecal.user_id;
	let startTime = `${evecal.date_start}T${evecal.start_time}`;
	let endTime = `${evecal.date_end}T${evecal.end_time}`;

	EventCal.checkEventClash(userId, startTime, endTime, null, (err, isClashing) => {
		if (err) {
			res.status(500).send({
				message: "Error checking event clash",
			});
			return;
		}

		if (isClashing) {
			res.status(400).send({
				message: "Event clash detected, please choose a different time",
			});
			return;
		}

		// Save the event if no clash
		EventCal.create(evecal, (err, data) => {
			if (err) {
				res.status(500).send({
					status: false,
					message: err.message || "Some error occurred while creating the events calendar.",
				});
				return;
			}
			res.status(200).send({
				success: true,
				message: "Events created!",
				data,
			});
		});
	});
};

exports.update = (req, res) => {
	// Validate Request
	if (!req.body) {
		res.status(400).send({
			status: false,
			message: "Content can not be empty!",
		});
		return;
	}

	// Create an events calendar
	const upd = {
		user_id: req.body.user_id,
		title: req.body.title,
		description: req.body.description,
		date_start: moment.utc(req.body.date_start).format("YYYY-MM-DD"),
		date_end: moment.utc(req.body.date_end).format("YYYY-MM-DD"),
		start_time: convertTo24Hour(req.body.start_time),
		end_time: convertTo24Hour(req.body.end_time),
	};

	const userId = req.body.user_id;
	const newEventStartTime = `${upd.date_start}T${upd.start_time}`;
	const newEventEndTime = `${upd.date_end}T${upd.end_time}`;
	const eventID = req.params.id;

	// Check for event clashes
	EventCal.checkEventClash(userId, newEventStartTime, newEventEndTime, eventID, (err, isClashing) => {
		if (err) {
			res.status(500).send({
				status: false,
				message: "Error checking event clash",
			});
			return;
		}

		if (isClashing) {
			res.status(400).send({
				status: false,
				message: "Event times clash with an existing event",
			});
			return;
		}

		// Proceed with updating the event
		EventCal.updateById(eventID, upd, (err, data) => {
			if (err) {
				if (err.kind === "not_found") {
					res.status(404).send({
						status: false,
						message: `EventCal.updateById Not found events calendar with id ${req.params.id}.`,
					});
				} else {
					res.status(500).send({
						status: false,
						message: "Error updating events calendar with id " + req.params.id,
					});
				}
			} else {
				res.status(200).send({
					success: true,
					message: "Event Updated!",
					data,
				});
			}
		});
	});
};
// Retrieve all events calendar from the database (with filter).
exports.findAll = (req, res) => {
	const title = req.query.title;

	EventCal.getAll(title, (err, data) => {
		if (err)
			res.status(500).send({
				status: false,
				message: err.message || "Some error occurred while retrieving events calendar.",
			});

		res.status(200).send({
			success: true,
			message: "list events calendar",
			data,
		});
	});
};

// Retrieve all events calendar from the database (with filter).
exports.eventsData = (req, res) => {
	const title = req.query.title;

	EventCal.getAll(title, (err, data) => {
		if (err)
			res.status(500).send({
				status: false,
				message: err.message || "Some error occurred while retrieving events calendar.",
			});

		const formattedData = data.map((event) => ({
			id: event.id,
			title: event.title,
			start: moment.utc(event.date_start).format(), // ISO 8601 format
			end: moment.utc(event.date_end).format(), // ISO 8601 format
		}));

		res.status(200).send({
			success: true,
			message: "list events calendar",
			data: formattedData,
		});
	});
};

// Retrieve all users from the database (with filter).
exports.findAllUsers = (req, res) => {
	const title = req.query.title;

	EventCal.getAllUsers(title, (err, data) => {
		if (err)
			res.status(500).send({
				status: false,
				message: err.message || "Some error occurred while retrieving users.",
			});

		res.status(200).send({
			success: true,
			message: "list Users",
			data,
		});
	});
};
// Retrieve events by selected persons
exports.findByPersons = (req, res) => {
	const personIds = req.body.personIds;

	EventCal.getByPersons(personIds, (err, data) => {
		if (err) {
			res.status(500).send({
				status: false,
				message: err.message || "Some error occurred while retrieving events.",
			});
		} else {
			const formattedData = data.map((event) => ({
				id: event.id,
				title: event.title,
				start: event.date_start,
				end: event.date_end,
			}));
			// res.send(data);
			res.status(200).send({
				success: true,
				message: "list events calendar getByPersons",
				data: formattedData,
			});
		}
	});
};

// Find a single events calendar by Id
exports.findOne = (req, res) => {
	EventCal.findById(req.params.id, (err, data) => {
		if (err) {
			if (err.kind === "not_found") {
				res.status(404).send({
					status: false,
					message: `Not found events calendar with id ${req.params.id}.`,
				});
			} else {
				res.status(500).send({
					status: false,
					message: "Error retrieving events calendar with id " + req.params.id,
				});
			}
		} else {
			res.status(200).send({
				success: true,
				message: "found events calendar",
				data,
			});
		}
	});
};

exports.findEventByUserId = (req, res) => {
	EventCal.findEventByUserId(req.params.userId, (err, data) => {
		if (err) {
			if (err.kind === "not_found") {
				res.status(404).send({
					status: false,
					message: `Not found events calendar with user_id ${req.params.userId}.`,
				});
			} else {
				res.status(500).send({
					status: false,
					message: "Error retrieving events calendar with user_id " + req.params.userId,
				});
			}
		} else {
			res.status(200).send({
				success: true,
				message: "found events calendar",
				data,
			});
		}
	});
};

// Delete a events calendar with the specified id in the request
exports.delete = (req, res) => {
	EventCal.remove(req.params.id, (err, data) => {
		if (err) {
			if (err.kind === "not_found") {
				res.status(404).send({
					status: false,
					message: `Not found events calendar with id ${req.params.id}.`,
				});
			} else {
				res.status(500).send({
					status: false,
					message: "Could not delete events calendar with id " + req.params.id,
				});
			}
		} else {
			res.status(200).send({
				success: true,
				message: "Event deleted!",
			});
		}
	});
};
