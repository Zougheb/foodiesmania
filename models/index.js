const mongoose    = require("mongoose");
      MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost/mongoHeadlines",
      options     = {
    autoIndex: false, // Don't build indexes
    reconnectTries: Number.MAX_VALUE, // Never stop trying to reconnect
    reconnectInterval: 500, // Reconnect every 500ms
    poolSize: 10, // Maintain up to 10 socket connections
    // If not connected, return errors immediately rather than waiting for reconnect
    bufferMaxEntries: 0
},

mongoose.connect(MONGODB_URI, options);
mongoose.set("debug", true);
mongoose.Promise = global.Promise;



