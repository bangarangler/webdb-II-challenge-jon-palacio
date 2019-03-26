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
    return res
      .status(400)
      .json({ message: "Bad Request. Must provide a name" });
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

router.put("/:id", (req, res) => {
  db("bears")
    .where({ id: req.params.id })
    .update(req.body)
    .then(count => {
      if (count > 0) {
        res.status(200).json(count);
      } else {
        res.status(404).json({ message: "bear not found. can not update" });
      }
    })
    .catch(err => {
      res.status(500).json(err);
    });
});

router.delete("/:id", (req, res) => {
  db("bears")
    .where({ id: req.params.id })
    .del()
    .then(count => {
      if (count > 0) {
        res.status(204).end();
      } else {
        res.status(404).json({ message: "Bear not found" });
      }
    })
    .catch(err => {
      res.status(500).json(err);
    });
});

module.exports = router;
