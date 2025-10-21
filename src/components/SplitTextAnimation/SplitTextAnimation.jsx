import React, { useEffect, useState } from 'react';
import { useUserAuth } from '../../contexts/UserAuthContext';
import './SplitTextAnimation.css';

const SplitTextAnimation = () => {
  const { user } = useUserAuth();
  const [username, setUsername] = useState('User');

  useEffect(() => {
    if (user?.username) {
      setUsername(user.username);
    } else if (user?.name) {
      setUsername(user.name);
    } else if (user?.email) {
      // Extract name from email if available
      const emailName = user.email.split('@')[0];
      setUsername(emailName);
    }
  }, [user]);

  // Create 16 spans for the 3D rotating effect
  const renderSpans = () => {
    const spans = [];
    for (let i = 1; i <= 16; i++) {
      spans.push(
        <span key={i} style={{ '--i': i }}>
          <i>WELCOME</i>
          {' '}{username.toUpperCase()}{' '}
          <i>!</i>
        </span>
      );
    }
    return spans;
  };

  return (
    <div className="split-text-wrapper">
      <div className="container">
        <div className="box">
          {renderSpans()}
        </div>
      </div>
    </div>
  );
};

export default SplitTextAnimation;
