import { Rcon } from "minecraft-rcon-client";
const client = new Rcon({
    host: '135.181.126.159',
    port: 25571,
    password: 'U9gL2cYAC1'
});

export async function rconQuery(command) {
    try {
        await client.connect();
        const response = await client.query(command);
        await client.disconnect();
        return response;
    }catch(e) {
        return e
    }
}