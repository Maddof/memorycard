const PokemonDeck = ({ pokemonDeck }) => {
  return (
    <div className="grid">
      {pokemonDeck.map((pokemon) => (
        <div key={pokemon.id} className="card">
          <img src={pokemon.sprites.front_default} alt={pokemon.name} />
          <p>{pokemon.name}</p>
        </div>
      ))}
    </div>
  );
};

export default PokemonDeck;
