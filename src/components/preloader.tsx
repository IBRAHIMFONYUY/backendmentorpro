"use client"

import { useEffect } from 'react';

const Preloader = () => {
  useEffect(() => {
    const container = document.querySelector('.preloader-container');
    if (!container) return;

    const existingDots = container.querySelectorAll('.forming-dot');
    existingDots.forEach(dot => dot.remove());

    function createFormingDots() {
        if (!container) return;

        const bDots = [
            {x: -150, y: -80}, {x: -150, y: -60}, {x: -150, y: -40}, {x: -150, y: -20}, 
            {x: -150, y: 0}, {x: -150, y: 20}, {x: -150, y: 40}, {x: -150, y: 60}, {x: -150, y: 80},
            {x: -130, y: -80}, {x: -110, y: -80}, {x: -90, y: -80},
            {x: -70, y: -60}, {x: -70, y: -40},
            {x: -130, y: -20}, {x: -110, y: -20}, {x: -90, y: -20}, {x: -70, y: -20},
            {x: -70, y: 0}, {x: -70, y: 20}, {x: -70, y: 40},
            {x: -130, y: 80}, {x: -110, y: 80}, {x: -90, y: 80}
        ];
        
        const mDots = [
            {x: 50, y: -80}, {x: 50, y: -60}, {x: 50, y: -40}, {x: 50, y: -20}, 
            {x: 50, y: 0}, {x: 50, y: 20}, {x: 50, y: 40}, {x: 50, y: 60}, {x: 50, y: 80},
            {x: 70, y: -60}, {x: 90, y: -40}, {x: 110, y: -20},
            {x: 130, y: 0},
            {x: 150, y: -20}, {x: 170, y: -40}, {x: 190, y: -60},
            {x: 210, y: -80}, {x: 210, y: -60}, {x: 210, y: -40}, {x: 210, y: -20}, 
            {x: 210, y: 0}, {x: 210, y: 20}, {x: 210, y: 40}, {x: 210, y: 60}, {x: 210, y: 80}
        ];
        
        const allDots = [...bDots, ...mDots];
        const centerX = window.innerWidth / 2;
        const centerY = window.innerHeight / 2;
        
        allDots.forEach((dotPos, index) => {
            const dot = document.createElement('div');
            dot.className = 'forming-dot';
            dot.style.width = '8px';
            dot.style.height = '8px';
            dot.style.background = 'rgba(255, 255, 255, 0.9)';
            dot.style.borderRadius = '50%';
            dot.style.position = 'absolute';
            dot.style.boxShadow = '0 0 15px rgba(255, 255, 255, 0.8)';
            dot.style.opacity = '0';
            dot.style.zIndex = '5';
            
            const startX = Math.random() * window.innerWidth;
            const startY = Math.random() * window.innerHeight;
            dot.style.left = startX + 'px';
            dot.style.top = startY + 'px';
            
            const finalX = centerX + dotPos.x;
            const finalY = centerY + dotPos.y;
            
            container.appendChild(dot);
            
            setTimeout(() => {
                dot.style.transition = 'all 2.5s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
                dot.style.opacity = '1';
                dot.style.left = finalX + 'px';
                dot.style.top = finalY + 'px';
                dot.style.transform = 'scale(1.2)';
            }, index * 80);
            
            setTimeout(() => {
                dot.style.transform = 'scale(1.5)';
                dot.style.boxShadow = '0 0 25px rgba(255, 255, 255, 1)';
                dot.style.animation = 'letterPulse 0.8s ease-in-out infinite alternate';
            }, 3500 + index * 15);
            
            setTimeout(() => {
                dot.style.transform = 'scale(2)';
                dot.style.boxShadow = '0 0 40px rgba(255, 255, 255, 1), 0 0 80px rgba(255, 255, 255, 0.5)';
            }, 5000 + index * 10);
            
            setTimeout(() => {
                dot.style.transition = 'all 1.5s ease-out';
                dot.style.animation = 'none';
                if (index < bDots.length) {
                    dot.style.left = (centerX - 50) + 'px';
                    dot.style.top = centerY + 'px';
                } else {
                    dot.style.left = (centerX + 50) + 'px';
                    dot.style.top = centerY + 'px';
                }
                dot.style.opacity = '0';
                dot.style.transform = 'scale(0)';
            }, 7000 + index * 30);
        });
    }

    function createFloatingDots() {
        setTimeout(() => {
            if (!container) return;
            const dotCount = 30;
            
            for (let i = 0; i < dotCount; i++) {
                const dot = document.createElement('div');
                dot.className = 'floating-dot';
                
                const x = Math.random() * window.innerWidth;
                const y = Math.random() * window.innerHeight;
                
                dot.style.left = x + 'px';
                dot.style.top = y + 'px';
                dot.style.animationDelay = Math.random() * 4 + 's';
                dot.style.animationDuration = (3 + Math.random() * 3) + 's';
                
                container.appendChild(dot);
            }
        }, 9000);
    }

    function createSparkles() {
        if (!container) return;
        const sparkleCount = 20;
        
        for (let i = 0; i < sparkleCount; i++) {
            const sparkle = document.createElement('div');
            sparkle.className = 'sparkle';
            
            const x = Math.random() * window.innerWidth;
            const y = Math.random() * window.innerHeight;
            
            sparkle.style.left = x + 'px';
            sparkle.style.top = y + 'px';
            sparkle.style.animationDelay = Math.random() * 3 + 's';
            
            container.appendChild(sparkle);
        }
    }

    function createMagicParticles() {
        if (!container) return;
        const particleCount = 15;
        
        for (let i = 0; i < particleCount; i++) {
            const particle = document.createElement('div');
            particle.className = 'magic-particle';
            
            const x = Math.random() * window.innerWidth;
            const y = window.innerHeight - 50;
            
            particle.style.left = x + 'px';
            particle.style.top = y + 'px';
            particle.style.animationDelay = Math.random() * 2 + 's';
            
            container.appendChild(particle);
        }
    }

    createFormingDots();
    createFloatingDots();
    createSparkles();
    createMagicParticles();
  }, []);

  return (
    <div id="preloader-body">
      <div className="preloader-container">
          <div className="glow-effect"></div>
          
          <div className="text-container" id="textContainer">
              <span className="letter b">B</span>
              <span className="letter a">a</span>
              <span className="letter c">c</span>
              <span className="letter k">k</span>
              <span className="letter e1">e</span>
              <span className="letter n1">n</span>
              <span className="letter d">d</span>
              <span className="letter m">M</span>
              <span className="letter e2">e</span>
              <span className="letter n2">n</span>
              <span className="letter t">t</span>
              <span className="letter o">o</span>
              <span className="letter r">r</span>
          </div>
      </div>
    </div>
  );
};

export default Preloader;
