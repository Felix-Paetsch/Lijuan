import CHANNELS from "./channel_id_map.json" assert { type: 'json' };
import { EmbedBuilder } from 'discord.js';
import { catch_throw_internal } from "../utils/errors.js";

const catch_wrap = (fun) => {
    return (...args) => catch_throw_internal(() => fun(...args), "discord_error")
};

let client;
let event_manager;

export const init = function(_client, _event_manager){
    client = _client;
    event_manager = _event_manager;
}

export const send_message = catch_wrap(function(channel_ident, msg){
    let channel;
    if (typeof channel_ident == "string"){
        channel = client.channels.cache.get(CHANNELS[channel_ident.toLowerCase()]);
        if (!channel){
            const err = new Error(`Discord Channel ${ channel_ident } not found`);
            err.data = { type: "channel_not_found" };
            throw err;
        }
    } else {
        channel = channel_ident;
    }

    channel.send(msg);
    return true;
}, { soft_throw: true });

export const send_embed = catch_wrap(function(channel_ident, embed_data){
    let channel;
    if (typeof channel_ident == "string"){
        channel = client.channels.cache.get(CHANNELS[channel_ident.toLowerCase()]);
        if (!channel){
            const err = new Error(`Discord Channel ${ channel_ident } not found`);
            err.data = { error_type: "channel_not_found" };
            throw err;
        }
    } else {
        channel = channel_ident;
    }

    try{
        const embed = new EmbedBuilder()
        .setColor(embed_data.color || 0x4D6CFA)
        .setTitle(embed_data.title)
        .setTimestamp()

        if (embed_data.descr){
            embed.setDescription(embed_data.descr)
        }

        if (embed_data.fields){
            embed.addFields(
                ...embed_data.fields
            )
        }

        if (channel) channel.send({ embeds: [embed] });
        return true;
    } catch (err){
        if (!trigger_error){
            return;
        }
    
        err.data = embed_data;
        try{
            err.data.error_type = "embed_error"
        } catch (e){}

        throw err;
    }
}, { soft_throw: true });