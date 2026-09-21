const motionButton = document.querySelector('.motion-button');
motionButton.addEventListener('click', () => {
  const paused = document.body.classList.toggle('motion-paused');
  motionButton.setAttribute('aria-pressed', String(paused));
  motionButton.textContent = paused ? 'Resume motion' : 'Pause motion';
});
const submissionForm = document.querySelector('#submission-form');
const youtubeInput = submissionForm.elements.youtubeUrl;
function validateYouTube() {
  let valid = false;
  try {
    const url = new URL(youtubeInput.value);
    const host = url.hostname.toLowerCase();
    const youtubeHost = ['youtube.com', 'www.youtube.com', 'm.youtube.com'].includes(host);
    valid = ['https:', 'http:'].includes(url.protocol) && (
      (host === 'youtu.be' && /^\/[A-Za-z0-9_-]{11}\/?$/.test(url.pathname)) ||
      (youtubeHost && url.pathname === '/watch' && /^[A-Za-z0-9_-]{11}$/.test(url.searchParams.get('v') || '')) ||
      (youtubeHost && /^\/(shorts|live|embed)\/[A-Za-z0-9_-]{11}\/?$/.test(url.pathname))
    );
  } catch {}
  youtubeInput.setCustomValidity(valid || !youtubeInput.value ? '' :
    'Please paste a YouTube video link, such as youtube.com/watch?v=… or youtu.be/…');
}
youtubeInput.addEventListener('input', validateYouTube);
submissionForm.addEventListener('submit', (event) => {
  validateYouTube();
  if (!submissionForm.reportValidity()) event.preventDefault();
});
// Valid forms use a standard POST. FormSubmit handles spam checks and the
// confirmation page; no delivery success is claimed by this page.
