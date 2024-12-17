import pg from "pg"
import DB_CONF from "./config.json" assert { type: 'json' };

const client_conf = {
    user: DB_CONF.pg_user,
    host: DB_CONF.pg_host,
    password: DB_CONF.pg_password,
    port: DB_CONF.pg_port,
    database: DB_CONF.pg_database
}

if (DB_CONF.pg_ssl){
    client_conf.ssl = {
        rejectUnauthorized: false
    }
}

// Initialize multiple pools
const numPools = DB_CONF.concurrent_pools;
const pools = Array.from({ length: numPools }, () => new pg.Pool(client_conf));

let currentPoolIndex = 0;
function getNextPool() {
    const pool = pools[currentPoolIndex];
    currentPoolIndex = (currentPoolIndex + 1) % pools.length; // Round-robin increment
    return pool;
}

export function make_query(query, args = []) {
    const pool = getNextPool();
    return new Promise((resolve, reject) => {
        pool.query(query, args, (err, res) => {
            if (err) return reject(err);
            return resolve(res);
        });
    });
}

export function make_transaction(queries) {
    const pool = getNextPool();
    return new Promise(async (resolve, reject) => {
        const client = await pool.connect();
        const results = [];
        try {
            await client.query('BEGIN');
            for (const [query, args] of queries) {
                const queryResult = await client.query(query, args);
                results.push(queryResult);
            }
            await client.query('COMMIT');
            resolve(results);
        } catch (error) {
            await client.query('ROLLBACK');
            reject(error);
        } finally {
            client.release();
        }
    });
}

export function get_pool(){
    return getNextPool();
}

export function end_connection(){
    pools.forEach(pool => pool.end());
}
