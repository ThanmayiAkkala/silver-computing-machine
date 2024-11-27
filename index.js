const express = require("express");
const bodyParser = require("body-parser");
const MongoClient = require("mongodb").MongoClient;
const ObjectId = require("mongodb").ObjectId;
const mysql = require("mysql2");
const cors = require("cors");

const app = express();
const PORT = 3000;

app.use(bodyParser.json());
app.use(cors({ origin: "*" }));

// MongoDB connection string
const dbURI =
  "mongodb+srv://akkalathanmayi12:thanmayi123@cluster0.r6ohtow.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";
let db;

MongoClient.connect(dbURI, { useUnifiedTopology: true })
  .then((client) => {
    console.log("Connected to Database");
    db = client.db("cs480-project2");
  })
  .catch(console.error);

const conn = mysql.createConnection({
  host: process.env["host"],
  user: process.env["user"] /* MySQL User */,
  password: process.env["password"] /* MySQL Password */,
  database: process.env["database"] /* MySQL Database */,
});

conn.connect((err) => {
  if (err) throw err;
  console.log("Mysql Connected with Apap...");
});

// Create a new router
const router = express.Router();

// Define routes on the router instead of the app
router.get("/documents", (req, res) => {
  db.collection("colors")
    .find()
    .toArray()
    .then((results) => {
      if (!results.length)
        res.json([]); // Return an empty array if no documents found
      else res.json(results); // Return an array of documents
    })
    .catch((error) => {
      console.error(error);
      res.json(["An error has occurred."]);
    });
});

router.post("/documents", (req, res) => {
  db.collection("colors")
    .insertOne(req.body)
    .then((result) => {
      if (result.acknowledged)
        res.json(result); // Check if the insert operation was acknowledged
      else res.json([]); // Return an empty array if not acknowledged (no document inserted)
    })
    .catch((error) => {
      console.error(error);
      res.json(["An error has occurred."]);
    });
});

router.get("/documents/:id", (req, res) => {
  db.collection("colors")
    .findOne({ _id: new ObjectId(req.params.id) })
    .then((result) => {
      if (!result)
        res.json([]); // Return an empty array if no document found
      else res.json(result); // Return the document
    })
    .catch((error) => {
      console.error(error);
      res.json(["An error has occurred."]);
    });
});

router.put("/documents/:id", (req, res) => {
  db.collection("colors")
    .updateOne({ _id: new ObjectId(req.params.id) }, { $set: req.body })
    .then((result) => {
      if (result.modifiedCount === 0)
        res.json([]); // Return an empty array if no document was updated
      else res.json(result); // Return the result object if the document was updated
    })
    .catch((error) => {
      console.error(error);
      res.json(["An error has occurred."]);
    });
});

router.delete("/documents/:id", (req, res) => {
  db.collection("colors")
    .deleteOne({ _id: new ObjectId(req.params.id) })
    .then((result) => {
      if (result.deletedCount === 0)
        res.json([]); // Return an empty array if no document was deleted
      else res.json(result); // Return the result object if the document was deleted
    })
    .catch((error) => {
      console.error(error);
      res.json(["An error has occurred."]);
    });
});

app.get("/api/v1/actors", (req, res) => {
  conn.query("SELECT * FROM actor", (error, results) => {
    if (error) return res.json(["An error has occurred."]);
    res.json(results);
  });
});

app.get("/api/v1/films", (req, res) => {
  let query = "SELECT * FROM film";
  const params = [];

  // Check for a search query parameter
  if (req.query.query) {
    query += " WHERE LOWER(title) LIKE LOWER(?)";
    params.push(`%${req.query.query}%`);
  }

  conn.query(query, params, (error, results) => {
    if (error) {
      console.error(error);
      return res.json(["An error has occurred."]);
    }
    res.json(results.length ? results : []);
  });
});

// Get all customers
app.get("/api/v1/customers", (req, res) => {
  const query = "SELECT * FROM customer";
  conn.query(query, (error, results) => {
    if (error) {
      console.error(error);
      return res.json(["An error has occurred."]);
    }
    res.json(results.length ? results : []);
  });
});

// Get all stores
app.get("/api/v1/stores", (req, res) => {
  const query = "SELECT * FROM store";
  conn.query(query, (error, results) => {
    if (error) {
      console.error(error);
      return res.json(["An error has occurred."]);
    }
    res.json(results.length ? results : []);
  });
});

// Get all staff
app.get("/api/v1/staff", (req, res) => {
  const query = "SELECT * FROM staff";
  conn.query(query, (error, results) => {
    if (error) {
      console.error(error);
      return res.json(["An error has occurred."]);
    }
    res.json(results.length ? results : []);
  });
});

// Get a specific actor by ID
app.get("/api/v1/actors/:id", (req, res) => {
  const query = "SELECT * FROM actor WHERE actor_id = ?";
  conn.query(query, [req.params.id], (error, results) => {
    if (error) {
      console.error(error);
      return res.json(["An error has occurred."]);
    }
    res.json(results.length ? results[0] : []);
  });
});

