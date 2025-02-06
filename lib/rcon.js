import { Rcon } from "minecraft-rcon-client";
const client = new Rcon({
    host: '135.181.126.159',
    port: 25793,
    password: 'A4$c6QvaB@y7n;g0x;Tr'
});

export async function rconQuery(command) {
    try {
        await client.connect();
        const response = await client.query(command);
        client.disconnect();
        return response;
    }catch(e) {
        return e
    }
}