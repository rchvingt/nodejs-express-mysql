const EventCal = require("../models/model.js");
const moment = require("moment");

// Check event clash
exports.checkEventClash = (req, res) => {
	const userId = req.body.user_id;
	const newEventStartTime = moment.utc(req.body.date_start + "T" + req.body.start_time).format();
	const newEventEndTime = moment.utc(req.body.date_end + "T" + req.body.end_time).format();

	EventCal.checkEventClash(userId, newEventStartTime, newEventEndTime, (err, isClashing) => {
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
		start_time: moment.utc(req.body.start_time, "HH:mm:ss").format("HH:mm:ss"),
		end_time: moment.utc(req.body.end_time, "HH:mm:ss").format("HH:mm:ss"),
	});

	// Check for event clash
	let userId = evecal.user_id;
	let startTime = `${evecal.date_start}T${evecal.start_time}`;
	let endTime = `${evecal.date_end}T${evecal.end_time}`;
	console.log(`Checking event clash for user ${userId} from ${startTime} to ${endTime}`);

	EventCal.checkEventClash(userId, startTime, endTime, (err, isClashing) => {
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

		// const formattedData = data.map((event) => ({
		// 	id: event.id,
		// 	title: event.title,
		// 	start: event.date_start.toISOString(),
		// 	end: event.date_end.toISOString(),
		// }));
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

exports.findByUserIds = (req, res) => {
	const userIds = req.query.userIds;

	if (!userIds) {
		res.status(400).send({
			status: false,
			message: "No userIDs provided.",
		});
		return;
	}

	const userIdArray = userIds
		.split(",")
		.map((id) => parseInt(id, 10))
		.filter((id) => !isNaN(id));

	if (userIdArray.length === 0) {
		res.status(400).send({
			status: false,
			message: "Invalid userIDs provided.",
		});
		return;
	}

	EventCal.findByUserIds(userIdArray, (err, data) => {
		if (err) {
			if (err.kind === "not_found") {
				res.status(404).send({
					status: false,
					message: `No events found for user IDs ${userIds}.`,
				});
			} else {
				res.status(500).send({
					status: false,
					message: "Error retrieving events for user IDs " + userIds,
				});
			}
		} else {
			res.status(200).send({
				success: true,
				message: "Events found",
				data,
			});
		}
	});
};

// Update a events calendar identified by the id in the request
exports.update = (req, res) => {
	// Validate Request
	if (!req.body) {
		res.status(400).send({
			status: false,
			message: "Content can not be empty!",
		});
	}

	console.log(req.body);

	EventCal.updateById(req.params.id, new EventCal(req.body), (err, data) => {
		if (err) {
			if (err.kind === "not_found") {
				res.status(404).send({
					status: false,
					message: `Not found events calendar with id ${req.params.id}.`,
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
