import { useState, useEffect } from 'react'

const CForm = ({auth, userId, businesses})=> {

    const [selectedOption, setSelectedOption] = useState('');
    const [comment, setComment] = useState('');
    const [rate, setRate] = useState('');
    const [error, setError] = useState('');
    
    console.log("userId ", userId);
    console.log("selectedOption ", selectedOption);
    
    const businessId = businesses.find(business => business.name == selectedOption);
    const submit = async (ev) => {
      ev.preventDefault();
      try {
        console.log({text: comment, rate: rate})
        const response = await fetch(`/api/users/${userId}/${businessId.id}/reviews`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({text: comment, rate: rate}),
        });
        
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || 'Create Review failed');
        }
      } catch (error) {
      throw error;
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
        <button>Submit</button>
      </form>
  );
}

export default CForm;
