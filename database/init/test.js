import fs from 'fs';
import DB_CONF from "../config.json" assert { type: 'json' };
import { make_query, end_connection } from '../db_connection.js';

const client_conf = {
    user: DB_CONF.pg_user,
    host: DB_CONF.pg_host,
    password: DB_CONF.pg_password,
    port: DB_CONF.pg_port,
    database: DB_CONF.pg_main_database
}

if (DB_CONF.pg_ssl){
    client_conf.ssl = {
        rejectUnauthorized: false
    }
}

run_table_init_queries();

async function run_table_init_queries(){
    const splitted = fs.readFileSync("./Database/init/sql/_test.sql", { encoding: 'utf8' }).split("-- sep --");

    for (const query in splitted){
        console.log("===================");
        console.log("Query:", splitted[query].trim());
        
        const res = await make_query(splitted[query]);

        console.log("Result:", res.rows);
        console.log("===================");

    }

    end_connection();
    console.log("Done!");
}