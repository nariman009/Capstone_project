// import CForm from './CForm';
import { useState, useEffect } from 'react'


const CReview = ({ createAction, businesses })=> {
  // const [businesses, setBusinesses] = useState([]);
  const [selectedOption, setSelectedOption] = useState('');
  const [comment, setComment] = useState('');
  const [rate, setRate] = useState('');
  const [error, setError] = useState('');
  // const [reviews, setReviews] = useState([]);
  const [addedReview, setAddedReview] = useState('');

  // const [selectedRate, setSelectedRate] = useState('');

  const numbers = [1.0, 2.0, 3.0, 4.0, 5.0];
  // console.log("userId ", auth.id);
  // console.log("selectedOption ", selectedOption);
  
  // setSelectedOption(businesses[0]?.name || ''); 
  const businessId = businesses.find(business => business.name == selectedOption);
    
  const submit = async (ev) => {
    ev.preventDefault();
    try {
      const returned = await createAction({businessId, comment, rate})
      setAddedReview(returned)
      console.log("returend",returned)
      
    } catch (error) {
        console.error(error.message);
        setError(error.message)
    }
  }  
  
  return (
    <>
      <h1>Create Reviews</h1>
        {!!addedReview && (
          <>
            <h3>Review successfully Added:</h3>
            <h4>{selectedOption} --{">"} Comment: {addedReview.text} - Rate: {rate}</h4>
          </>
        )}


      <form onSubmit={ submit }>
        { !!error && <div className='error'>{ error }</div> }
        <select 
          value={selectedOption} 
          onChange={e => setSelectedOption(e.target.value)}
          defaultValue=""
        >
          <option value="" disabled>Select a business...</option>
          {businesses.map((business, index) => (
            <option key={index} value={business.name}>
              {business.name}
            </option>
          ))}
        </select>
        <input value={ comment } placeholder='Write your comments' onChange={ ev=> setComment(ev.target.value)}/>
        <select
          value={rate}
          onChange={e => setRate(e.target.value)}
          defaultValue=""
        >
          <option value="" disabled>Choose a rate...</option>
          {numbers.map(number => (
            <option key={number} value={number}>
              {number}
            </option>
          ))}
        </select>
        <button >Submit</button>
      </form>
    </>
  );
}

// <button onClick={() => addReview(business.id)}>Add Review</button>
export default CReview;

