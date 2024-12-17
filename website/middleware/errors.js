import WEBSITE_CONF from "../config.json" assert { type: 'json' };
import { _throw_internal } from "../../utils/errors.js";

export default (app) => {
    app.use((err, req, res, next) => {
        if (!WEBSITE_CONF.is_publish && WEBSITE_CONF.throw_on_server_error){
            throw err;
        }

        _throw_internal(err, "middleware_error");
        return res.status(500).redirect("/server_error");
    });
}