
import redirect_page_not_found from "./utils/redirect_page_not_found.js";
import hot_reload_route from "./utils/hot_reload.js";

export default function register_routes(app){
    hot_reload_route(app);
    app.use((req, res) => redirect_page_not_found(req, res));
}