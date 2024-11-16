import fs from 'fs';
import DB_CONF from "../config.json" assert { type: 'json' };
import { make_query, end_connection } from '../db_connection.js';

const client_conf = {
    user: DB_CONF.pg_user,
    host: DB_CONF.pg_host,
    password: DB_CONF.pg_password,
    port: DB_CONF.pg_port,
    database: DB_CONF.pg_main_database
};

if (DB_CONF.pg_ssl) {
    client_DB_CONF.ssl = {
        rejectUnauthorized: false
    };
}

const run_table_init_queries = async () => {
    // Ensure you're using the correct path to the SQL file
    const migrationQuery = fs.readFileSync("./Database/init/sql/_migrations.sql", { encoding: 'utf8' });
    await make_query(migrationQuery);
    end_connection();
    console.log("Done!");
};

run_table_init_queries().catch(console.error);