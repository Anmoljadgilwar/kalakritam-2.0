// Dynamic 3D Card Tilt delegation utility
export const initCardTilt = () => {
  const handleMouseMove = (e) => {
    // Target any hovered card with the 'universal-card', login card, or feature card classes
    const card = e.target.closest('.universal-card, .user-login-card, .admin-login-card, .feature-card');
    if (!card) return;
    
    // Skip on mobile devices for accessibility and performance
    if (window.innerWidth <= 768) {
      card.style.transform = '';
      return;
    }

    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left; // x coordinate relative to card
    const y = e.clientY - rect.top;  // y coordinate relative to card
    
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    
    // Calculate tilt angles (maximum 10 degrees)
    const rotateX = ((centerY - y) / centerY) * 10;
    const rotateY = ((x - centerX) / centerX) * 10;
    
    // Set perspective and apply rotation matrices
    // Using slight translateY translation for hover lift
    card.style.transform = `perspective(1000px) rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg) translateY(-12px) scale(1.02)`;
    card.style.transition = 'transform 0.1s ease-out, box-shadow 0.3s ease-out';
  };

  const handleMouseOut = (e) => {
    const card = e.target.closest('.universal-card, .user-login-card, .admin-login-card, .feature-card');
    if (card && !card.contains(e.relatedTarget)) {
      // Smooth reset transition when leaving card boundaries
      card.style.transform = '';
      card.style.transition = 'transform 0.4s cubic-bezier(0.34, 1.56, 0.64, 1), box-shadow 0.4s ease-out';
    }
  };

  document.addEventListener('mousemove', handleMouseMove);
  document.addEventListener('mouseout', handleMouseOut);

  return () => {
    document.removeEventListener('mousemove', handleMouseMove);
    document.removeEventListener('mouseout', handleMouseOut);
  };
};
