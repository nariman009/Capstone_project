const Businesses = ({ businesses })=> {
  return (
    <>
      <h1>Placeholder for Businesses { businesses.length }</h1>
      <ul>
        {businesses.map((business, index) => (
          <li key={index}>{business.name}</li>
        ))}
      </ul>
    </>
  );
}


export default Businesses;
