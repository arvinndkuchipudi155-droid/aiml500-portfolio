(function(){
  'use strict';
  var activeViewer=null;
  function clamp(value,min,max){return Math.max(min,Math.min(max,value));}
  function make(tag,className,text){var el=document.createElement(tag);if(className)el.className=className;if(text!=null)el.textContent=text;return el;}
  function create(config){
    if(!config||!config.slides||!config.slides.length)throw new Error('PortfolioSlideViewer requires slides.');
    var index=clamp(config.startIndex||0,0,config.slides.length-1),lastFocus=null,frame=null,resizeObserver=null;
    var overlay=make('div','psv-overlay');overlay.hidden=true;overlay.setAttribute('role','dialog');overlay.setAttribute('aria-modal','true');overlay.setAttribute('aria-label',config.title||'Slide presentation');
    var shell=make('div','psv-shell'),header=make('div','psv-header'),title=make('strong','psv-title',config.title||'Slides'),headerActions=make('div','psv-header-actions'),count=make('span','psv-count'),close=make('button','psv-close','\u00d7');
    close.type='button';close.setAttribute('aria-label','Close slides');headerActions.append(count,close);header.append(title,headerActions);
    var stageWrap=make('div','psv-stage-wrap'),stage=make('div','psv-stage'),status=make('span','psv-status');status.setAttribute('aria-live','polite');stageWrap.append(stage,status);
    var footer=make('div','psv-footer'),previous=make('button','psv-nav psv-previous'),next=make('button','psv-nav psv-next');previous.type=next.type='button';previous.setAttribute('aria-label','Previous slide');next.setAttribute('aria-label','Next slide');previous.innerHTML='<span aria-hidden="true">\u2190</span> <b>Previous</b>';next.innerHTML='<b>Next</b> <span aria-hidden="true">\u2192</span>';
    var jump=make('div','psv-jump'),label=make('label','',config.jumpLabel||'Go to slide'),select=make('select','psv-select');label.htmlFor='psv-select-'+Math.random().toString(36).slice(2);select.id=label.htmlFor;
    config.slides.forEach(function(slide,i){var option=document.createElement('option');option.value=String(i);option.textContent=(i+1)+'. '+(slide.title||('Slide '+(i+1)));select.append(option);});
    jump.append(label,select);footer.append(previous,jump,next);shell.append(header,stageWrap,footer);overlay.append(shell);document.body.append(overlay);
    function fitFrame(){if(!frame)return;var width=config.baseWidth||1440,height=config.baseHeight||900,rect=stage.getBoundingClientRect(),scale=Math.min(rect.width/width,rect.height/height);frame.style.width=width+'px';frame.style.height=height+'px';frame.style.transform='translate(-50%,-50%) scale('+Math.max(.01,scale)+')';}
    function sendSlide(){if(frame&&frame.contentWindow)frame.contentWindow.postMessage({source:'portfolio-slide-viewer',type:'show-slide',index:index},location.origin);}
    function render(){
      var slide=config.slides[index];count.textContent=(index+1)+' / '+config.slides.length;select.value=String(index);previous.disabled=index===0;next.disabled=index===config.slides.length-1;status.textContent='Slide '+(index+1)+' of '+config.slides.length+': '+(slide.title||'');
      if(config.type==='iframe'){
        if(!frame){frame=make('iframe','psv-frame');frame.title=config.frameTitle||config.title||'Slide presentation';frame.src=config.src;frame.setAttribute('loading','eager');frame.addEventListener('load',function(){sendSlide();fitFrame();});stage.replaceChildren(frame);}
        sendSlide();fitFrame();
      }else{
        var image=make('img','psv-image');image.src=slide.src;image.alt=slide.alt||slide.title||('Slide '+(index+1));stage.replaceChildren(image);
      }
      if(config.onChange)config.onChange(index,slide);
    }
    function go(value){index=clamp(value,0,config.slides.length-1);render();}
    function open(){if(activeViewer&&activeViewer!==api)activeViewer.close();activeViewer=api;lastFocus=document.activeElement;overlay.hidden=false;document.body.style.overflow='hidden';render();requestAnimationFrame(function(){fitFrame();close.focus();});}
    function hide(){overlay.hidden=true;document.body.style.overflow='';if(activeViewer===api)activeViewer=null;if(lastFocus&&lastFocus.focus)lastFocus.focus();}
    previous.addEventListener('click',function(){go(index-1);});next.addEventListener('click',function(){go(index+1);});select.addEventListener('change',function(){go(Number(select.value));});close.addEventListener('click',hide);overlay.addEventListener('click',function(event){if(event.target===overlay)hide();});
    document.addEventListener('keydown',function(event){if(overlay.hidden)return;if(event.key==='Escape'){event.preventDefault();hide();}else if(event.key==='ArrowRight'||event.key==='PageDown'){event.preventDefault();go(index+1);}else if(event.key==='ArrowLeft'||event.key==='PageUp'){event.preventDefault();go(index-1);}else if(event.key==='Tab'){var focusable=Array.from(shell.querySelectorAll('button:not(:disabled),select,[href],iframe')).filter(function(el){return !el.hidden;});if(!focusable.length)return;var first=focusable[0],last=focusable[focusable.length-1];if(event.shiftKey&&document.activeElement===first){event.preventDefault();last.focus();}else if(!event.shiftKey&&document.activeElement===last){event.preventDefault();first.focus();}}});
    if('ResizeObserver'in window){resizeObserver=new ResizeObserver(fitFrame);resizeObserver.observe(stage);}else window.addEventListener('resize',fitFrame);
    var api={open:open,close:hide,goTo:go,getIndex:function(){return index;},destroy:function(){if(resizeObserver)resizeObserver.disconnect();overlay.remove();}};
    if(config.trigger){document.querySelectorAll(config.trigger).forEach(function(trigger){trigger.addEventListener('click',open);});}
    return api;
  }
  window.PortfolioSlideViewer={create:create};
  function initializePresentations(){
    document.querySelectorAll('script[data-portfolio-presentation]').forEach(function(element){
      if(element.dataset.initialized)return;
      var config=JSON.parse(element.textContent);
      create(config);element.dataset.initialized='true';
    });
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',initializePresentations,{once:true});
  else initializePresentations();
})();


