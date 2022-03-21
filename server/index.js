const express = require("express");
const router = express.Router();
const Dao = require("./models/Dao");
require('./dbConfig');


router.get("/daos", async (req, res) => {
  try {
    const daoList = await Dao.find();
    res.json(daoList);
    console.log('Fetched');
  } catch (e) {
    res.send({ message: "Error in Fetching rendez vous" });
  }
});
/* Get Rendez Vous By id*/
module.exports = router;