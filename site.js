const viewer = document.querySelector('dialog');
const enlarged = viewer.querySelector('img');
const description = viewer.querySelector('p');
let opener;

for (const figure of document.querySelectorAll('[data-zoom-image]')) {
  const caption = figure.querySelector('figcaption').textContent;
  const link = figure.querySelector('a');
  const picture = link.querySelector('img');

  link.addEventListener('click', event => {
    if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    event.preventDefault();
    opener = link;
    enlarged.src = picture.closest('picture') ? picture.currentSrc : link.href;
    enlarged.alt = picture.alt;
    description.textContent = caption;
    viewer.showModal();
  });
}

viewer.addEventListener('close', () => opener?.focus());
