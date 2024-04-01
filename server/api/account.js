const router = require("express").Router();
const manager = require('../account_manager')

router.route("/").get((req, res) => {
    const account = ["login", "register", "profile"]
    res.json(account);
});

/**
 * validates user credentials and allows login
 */
router.route("/login").post(async (req,res) => {
    console.log(req.body);
    let pass = await manager.getAccountPassword(req.body.username);
    console.log("returned from account manager: " + pass.password);
    if(pass.password != req.body.password){
        //TODO: Add encryption for passwords
        //Passwords don't match. Deny entry
        return res.status(400).json("error");
    }else{
        return res.status(200).json("success");
    }
});

/**
 * API endpoint to register a new user
 */
router.route("/register").post((req,res) => {
    console.log(req.body.uname);
    return manager.createAccount(req.body.uname,  req.body.email, 'cs', req.body.pass)
    .then(success => res.status(200).json(success))
    .catch(err => res.status(400).json(err));
});

/**
 *
 */
router.route("/searchUsers").get((req, res) => {
  manager.searchUsers(req.query.prefix).then(users => {
    console.log(users)
    res.json(users);
  });
});

router.route("/searchUsersCT").get((req, res) => {
  manager.searchUsersCT(req.query.classtag).then(users => {
    console.log(users)
    res.json(users);
  });
});

router.route("/searchClassTag").get((req, res) => {
  manager.searchClassTag(req.query.prefix).then(users => {
    console.log(users)
    res.json(users);
  });
});

router.route("/findUserCT").get((req, res) => {
  manager.findUserCT(req.query.prefix).then(users => {
    console.log(users)
    res.json(users);
  });
});

/**
 *
 */
router.route("/sendfr").post((req, res) => {
  return manager.updateFriendRequest(req.body.curUser, req.body.data)
  .then(success => res.status(200).json(success))
  .catch(err => res.status(400).json(err));
});

router.route("/updateUserInfo").post((req, res) => {
  console.log(req.body.data)
  console.log(req.body.type)
  if (req.body.type == "acceptfr" || req.body.type == "declinefr") {
    return manager.handleAcceptReject(req.body)
    .then(success => res.status(200).json(success))
    .catch(err => res.status(400).json(err));
  } else if (req.body.type == "ban") {
    console.log("ban cond")
    return manager.handleBanUpdate(req.body)
    .then(success => res.status(200).json(success))
    .catch(err => res.status(400).json(err));
  }
});

router.route("/deleteStudyGroup").get((req, res) => {
  manager.deleteStudyGroup(req.query.prefix).then(ret => {
    console.log("ret here")
    console.log(ret)
    res.json(ret);
  });
});

router.route("/searchStudyGroup").get((req, res) => {
  manager.searchStudyGroup(req.query.prefix).then(users => {
    console.log(users)
    res.json(users);
  });
});

router.route("/searchAllStudyGroup").get((req, res) => {
  manager.searchAllStudyGroup().then(users => {
    console.log(users)
    res.json(users);
  });
});

router.route("/updateStudyGroupRequest").post((req, res) => {
  console.log(req.body.data)
  console.log(req.body)
  return manager.updateStudyGroupRequest(req.body.curUser, req.body.data)
    .then(success => res.status(200).json(success))
    .catch(err => res.status(400).json(err));
});


router.route("/updateStudyGroupAnnounce").post((req, res) => {
  console.log(req.body.data)
  console.log(req.body.entered)
  console.log(req.body)
  console.log('reached here 2')
  return manager.updateStudyGroupAnnounce(req.body.data, req.body.entered)
    .then(success => res.status(200).json(success))
    .catch(err => res.status(400).json(err));
});

router.route("/updateStudyGroupComment").post((req, res) => {
  console.log(req.body.data)
  console.log(req.body.entered)
  return manager.updateStudyGroupComment(req.body.data, req.body.entered)
    .then(success => res.status(200).json(success))
    .catch(err => res.status(400).json(err));
});

router.route("/getBuildings").get((req, res) => {
  manager.getAllBuildings().then(buildings => {
    console.log(buildings)
    res.json(buildings);
  });
});

// router.route("/DONOTGOHERE").get((req, res) => {
//   manager.populateDatabase()
// });

module.exports = router;
