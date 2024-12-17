import fs from 'fs';
import { make_query, end_connection } from '../db_connection.js';

const run_table_init_queries = async () => {
    const migrationQuery = fs.readFileSync("./Database/init/sql/_migrations.sql", { encoding: 'utf8' });
    await make_query(migrationQuery);
    end_connection();
    console.log("Done!");
};

run_table_init_queries();