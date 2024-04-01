const MongoClient = require('mongodb').MongoClient; // Framework to communicate with mongodb
const ObjectId = require('mongodb').ObjectId;
const Binary = require('mongodb').Binary;           // Framework to store binary data in mongodb
const uri = "mongodb+srv://hyuen:cs407@cluster0.tw2mu.mongodb.net/myFirstDatabase?retryWrites=true&w=majority"    // Mongo DB uri
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

const router = require("express").Router();
const _ = require("underscore");

// Global vars for Mongo DB connection
var connection, db;

/*
 * Function that connects to database
 *
 * @return {int} returns value depending on successful db connection (-1 = Cannot connect to database, 0 = Connected)
 */
const startDatabaseConnection = async function() {
	try {
		connection = await client.connect();
		db = connection.db('purdue_pete');
        console.log('database conencted');
	}catch(err){
		console.log(err.stack);
		return -1;
	}

	return 0;
}

/*
 * Closes the database connection
 *
 * @return {int} returns value depending whether or not connection was closed successfully (-1 = Cannot close connection to database, 0 = Disconnected)
 */
const closeDatabaseConnection = async function() {
	try {
		connection.close();
	}catch(err){
		console.log(err.stack);
		return -1;
	}

	return 0;
}

/**
 * Creates a new user account and adds it to the database
 *
 * @param {String} username
 * @param {String} email
 * @param {String} major
 * @param {String} pass
 * @return {Int} returns success value. (-1 = account creation failed, 0 = account creation success)
 */
const createAccount = async function(username, email, major, pass) {
	// create a JSON user object
	const user = {
		"user_name":username,
		"password":pass,
		"email":email,
		"schedule":[],
		"major":major,
		"study_group":[],
		"chats":[],
		"friend":[],
		"friend_request":[],
		"book_room":[],
		"event_invite":[]
	}

	let emailExists;

	try {
		emailExists = await accountEmailExists();

		if(emailExists === -1){	return -1; }
		if(!emailExists){
			// add a new user to the database
			 await db.collection('User').insertOne(user);
		}
	} catch (error) {
		console.log(err.stack);
		return -1;
	}

	return 0;
}

//create a new event and add it to the db
const createEvent = async function(name, description, time, link, location, repeat, owner) {
	const event = {
		"name":name,
		"description":description,
		"Time":time,
		"link":link,
		"location":location,
		"repeat":repeat,
		"owner":owner,
		"invited":[]
	}

	await db.collection('Event').insertOne(event);
	await db.collection('User').updateOne({user_name: owner[0]}, { $push: {schedule: event}}, function(err, res) {
		if (err) throw err;
		console.log(err);
	});
}

const createSchedule =  async function(title,date,userName,link) {
  const schedule = {
    "title":title,
    "date":date,
    "link":link
  }
  var myquery = { user_name: userName };
  var newvalue = { $push: {schedule: schedule} };
  db.collection("User").updateOne(myquery, newvalue, function(err, res) {
    if (err) throw err;
    console.log(err);
  });
}

/**
 *
 * @param {String} owner
 */
//returns all user created events
 const searchUserEvent = async function(user){
	return new Promise(function(resolve, reject) {
		db.collection("Event").find({owner: user}).toArray(function(err, result) {
			if (err) throw err;
			resolve(result);
		});
	});
}

const getEvent = async function(prefix){
  console.log(prefix);
  return new Promise(function(resolve, reject) {
    var myquery = { user_name: prefix };
    db.collection("User").find(myquery, {projection: {schedule: true, _id: false}}).toArray(function(err, result) {
      if (err) throw err;
      console.log(result);
      resolve(result);
    });
  });
}

const getDue = async function(prefix){
  console.log(prefix);
  return new Promise(function(resolve, reject) {
    var myquery = { user_name: prefix };
    db.collection("User").find(myquery, {projection: {schedule: true, _id: false}}).toArray(function(err, result) {
      if (err) throw err;
      console.log(result);
      resolve(result);
    });
  });
}

//checks all events for the user to see if theyve accepted an invite
const searchInvitedEvent = async function(user){
	return new Promise(function(resolve, reject) {
		db.collection("Event").find({invited: user}).toArray(function(err, result) {
			if(err) throw err;
			resolve(result);
		});
	});
}

//returns all evnts in the db
const getAllEvents = async function(){
	return new Promise(function(resolve, reject) {
		db.collection("Event").find().toArray(function(err, result) {
			if(err) throw err;
			resolve(result);
		});
	});
}

