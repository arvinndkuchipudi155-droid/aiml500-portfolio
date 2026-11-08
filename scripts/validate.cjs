const fs=require('node:fs'),path=require('node:path'),vm=require('node:vm'),cp=require('node:child_process');
const root=path.resolve(__dirname,'..');
function walk(d){return fs.readdirSync(d,{withFileTypes:true}).flatMap(e=>e.isDirectory()?walk(path.join(d,e.name)):[path.join(d,e.name)])}
const files=walk(root),known=new Set(files.map(f=>path.relative(root,f).replaceAll('\\','/')));
// A supplied manifest permits checking binary assets when only source files are checked out.
const manifest=process.argv[2];if(manifest)JSON.parse(fs.readFileSync(manifest,'utf8')).forEach(p=>known.add(p));
known.delete('assets/js/timeline.js');known.delete('model-development/artifacts/ai-infrastructure/artifact-typography.css');
const failures=[];let links=0,decks=0,pages=0;
function target(file,url){if(!url||/^(?:[a-z]+:|#|\/\/)/i.test(url))return;const clean=decodeURIComponent(url.split(/[?#]/)[0]);if(!clean)return;let p=path.posix.normalize(path.posix.join(path.posix.dirname(file),clean));if(known.has(p)||known.has(p.replace(/\/$/,'')+'/index.html')){links++;return;}failures.push(file+' → '+url);}
for(const file of files){const relative=path.relative(root,file).replaceAll('\\','/');if(file.endsWith('.js')){new vm.Script(fs.readFileSync(file,'utf8'),{filename:relative});}
 if(!file.endsWith('.html')||relative.startsWith('assets/templates/'))continue;
 const html=fs.readFileSync(file,'utf8');pages++;
 for(const m of html.matchAll(/(?:href|src)="([^"]*)"/g))target(relative,m[1]);
 if(html.includes('<!-- portfolio-nav:start -->')){
  const nav=html.match(/<!-- portfolio-nav:start -->([\s\S]*?)<!-- portfolio-nav:end -->/)[1];if((nav.match(/aria-current="page"/g)||[]).length!==1)failures.push(relative+' has invalid active navigation');
 }
 if(relative!=='model-development/artifacts/neural-networks/slides.html'&&/<style>/.test(html))failures.push(relative+' still has inline page CSS');
 for(const m of html.matchAll(/<script([^>]*)>([\s\S]*?)<\/script>/g)){
  if(m[1].includes('data-portfolio-presentation')){const c=JSON.parse(m[2]);decks++;if(!c.trigger||!c.slides?.length)failures.push(relative+' has incomplete slide configuration');if(c.src)target(relative,c.src);c.slides.forEach(s=>{if(s.src)target(relative,s.src)});}
  else if(m[2].trim())new vm.Script(m[2],{filename:relative});
 }
 for(const m of html.matchAll(/<(?:a|button)\b([^>]*)>/g)){if(/\bdownload(?:\s|=|$)/.test(m[1])&&!m[1].includes('portfolio-button'))failures.push(relative+' has an unstyled download action');}
}
if(decks!==2)failures.push('Expected two shared-viewer configurations, found '+decks);
cp.execFileSync(process.execPath,[path.join(__dirname,'sync-components.cjs'),'--check'],{stdio:'inherit'});
if(failures.length)throw Error(failures.join('\n'));
console.log('Validated '+pages+' pages, '+links+' local references, JavaScript syntax, active navigation, downloads, and '+decks+' presentation configurations.');
