// Ф-ия получения данных о пользователе из сессии
export async function getSession() {
    const response = await fetch("/api/v1/users/me", {
        method: "GET",
    });
    if ( !response.ok ) {
        const errorJSON = await response.json();
        console.log(errorJSON)

        return {
            success: false,
            code: response.status,
            message: errorJSON.message || "Произошла ошибка при получении данных из API",
            error: errorJSON.error || "Неизвестная ошибка",
        }
    }

    const json = await response.json();
    return { success: true, data: json }
}

// Ф-ия получения статистики об игроке по его UUID
export async function getStats(uuid: string){
    const response = await fetch(`https://foxworldstatisticplan.dynmap.xyz/v1/player?player=${uuid}`,{
        method: "GET"
    })
    if ( !response.ok ) {
        const errorJSON = await response.json();
        console.log(errorJSON)

        return {
            success: false,
            code: response.status,
            message: errorJSON.message || "Произошла ошибка при получении данных из API",
            error: errorJSON.error || "Неизвестная ошибка",
        }
    }

    const json = await response.json();
    return { success: true, data: json };
}

export async function getAllMyGuilds(token: string){
    const response = await fetch("/api/v1/guilds/me",{
        method: "GET",
        headers: {"Authorization": `Bearer ${token}`},
    })

    if ( !response.ok ) {
        const errorJSON = await response.json();
        console.log(errorJSON)

        return {
            success: false,
            code: response.status,
            message: errorJSON.message || "Произошла ошибка при получении данных из API",
            error: errorJSON.error || "Неизвестная ошибка",
        }
    }

    const json = await response.json();
    return { success: true, data: json.data }
}

export async function getMyGuildsApplications(token: string){
    const response = await fetch("/api/v1/guilds/me/applications", {
        method: "GET",
        headers: {
            "Authorization": `Bearer ${token}`
        }
    })

    if ( !response.ok ) {
        const errorJSON = await response.json();
        console.log(errorJSON)

        return {
            success: false,
            code: response.status,
            message: errorJSON.message || "Произошла ошибка при получении данных из API",
            error: errorJSON.error || "Неизвестная ошибка",
        }
    }

    const json = await response.json();
    return { success: true, data: json.data }
}

export async function getGuild(url: string){
    const response = await fetch(`/api/v1/guilds/${url}`, {
        method: "GET",
    })

    if ( !response.ok ) {
        const errorJSON = await response.json();
        console.log(errorJSON)

        return {
            success: false,
            code: response.status,
            message: errorJSON.message || "Произошла ошибка при получении данных из API",
            error: errorJSON.error || "Неизвестная ошибка",
        }
    }

    const json = await response.json();
    return { success: true, data: json.data};
}
export async function getGuildUsers(url: string) {
    const response = await fetch(`/api/v1/guilds/${url}/users`, {
        method: "GET",
    });
    if ( !response.ok ) {
        const errorJSON = await response.json();
        console.log(errorJSON)

        return {
            success: false,
            code: response.status,
            message: errorJSON.message || "Произошла ошибка при получении данных из API",
            error: errorJSON.error || "Неизвестная ошибка",
        }
    }

    const json = await response.json()
    return { success: true, data: json.data }
}

export async function getGuildUser(url: string, uId: number) {
    const response = await fetch(`/api/v1/guilds/${url}/users/${uId}`, {
        method: "GET",
    });

    if ( !response.ok ) {
        const errorJSON = await response.json();
        console.log(errorJSON)

        return {
            success: false,
            code: response.status,
            message: errorJSON.message || "Произошла ошибка при получении данных из API",
            error: errorJSON.error || "Неизвестная ошибка",
        }
    }

    const json = await response.json();
    return { success: true, data: json.data }
}

export async function getGuildAlbum(url: string) {
    const response = await fetch(`/api/v1/guilds/${url}/album`, {
        method: "GET",
    });

    if ( !response.ok ) {
        const errorJSON = await response.json();
        console.log(errorJSON)

        return {
            success: false,
            code: response.status,
            message: errorJSON.message || "Произошла ошибка при получении данных из API",
            error: errorJSON.error || "Неизвестная ошибка",
        }
    }

    const json = await response.json();
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
        const errorJSON = await response.json();
        console.log(errorJSON)

        return {
            success: false,
            code: response.status,
            message: errorJSON.message || "Произошла ошибка при получении данных из API",
            error: errorJSON.error || "Неизвестная ошибка",
        }
    }

    const json = await response.json()
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
        const errorJSON = await response.json();
        console.log(errorJSON)

        return {
            success: false,
            code: response.status,
            message: errorJSON.message || "Произошла ошибка при получении данных из API",
            error: errorJSON.error || "Неизвестная ошибка",
        }
    }

    const json = await response.json()
    return { success: true, data: json.data }
}