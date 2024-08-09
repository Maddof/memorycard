const FetchButton = ({ onFetch, fetchCount }) => {
  return (
    <button onClick={() => onFetch(fetchCount)}>
      Fetch new cards({fetchCount})
    </button>
  );
};

export { FetchButton };
