export async function getSession() {
    const response = await fetch("/api/v1/users/me", {
        method: "GET"
    });
    if ( !response.ok ) {
        return { success: false}
    }
    const json = await response.json();
    if ( !json.success ) {
        return { success: false }
    }
    return {success: true, data: json}
}

export async function getStats(data : any){
    const response = await fetch(`https://foxworldstatisticplan.dynmap.xyz/v1/player?player=${data.profile.fk_uuid}`,{
        method: "GET"
    })
    if ( !response.ok ) {
        return { success: false }
    }
    return { success: true, data: await response.json() };
}

export async function getAllMyGuilds(data:any){
    const session_token = data.token
    const response = await fetch("/api/v1/guilds/me",{
        method: "POST",
        body: JSON.stringify({session_token}),
    })

    if ( !response.ok ) {
        return { success: false }
    }

    const json = await response.json();
    if ( !json.success ) {
        return { success: false }
    }

    return { success: true, data: json.data }
}
export async function getGuild(url: string){
    const response = await fetch(`/api/v1/guilds/${url}`, {
        method: "GET",
    })

    if ( !response.ok ) {
        return { success: false }
    }

    const json = await response.json();
    if ( !json.success ) {
        return { success: false }
    }
    return { success: true, data: json.data};
}
export async function getGuildUsers(url: string) {
    const response = await fetch(`/api/v1/guilds/${url}/users`, {
        method: "GET",
    });
    if ( !response.ok ) {
        return { success: false }
    }

    const json = await response.json()
    if ( !json.success ) {
        return { success: false }
    }
    return { success: true, data: json.data }
}

export async function checkGuildAccess(url: string, data : any) {
    const response = await fetch(`/api/v1/guilds/${url}/users/${data.profile.id}`, {
        method: "GET",
    });

    if ( !response.ok ) {
        return { success: false }
    }

    const json = await response.json();
    if ( !json.success ) {
        return { success: false }
    }
    return { success: true, data: json.data }
}