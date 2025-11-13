const form = document.getElementById('chat-form');
const promptInput = document.getElementById('prompt');
const responseDiv = document.getElementById('response');

form.addEventListener('submit', async (e) => {
  e.preventDefault();
  const prompt = promptInput.value;
  responseDiv.textContent = "Loading...";

  const res = await fetch('http://localhost:3000/ask', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ prompt })
  });

  const data = await res.json();
  responseDiv.textContent = data.text;
});
