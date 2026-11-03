// Shared portfolio slide viewer configuration for the AI/ML History Timeline.
var timelineViewer=null;
var timelineScriptUrl=document.currentScript.src;
var timelineAssetRoot=new URL('../../ml-fundamentals/artifacts/ai-ml-timeline/',timelineScriptUrl);
var timelineSlides=[
  {file:'image_02.png',title:'The Foundations of AI'},
  {file:'image_03.png',title:'Early Growth and Optimism'},
  {file:'image_04.png',title:'AI Winters'},
  {file:'image_05.png',title:'Machine Learning Resurgence'},
  {file:'image_06.png',title:'The Generative AI Era'}
].map(function(slide,index){return{title:slide.title,src:new URL(slide.file,timelineAssetRoot).href,alt:'AI and ML history timeline slide '+(index+1)+': '+slide.title};});

document.addEventListener('DOMContentLoaded',function(){
  timelineViewer=PortfolioSlideViewer.create({
    title:'AI/ML History Timeline',
    type:'image',
    slides:timelineSlides
  });
});

function openSlides(){if(timelineViewer)timelineViewer.open();}
function closeSlides(){if(timelineViewer)timelineViewer.close();}
function prevSlide(){if(timelineViewer)timelineViewer.goTo(timelineViewer.getIndex()-1);}
function nextSlide(){if(timelineViewer)timelineViewer.goTo(timelineViewer.getIndex()+1);}
function goSlide(index){if(timelineViewer)timelineViewer.goTo(index);}

