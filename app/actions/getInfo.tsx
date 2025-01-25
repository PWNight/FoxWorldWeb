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