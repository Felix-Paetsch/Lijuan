
import redirect_page_not_found from "./utils/redirect_page_not_found.js";
import hot_reload_route from "./utils/hot_reload.js";

export default function register_routes(app){
    app.event_manager.console_log();

    app.get("/", (req, res) => {
        req.event_manager.emit("jdb_read_global_sync", (jdb_res) => {
            res.render("index", {
                counter: jdb_res || 0
            });
        });
    });

    app.get("/click", (req, res) => {
        req.event_manager.emit("jdb_read_global_sync", (jdb_res) => {
            const count = ((jdb_res || 0) + 1);
            req.event_manager.emit("jdb_write_global_sync", count);
            req.event_manager.emit("updated_count", count);
            res.send(count.toString());
        });
    })
    
    app.get("/reset", (req, res) => {
        req.event_manager.emit("jdb_write_global_sync", 0);
        req.event_manager.emit("updated_count", 0);
        res.render("htmx_responses/reset"); // This could be done easier, just for the show
    })

    hot_reload_route(app);
    app.use((req, res) => redirect_page_not_found(req, res));
}