const menuButton = document.querySelector('.menu-toggle');
const nav = document.querySelector('.nav');
menuButton.addEventListener('click', () => {
  const open = nav.classList.toggle('open');
  menuButton.setAttribute('aria-expanded', String(open));
});
nav.querySelectorAll('a').forEach(link => link.addEventListener('click', () => {
  nav.classList.remove('open');
  menuButton.setAttribute('aria-expanded', 'false');
}));

document.querySelector('#search-form').addEventListener('submit', event => {
  event.preventDefault();
  const region = document.querySelector('#destination').value;
  const experience = document.querySelector('#experience').value;
  const cards = [...document.querySelectorAll('.destination-card')];
  let visible = 0;
  cards.forEach(card => {
    const matches = (region === 'all' || card.dataset.region === region)
      && (experience === 'all' || card.dataset.experience.split(' ').includes(experience));
    card.hidden = !matches;
    if (matches) visible++;
  });
  document.querySelector('.no-results').hidden = visible > 0;
  document.querySelector('#destinations').scrollIntoView({ behavior: 'smooth' });
});

document.querySelector('.signup').addEventListener('submit', event => {
  event.preventDefault();
  const email = document.querySelector('#email');
  document.querySelector('.form-message').textContent = `Merci ! ${email.value} est bien inscritÂ·e (dÃ©mo).`;
  email.value = '';
});

