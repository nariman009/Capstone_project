const Businesses = ({ businesses })=> {
  return (
    <>
      <h1>Number of Businesses: { businesses.length }</h1>
      <ul>
        {businesses.map((business, index) => (
          <li key={index}>{business.name}</li>
        ))}
      </ul>
    </>
  );
}


export default Businesses;
