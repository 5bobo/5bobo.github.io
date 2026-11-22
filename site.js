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
    enlarged.src = link.href;
    enlarged.alt = picture.alt;
    description.textContent = caption;
    viewer.showModal();
  });
}

viewer.addEventListener('close', () => opener?.focus());

const lossDemo = document.querySelector('.loss-demo');
if (lossDemo) {
  // Teaching values illustrate the loss; they are not evaluation measurements.
  const probabilities = [.4, .25, .15, .1, .06, .04];
  const worlds = lossDemo.querySelector('.loss-worlds');
  function showResponsibilities(bestFit) {
    const energies = [2.1, 2.1, 2.8, 3.3, 3.8, 4.2];
    energies[bestFit] = .25;
    const likelihoods = probabilities.map((p, k) => p * Math.exp(-energies[k]));
    const normalizer = likelihoods.reduce((sum, value) => sum + value, 0);
    const responsibilities = likelihoods.map(value => value / normalizer);
    worlds.replaceChildren(...probabilities.map((p, k) => {
      const item = document.createElement('li');
      const responsibility = responsibilities[k];
      const direction = responsibility > p ? '提高分数' : '降低分数';
      item.innerHTML = `<div class="loss-world-track" aria-hidden="true"><span class="loss-world-bar pi" style="height:${p * 100}%"></span><span class="loss-world-bar r" style="height:${responsibility * 100}%"></span></div><span class="loss-world-label">候选 ${k + 1}</span><span class="loss-world-values">π ${(p * 100).toFixed(0)}%<br>r ${(responsibility * 100).toFixed(1)}%</span><span class="loss-world-change">${direction}</span>`;
      return item;
    }));
    for (const button of lossDemo.querySelectorAll('[data-loss-fit]')) {
      button.setAttribute('aria-pressed', String(Number(button.dataset.lossFit) === bestFit));
    }
    lossDemo.querySelector('.loss-demo-status').textContent = `候选 ${bestFit + 1} 的责任度为 ${(responsibilities[bestFit] * 100).toFixed(1)}%，高于当前概率 ${(probabilities[bestFit] * 100).toFixed(0)}%；π − r 为负，梯度下降会提高该候选的评分。`;
  }
  for (const button of lossDemo.querySelectorAll('[data-loss-fit]')) {
    button.addEventListener('click', () => showResponsibilities(Number(button.dataset.lossFit)));
  }
  showResponsibilities(1);
}
