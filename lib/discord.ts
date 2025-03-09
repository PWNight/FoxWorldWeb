export async function sendDiscordMessage(discordId: string, message: string) {
  const botToken = process.env.BOT_TOKEN;

  let response = await fetch(`https://discord.com/api/users/@me/channels`,{
    headers: {
      "Authorization": `Bot ${botToken}`,
      "Content-Type": "application/json",
    },
    method: "POST",
    body: JSON.stringify({"recipient_id": discordId}),
  })
  const channels = await response.json()

  if ( !response.ok ){
    return { success: false, data: channels }
  }

  response = await fetch(`https://discord.com/api/channels/${channels.id}/messages`,{
    headers: {
      "Authorization": `Bot ${botToken}`,
      "Content-Type": "application/json",
    },
    method: "POST",
    body: JSON.stringify({"content": message}),
  })
  const json = await response.json()

  if ( !response.ok ){
    return { success: false, data: json }
  }
  return { success: true }
}