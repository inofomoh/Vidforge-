
async function postJSON(url, body) {
  const res = await fetch(url, {
    method: 'POST',
    headers: {'Content-Type':'application/json'},
    body: JSON.stringify(body)
  });
  return res.json();
}

document.getElementById('generate').addEventListener('click', async ()=>{
  const title = document.getElementById('title').value;
  const prompt = document.getElementById('prompt').value;
  const style = document.getElementById('style').value;
  const panels = Number(document.getElementById('panels').value) || 6;
  const status = document.getElementById('status');
  status.textContent = 'Starting generation...';
  document.getElementById('pages').innerHTML = '';
  document.getElementById('projectTitle').textContent = '';

  try {
    const resp = await postJSON('/api/comics/generate', { title, prompt, style, panels });
    if (resp.error) {
      status.textContent = 'Error: ' + resp.error;
      return;
    }
    const project = resp.project;
    document.getElementById('projectTitle').textContent = project.title || 'Untitled';
    const pagesDiv = document.getElementById('pages');
    project.pages.forEach(pg => {
      const pageEl = document.createElement('div');
      pageEl.className = 'page';
      const img = document.createElement('img');
      img.src = pg.panels[0].image;
      pageEl.appendChild(img);
      const bubbles = document.createElement('div');
      bubbles.className = 'bubbles';
      pg.panels.forEach(panel => {
        panel.bubbles.forEach(b => {
          const bEl = document.createElement('div');
          bEl.className = 'bubble';
          bEl.textContent = b.text;
          bubbles.appendChild(bEl);
        });
      });
      pageEl.appendChild(bubbles);
      pagesDiv.appendChild(pageEl);
    });
    status.textContent = 'Generation complete.';
  } catch (err) {
    console.error(err);
    document.getElementById('status').textContent = 'Generation failed.';
  }
});
