document.addEventListener('DOMContentLoaded', () => {
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  const form = document.querySelector('form[name="booking"]');
  if (!form) return;

  const note = document.createElement('p');
  note.className = 'small';
  note.id = 'form-note';
  form.appendChild(note);

  form.addEventListener('submit', (e) => {
    note.textContent = 'Sending…';
    setTimeout(() => {
      note.textContent = 'Thanks — your inquiry was sent. We will reply within 24 hours.';
      form.reset();
    }, 1100);
  });
});
