const express = require("express");
const helmet = require("helmet");
const knex = require("knex");

const server = express();

server.use(express.json());
server.use(helmet());

// endpoints here
const knexConfig = {
  client: "sqlite3",
  useNullAsDefault: true,
  connection: {
    filename: "./data/lambda.sqlite3"
  },
  debug: true
};

const db = knex(knexConfig);
const bearsRouter = require("./router/bearsRouter.js");

server.use("/api/bears", bearsRouter);

server.post("/api/zoos", (req, res) => {
  db("zoos")
    .insert(req.body)
    .then(ids => {
      const id = ids[0];
      db("zoos")
        .where({ id })
        .first()
        .then(z => {
          res.status(201).json(z);
        });
    })
    .catch(err => {
      res.status(500).json(err);
    });
});

server.get("/api/zoos", (req, res) => {
  db("zoos")
    .then(zoo => {
      res.status(200).json(zoo);
    })
    .catch(err => {
      res.status(500).json(err);
    });
});

server.get("/api/zoos/:id", (req, res) => {
  const zooID = req.params.id;
  db("zoos")
    .where({ id: zooID })
    .first()
    .then(zoo => {
      res.status(200).json(zoo);
    })
    .catch(err => {
      res.status(500).json(err);
    });
});

server.delete("/api/zoos/:id", (req, res) => {
  db("zoos")
    .where({ id: req.params.id })
    .del()
    .then(count => {
      if (count > 0) {
        res.status(204).end();
      } else {
        res.status(404).json({ message: "Zoo not found!" });
      }
    })
    .catch(err => {
      res.status(500).json(err);
    });
});

server.put("/api/zoos/:id", (req, res) => {
  db("zoos")
    .where({ id: req.params.id })
    .update(req.body)
    .then(count => {
      if (count > 0) {
        res.status(200).json(count);
      } else {
        res.status(404).json({ message: "Zoo not found. Can not update" });
      }
    })
    .catch(err => {
      res.status(500).json(err);
    });
});
//router.post('/', (req, res) => {
//// get back an array with the last id generated: [ 3 ]
//db('roles')
//.insert(req.body)
//.then(ids => {
//const id = ids[0];
//db('roles')
//.where({ id })
//.first()
//.then(role => {
//res.status(201).json(role);
//});
//})
//.catch(error => {
//res.status(500).json(error);
//});
//});

const port = 3300;
server.listen(port, function() {
  console.log(`\n=== Web API Listening on http://localhost:${port} ===\n`);
});
