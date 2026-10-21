  // ── DOCUMENT VIEWER ──
  function openDocViewer() {
    var m = document.getElementById('dv-modal');
    m.style.display = 'flex';
    document.body.style.overflow = 'hidden';
    document.getElementById('dv-body').scrollTop = 0;
  }
  function closeDocViewer() {
    document.getElementById('dv-modal').style.display = 'none';
    document.body.style.overflow = '';
  }
  function dvGoto(id) {
    var el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    document.querySelectorAll('.dv-nav-item').forEach(function(b) { b.classList.remove('dv-active'); });
    var sectionMap = { 'dv-intro': 0, 'dv-diff': 1, 'dv-ml': 2, 'dv-dl': 3, 'dv-conclusion': 4, 'dv-refs': 5 };
    var idx = sectionMap[id];
    if (idx !== undefined) {
      var items = document.querySelectorAll('.dv-nav-item');
      if (items[idx]) items[idx].classList.add('dv-active');
    }
  }

document.addEventListener('keydown',function(e){if(e.key==='Escape')closeDocViewer();});
