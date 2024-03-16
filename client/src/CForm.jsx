import { useState, useEffect } from 'react'

const CForm = ({auth, userId, businesses})=> {

    const [selectedOption, setSelectedOption] = useState(businesses[0]?.name || '');
    const [comment, setComment] = useState('');
    const [rate, setRate] = useState('');
    const [error, setError] = useState('');
    const [reviews, setReviews] = useState([]);

    
    console.log("userId ", userId);
    console.log("selectedOption ", selectedOption);
    
    // setSelectedOption(businesses[0]?.name || ''); 
    const businessId = businesses.find(business => business.name == selectedOption);
      
    const submit = async (ev) => {
      ev.preventDefault();
      try {
        // console.log({text: comment, rate: rate})
        const response = await fetch(`/api/users/${userId}/${businessId.id}/reviews`, {
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
  );
}

export default CForm;
