import { useEffect, useState } from 'react';
import './App.css';
import { getAllPokemon, getPokemon } from './utils/pokemon';
import Card from './components/Card/Card';
import Navbar from './components/Navbar/Navbar';

function App() {
  const initialURL = 'https://pokeapi.co/api/v2/pokemon';

  const [loading, setLoading] = useState(true);
  const [pokemonData, setPokemonData] = useState([]);
  const [prevUrl, setPrevUrl] = useState('');
  const [nextUrl, setNextUrl] = useState('');
  const [prevDisabled, setPrevDisabled] = useState(false);
  const [nextDisabled, setNextDisabled] = useState(false);

  useEffect(() => {
    const fetchPokemonData = async () => {
      // 全てのポケモンデータ取得
      const res = await getAllPokemon(initialURL);
      // 各ポケモンの詳細データ取得
      loadPokemon(res.results);
      setPrevUrl(res.previous);
      setNextUrl(res.next);
      if (res.previous === null) {
        setPrevDisabled(true);
      }
      if (res.next === null) {
        setNextDisabled(true);
      }
      setLoading(false);
    };
    fetchPokemonData();
  }, []);

  const loadPokemon = async (data) => {
    const _pokemonData = await Promise.all(
      data.map((pokemon) => {
        const pokemonRecord = getPokemon(pokemon.url);
        return pokemonRecord;
      })
    );

    setPokemonData(_pokemonData);
  };

  const handlePrevPage = async () => {
    setLoading(true);
    setPrevDisabled(false);
    setNextDisabled(false);
    const res = await getAllPokemon(prevUrl);
    await loadPokemon(res.results);
    setPrevUrl(res.previous);
    setNextUrl(res.next);
    if (res.previous === null) {
      setPrevDisabled(true);
    }
    if (res.next === null) {
      setNextDisabled(true);
    }
    setLoading(false);
  };

  const handleNextPage = async () => {
    setLoading(true);
    setPrevDisabled(false);
    setNextDisabled(false);
    const res = await getAllPokemon(nextUrl);
    await loadPokemon(res.results);
    setPrevUrl(res.previous);
    setNextUrl(res.next);
    if (res.previous === null) {
      setPrevDisabled(true);
    }
    if (res.next === null) {
      setNextDisabled(true);
    }
    setLoading(false);
  };

  return (
    <>
      <Navbar />
      <div className="App">
        {loading ? (
          <h1>ロード中・・・</h1>
        ) : (
          <>
            <div className="pokemonCardContainer">
              {pokemonData.map((pokemon, i) => {
                return <Card key={i} pokemon={pokemon} />;
              })}
            </div>
            <div className="btn">
              <button
                onClick={handlePrevPage}
                disabled={prevDisabled}
                className={prevDisabled ? "disabledBtn" : "clickableBtn"}
              >
                前へ
              </button>
              <button
                onClick={handleNextPage}
                disabled={nextDisabled}
                className={nextDisabled ? "disabledBtn" : "clickableBtn"}
              >
                次へ
              </button>
            </div>
          </>
        )}
      </div>
    </>
  );
}

export default App;
