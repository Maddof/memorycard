const PokemonCards = ({ pokemonDeck, onClick }) => {
  return (
    // <div className="grid">
    <>
      {pokemonDeck.map((pokemon) => (
        <div
          key={pokemon.id}
          className="card"
          onClick={() => onClick(pokemon.id)}
        >
          <img
            src={pokemon.sprites.other.home.front_default}
            alt={pokemon.name}
          />
          <p className="pokemon-name">
            {pokemon.name.charAt(0).toUpperCase() + pokemon.name.slice(1)}
          </p>
        </div>
      ))}
    </>
    // </div>
  );
};

export default PokemonCards;
