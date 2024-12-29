"use client";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import './guilds.css'

export default function Guilds() {
    const [guilds,setGuilds] = useState(Array)
    const [searchQuery, setSearchQuery] = useState(''); // Добавляем состояние для хранения поискового запроса
    const router = useRouter()

    useEffect(()=>{
        async function getAll(){
            const response = await fetch("http://fox-api/g",{
                method:"GET"
            })
            if(response.ok){
                const data = await response.json();
                setGuilds(data.data.all)
            }
        }
        getAll()
    },[])

    // Функция для фильтрации игроков по поисковому запросу
    const filteredGuilds = () => {
        if (!searchQuery) {
            return guilds;
        }
        return guilds.filter((guild:any) => guild.name.toLowerCase().includes(searchQuery.toLowerCase()));
    };

    if(guilds.length === 0){
        return(
            <>
            </>
        )
    }else{
        return (
            <>
                <div className="flex mt-9 flex-col gap-4 select-none">
                    <h1 className="text-3xl">Гильдии</h1>
                    <input className="p-3 border-2 border-solid w-60 rounded-lg outline-none" type="text" onChange={e => setSearchQuery(e.target.value)} placeholder="Поиск" />
                </div>
                <div className="guilds">
                    {
                        filteredGuilds().map((guild:any) => (
                            <div key={guild.id} onClick={() => router.push("/g/"+guild.url)} className="guild_card">
                                <div className="txt">
                                    <div className="head">
                                        <div className="owner"><img src="https://plasmorp.com/avatar/Apehum?w=24" alt='profile_avatar'></img><p>NoName</p></div>
                                    </div>
                                    <div className="info">
                                            <div>
                                                <h1>{guild.name}</h1>
                                                <p>{guild.slogan}</p>
                                            </div>
                                            <div className="notes">
                                                <ul>
                                                <li>{guild.members} участников</li>
                                                {guild.discord_code!=null&&<li>Есть Discord сервер</li>}
                                                {guild.base_xyz!=null&&<li>Есть метка базы</li>}
                                                <li>Дата регистрации: {guild.registred_since}</li>
                                                </ul>
                                            </div>
                                        </div>
                                </div>
                                <div className="img">
                                    {guild.emblem_url!=null&&<img src={guild.emblem_url} alt='guild_emblem'></img>}
                                </div>
                            </div>
                        ))
                    }
                </div>
            </>
        );
    }
}