import { make_query, catch_make_query, make_transaction } from "./db_connection.js";

export default (event_manager) => {
    event_manager.on("db_query", (query, callback) => {
        if (typeof query === "string") {
            return callback(make_query(query))
        }

        return callback(make_query(query.query, query.args));
    });

    event_manager.on("catch_db_query", (query, callback) => {
        if (typeof query === "string") {
            return callback(catch_make_query(query))
        }

        return callback(catch_make_query(query.query, query.args));
    });

    event_manager.on("db_transaction", (queries, callback) => {
        callback(make_transaction(queries));
    });

    console.log("PG database engaged!");
}