//gets an event by its id
const getCurrentEvent = async function(findid){
	let event = db.collection("Event").findOne({_id: ObjectId(findid)});
	return event;
}

//updates an events data after edits
const updateEvent = async function(id, nameParam, desc, date, linkParam, loc, repeatParam){
	await db.collection("Event").updateOne({_id: ObjectId(id)},
	 {$set: { name: nameParam, description: desc, Time: date, link: linkParam, location: loc, repeat: repeatParam},},
	  function(err, res) {
		  if(err) throw err;
		  console.log(err);
	  });
}

//adds an event invitation to the users event invtie array
const updateEventInvite = async function(reciever, sender, eventName, eventID){
	var myquery = { user_name: reciever };
	var newvalue = { $push: {event_invite:  [sender[0], eventName, eventID]  }};
	await db.collection("User").updateOne(myquery, newvalue, function(err, res) {
	if (err) throw err;
		console.log(err);
	});
}

//searches for all events user is invited to
const searchUserEventInvites = async function(user){
	invites = await db.collection("User").findOne({user_name: user}, {projection: {event_invite: true, _id: false}});
	console.log(invites);
	return invites;
}

//accepts an event invitation by adding the users name to the events invited array, removes invite from users invite list
const acceptEventInvite = async function(sentUser, sentName, eventID, user){
	db.collection("Event").updateOne({_id: ObjectId(eventID)}, { $push: {invited: user}});
	db.collection("User").updateOne({user_name: user}, { $pull: {event_invite: [sentUser, sentName, eventID]}});
}

//declines an event invitation by removing it from the invite list
const declineEventInvite = async function(sentUser, sentName, eventID, user){
	await db.collection("User").updateOne({user_name: user}, { $pull: {event_invite: [sentUser, sentName, eventID]}});
}

//for use in deleting an event
//removes any invites to event from all users
const removeInvites = async function(sentUser, sentName, eventID){
	return new Promise(function(resolve, reject) {
		db.collection("User").updateMany({}, { $pull: {event_invite: [sentUser, sentName, eventID]}});
	});
}

//delete event from db
const deleteEvent = async function(sentUser, sentName, eventID){
	let stuff= removeInvites(sentUser, sentName, eventID);
	db.collection("Event").deleteOne({_id: ObjectId(eventID)});
}

//Remove event from interested tab
const removeEvent = async function(user, eventID){
	await db.collection("Event").updateOne({_id: ObjectId(eventID)}, {$pull: {invited: user}});
}

/**
 * Gets all information about a user for the profile page
 *
 * @param {String} email
 */
const getUserInfo = async function(email){
	let userExists, info;


}

/*
 * Summary. Function that checks if email exists in database
 *
 * @param {String} mail The email of the account which the password is being extracted
 * @return {int} Returns a value depending on if email exists (-1 = Cannot connect to database, 0 = Does not Exist, 1 = Exists)
 */
const accountEmailExists = async function(mail) {
	let emailExists;

	try {
		// this line depends on the mongodb:
		emailExists = await db.collection('User').find({email: mail}).limit(1).count(true);
	} catch (err) {
		console.log(err.stack);
		return -1;
	}

	return emailExists;
}

/**
 * Gets all users with the given prefix
 *
 * @param {String} prefix
 */
const searchUsers = async function(prefix){
	return new Promise(function(resolve, reject) {
		//TODO: error with regex try again later
		// var query = { user_name: { $regex: `/^${prefix}/` } };
		var query = { user_name: prefix };
		db.collection("User").find(query).toArray(function(err, result) {
			if (err) throw err;
			console.log(result);
			resolve(result);
		});
	});
}

/*
 * Summary. Function that gets the hashed password of an account
 *
 * @param {String} usrname 	The username of the account which the password is being extracted
 *
 * @return {int} 	Returns a value depending on invalid information (-1 = Cannot connect to database, 1 = Invalid Username)
 * @return {String} Returns a string of the password
 */
const getAccountPassword = async function(usrname) {
	let userExists, pass;
	try {
		console.log("in get account password: " + usrname);
		userExists = await userAccountExists(usrname);
		if(userExists === -1){return -1;}

		if(userExists) {
			pass = await db.collection('User').findOne({user_name: usrname}, {projection: {password: true, _id: false}});
			console.log(pass);
		}
	} catch (err) {
		console.log(err.stack);
		return -1;
	}

	if (!userExists) {return 1;}
	else {return pass};

}

