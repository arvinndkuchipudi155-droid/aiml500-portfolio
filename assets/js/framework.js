  function filterAlgorithms(domain) {
    var count = 0;
    document.querySelectorAll('.algorithm-card').forEach(function(card) {
      var show = domain === 'all' || card.dataset.domains.indexOf(domain) !== -1;
      card.hidden = !show;
      if (show) count++;
    });
    document.getElementById('algorithm-count').textContent = count + ' algorithms and model families';
  }
