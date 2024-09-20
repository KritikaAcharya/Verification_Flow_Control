import React, { useState } from 'react';
import axios from 'axios';
import './App.css';

function App() {
  const [code, setCode] = useState(Array(6).fill(''));
  const [errorMessage, setErrorMessage] = useState('');

  const handleChange = (e, index) => {
    const { value } = e.target;
    if (/^\d*$/.test(value)) {
      const newCode = [...code];
      newCode[index] = value;
      setCode(newCode);
      if (value && index < 5) {
        document.getElementById(`code-input-${index + 1}`).focus();
      }
    }
  };

  const handleSubmit = async () => {
    const fullCode = code.join('');
    try {
      const response = await axios.post('http://localhost:4000/verify', { code: fullCode });
      window.location.href = '/success';
    } catch (error) {
      setErrorMessage('Verification Error');
    }
  };

  return (
    <div className="App">
      <h1>Enter 6-digit Verification Code</h1>
      <div className="code-inputs">
        {code.map((digit, index) => (
          <input
            key={index}
            id={`code-input-${index}`}
            type="text"
            value={digit}
            onChange={(e) => handleChange(e, index)}
            maxLength="1"
          />
        ))}
      </div>
      <button onClick={handleSubmit}>Submit</button>
      {errorMessage && <p className="error">{errorMessage}</p>}
    </div>
  );
}

export default App;
