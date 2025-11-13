document.addEventListener('DOMContentLoaded', () => {
  console.log('[init] DOM ready');

  const backgroundMusic   = document.getElementById('backgroundMusic');
  const startButton       = document.getElementById('startButton');
  const envelopeContainer = document.getElementById('envelopeContainer');
  const unfoldButton      = document.getElementById('unfoldButton');
  const finalGreetingElement = document.getElementById('finalGreeting');

  const steps = {
    step1: document.getElementById('step1'),
    step2: document.getElementById('step2'),
    step3: document.getElementById('step3'),
    step4: document.getElementById('step4'),
  };

  const recipientName   = "Sapthesh";      // Customizable Name
  const messageGreeting = "Happy Birthday,"; // Customizable Greeting

  console.log('[check]', {
    backgroundMusic: !!backgroundMusic,
    startButton: !!startButton,
    envelopeContainer: !!envelopeContainer,
    unfoldButton: !!unfoldButton,
    finalGreetingElement: !!finalGreetingElement,
    step1: !!steps.step1, step2: !!steps.step2, step3: !!steps.step3, step4: !!steps.step4
  });

  // --- Utility Function to Transition Steps ---
  function transitionToStep(targetStepId) {
    const currentActive = document.querySelector('.step.active');
    if (currentActive) currentActive.classList.remove('active');
    steps[targetStepId].classList.add('active');
    console.log('[nav] ->', targetStepId);
  }

  // --- Step 1: Welcome Screen Interactions ---
  if (startButton) {
    startButton.addEventListener('click', () => {
      console.log('[click] startButton');
      transitionToStep('step2');
    });
  }

  // --- Step 2: Envelope Interactions ---
  if (envelopeContainer) {
    envelopeContainer.addEventListener('click', () => {
      console.log('[click] envelopeContainer');
      envelopeContainer.classList.add('open');
      const hint = envelopeContainer.querySelector('.click-instruction');
      if (hint) hint.style.opacity = '0';
      setTimeout(() => {
        transitionToStep('step3');
        setTimeout(() => {
          const lc = document.getElementById('letterContainer');
          if (lc) lc.classList.add('show');
        }, 100);
      }, 700);
    });
  }

  // --- Step 3: Letter Unfold Interactions (PLAY MUSIC HERE) ---
  if (unfoldButton) {
    unfoldButton.addEventListener('click', async () => {
      console.log('[click] unfoldButton');
      transitionToStep('step4');
      startCelebrationAnimations();

      try {
        if (!backgroundMusic) throw new Error('No audio element');
        backgroundMusic.loop = true;
        backgroundMusic.currentTime = 0;
        backgroundMusic.volume = 0; // start silent
        await backgroundMusic.play(); // user gesture -> should succeed
        // Fade in volume
        const target = 0.6, steps = 16, dur = 800;
        let i = 0;
        const timer = setInterval(() => {
          i++;
          backgroundMusic.volume = Math.min(target, (i/steps)*target);
          if (i >= steps) clearInterval(timer);
        }, dur/steps);
        console.log('[audio] playing');
      } catch (e) {
        console.warn('[audio] blocked/error:', e);
        showPlayMusicFallback();
      }
    });
  }

  function showPlayMusicFallback() {
    if (document.getElementById('playMusicBtn')) return;
    const btn = document.createElement('button');
    btn.id = 'playMusicBtn';
    btn.className = 'action-button';
    btn.textContent = 'Play Music 🎵';
    btn.style.marginTop = '12px';
    btn.addEventListener('click', async () => {
      try {
        await backgroundMusic.play();
        console.log('[audio] manual play ok');
        btn.remove();
      } catch (e) {
        console.error('[audio] manual play failed', e);
      }
    });
    const card = document.querySelector('.celebration-card') || steps.step4;
    card.appendChild(btn);
  }

  // --- Step 4: Grand Celebration Animations ---
  function startCelebrationAnimations() {
    // --- Typewriter Effect for Main Greeting ---
    let i = 0;
    finalGreetingElement.textContent = '';
    finalGreetingElement.style.borderRight = '3px solid var(--accent-yellow)';

    const typingInterval = setInterval(() => {
      if (i < messageGreeting.length) {
        finalGreetingElement.textContent += messageGreeting.charAt(i);
        i++;
      } else {
        clearInterval(typingInterval);
        finalGreetingElement.classList.add('typed');
      }
    }, 100);

    // --- Confetti Cannon Effect ---
    createConfettiCannon(100, 0.5);
    setTimeout(() => createConfettiCannon(80, 0.3), 500);
    setTimeout(() => createConfettiCannon(60, 0.2), 1000);

    // --- Rising Balloons ---
    createBalloons(15);

    // --- Background Fireworks (Subtle) ---
    createFireworks(5);
  }

  // --- Confetti Cannon Helper ---
  function createConfettiCannon(count, delayMultiplier) {
    const confettiCannonContainer = document.querySelector('.confetti-cannon-container');
    const colors = ['var(--primary-red)', 'var(--accent-yellow)', 'var(--text-light)', '#00d8d6', '#8e44ad'];

    for (let i = 0; i < count; i++) {
      const confetti = document.createElement('div');
      confetti.classList.add('confetti');

      confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
      confetti.style.left = `${Math.random() * 100}vw`;
      confetti.style.top = `${Math.random() * 20 - 10}vh`;

      const duration = Math.random() * 2 + 3;
      const delay = Math.random() * delayMultiplier;
      confetti.style.animationDuration = `${duration}s`;
      confetti.style.animationDelay = `${delay}s`;

      const size = Math.random() * 8 + 4;
      confetti.style.width = `${size}px`;
      confetti.style.height = `${size}px`;
      if (Math.random() > 0.5) confetti.style.borderRadius = '50%';

      confetti.style.transform = `rotate(${Math.random() * 360}deg)`;

      confettiCannonContainer.appendChild(confetti);
      confetti.addEventListener('animationend', () => confetti.remove());
    }
  }

  // --- Balloons Helper ---
  function createBalloons(count) {
    const balloonsContainer = document.querySelector('.balloons-container');
    const colors = ['var(--primary-red)', 'var(--accent-yellow)', '#00d8d6', '#8e44ad', '#3498db'];

    for (let i = 0; i < count; i++) {
      const balloon = document.createElement('div');
      balloon.classList.add('balloon');

      balloon.style.left = `${Math.random() * 80 + 10}vw`;
      balloon.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
      balloon.style.animationDuration = `${Math.random() * 6 + 10}s`;
      balloon.style.animationDelay = `${Math.random() * 5}s`;

      balloonsContainer.appendChild(balloon);
      balloon.addEventListener('animationend', () => balloon.remove());
    }
  }

  // --- Fireworks Helper ---
  function createFireworks(count) {
    const fireworksContainer = document.querySelector('.fireworks-container');
    const colors = ['var(--primary-red)', 'var(--accent-yellow)', 'var(--text-light)', '#00d8d6'];

    for (let i = 0; i < count; i++) {
      const firework = document.createElement('div');
      firework.classList.add('firework');

      firework.style.left = `${Math.random() * 80 + 10}vw`;
      firework.style.bottom = `${Math.random() * 20}vh`;
      firework.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
      firework.style.boxShadow = `0 0 5px ${firework.style.backgroundColor}`;

      const delay = Math.random() * 3;
      firework.style.animationDelay = `${delay}s, ${delay + 3}s`;

      fireworksContainer.appendChild(firework);
      firework.addEventListener('animationend', () => firework.remove());
    }
  }
});
