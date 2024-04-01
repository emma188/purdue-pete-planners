const router = require("express").Router();
const manager = require('../account_manager')

router.route("/").get((req, res) => { 
    const messaging = ["userChats", "chatHistory"]
    res.json(messaging);
});

/**
 * route to get the chats in a user chat list.
 */
router.route("/userChats").get(async (req,res) => {
    console.log(req);
    let chatlist = manager.getUserChats(req.body.username);
    console.log("From chats:\n" + chatlist);
});

router.route("/chatHistory").get(async (req,res) => {
    console.log("chat id to retrieve:" + req.query.prefix);
    return manager.getChatHistory(req.query.prefix)
    .then(chatHist => {
        res.json(chatHist);
    });
});

module.exports = router;