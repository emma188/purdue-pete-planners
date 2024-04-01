const router = require("express").Router();
const manager = require('../account_manager')

router.route("/").get((req, res) => { 
    const event = ["events"]
    res.json(event);
});

router.post("/events", (req,res) => {
    res.send('200: success')
});

router.route("/createEvent").post((req, res) => {
   return manager.createEvent(req.body.name, req.body.description, req.body.Time, req.body.link, req.body.location, req.body.repeat, req.body.owner)
    .then(success => res.status(200).json(success))
    .catch(err => res.status(400).json(err));
  });

  router.route("/searchInvitedEvent").get((req, res) => {
    manager.searchInvitedEvent(req.query.prefix).then(users => {
      res.json(users);
    });
  });

  router.route("/searchUserEvent").get((req, res) => {
    manager.searchUserEvent(req.query.prefix).then(users => {
      res.json(users);
    });
  });

  router.route("/getAllEvents").get((req,res) => {
    manager.getAllEvents().then(response => {
      res.json(response);
    });
  });

  router.route("/getCurrentEvent").get((req,res) => {
    manager.getCurrentEvent(req.query.prefix).then(response => {
      console.log(response);
      res.json(response);
    });
  });

  router.route("/updateEvent").post((req,res) => {
    return manager.updateEvent(req.body._id, req.body.name, req.body.description, req.body.Time, req.body.link, req.body.location, req.body.repeat)
    .then(success => res.status(200).json(success))
    .catch(err => res.status(400).json(err));
  });

  router.route("/updateEventInvite").post((req, res) => {
    return manager.updateEventInvite(req.body.reciever, req.body.sender, req.body.eventName, req.body.eventID)
    .then(success => res.status(200).json(success))
    .catch(err => res.status(400).json(err));
  });

  router.route("/searchUserEventInvites").get((req,res) =>{
    manager.searchUserEventInvites(req.query.prefix).then(response => {
      console.log(response);
      res.json(response);
    });
  });

  router.route("/acceptEventInvite").post((req,res) => {
    return manager.acceptEventInvite(req.body.params.sentUser, req.body.params.sentName, req.body.params.event_id, req.body.params.user)
    .then(success => res.status(200).json(success))
    .catch(err => res.status(400).json(err));
  });

  router.route("/declineEventInvite").post((req,res) => {
    return manager.declineEventInvite(req.body.params.sentUser, req.body.params.sentName, req.body.params.event_id, req.body.params.user)
    .then(success => res.status(200).json(success))
    .catch(err => res.status(400).json(err));
  });

  router.route("/deleteEvent").post((req,res) => {
    return manager.deleteEvent(req.body.params.user_delete, req.body.params.event_name, req.body.params.event_id)
    .then(success => res.status(200).json(success))
    .catch(err => res.status(400).json(err));
  });

  router.route("/removeEvent").post((req,res) => {
    return manager.removeEvent(req.body.params.user_remove, req.body.params.event_id)
    .then(success => res.status(200).json(success))
    .catch(err => res.status(400).json(err))
  });

  module.exports = router;