/**
 * Gets all users with the given class tag
 *
 * @param {String} classtag
 */
 const searchUsersCT = async function(classtag){
	return new Promise(function(resolve, reject) {
		var query = { class_tag: classtag };
		db.collection("Class_tag").find(query).toArray(function(err, result) {
			if (err) throw err;
			console.log(result);
			resolve(result);
		});
	});
}

/**
 * Gets all class tags given a user
 *
 * @param {String} prefix
 */
const findUserCT = async function(prefix){
	return new Promise(function(resolve, reject) {
		var query = { class_list: prefix };
		db.collection("User").find(query).toArray(function(err, result) {
			if (err) throw err;
			console.log(result);
			resolve(result);
		});
	});
}

module.exports = {
    startDatabaseConnection:startDatabaseConnection,
    closeDatabaseConnection:closeDatabaseConnection,
    createAccount:createAccount,
	getUserInfo:getUserInfo,
	accountEmailExists:accountEmailExists,
	searchUsers:searchUsers,
	createEvent:createEvent,
	searchUserEvent:searchUserEvent,
	getAllEvents:getAllEvents,
  getEvent:getEvent,
	getCurrentEvent:getCurrentEvent,
	updateEvent:updateEvent,
	updateEventInvite:updateEventInvite,
  createSchedule:createSchedule,
  getDue:getDue,
  createSchedule:createSchedule,
	searchUserEventInvites:searchUserEventInvites,
	acceptEventInvite:acceptEventInvite,
	declineEventInvite:declineEventInvite,
	searchInvitedEvent:searchInvitedEvent,
	deleteEvent:deleteEvent,
	removeEvent:removeEvent
}

/**
 * Update's the friendlist of the one recieving the friend request
 *
 * @param {String} receiver
 */
const updateFriendRequest = async function(curuser, receiver){
	//TODO: error checking on duplicate
	curUser = curuser
	console.log(receiver)
	var myquery = { user_name: receiver };
	var newvalue = { $push: {friend_request: curUser} };
	db.collection("User").updateOne(myquery, newvalue, function(err, res) {
	if (err) throw err;
		console.log(err);
	});
}

/**
 * Gets the study group with the given prefix
 *
 * @param {String} prefix
 */
const searchStudyGroup = async function(prefix){
  return new Promise(function(resolve, reject) {
    var query = { Course_name: prefix };
    db.collection("Study_group").find(query).toArray(function(err, result) {
      if (err) throw err;
      console.log(result);
      resolve(result);
    });
  });
}


/**
 * Gets the class tag with the given prefix
 *
 * @param {String} prefix
 */
const searchClassTag = async function(prefix){
	return new Promise(function(resolve, reject) {
	  //TODO: error with regex try again later
	  // var query = { Course_name: { $regex: `/^${prefix}/` } };
	  var query = { class_tag: prefix };
	  db.collection("Class_tag").find(query).toArray(function(err, result) {
		if (err) throw err;
		console.log(result);
		resolve(result);
	  });
	});
}
/*
 * Gets all study groups
 *
 * @param {String} prefix
 */
const searchAllStudyGroup = async function(){
  return new Promise(function(resolve, reject) {
    db.collection("Study_group").find().toArray(function(err, result) {
      if (err) throw err;
      console.log(result);
      resolve(result);
    });
  });
}

/*
 * Gets buildings
 *
 * @param {String} prefix
 */
const getAllBuildings = async function(){
	return new Promise(function(resolve, reject) {
	  db.collection("Building").find().toArray(function(err, result) {
		if (err) throw err;
		console.log(result);
		resolve(result);
	  });
	});
  }

/**
 * Update's the Member of the study group
 *
 * @param {String} study_group
 */
const updateStudyGroupRequest = async function(curuser, study_group){
  //TODO: error checking on duplicate
  curUser = curuser
  console.log(study_group)
  var myquery = { Course_name: study_group};
  var newvalue = { $push: {Member: curUser} };
  db.collection("Study_group").updateOne(myquery, newvalue, function(err, res) {
    if (err) throw err;
    console.log(err);
  });
  var userquery = {user_name: curuser};
  var uservalue = { $push: {study_group: study_group} };
  db.collection("User").updateOne(userquery, uservalue, function(err, res) {
    if (err) throw err;
    console.log(err);
  });
}

/**
 * Update's the Comment of the study group
 *
 * @param {String} study_group
 */
const updateStudyGroupComment = async function(study_group, info){
  //TODO: error checking on duplicate
  Info = info
  console.log(study_group)
  var myquery = { Course_name: study_group};
  var newvalue = { $push: {Comments: Info} };
  db.collection("Study_group").updateOne(myquery, newvalue, function(err, res) {
    if (err) throw err;
    console.log(err);
  });
}

