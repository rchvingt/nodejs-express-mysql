const EventCal = require("../models/model.js");

// Create and Save a new events calendar
exports.create = (req, res) => {
	// Validate request
	if (!req.body) {
		res.status(400).send({
			message: "Content can not be empty!",
		});
	}

	// Create a events calendar
	const evecal = new EventCal({
		user_id: req.body.user_id,
		title: req.body.title,
		description: req.body.description,
		date: req.body.date,
		start_time: req.body.start_time,
		end_time: req.body.end_time,
	});

	// Save events calendar in the database
	EventCal.create(evecal, (err, data) => {
		if (err)
			res.status(500).send({
				status: false,
				message: err.message || "Some error occurred while creating the events calendar.",
			});
		res.status(200).send({
			success: true,
			message: "Events created!",
			data,
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
				message: "Event calendar was deleted!",
			});
		}
	});
};
