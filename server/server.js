require("dotenv").config();
const express = require("express");
const app = express();
const eventRouter = require("./routes/eventRouter");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("../client/public"));
app.use("/api/events", eventRouter);

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
    console.log(`Now listening on http://localhost:${ PORT }`);
});