import './loading.css'
export default function Header() {
    //TODO: Переместить гифку в /public
    return (
        <div className='content'>
            <div className="loading">
            <h1>Загружаем контент...</h1>
                <div>
                    <img src="https://media1.tenor.com/m/Njoj9Qrrpj4AAAAC/walking-fox-walking.gif"></img>
                </div>
            </div>
        </div>
    );
}
