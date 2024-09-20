import React, { useState } from 'react';
import axios from 'axios';
import './App.css';

function App() {
  const [code, setCode] = useState(Array(6).fill(''));
  const [errorMessage, setErrorMessage] = useState('');
  const [invalidInputs, setInvalidInputs] = useState(Array(6).fill(false));

  const handleChange = (e, index) => {
    const { value } = e.target;
    if (/^\d*$/.test(value)) {
      const newCode = [...code];
      newCode[index] = value;
      setCode(newCode);

      const newInvalidInputs = [...invalidInputs];
      newInvalidInputs[index] = false;
      setInvalidInputs(newInvalidInputs);

      if (value && index < 5) {
        document.getElementById(`code-input-${index + 1}`).focus();
      }
    }
  };

  const validateInputs = () => {
    const newInvalidInputs = code.map(digit => digit === '' || !/^\d$/.test(digit));
    setInvalidInputs(newInvalidInputs);
    return !newInvalidInputs.some(invalid => invalid);
  };

  const handleSubmit = async () => {
    if (validateInputs()) {
      const fullCode = code.join('');
      try {
        const response = await axios.post('http://localhost:4000/verify', { code: fullCode });
        window.location.href = '/success';
      } catch (error) {
        setErrorMessage('Verification Error');
      }
    } else {
      setErrorMessage('Please fill all inputs with valid numbers');
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
            className={invalidInputs[index] ? 'invalid' : ''}
          />
        ))}
      </div>
      <button onClick={handleSubmit}>Submit</button>
      {errorMessage && <p className="error">{errorMessage}</p>}
    </div>
  );
}

export default App;