// Get a specific film by ID
app.get("/api/v1/films/:id", (req, res) => {
  const query = "SELECT * FROM film WHERE film_id = ?";
  conn.query(query, [req.params.id], (error, results) => {
    if (error) {
      console.error(error);
      return res.json(["An error has occurred."]);
    }
    res.json(results.length ? results[0] : []);
  });
});

// Get a specific customer by ID
app.get("/api/v1/customers/:id", (req, res) => {
  const query = "SELECT * FROM customer WHERE customer_id = ?";
  conn.query(query, [req.params.id], (error, results) => {
    if (error) {
      console.error(error);
      return res.json(["An error has occurred."]);
    }
    res.json(results.length ? results[0] : []);
  });
});

// Get a specific store by ID
app.get("/api/v1/stores/:id", (req, res) => {
  const query = "SELECT * FROM store WHERE store_id = ?";
  conn.query(query, [req.params.id], (error, results) => {
    if (error) {
      console.error(error);
      return res.json(["An error has occurred."]);
    }
    res.json(results.length ? results[0] : []);
  });
});

// Get a specific staff member by ID
app.get("/api/v1/staff/:id", (req, res) => {
  const query = "SELECT * FROM staff WHERE staff_id = ?";
  conn.query(query, [req.params.id], (error, results) => {
    if (error) {
      console.error(error);
      return res.json(["An error has occurred."]);
    }
    res.json(results.length ? results[0] : []);
  });
});

// Get a specific inventory item by ID
app.get("/api/v1/inventory/:id", (req, res) => {
  const query = "SELECT * FROM inventory WHERE inventory_id = ?";
  conn.query(query, [req.params.id], (error, results) => {
    if (error) {
      console.error(error);
      return res.json(["An error has occurred."]);
    }
    res.json(results.length ? results[0] : []);
  });
});

app.get("/api/v1/actors/:id/films", (req, res) => {
  // SQL query that joins the film_actor table with the film table
  // to find all films associated with a specific actor ID
  const query = `
    SELECT f.film_id, f.title, f.description, f.release_year, f.language_id, f.rental_duration, 
           f.rental_rate, f.length, f.replacement_cost, f.rating, f.special_features
    FROM film_actor fa
    JOIN film f ON fa.film_id = f.film_id
    WHERE fa.actor_id = ?
  `;

  conn.query(query, [req.params.id], (error, results) => {
    if (error) {
      console.error(error);
      return res.json(["An error has occurred."]);
    }
    res.json(results.length ? results : []);
  });
});

app.get("/api/v1/films/:id/actors", (req, res) => {
  // SQL query that joins the film_actor table with the actor table
  // to find all actors associated with a specific film ID
  const query = `
    SELECT a.actor_id, a.first_name, a.last_name
    FROM film_actor fa
    JOIN actor a ON fa.actor_id = a.actor_id
    WHERE fa.film_id = ?
  `;

  conn.query(query, [req.params.id], (error, results) => {
    if (error) {
      console.error(error);
      return res.json(["An error has occurred."]);
    }
    res.json(results.length ? results : []);
  });
});
app.get("/api/v1/films/:id/detail", (req, res) => {
  // SQL query to select the row from film_list view where the FID matches the specified ID
  const query = "SELECT * FROM film_list WHERE FID = ?";

  conn.query(query, [req.params.id], (error, results) => {
    if (error) {
      console.error(error);
      return res.json(["An error has occurred."]);
    }
    // The view should only match one row, but we check for length and return the first item if present
    res.json(results.length ? results[0] : []);
  });
});

app.get("/api/v1/customers/:id/detail", (req, res) => {
  // SQL query to select the row from customer_list view where the ID matches the specified ID
  const query = "SELECT * FROM customer_list WHERE ID = ?";

  conn.query(query, [req.params.id], (error, results) => {
    if (error) {
      console.error(error);
      return res.json(["An error has occurred."]);
    }
    // Since the view should only have a unique row per customer, we return the first result if available
    res.json(results.length ? results[0] : []);
  });
});

app.get("/api/v1/actors/:id/detail", (req, res) => {
  // SQL query to select the rows from actor_info view where the actor_id matches the specified ID
  const query = "SELECT * FROM actor_info WHERE actor_id = ?";

  conn.query(query, [req.params.id], (error, results) => {
    if (error) {
      console.error(error);
      return res.json(["An error has occurred."]);
    }
    // The view might return multiple rows if the actor is in multiple films, so return all matching records
    res.json(results.length ? results : []);
  });
});

app.get("/api/v1/inventory-in-stock/:film_id/:store_id", (req, res) => {
  // Extracting film_id and store_id from the route parameters
  const { film_id, store_id } = req.params;

  // Calling the stored procedure film_in_stock
  const query = "CALL film_in_stock(?, ?, @count)";

  conn.query(query, [film_id, store_id], (error, results, fields) => {
    if (error) {
      console.error(error);
      return res.json(["An error has occurred."]);
    }
    // The result of CALLing a stored procedure might be nested within the results object,
    // depending on the MySQL driver version. Adjust the response accordingly.
    const inventoryIds = results[0].map((row) => row.inventory_id);
    res.json(inventoryIds.length ? inventoryIds : []);
  });
});

// Tell the app to use the router on all paths starting with /api/v1
app.use("/api/v1", router);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}` + "...");
});
