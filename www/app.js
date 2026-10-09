(function(){
const TOTAL=200, $=id=>document.getElementById(id);
const img=$('page'), stage=$('stage'), viewer=$('viewer');
let cur=1, scale=1, tx=0, ty=0, baseW=0, baseH=0;
const ls={get:(k,d)=>{try{return JSON.parse(localStorage.getItem(k))??d}catch(e){return d}},set:(k,v)=>{try{localStorage.setItem(k,JSON.stringify(v))}catch(e){}}};
let marks=ls.get('marks',[]);
const TOC=[
[1,'Préface',0],
[5,'Dieu',0],[13,'Les attributs de Dieu (Imâm Ghazali)',1],
[33,'Les Prophètes',0],
[45,'Le Coran',0],
[61,"L'Islam",0],
[66,'La Prière',0],
[68,'Les premières conditions',1],[69,'Les actes obligatoires',1],[70,'Ce qu’il faut éviter pendant la prière',1],[71,'Les actes qui annulent la prière',1],
[72,"L'appel à la prière (Al Azâne)",1],[75,"Le second appel à la prière (Iqâma)",1],[77,'Le Tachahoude',1],[79,'Le recueillement (Al-Qounoût)',1],
[80,'La prière du vendredi',1],[81,'La prière des deux fêtes canoniques',1],[82,'Prière en voyage, en danger, des éclipses',1],
[83,'Le lavage mortuaire',1],[85,'La prière mortuaire',1],[86,"La prière d'exaltation de Dieu (Tasbih)",1],[88,'Comment faire la prière (photos)',1],
[92,'Quelques sourates et leurs bienfaits',0],
[93,'Al Fâtihatou',1],[94,'Bienfaits de la Fâtiha',1],[95,'Bienfaits de « Bismillâh »',1],[98,"Ayâtoul Kour'siy-you",1],[102,'Amanar Rasoûlou',1],[106,"Laqad djâ'akoum",1],[109,'Law Anzalna',1],
[112,'Souratoul Douhâ',1],[114,"Souratou Char'hi",1],[116,'Soûratout Tîni',1],[117,'Souratoul Halaq',1],[120,'Souratoul Qadri',1],[123,'Souratoul Bay-yinati',1],[125,'Soûratoul Zoulzilati',1],
[127,'Soûratoul Adiyâti',1],[129,'Soûratoul Qâri-ati',1],[131,'Souratout Takaçour',1],[133,'Soûratoul Asri',1],[135,'Soûratoul Houmazati',1],[137,'Soûratoul Fîli',1],[139,'Soûratou Qouraychîne',1],
[141,'Soûratoul Mahoûna',1],[143,'Soûratoul Kawsara',1],[145,'Soûratoul Kâfiroûna',1],[147,"Soûratoun Naç'ri",1],[148,'Souratoul Masadi',1],[149,'Soûratoul Ikhlâç',1],[154,'Soûratoul Falaq',1],[155,'Souratoun Nâsi',1],
[158,'La Zakat',0],
[165,'Le mariage dans le droit musulman',0],
[167,"L'héritage en Islam",0],[168,'Les conditions pour hériter',1],[169,"Ce qui annule ou empêche l'héritage",1],[171,"Validité de l'héritage",1],
[172,"Qui peut prétendre à l'héritage — répartition",1],[176,'Les cas particuliers',1],[177,'Exemples de répartition',1],[181,'Cas particuliers des héritiers',1],[185,'Exemple de calcul des parts',1],[186,'Frais sur héritage',1],
[187,'Différentes sortes de Zikr',0],[189,"La lecture du Coran et l'invocation (Ad-do'a)",1],[191,"Bienséance pendant l'invocation",1],
[193,'La prière de consultation de Dieu',1],[194,'La prière du besoin',1],[195,'Les mérites de « La Illaha Illa Lah »',1],[196,'Les mérites du Tasbih',1],[197,"Les mérites de l'Istighfar",1],
[198,'Tableau : arabe, transcription, traduction',1]
];
function chapterOf(n){let t=TOC[0];for(const e of TOC){if(e[0]<=n)t=e;else break}return t}
const pad=n=>String(n).padStart(3,'0');

$('slider').max=TOTAL; $('jump').max=TOTAL; $('total').textContent=TOTAL;
if(ls.get('night',false)) document.body.classList.add('night');

function fit(){
  const vw=innerWidth, vh=innerHeight, r=img.naturalWidth/img.naturalHeight||0.7;
  baseH=Math.min(vh,vw/r); baseW=baseH*r;
  img.style.width=baseW+'px'; img.style.height=baseH+'px';
  scale=1; tx=(vw-baseW)/2; ty=(vh-baseH)/2; apply();
}
function clamp(){
  const vw=innerWidth, vh=innerHeight, w=baseW*scale, h=baseH*scale;
  tx = w<=vw ? (vw-w)/2 : Math.min(0,Math.max(vw-w,tx));
  ty = h<=vh ? (vh-h)/2 : Math.min(0,Math.max(vh-h,ty));
}
function apply(){clamp(); stage.style.transform=`translate(${tx}px,${ty}px) scale(${scale})`}

function show(n){
  cur=Math.min(TOTAL,Math.max(1,n));
  img.onload=fit; img.src=`pages/${pad(cur)}.webp`;
  if(img.complete&&img.naturalWidth) fit();
  $('slider').value=cur; $('jump').value=cur;
  $('btnBook').textContent=marks.includes(cur)?'★':'☆';
  ls.set('last',cur);
  $('title').textContent=chapterOf(cur)[1];
  [cur+1,cur-1].forEach(p=>{if(p>=1&&p<=TOTAL){const i=new Image();i.src=`pages/${pad(p)}.webp`}});
}

// gestes
const pts=new Map(); let start=null, moved=false, lastTap=0, swipeX=0;
viewer.addEventListener('pointerdown',e=>{viewer.setPointerCapture(e.pointerId);pts.set(e.pointerId,{x:e.clientX,y:e.clientY});moved=false;start=snap();swipeX=0});
viewer.addEventListener('pointermove',e=>{
  if(!pts.has(e.pointerId))return; pts.set(e.pointerId,{x:e.clientX,y:e.clientY});
  const a=[...pts.values()];
  if(a.length===2&&start.d){
    const d=Math.hypot(a[0].x-a[1].x,a[0].y-a[1].y), s=Math.min(5,Math.max(1,start.scale*d/start.d));
    const cx=(a[0].x+a[1].x)/2, cy=(a[0].y+a[1].y)/2;
    tx=cx-(start.cx-start.tx)*s/start.scale; ty=cy-(start.cy-start.ty)*s/start.scale; scale=s; moved=true; apply();
  } else if(a.length===1){
    const dx=a[0].x-start.x0, dy=a[0].y-start.y0;
    if(Math.abs(dx)+Math.abs(dy)>8) moved=true;
    tx=start.tx+dx; ty=start.ty+dy; swipeX=dx; apply();
  }
});
function snap(){const a=[...pts.values()];const o={scale,tx,ty,x0:a[0]?.x,y0:a[0]?.y};
  if(a.length===2){o.d=Math.hypot(a[0].x-a[1].x,a[0].y-a[1].y);o.cx=(a[0].x+a[1].x)/2;o.cy=(a[0].y+a[1].y)/2}return o}
function up(e){
  const wasOne=pts.size===1; pts.delete(e.pointerId);
  if(pts.size===1){start=snap();return}
  if(!wasOne)return;
  const w=baseW*scale, atEdge=w<=innerWidth+2||true;
  if(moved && scale<=1.05 && Math.abs(swipeX)>60){ swipeX<0?show(cur+1):show(cur-1); return }
  if(moved && scale>1.05){ // swipe de page seulement si on est au bord
    if(Math.abs(swipeX)>140 && ((swipeX<0&&tx<=innerWidth-w+1)||(swipeX>0&&tx>=-1))){swipeX<0?show(cur+1):show(cur-1);return}
    return;
  }
  if(!moved){
    const now=Date.now();
    if(now-lastTap<300){ // double tap = zoom
      if(scale>1.05){scale=1;fit()} else {const s=2.5; tx=e.clientX-(e.clientX-tx)*s/scale; ty=e.clientY-(e.clientY-ty)*s/scale; scale=s; apply()}
      lastTap=0;
    } else {
      lastTap=now;
      setTimeout(()=>{ if(lastTap===now){ lastTap=0; document.body.classList.toggle('hide') } },310);
    }
  } else apply();
}
viewer.addEventListener('pointerup',up); viewer.addEventListener('pointercancel',up);
viewer.addEventListener('wheel',e=>{e.preventDefault();const s=Math.min(5,Math.max(1,scale*(e.deltaY<0?1.1:.9)));tx=e.clientX-(e.clientX-tx)*s/scale;ty=e.clientY-(e.clientY-ty)*s/scale;scale=s;apply()},{passive:false});

// contrôles
$('prev').onclick=()=>show(cur-1); $('next').onclick=()=>show(cur+1);
$('slider').oninput=e=>show(+e.target.value);
$('jump').onchange=e=>show(+e.target.value||cur);
$('jump').onfocus=e=>e.target.select();
$('btnTheme').onclick=()=>{document.body.classList.toggle('night');ls.set('night',document.body.classList.contains('night'))};
$('btnBook').onclick=()=>{const i=marks.indexOf(cur); i>=0?marks.splice(i,1):marks.push(cur); marks.sort((a,b)=>a-b); ls.set('marks',marks); $('btnBook').textContent=i>=0?'☆':'★'};
document.addEventListener('keydown',e=>{if(e.target.tagName==='INPUT'&&e.target.type==='number')return;
  if(e.key==='ArrowRight'||e.key==='PageDown')show(cur+1); if(e.key==='ArrowLeft'||e.key==='PageUp')show(cur-1)});
addEventListener('resize',fit);

// panneau pages / marque-pages
let tab='toc';
function render(){
  const g=$('grid'); g.innerHTML=''; g.classList.toggle('list',tab==='toc');
  if(tab==='toc'){
    const ch=chapterOf(cur);
    TOC.forEach(([p,t,l])=>{const d=document.createElement('div');d.className='toc l'+l+(p===ch[0]?' cur':'');
      d.innerHTML=`<span></span><b>${p}</b>`;d.firstChild.textContent=t;
      d.onclick=()=>{$('panel').hidden=true;show(p)};g.appendChild(d)});
    const c=g.querySelector('.cur'); if(c)c.scrollIntoView({block:'center'});
    return;
  }
  const list=tab==='all'?Array.from({length:TOTAL},(_,i)=>i+1):marks;
  if(!list.length){g.innerHTML='<div class="empty">Aucun marque-page.<br>Touchez ☆ sur une page pour en ajouter.</div>';return}
  list.forEach(n=>{const c=document.createElement('div');c.className='cell'+(n===cur?' cur':'');
    c.innerHTML=`<img loading="lazy" src="thumbs/${pad(n)}.webp"><div>${n}</div>`;
    c.onclick=()=>{$('panel').hidden=true;show(n)};g.appendChild(c)});
  const c=g.querySelector('.cur'); if(c)c.scrollIntoView({block:'center'});
}
$('btnGrid').onclick=()=>{$('panel').hidden=false;render()};
$('close').onclick=()=>{$('panel').hidden=true};
document.querySelectorAll('.tabs [data-tab]').forEach(b=>b.onclick=()=>{
  tab=b.dataset.tab;document.querySelectorAll('.tabs [data-tab]').forEach(x=>x.classList.toggle('on',x===b));render()});

// bouton retour Android (Capacitor)
try{const A=window.Capacitor&&Capacitor.Plugins&&Capacitor.Plugins.App;
 if(A)A.addListener('backButton',()=>{ if(!$('panel').hidden)$('panel').hidden=true; else if(cur>1&&false){} else A.exitApp()})}catch(e){}

show(ls.get('last',1));
})();
