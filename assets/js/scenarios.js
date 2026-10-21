  // ── Artifact 04 slide navigation ────────────────────────────────────────
  var currentSlide = 1;
  function showSlide(n) {
    currentSlide = n;
    [1,2,3].forEach(function(i) {
      var s = document.getElementById('slide-' + i);
      var d = document.getElementById('dot-' + i);
      if (s) s.style.display = (i === n) ? 'block' : 'none';
      if (d) {
        d.style.background = (i === n) ? 'var(--navy)' : 'var(--border)';
        d.style.color       = (i === n) ? '#c9a84c'    : 'var(--navy)';
      }
    });
    var ctr = document.getElementById('slide-counter');
    if (ctr) ctr.textContent = 'Slide ' + n + ' of 3';
  }

