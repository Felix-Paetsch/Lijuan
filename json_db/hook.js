import fs from 'fs/promises';
import path from 'path';
import { catch_wrap_internal } from"../utils/errors.js"

let current_data = null;

const dataDirPath = path.join(process.cwd(), 'json_db/data');
await fs.mkdir(dataDirPath, { recursive: true });
const dataFilePath = path.join(dataDirPath, 'global_storage.json');

const loadInitialData = async () => {
    try {
        const fileContent = await fs.readFile(dataFilePath, 'utf8');
        current_data = JSON.parse(fileContent);
        console.log("Global JSON storage loaded.");
    } catch (error) {
        console.log(`Global JSON storage reset.`);
        current_data = null;
    }
};

const saveDataToFile = catch_wrap_internal(async (data) => {
    await fs.writeFile(dataFilePath, JSON.stringify(data, null, 2), 'utf8');
}, "jdb_couldnt_save_file");

export default async (event_manager) => {
    await loadInitialData();
    event_manager.on("jdb_write_global", (data, callback = () => {}) => {
        current_data = data;
        callback(saveDataToFile(data));
    });

    event_manager.on("jdb_write_global_sync", catch_wrap_internal(async (data) => {
        current_data = data;
        await saveDataToFile(data);
    }, "saving_jdb_error"));

    event_manager.on("jdb_read_global", (callback) => {
        return callback(
            new Promise((resolve) => resolve(current_data))
        );
    });

    event_manager.on("jdb_read_global_sync", catch_wrap_internal((callback) => {
        return callback(current_data);
    }, "reading_jdb_error"));
};