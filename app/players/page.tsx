"use client";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import './players.css'

export default function Players() {
    const [players,setPlayers] = useState(Array)
    const [searchQuery, setSearchQuery] = useState(''); // Добавляем состояние для хранения поискового запроса
    const router = useRouter()

    useEffect(()=>{
        async function getAll(){
            const response = await fetch("http://135.181.126.159:25576/v1/playersTable",{
                method:"GET"
            })
            if(response.ok){
                const data = await response.json();
                setPlayers(data.players)
            }
        }
        getAll()
    },[])

    // Функция для фильтрации игроков по поисковому запросу
    const filteredPlayers = () => {
        if (!searchQuery) {
            return players;
        }
        return players.filter((player:any) => player.playerName.toLowerCase().includes(searchQuery.toLowerCase()));
    };

    if(players.length != 0){
        return (
            <>
                <div className="flex mt-9 flex-col gap-4 select-none">
                    <h1 className="text-3xl">Игроки</h1>
                    <input className="p-3 border-2 border-solid w-60 border-input bg-input rounded-lg outline-none placeholder-current" type="text" onChange={e => setSearchQuery(e.target.value)} placeholder="Поиск" />
                </div>
                <div className="players">
                    {
                        filteredPlayers().map((player:any) => (
                            <div key={player.playerName} onClick={() => router.push("/p/"+player.playerName)} className="player_card">
                                <div className="avatar">
                                    <img src={"https://crafatar.com/avatars/"+player.playerUUID+"?size=120&default=MHF_Steve&overlay"}></img>
                                </div>
                                <div className="info">
                                    <h1>{player.playerName}</h1>
                                    <p>Наиграл {(player.playtimeActive / (1000  *  60  *  60)).toFixed(1)} часов</p>
                                </div>
                            </div>
                        ))
                    }
                </div>
            </>
        );
    }
}