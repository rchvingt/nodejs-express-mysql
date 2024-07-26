const sql = require("./db.js");

// constructor
const EventCal = function (evcal) {
	this.user_id = evcal.user_id;
	this.title = evcal.title;
	// this.description = evcal.description;
	this.date_start = evcal.date_start;
	this.date_end = evcal.date_end;
	this.start_time = evcal.start_time;
	this.end_time = evcal.end_time;
};

// manage create event
EventCal.create = (nuEvent, result) => {
	sql.query("INSERT INTO events SET ?", nuEvent, (err, res) => {
		if (err) {
			console.log("error: ", err);
			result(err, null);
			return;
		}

		console.log("created events calendar: ", { id: res.insertId, ...nuEvent });
		result(null, { id: res.insertId, ...nuEvent });
	});
};

// manage filter event by ID
EventCal.findById = (id, result) => {
	sql.query(`SELECT * FROM events WHERE id = ${id}`, (err, res) => {
		if (err) {
			console.log("error: ", err);
			result(err, null);
			return;
		}

		if (res.length) {
			console.log("found events calendar: ", res[0]);
			result(null, res[0]);
			return;
		}

		// not found events calendar with the id
		result({ kind: "not_found" }, null);
	});
};

// manage filter event by userIDs
EventCal.findByUserIds = (userIds, result) => {
	// convert array of userIDs to a comma-separated string
	const userIdsString = userIds.join(",");

	// Create the SQL query with the IN clause
	const query = `SELECT * FROM events WHERE user_id IN (${userIdsString})`;

	sql.query(query, (err, res) => {
		if (err) {
			console.log("error: ", err);
			result(err, null);
			return;
		}

		if (res.length) {
			console.log("found events: ", res);
			result(null, res);
			return;
		}

		// not found events calendar with the userIDs
		result({ kind: "not_found" }, null);
	});
};

// manage get all event
// search all event by keyword (if keyword exist)
EventCal.getAll = (title, result) => {
	let query = "SELECT * FROM events";

	if (title) {
		query += ` WHERE title LIKE '%${title}%'`;
	}

	sql.query(query, (err, res) => {
		if (err) {
			console.log("error: ", err);
			result(null, err);
			return;
		}

		console.log("events calendar: ", res);
		result(null, res);
	});
};

// manage get all person/user
EventCal.getAllUsers = (name, result) => {
	let query = "SELECT * FROM users";

	if (name) {
		query += ` WHERE name LIKE '%${name}%'`;
	}

	sql.query(query, (err, res) => {
		if (err) {
			console.log("error: ", err);
			result(null, err);
			return;
		}

		console.log("users: ", res);
		result(null, res);
	});
};

// Get events by selected persons
EventCal.getByPersons = (personIds, result) => {
	let iDs = personIds.map(() => "?").join(",");
	let query = `SELECT * FROM events WHERE user_id IN (${iDs})`;

	sql.query(query, personIds, (err, res) => {
		if (err) {
			console.log("error: ", err);
			result(err, null);
			return;
		}
		console.log("users: ", res);
		result(null, res);
	});
};

// manage update event by ID
EventCal.updateById = (id, evcal, result) => {
	sql.query(
		"UPDATE events SET user_id = ?, title = ?, description = ?, date_start = ?, date_end = ?, start_time = ?, end_time = ? WHERE id = ?",
		[evcal.user_id, evcal.title, evcal.description, evcal.date_start, evcal.date_end, evcal.start_time, evcal.end_time, id],
		(err, res) => {
			if (err) {
				console.log("error: ", err);
				result(null, err);
				return;
			}

			if (res.affectedRows == 0) {
				// not found events calendar with the id
				result({ kind: "not_found" }, null);
				return;
			}

			console.log("updated events calendar: ", { id: id, ...evcal });
			result(null, { id: id, ...evcal });
		}
	);
};

// manage remove event by ID
EventCal.remove = (id, result) => {
	sql.query("DELETE FROM events WHERE id = ?", id, (err, res) => {
		if (err) {
			console.log("error: ", err);
			result(null, err);
			return;
		}

		if (res.affectedRows == 0) {
			// not found events calendar with the id
			result({ kind: "not_found" }, null);
			return;
		}

		console.log("deleted events calendar with id: ", id);
		result(null, res);
	});
};

// Check for event clash
EventCal.checkEventClash = (userId, newEventStartTime, newEventEndTime, result) => {
	const query = `
        SELECT * FROM events
        WHERE user_id = ?
        AND (
            (CONCAT(date_start, 'T', start_time) < ? AND CONCAT(date_end, 'T', end_time) > ?)
            OR
            (CONCAT(date_start, 'T', start_time) <= ? AND CONCAT(date_end, 'T', end_time) >= ?)
        )
    `;

	const params = [userId, newEventEndTime, newEventStartTime, newEventStartTime, newEventEndTime];
	console.log("Running query checkEventClash:", query);
	console.log("With parameters:", params);
	sql.query(query, params, (err, res) => {
		if (err) {
			console.log("error: ", err);
			result(err, null);
			return;
		}

		if (res.length) {
			result(null, true); // There is a clash
			return;
		}

		result(null, false); // No clash
	});
};
module.exports = EventCal;
