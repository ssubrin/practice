var express = require("express");
const db = require("../database");
var router = express.Router();

router.get("/", async function (req, res) {
    // fetch data from postgres
    const result = await db.query("SELECT * FROM entries;");
    console.log(result);
    // send the data as response
    res.send(result.rows);
});
router.get("/:id", async function (req, res) {
        const entryId = req.params.id;
        // Fetch data from postgres for the specified entry ID
        const result = await db.query("SELECT * FROM entries WHERE id = $1;", [entryId]);
        // Send the data as response
        res.json(result.rows[0]);
});

router.patch("/:id", async function (req, res) {
        const entryId = req.params.id;
        const { value } = req.body;

        // Construct the SQL query for updating the 'value' column in the entry
        const updateQuery = "UPDATE entries SET value = $2 WHERE id = $1 RETURNING *;";
        const updateValues = [entryId, value];

        // Execute the update query
        const result = await db.query(updateQuery, updateValues);
     // Send the updated data as response
        res.json(result.rows[0]);
});


router.delete("/:id", async function (req, res) {
        const entryId = req.params.id;
        // Construct the SQL query for deleting the entry
        const deleteQuery = "DELETE FROM entries WHERE id = $1 RETURNING *;";
        const deleteValues = [entryId];

        // Execute the delete query
        const result = await db.query(deleteQuery, deleteValues);
       // Send the deleted data as response (optional)
        res.json({ message: "Entry deleted successfully", deletedEntry: result.rows[0] });
});

router.post("/", async function (req, res) {
    // read data from client
    const { title, value, type } = req.body;

    // save data to database
    const result = await db.query(
        `INSERT INTO entries (title, value, type) VALUES ($1, $2, $3) RETURNING *;`,
        [title, value, type]
    );

    // send the new entry as response
    res.send(result.rows[0]);
});


// GET /:id - get single entry
// PATCH /:id - update single entry
// DELTE /:id - delete single entry

module.exports = router;
