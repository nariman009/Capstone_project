// import CForm from './CForm';
import { useState, useEffect } from 'react'


const CReview = ({ auth, users, businesses })=> {
  const [selectedOption, setSelectedOption] = useState(businesses[0]?.name || '');
    const [comment, setComment] = useState('');
    const [rate, setRate] = useState('');
    const [error, setError] = useState('');
    const [reviews, setReviews] = useState([]);

    
    console.log("userId ", auth.id);
    console.log("selectedOption ", selectedOption);
    
    // setSelectedOption(businesses[0]?.name || ''); 
    const businessId = businesses.find(business => business.name == selectedOption);
      
    const submit = async (ev) => {
      ev.preventDefault();
      try {
        // console.log({text: comment, rate: rate})
        const response = await fetch(`/api/users/${auth.id}/${businessId.id}/reviews`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({text: comment, rate: rate}),
        });
        const json = await response.json();
        if (response.ok){
          console.log("json",json)
          setReviews([...reviews, json]);
          console.log("reviews",reviews)
          
        }
        else {
          console.error(json.message);
          throw new Error(json.message);
          
        }
      } catch (error) {
          console.error(error.message);
          setError(error.message)
      }
    }  
  return (
    <>
      <h1>List of Reviews { reviews.length }</h1>
      <ul>
      {reviews.map((review, index) => {
        // Directly access the business name using the review's business_id
        const business = businesses.find(business => (business.id === review.business_id));
        return <li key={index}>{business.name} - Review is: {review.text} - Rate is: {review.rate}</li>;
      })}
      </ul>
      <form onSubmit={ submit }>
        { !!error && <div className='error'>{ error }</div> }
        <select 
            value={selectedOption} 
            onChange={e => setSelectedOption(e.target.value)}
        >
            {businesses.map((business, index) => (
                <option key={index} value={business.name}>
                    {business.name}
                </option>
            ))}
        </select>
        <input value={ comment } placeholder='comment' onChange={ ev=> setComment(ev.target.value)}/>
        <input value={ rate} placeholder='rate' onChange={ ev=> setRate(ev.target.value)}/>
        <button >Submit</button>
      </form>
    </>
  );
}

// <button onClick={() => addReview(business.id)}>Add Review</button>
export default CReview;