/**
 * Update's the Announcement of the study group
 *
 * @param {String} study_group
 */
const updateStudyGroupAnnounce = async function(study_group, info){
  //curUser = curuser
  Info = info
  console.log(study_group)
  console.log(info)
  console.log('reached here')
  var myquery = { Course_name: study_group};
  var newvalue = { $push: {Announcement: Info} };
  db.collection("Study_group").updateOne(myquery, newvalue, function(err, res) {
    if (err) throw err;
    console.log(err);
  });
}

const deleteStudyGroup = async function(data){
	return new Promise(function(resolve, reject) {
		var myquery = { Course_name: data };
		db.collection("Study_group").deleteOne(myquery, function(err, res) {
			console.log(res.deletedCount)
			resolve(res.deletedCount)
		});
	});
}

const handleAcceptReject = async function(data){
	curUser = data.curUser
	console.log(data)
	var myquery = { user_name: curUser };
	var remove = { $pull: {friend_request: data.data} };

	db.collection("User").findOneAndUpdate(myquery, remove, function(err, res) {
		if (err) throw err;
			console.log(err);
	});

	if (data.type == "acceptfr") {
		var newvalue = { $push: {friend: data.data} };
		db.collection("User").updateOne(myquery, newvalue, function(err, res) {
		if (err) throw err;
			console.log(err);
		});
		myquery = { user_name: data.data };
		newvalue = { $push: {friend: curUser} };
		db.collection("User").updateOne(myquery, newvalue, function(err, res) {
		if (err) throw err;
			console.log(err);
		});
	}
}

const handleBanUpdate = async function(data){
	console.log("in handle ban update")
	console.log(data.data.newbanstatus)
	var myquery = { user_name: data.data.username };
	var newvalue = { $set: {banned: data.data.newbanstatus} };
	db.collection("User").updateOne(myquery, newvalue, function(err, res) {
	if (err) throw err;
		console.log(err);
	});
}

// ONLY USE TO POPULATE EMPTY DATABASE FOR TESTING
const populateDatabase = async function(){
	console.log("POPUlating database")
	var buildinginfo = [
		// Too lazy to create hours object so I'll just go with strings or html
		// That also that it is in our database so I'm not at fault right? ┌( ಠ‿ಠ)┘
		{ name: "Purdue University Beering Hall", location: "100 University St, West Lafayette, IN 47907",
		bussiness_hour:
			`Sunday	Closed
			Monday	6:30AM–11PM
			Tuesday	6:30AM–11PM
			Wednesday	6:30AM–11PM
			Thursday	6:30AM–11PM
			Friday	6:30AM–11PM
			Saturday	6:30AM–6PM`,
		refimg: "https://www.cla.purdue.edu/resources/buildings/images/brng.jpg"
		},
		{ name: "Purdue Mathematical Sciences Building", location: "150 N University St, West Lafayette, IN 47907",
		bussiness_hour:
			`Sunday	1–10PM
			Monday	8AM–10PM
			Tuesday	8AM–10PM
			Wednesday	8AM–10PM
			Thursday	8AM–10PM
			Friday	8AM–5PM
			Saturday	1–5PM`,
		refimg: ""
		},
		{ name: "Purdue Physics Building", location: "525 Northwestern Ave, West Lafayette, IN 47907",
		bussiness_hour:
			`Missing Hours`,
		refimg: "http://purdue7barz.s3.amazonaws.com/physics-ext.jpg"
		},
		{ name: "Recreational Sports Center", location: "355 N Martin Jischke Dr, West Lafayette, IN 47906",
		bussiness_hour:
			`Sunday	11AM–10PM
			Monday	6AM–11PM
			Tuesday	6AM–11PM
			Wednesday	6AM–11PM
			Thursday	6AM–11PM
			Friday	6AM–10PM
			Saturday	8AM–8PM
			`,
		refimg: ""
		}

	];

	db.collection("Building").insertMany(buildinginfo, function(err, res) {
		if (err) {
			console.log(err)
		};
	});

}

/*
 * Summary. Function that checks if username exists in database
 *
 * @param {String} usrname The email of the account which the password is being extracted
 *
 * @return {int} Returns a value depending on if username exists (-1 = Cannot connect to database, 0 = Does not Exist, 1 = Exists)
 */
const userAccountExists = async function(usrname) {
	let userExists;

	try {
		userExists = await db.collection('User').find({user_name: usrname}).limit(1).count(true);
	} catch (err) {
		console.log(err.stack);
		return -1;
	}

	return userExists;
}

