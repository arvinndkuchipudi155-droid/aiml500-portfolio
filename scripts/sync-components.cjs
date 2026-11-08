// Generate static navigation from one template. No runtime framework is required.
const fs=require('node:fs'),path=require('node:path');
const root=path.resolve(__dirname,'..'),check=process.argv.includes('--check');
const template=fs.readFileSync(path.join(root,'assets/templates/navigation.html'),'utf8').trim();
function walk(d){return fs.readdirSync(d,{withFileTypes:true}).flatMap(e=>e.isDirectory()?walk(path.join(d,e.name)):[path.join(d,e.name)])}
let count=0;
for(const file of walk(root).filter(f=>f.endsWith('.html')&&!f.includes(path.join('assets','templates')))){
 let html=fs.readFileSync(file,'utf8');if(!html.includes('<!-- portfolio-nav:start -->'))continue;
 const relative=path.relative(root,file).replaceAll('\\','/'),depth=relative.split('/').length-1;
 const active=relative.startsWith('ml-fundamentals/')?'ML':relative.startsWith('model-development/')?'MODEL':'HOME';
 const values={ROOT:'../'.repeat(depth)};for(const key of ['HOME','ML','MODEL']){values[key+'_ACTIVE']=key===active?' active':'';values[key+'_CURRENT']=key===active?' aria-current="page"':'';}
 const nav=template.replace(/\{\{(\w+)\}\}/g,(_,key)=>values[key]);
 const updated=html.replace(/<!-- portfolio-nav:start -->[\s\S]*?<!-- portfolio-nav:end -->/,'<!-- portfolio-nav:start -->'+nav+'<!-- portfolio-nav:end -->');
 if(check&&updated!==html)throw Error('Navigation is out of sync: '+relative);
 if(!check)fs.writeFileSync(file,updated);count++;
}
console.log((check?'Checked':'Generated')+' shared navigation on '+count+' pages.');
