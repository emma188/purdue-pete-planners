const router = require("express").Router();
const axios = require('axios')

var diningUrl = 'https://api.hfs.purdue.edu/menus/v2/';

router.route("/").get((req, res) => {
  //TODO: parse the data
  diningUrl += "locations/Hillenbrand/03-03-2021";
  return axios.get(diningUrl)
    .then((response) => {
      if (!response.data) {
        return reject('No data was returned');
      }

      console.log(response.data)
      res.json(response.data);
      return response.data;
    })
    .catch((err) => {
      console.log(err);
      return err;
    });
});

router.route("/locations").get((req, res) => {
  var curdate = new Date();
  let date = (`0${curdate.getDate()}`).slice(-2);
  let month = (`0${curdate.getMonth() + 1}`).slice(-2);
  let year = curdate.getFullYear();
  let dateDisplay = `${month}-${date}-${year}`;
  // console.log(dateDisplay)
  //03-03-2021
  return axios.get(diningUrl + `locations/${req.query.location}/${dateDisplay}`)
    .then((response) => {
      if (!response.data) {
        return reject('No data was returned');
      }

      // console.log(response.data)
      res.json(response.data);
      return response.data;
    })
    .catch((err) => {
      console.log(err);
      return err;
    });
});

module.exports = router;