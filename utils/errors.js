import GLOBAL_CONF from "../config.json" assert { type: 'json' };

let em = null;

export const __init = (event_manager) => {
    em = event_manager;
}

export function _throw(err, data = null){
    data = data || err.data;
    _throw_internal(err, "throw", data);
}

export function catch_throw(fun, default_val = false){
    return catch_throw_internal(fun, "throw", default_val);
}

export function catch_wrap(fun, default_val = false){
    return (...args) => catch_throw(() => fun(...args), default_val);
}

export function _throw_internal(err, err_name, data = null){
    if (
        GLOBAL_CONF.throw_on_err
        && !data?.soft_throw
    ){
        data = data || err.data;
        if (data) {
            console.error(`======== ERROR ${ data?.error_type || "DATA" } ========`)
            console.error(data);
        }
        throw err;
    }
    
    em.emit(err_name, err, data);
    return false;
}

export async function catch_throw_internal(fun, err_name = "throw", default_val = false){
    try {
        const res = await fun();
        if (typeof res == "undefined") return true;
    } catch (e) {
        _throw_internal(e, err_name);
        return default_val;
    }
}

export function catch_wrap_internal(fun, err_name, default_val = false){
    return (...args) => catch_throw(() => fun(...args), err_name, default_val);
}

export function assert(bool, text, hard_err = false){
    if (bool) return bool;
    const err = new Error(text);
    if (hard_err){
        throw err;
    }
    err.data = {
        error_type: "assert_failed"
    }
    return _throw(err);
}