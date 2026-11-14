const viewer = document.querySelector('dialog');
const enlarged = viewer.querySelector('img');
const description = viewer.querySelector('p');
let opener;

for (const figure of document.querySelectorAll('[data-figure]')) {
  const caption = figure.querySelector('figcaption').textContent;
  const link = document.createElement('a');
  const picture = document.createElement('img');
  link.href = 'assets/' + figure.dataset.figure;
  link.setAttribute('aria-label', '放大查看：' + caption);
  picture.src = link.href;
  picture.alt = caption;
  picture.decoding = 'async';
  link.append(picture);
  figure.prepend(link);

  link.addEventListener('click', event => {
    if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    event.preventDefault();
    opener = link;
    enlarged.src = link.href;
    enlarged.alt = caption;
    description.textContent = caption;
    viewer.showModal();
  });
}

viewer.addEventListener('close', () => opener?.focus());
