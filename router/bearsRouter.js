const express = require("express");
const knex = require("knex");

const router = express.Router();

const knexConfig = {
  client: "sqlite3",
  useNullAsDefault: true,
  connection: {
    filename: "./data/lambda.sqlite3"
  },
  debug: true //TODO:  Remove before deploying
};

const db = knex(knexConfig);

router.get("/", (req, res) => {
  db("bears")
    .then(bear => {
      res.status(200).json(bear);
    })
    .catch(err => {
      res.status(500).json(err);
    });
});

router.get("/:id", async (req, res) => {
  const bearID = req.params.id;
  try {
    const bears = await db("bears")
      .where({ id: bearID })
      .first();
    res.status(200).json(bears);
  } catch {
    res.status(500).json({ message: "Internal Server Error" });
  }
});

router.post("/", async (req, res) => {
  if (req.body.name === "") {
    res.status(400).json({ message: "Bad Request. Must provide a name" });
  }
  try {
    const newBear = await db("bears").insert(req.body);
    const id = newBear[0];
    console.log(id);
    const newObjBear = await db("bears")
      .where({ id })
      .first();
    res.status(201).json(newObjBear);
    //res.status(200).json(id);
  } catch {
    res.status(500).json({ message: "Internal Server Error" });
  }
});

module.exports = router;
