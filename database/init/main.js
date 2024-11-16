import fs from 'fs';
import path from 'path';
import pg from "pg";
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
    client_conf.ssl = {
        rejectUnauthorized: false
    };
}

if (!DB_CONF.pg_user.startsWith("postgres")) {
    console.log("DB:", DB_CONF.pg_database);
    throw new Error("Careful!!!");
}

const db_init_pool = new pg.Pool(client_conf);

db_init_pool.query(`DROP DATABASE IF EXISTS ${DB_CONF.pg_database}`, (err, res) => {
    db_init_pool.query(`CREATE DATABASE ${DB_CONF.pg_database}`, (err, res) => {
        db_init_pool.end();
        if (err) throw err;

        run_table_init_queries();
    });
});

async function run_table_init_queries() {
    const sqlDirectory = "./Database/init/sql"; // Directory containing SQL files
    const sqlFiles = fs.readdirSync(sqlDirectory)
        .filter(file => file.endsWith('.sql') && !file.startsWith('_')); // Exclude files starting with "_"

    const queries = sqlFiles.map(file => 
        fs.readFileSync(path.join(sqlDirectory, file), { encoding: 'utf8' })
    );

    for (const query of queries) {
        await make_query(query);
    }

    end_connection();
    console.log("Done!");
}