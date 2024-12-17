import fs from 'fs';
import { make_query, end_connection } from '../db_connection.js';

run_test_queries();
async function run_test_queries(){
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