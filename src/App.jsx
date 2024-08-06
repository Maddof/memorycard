// App.js
import { useState, useEffect } from "react";
import PokemonDeck from "./components/PokemonCard";
import { ShuffleButton } from "./components/shuffleButton";
import "./App.css";

function App() {
  const [pokemonDeck, setPokemonDeck] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchRandomPokemons();
  }, []);

  const fetchRandomPokemons = async () => {
    const pokemonIds = generateUniqueRandomNumbers(8, 1, 1010); // 8 unique IDs between 1 and 1010
    const promises = pokemonIds.map((id) =>
      fetch(`https://pokeapi.co/api/v2/pokemon/${id}`).then((response) =>
        response.json()
      )
    );

    try {
      const results = await Promise.all(promises);
      setPokemonDeck(results);
    } catch (error) {
      setError("Failed to fetch Pokémon data");
    } finally {
      setLoading(false);
    }
  };

  const shuffleDeck = (deck) => {
    for (let i = deck.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [deck[i], deck[j]] = [deck[j], deck[i]]; // Swap elements
    }
    return deck;
  };

  const handleShuffle = () => {
    setPokemonDeck(shuffleDeck([...pokemonDeck])); // Shuffle the current deck
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="App">
      <h1>Pokemon Deck</h1>
      <ShuffleButton onShuffle={handleShuffle} />
      <PokemonDeck pokemonDeck={pokemonDeck} />
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
