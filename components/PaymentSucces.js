import React from 'react';
import '.././app/globals.css'; 
const PaymentSuccessAnimation = ({ message }) => {
  return (
    <div
      className="payment-success-animation"
      style={{
        textAlign: 'center',
        animation: 'fadeIn 2s ease-in-out',
      }}
    >
      <div
        className="checkmark-circle"
        style={{
          width: '70px',
          height: '70px',
          margin: '0 auto',
          borderRadius: '50%',
          border: '4px solid #4CAF50',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 100 100"
          className="checkmark-icon"
          style={{
            width: '50px',
            height: '50px',
            animation: 'checkmarkAnimation 1s ease-in-out forwards',
          }}
        >
          <circle
            cx="50"
            cy="50"
            r="45"
            className="checkmark-circle-bg"
            style={{
              fill: 'none',
              stroke: '#e5e5e5',
              strokeWidth: '5',
            }}
          />
          <path
            className="checkmark-path"
            fill="none"
            stroke="#4CAF50"
            strokeWidth="5"
            d="M20,50 L40,70 L80,30"
            style={{
              strokeDasharray: '100',
              strokeDashoffset: '100',
              animation: 'drawCheckmark 1s ease-in-out forwards',
            }}
          />
        </svg>
      </div>
      <p
        className="payment-success-message"
        style={{
          fontSize: '18px',
          marginTop: '20px',
          color: '#4CAF50',
          fontWeight: 'bold',
        }}
      >
        {message}
      </p>
    </div>
  );
};

export default PaymentSuccessAnimation;
