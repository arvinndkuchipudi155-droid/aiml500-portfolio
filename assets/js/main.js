// Preserve previously shared course and artifact hash links.
(function(){
  var script=document.currentScript;
  var root=new URL('../../',script.src);
  var routes={'model-development':'model-development/','ml-fundamentals':'ml-fundamentals/','artifacts':'ml-fundamentals/','card-timeline':'ml-fundamentals/artifacts/ai-ml-timeline/','card-chatbot':'ml-fundamentals/artifacts/leadership-chatbot/','card-report':'ml-fundamentals/artifacts/ml-vs-dl/','card-scenarios':'ml-fundamentals/artifacts/data-challenges/','card-newsletter':'ml-fundamentals/artifacts/energy-newsletter/'};
  function redirect(){var key=location.hash.slice(1);if(routes[key]) location.replace(new URL(routes[key],root).href);}
  redirect();window.addEventListener('hashchange',redirect);
})();
