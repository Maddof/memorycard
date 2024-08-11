import { useState, useEffect } from "react";
import PokemonCards from "./components/PokemonCard";
import { FetchButton } from "./components/fetchButton";
import { LoseUi } from "./components/loseUi";
import { WinUi } from "./components/winUi";
import "./App.css";

function App() {
  const [pokemonDeck, setPokemonDeck] = useState([]);
  const [correctClicks, setCorrectClicks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [isShuffling, setIsShuffling] = useState(false); // State for managing shuffle animation
  const [lose, setLost] = useState(false);
  const [win, setWin] = useState(false); // State for managing win condition

  const [fetchCount, setFetchCount] = useState(8);

  useEffect(() => {
    // Initial fetch when the component mounts
    console.log("Fetching new pokes");
    handleNewFetch();
  }, []);

  useEffect(() => {
    if (correctClicks.length === fetchCount) {
      handleWin();
    }
  }, [correctClicks]); // Run only when correctClicks changes

  const fetchRandomPokemons = async (pokemonIds) => {
    const promises = pokemonIds.map((id) =>
      fetch(`https://pokeapi.co/api/v2/pokemon/${id}`).then((response) =>
        response.json()
      )
    );
    return Promise.all(promises);
  };

  const shuffleDeck = (deck) => {
    for (let i = deck.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [deck[i], deck[j]] = [deck[j], deck[i]]; // Swap elements
    }
    return deck;
  };

  const handleShuffle = () => {
    setIsShuffling(true);
    setPokemonDeck(shuffleDeck([...pokemonDeck])); // Shuffle the current deck
    setTimeout(() => setIsShuffling(false), 1250); // Set animation state to false after 1250 ms (animation duration)
  };

  const handleNewFetch = async (count = 8) => {
    setLoading(true);
    setError(null);
    setWin(false);
    setLost(false);
    setCorrectClicks([]);

    if (count === 8) {
      setFetchCount(8);
    }
    if (count === 12) {
      setFetchCount(12);
    }

    try {
      const pokemonIds = generateUniqueRandomNumbers(count, 1, 1010); // Generate random unique IDs between 1 and 1010
      const results = await fetchRandomPokemons(pokemonIds);
      setPokemonDeck(results);
    } catch (error) {
      setError("Failed to fetch Pokémon data");
    } finally {
      setLoading(false);
    }
  };

  const handleClick = (pokeId) => {
    if (correctClicks.includes(pokeId)) {
      handleLose();
      console.log(`${pokeId} is in the array.`);
    } else {
      setCorrectClicks((prevClicks) => [...prevClicks, pokeId]);
    }
    handleShuffle();
  };
  const handleLose = () => {
    console.log("YOU LOST");
    setLost(true);
    setCorrectClicks([]);
  };

  const handleWin = () => {
    console.log("YOU WON!");
    setWin(true);
    setCorrectClicks([]);
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="App">
      <h1>Pokemon Memory Game</h1>
      <div>User score: {correctClicks.length}</div>
      <div className="fetchbuttons-wrapper">
        <FetchButton onFetch={handleNewFetch} fetchCount={8} />
        <FetchButton onFetch={handleNewFetch} fetchCount={12} />
      </div>

      {win ? (
        <WinUi />
      ) : lose ? (
        <LoseUi />
      ) : (
        <div
          className={`grid ${isShuffling ? "helloshuffle" : ""}`}
          style={{
            gridTemplateColumns: `repeat(${fetchCount / 2}, 1fr)`,
          }}
        >
          <PokemonCards
            pokemonDeck={pokemonDeck}
            onClick={handleClick}
            dispayCount={fetchCount}
          />
        </div>
      )}
    </div>
  );
}

const generateUniqueRandomNumbers = (count, min, max) => {
  const numbers = new Set();
  while (numbers.size < count) {
    numbers.add(Math.floor(Math.random() * (max - min + 1)) + min);
  }
  return Array.from(numbers);
};

export default App;
