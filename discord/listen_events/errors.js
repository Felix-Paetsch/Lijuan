import { send_embed } from "../send_messages.js";
import { catch_wrap } from "../../utils/errors.js";

export default function listen_errors(event_manager){
    event_manager.on("discord_error", catch_wrap((err, data) => {
        let errorStack = err.stack || 'No stack trace available';
        errorStack = errorStack.substring(0, 1000);
        
        return send_embed("errors", {
            color: 0xFF0000,
            title: "Internal error",
            descr: data?.text,
            fields: [{
                name: "Event",
                value: type || "NAS"
            }, {
                name: 'Stack Trace',
                value: `\`\`\`${errorStack}\`\`\``, inline: false
            }]
        }, false);
    }), { soft_throw: true });
}