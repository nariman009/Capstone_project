import { Link} from 'react-router-dom';
import Rating from 'react-rating';
import { useState } from 'react';


const Businesses = ({ auth, businesses, setBusinesses, reviews })=> {
  const [error, setError] = useState('');
  const [name, setName] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [error2, setError2] = useState('');
  
  const deleteAction = async(businessId) => {
    try {
      const response = await fetch(`/api/businesses/${businessId}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
      });
      if (!response.ok){
        const errorResponse  = await response.json();
        console.error("Error deleting review:", errorResponse.message);
        throw (errorResponse);
      }
      else {
        console.log("Business Deleted");
        setError('');
        setBusinesses(businesses.filter(business => business.id !== businessId));
        // console.log("businesses after delete :", businesses);
      }
    } catch (ex) {
      // console.error("Failed to delete business:", ex);
      setError(ex.error);
      throw error;
    }
  };
  
  const submit = async (ev) => {
    ev.preventDefault();
    try {
      if (!auth.id || !auth.is_admin) {
        setError2('Login with admin account to create businesses');
        return;
      }
      // console.log(businesses)
      const response = await fetch(`/api/businesses`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({name: name, image_url: imageUrl}),
      });
      const json  = await response.json();
      if (!response.ok){
        throw (json);
      }
      else {
        setBusinesses([...businesses, json.business]);
        setError2('');
        // console.log("businesses after add :", businesses);
      }
    } catch (ex) {
      console.error("Failed to Add business:", ex);
      setError2(ex.error  || 'Failed to add business due to an unexpected error.');
    }
  };
  
  return (
    <div className="mainBusiness">
      <div>
        <h1>Number of Businesses: { businesses.length }</h1>
        <h3>Businesses</h3>
        { !!error && <div className='error'>{ error }</div> }
        { !auth.is_admin && <h3>Login with admin account to manage businesses</h3> }
        <ul>
          {businesses.map((business, index) => {
            const filteredReviews = reviews.filter(review => review.business_id === business.id);
            console.log(filteredReviews);
            const averageRate = Number((filteredReviews.reduce((acc, curr) => acc + Number(curr.rate), 0) / filteredReviews.length).toFixed(1));
            const average = filteredReviews.length === 0 ? "No Review" : averageRate;
            return (
              <li key={index}  class="business-list">
                <Link to={`/businesses/${business.id}`}>{business.name}</Link> --{">"} Ave.Rate ({average})&nbsp;&nbsp;
                <Rating 
                  initialRating={average}
                  readonly
                  emptySymbol={<span className="icon">☆</span>}
                  fullSymbol={<span className="icon">★</span>}
                  fractions={4}
                />&nbsp;&nbsp;{auth.id && auth.is_admin && <button onClick={() => deleteAction(business.id)}>X</button>}&nbsp;&nbsp;
                {business.image_url && (
                  <Link to={`/businesses/${business.id}`}>
                    <img src={business.image_url} alt="Business" style={{ width: '30px', height: '30px' }} />
                  </Link>
                )}
              </li>
            );
          })}
        </ul>
      </div>
      <div>
        <h1>Create Business</h1>
        <form onSubmit={ submit }>
          { !!error2 && <div className='error'>{ error2 }</div> }
          <input value={ name } placeholder='Enter business name' onChange={ ev=> { setName(ev.target.value); setError2(''); }}/>
          <input value={imageUrl} placeholder='Enter image URL' onChange={ev => { setImageUrl(ev.target.value); setError2(''); }} />
          <button >Submit</button>
        </form>
      </div>
    </div>
  );
};

export default Businesses;
