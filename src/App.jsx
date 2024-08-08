import { useState, useEffect } from "react";
import PokemonCards from "./components/PokemonCard";
import "./App.css";
import { FetchButton } from "./components/fetchButton";
import { LoseUi } from "./components/loseUi";
import { WinUi } from "./components/winUi";

function App() {
  const [pokemonDeck, setPokemonDeck] = useState([]);
  const [correctClicks, setCorrectClicks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [isShuffling, setIsShuffling] = useState(false); // State for managing shuffle animation
  const [lose, setLost] = useState(false);
  const [win, setWin] = useState(false); // State for managing win condition

  useEffect(() => {
    // Initial fetch when the component mounts
    console.log("Fetching new pokes");
    handleNewFetch();
  }, []);

  useEffect(() => {
    if (correctClicks.length === 8) {
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

  const handleNewFetch = async () => {
    setLoading(true);
    setError(null);
    setWin(false);
    setLost(false);
    setCorrectClicks([]);

    try {
      const pokemonIds = generateUniqueRandomNumbers(8, 1, 1010); // Generate 8 random unique IDs
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
      <h1>Pokemon Deck</h1>
      <div>User score: {correctClicks.length}</div>
      <FetchButton onFetch={handleNewFetch} />
      {win ? (
        <WinUi />
      ) : lose ? (
        <LoseUi />
      ) : (
        <div className={`grid ${isShuffling ? "helloshuffle" : ""}`}>
          <PokemonCards pokemonDeck={pokemonDeck} onClick={handleClick} />
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
