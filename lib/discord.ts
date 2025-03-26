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

export async function sendErrorMessage(ip: string, url: string, method: string, code: number, object: object) {
  // Отправка в Discord
  const discordPayload = {
    content: "",
    tts: false,
    embeds: [{
      id: 467674012,
      color: 15510603,
      description: `## Ошибка в работе API\n` +
          `IP: ${ip}\n` +
          `URL: ${url}\n` +
          `Method: ${method}\n` +
          `Code: ${code}\n` +
          `JSON: \`\`\`${JSON.stringify(object)}\n\`\`\``
    }],
    username: "Errors",
    avatar_url: "https://cdn.discordapp.com/avatars/948287446808932373/73fbe4737f059852f8ffc523d83927e0.png"
  };

  await fetch(
      "https://discord.com/api/webhooks/1354453337134862447/tcCG2GXnFIroL7Sk9RyDJ5mHEY6r4vugJD5hQpWxJNL0ht_o9Pg0PCJoVkFUsxmJDgD0",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(discordPayload),
      }
  );
}