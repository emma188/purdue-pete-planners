const router = require("express").Router();
const manager = require('../account_manager');

router.route("/").get((req, res) => {
  const home = ["home"]
  res.json(home);
});

router.post("/home", (req,res) => {
  res.send('200: success')
});


router.route("/getDue").get((req, res) => {
  console.log(req);
  manager.getDue(req.query.prefix).then(users => {
    console.log(users)
    res.json(users);
  });
});

module.exports = router;
