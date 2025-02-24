export async function getSession() {
    const response = await fetch("/api/v1/users/me", {
        method: "GET",
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
        method: "GET",
        headers: {"Authorization": `Bearer ${session_token}`},
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

export async function getMyGuildsApplications(data:any){
    const session_token = data.token
    const response = await fetch("/api/v1/guilds/me/applications", {
        method: "GET",
        headers: {
            "Authorization": `Bearer ${session_token}`
        }
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

export async function getGuildApplications(url: string, token: string) {
    const response = await fetch(`/api/v1/guilds/${url}/applications`, {
        headers: {
            Authorization: `Bearer ${token}`
        },
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

export async function getVerifyApplications(token: string) {
    const response = await fetch(`/api/v1/users/applications`, {
        headers: {
            Authorization: `Bearer ${token}`
        },
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