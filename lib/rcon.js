import Rcon from 'rcon-srcds'

export const rconQuery = async (command) => {
    // TODO: Implement error response
    try {
        const server = new Rcon({ host: '135.181.126.159', port: 25571 });
        await server.authenticate("U9gL2cYAC1");
        return await server.execute(command) // You can read `status` reponse
    } catch(e) {
        return e
    }
};