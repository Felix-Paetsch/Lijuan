import fs from 'fs/promises';
import path from 'path';
import 'dotenv/config';
import CONF from "./config.json" assert { type: 'json' };
import EventManager from "./event_manager.js";

const event_manager = new EventManager();

const executeHooks = async () => {
    const currentDir = process.cwd();
    const folders = await fs.readdir(currentDir, { withFileTypes: true });

    const allowedModules = Array.isArray(CONF.use_modules) && CONF.use_modules.length > 0
        ? CONF.use_modules.map(module => module.toLowerCase())
        : null;

    let modulesToProcess = [];
    if (allowedModules) {
        for (const moduleName of allowedModules) {
            const folder = folders.find(dir => dir.isDirectory() && dir.name.toLowerCase() === moduleName);
            if (folder) {
                modulesToProcess.push(folder.name);
            } else {
                if (CONF.catch_module_error) {
                    console.warn(`Module folder "${moduleName}" not found.`);
                } else {
                    throw new Error(`Module folder "${moduleName}" not found.`);
                }
            }
        }
    } else {
        modulesToProcess = folders
            .filter(dir => dir.isDirectory())
            .map(dir => dir.name);
    }

    for (const folderName of modulesToProcess) {
        const hookPath = path.join(currentDir, folderName, 'hook.js');

        const fileExists = await fs
            .access(hookPath)
            .then(() => true)
            .catch(() => false);

        if (!fileExists) {
            if (CONF.catch_module_error) {
                console.warn(`hook.js not found in module "${folderName}".`);
            } else {
                throw new Error(`hook.js not found in module "${folderName}".`);
            }
            continue;
        }

        try {
            const hook = await import(`file://${hookPath}`);
            if (typeof hook.default === 'function') {
                await hook.default(event_manager);
                console.log(`Loaded hook from "${folderName}/hook.js"`);
            } else {
                if (CONF.catch_module_error) {
                    console.warn(`Default export in "${folderName}/hook.js" is not a function.`);
                } else {
                    throw new Error(`Default export in "${folderName}/hook.js" is not a function.`);
                }
            }
        } catch (error) {
            if (CONF.catch_module_error) {
                console.error(`Error loading or executing "${hookPath}":`, error.message);
            } else {
                throw error;
            }
        }
    }
};

executeHooks();
