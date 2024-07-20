const Event = require("../models/model.js");

// Create and Save a new Event
exports.create = (req, res) => {
  // Validate request
  if (!req.body) {
    res.status(400).send({
      message: "Content can not be empty!"
    });
  }

  // Create a Event
  const event = new Event({
    title       : req.body.title,
    description : req.body.description,
    date        : req.body.date,
    start_time  : req.body.start_time,
    end_time    :  req.body.end_time,
  });

  // Save Event in the database
  Event.create(event, (err, data) => {
    if (err)
      res.status(500).send({
        message:
          err.message || "Some error occurred while creating the Event."
      });
    else {
      res.status(200).send({
        success:true,
        message: "Events created!",
        data
      })
    };
  });
};

// Filter all Events from the database using keyword from title.
exports.findAll = (req, res) => {
  const title = req.query.title;

  Event.getAll(title, (err, data) => {
    if (err) {
      res.status(500).send({
        success:false,
        message:
          err.message || "Some error occurred while retrieving events."
      });
    }
    res.status(200).send({
      success:true,
      message: "All Events",
      data
    })
  });
};

// Find a single Event by Id
exports.findOne = (req, res) => {
  Event.findById(req.params.id, (err, data) => {
    if (err) {
      if (err.kind === "not_found") {
        res.status(404).send({
          message: `Not found Event with id ${req.params.id}.`
        });
      } else {
        res.status(500).send({
          message: "Error retrieving Event with id " + req.params.id
        });
      }
    } else {
      res.status(200).send({
        success:true,
        message: "Event found findOne",
        data
      })
    };
  });
};

// Find a Event by User (user_id)
exports.findEventByUser = (req, res) => {
  Event.eventByUser(req.params.user_id, (err, data) => {
    if (err) {
      if (err.kind === "not_found") {
        res.status(404).send({
          message: `Not found Event with user_id ${req.params.user_id}.`
        });
      } else {
        res.status(500).send({
          message: "Error retrieving Event with user_id " + req.params.user_id
        });
      }
    } else {
      res.status(200).send({
        success:true,
        message: "Event found findEventByUser",
        data
      })
    };
  });
};

// Update a Event identified by the id in the request
exports.update = (req, res) => {
  // Validate Request
  if (!req.body) {
    res.status(400).send({
      message: "Content can not be empty!"
    });
  }

  console.log(req.body);

  Event.updateById(
    req.params.id,
    new Event(req.body),
    (err, data) => {
      if (err) {
        if (err.kind === "not_found") {
          res.status(404).send({
            message: `Not found Event with id ${req.params.id}.`
          });
        } else {
          res.status(500).send({
            message: "Error updating Event with id " + req.params.id
          });
        }
      } else {
        res.status(200).send({
          success:true,
          message: "Event Updated!",
          data
        })
      };
    }
  );
};

// Delete a Event with the specified id in the request
exports.delete = (req, res) => {
  Event.remove(req.params.id, (err, data) => {
    if (err) {
      if (err.kind === "not_found") {
        res.status(404).send({
          message: `Not found Event with id ${req.params.id}.`
        });
      } else {
        res.status(500).send({
          message: "Could not delete Event with id " + req.params.id
        });
      }
    } else {
      res.status(200).send({
        success:true,
        message: "Event was deleted!",
        data
      })
      
    }
  });
};