/**
 * Summary. Function that retrives chat rooms for a user
 *
 * @param {String} username The username of the account in question
 *
 * @return A list of conversations
 */
const getUserChats = async function(usrname) {
	let chatList;

	if(userAccountExists(usrname)){
		try{
			chatList = await db.collection('User').findOne({user_name:usrname}, {projection:{chats: true, _id: false}});
			console.log(chatList)
		} catch(err){
			console.log(err.stack);
			return -1;
		}
	}

	return chatList;

}

/**
 * Adds new message to chat history
 * @param {objectID} chat
 * @param {string} sender
 * @param {string} message
 */

const updateChatHistory = async function(chat, sender, message) {
	let chatID = ObjectId.createFromHexString(chat);
	try{
		db.collection("chat_room").updateOne({ "_id": chatID } , {
			"$push": {
				"History": {
					"sender": sender,
					"message": message
				}
			}
		});
	} catch (err){
		console.error(err);
	}
}

/**
 * Summary. Function that retrieve chat room message history for a given chat
 *
 * @param {*} chat The id of the chat in question
 *
 * @return An array of messages and their senders
 */
const getChatHistory = async function(chat) {
	let history;
	let chatExists;

	let id = ObjectId.createFromHexString(chat);
	console.log(typeof(id));

	try{
		chatExists = await db.collection("chat_room").find({_id: id});
		if(!chatExists){
			console.log("chat does not exist");
			return -1;
		}

		history = await db.collection("chat_room").findOne({_id: id}, {projection: {History: true, _id: false}});
		console.log(history);
	} catch(err){
		console.log(err.stack);
		return -1;
	}

	return history;
}

/**
 * Summary. Function to create a new chat room
 *
 * @param {Array} users The list of users to be added to the chat
 *
 * @return The id of the new chat document. -1 for failure, 0 for already exists
 */
const createChatRoom = async function(users) {
	var new_chat;
	if(users < 2){
		console.log("cannot make chat with one person");
		return -1;
	}

	const room = {
		"Members": users,
		"History":[]
	};

	// check database for chat room with same participatnts.
	let chats;
	chats = await db.collection("chat_room").find({},{projection: {Members:true, _id:true}}).toArray();
	console.log(chats);

	var i;
	for(i = 0; i< chats.length; i++){
		chats[i].Members = chats[i].Members.sort();
		users = users.sort();
		if(_.difference(chats[i].Members, users).length == 0){
			console.log("chat already exists");
			return chats[i]._id;
		}
	}

	new_chat = await db.collection("chat_room").insertOne(room);

	console.log(new_chat.insertedId);

	for(i = 0; i<users.length; i++){
		addChatToUser(users[i], new_chat.insertedId);
	}

	return new_chat.insertedId;

}

/**
 * Sumarry. Function to add chat room to user document
 *
 * @param {String} user The user to add the chat to
 *
 * @param {ObjectId} id The id of the new chat
 *
 * @return An integer value (1 = success, 0 = failure, -1 = error)
 */
const addChatToUser = async function(user, id){
	let retval;

	retval = await db.collection('User').updateOne({user_name:user}, {$push: {direct_message: id}});
	console.log(retval);
}

module.exports = {
	searchUsers,
	startDatabaseConnection,
	updateFriendRequest,
	populateDatabase,
	getUserInfo,
	getAccountPassword,
	createAccount,
	userAccountExists,
	getUserChats,
	createChatRoom,
	addChatToUser,
	getChatHistory,
	updateChatHistory,
	handleAcceptReject,
	searchUsersCT,
  searchStudyGroup,
  searchAllStudyGroup,
  updateStudyGroupRequest,
	createEvent,
  updateStudyGroupAnnounce,
  updateStudyGroupComment,
	searchClassTag,
	findUserCT,
  	searchStudyGroup,
  	searchAllStudyGroup,
  	updateStudyGroupRequest,
	createEvent,
	searchStudyGroup,
	searchAllStudyGroup,
	updateStudyGroupRequest,
	createEvent,
	getAllBuildings,
	searchUserEvent,
	getAllEvents,
	getCurrentEvent,
	handleBanUpdate,
	deleteStudyGroup,
	updateEvent,
	updateEventInvite,
  createSchedule,
  getEvent,
  getEvent,
  getDue,
  createSchedule,
	searchUserEventInvites,
	acceptEventInvite,
	declineEventInvite,
	searchInvitedEvent,
	deleteEvent,
	removeEvent
}
