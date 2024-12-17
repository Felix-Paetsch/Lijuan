import on_error from "./errors.js";
import { send_message } from "../send_messages.js";

export default function register_listener(event_manager){
    on_error(event_manager);
    
    event_manager.on("updated_count", (count) => {
        send_message("index", `The new count is ${count}!`);
    })
}