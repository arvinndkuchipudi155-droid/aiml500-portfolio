  // ── SLIDE VIEWER ──
  var slideImages = [
    "image_02.png",
  "image_03.png",
  "image_04.png",
  "image_05.png",
  "image_06.png"
  ];
  var currentSlide = 0;
  var timelineAssetRoot = new URL('../../ml-fundamentals/artifacts/ai-ml-timeline/', document.currentScript.src);
  slideImages = slideImages.map(function(path){return new URL(path, timelineAssetRoot).href;});

  function openSlides() {
    currentSlide = 0;
    document.getElementById('slide-modal').style.display = 'flex';
    document.body.style.overflow = 'hidden';
    buildDots();
    renderSlide();
  }
  function closeSlides() {
    document.getElementById('slide-modal').style.display = 'none';
    document.body.style.overflow = '';
  }
  function prevSlide() { if (currentSlide > 0) { currentSlide--; renderSlide(); } }
  function nextSlide() { if (currentSlide < slideImages.length - 1) { currentSlide++; renderSlide(); } }
  function buildDots() {
    var dots = document.getElementById('slide-dots');
    dots.innerHTML = slideImages.map(function(_, i) {
      return '<div id="dot-' + i + '" onclick="goSlide(' + i + ')" style="width:8px;height:8px;border-radius:50%;background:rgba(255,255,255,0.2);cursor:pointer;transition:all 0.2s;"></div>';
    }).join('');
  }
  function goSlide(i) { currentSlide = i; renderSlide(); }
  function renderSlide() {
    document.getElementById('slide-counter').textContent = (currentSlide + 1) + ' / ' + slideImages.length;
    slideImages.forEach(function(_, i) {
      var d = document.getElementById('dot-' + i);
      if (d) d.style.background = i === currentSlide ? '#c9a84c' : 'rgba(255,255,255,0.2)';
    });
    document.getElementById('btn-prev').style.opacity = currentSlide === 0 ? '0.35' : '1';
    document.getElementById('btn-next').style.opacity = currentSlide === slideImages.length - 1 ? '0.35' : '1';
    document.getElementById('slide-display').innerHTML = '<img src="' + slideImages[currentSlide] + '" style="width:100%;display:block;" />';
  }

document.addEventListener('keydown',function(e){if(document.getElementById('slide-modal').style.display==='flex'){if(e.key==='ArrowLeft')prevSlide();if(e.key==='ArrowRight')nextSlide();if(e.key==='Escape')closeSlides();}});
