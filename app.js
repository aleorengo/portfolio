'use strict';
const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;

// Align the unreflected extension to the original hero's image coordinates.
const rippleHero=document.querySelector('.hero');
const rippleAbout=document.querySelector('.about-ripple-continuation');
const portrait=document.querySelector('.about-layout .about-portrait');
const workStar=document.querySelector('.gallery-header-star');
let portraitOffset=0;
function syncSectionArtwork(){
  // Use one image coordinate system on both sides of the printed transition.
  const about=document.querySelector('#about');
  const work=document.querySelector('#projects');
  if(about&&work){
    const scale=Math.max(about.offsetWidth/1536,(about.offsetHeight+220)/1024);
    const size=`${1536*scale}px ${1024*scale}px`;
    const x=`${(about.offsetWidth-1536*scale)/2}px`;
    for(const section of [about,work]){
      section.style.setProperty('--about-paper-size',size);
      section.style.setProperty('--about-paper-x',x);
    }
    work.style.setProperty('--about-paper-y',`${-about.offsetHeight}px`);
  }
  if(workStar){
    const star=workStar.getBoundingClientRect();
    const masthead=workStar.parentElement.getBoundingClientRect();
    const title=document.querySelector('#projects-title').getBoundingClientRect();
    workStar.style.setProperty('--work-star-top',`${(title.top+title.bottom)/2-masthead.top-star.width*188/360}px`);
  }
  if(rippleHero&&rippleAbout){
    const backdrop=rippleHero.querySelector('.hero-backdrop');
    const css=getComputedStyle(backdrop),box=backdrop.getBoundingClientRect();
    const target=rippleAbout.getBoundingClientRect();
    const width=parseFloat(css.width),height=parseFloat(css.height);
    const cover=Math.max(width/1536,height/1024);
    const scale=new DOMMatrixReadOnly(css.transform).a;
    const [x,y]=css.backgroundPosition.split(' ').map(v=>parseFloat(v)/100);
    rippleAbout.style.setProperty('--ripple-left',`${box.left+(width-1536*cover)*x*scale-target.left}px`);
    rippleAbout.style.setProperty('--ripple-top',`${box.top+(height-1024*cover)*y*scale-target.top}px`);
    rippleAbout.style.setProperty('--ripple-width',`${1536*cover*scale}px`);
  }
  if(portrait&&window.innerWidth>600){
    const image=portrait.querySelector('img').getBoundingClientRect();
    const title=document.querySelector('#about-title').getBoundingClientRect();
    const current=parseFloat(getComputedStyle(portrait).transform==='none'?0:new DOMMatrixReadOnly(getComputedStyle(portrait).transform).f);
    const linkBottom=document.querySelector('.about-copy .text-link').getBoundingClientRect().bottom;
    const headAlignment=current+title.top+9-(image.top+image.height*552/1761);
    const underlineLimit=current+linkBottom-image.bottom;
    portraitOffset=Math.min(headAlignment,underlineLimit);
    portrait.style.setProperty('--portrait-align-y',`${portraitOffset}px`);
  }
}
syncSectionArtwork();
document.fonts.ready.then(syncSectionArtwork);
if('ResizeObserver' in window){
  const artworkObserver=new ResizeObserver(syncSectionArtwork);
  if(rippleHero)artworkObserver.observe(rippleHero);
  const aboutSection=document.querySelector('#about');
  if(aboutSection)artworkObserver.observe(aboutSection);
  if(portrait)artworkObserver.observe(portrait.parentElement);
  if(workStar)artworkObserver.observe(workStar.parentElement);
}else window.addEventListener('resize',syncSectionArtwork,{passive:true});

// Scroll navigation; the hero artwork stays still.
const header=document.querySelector('.site-header');
const sectionStar=document.querySelector('.section-star');
let scrollFrame=false;
function updateNavigation(){
 const sections=[...document.querySelectorAll('main>section[id],.work-contact-flow>section[id]')];
 if(!sections.length)return;
 const threshold=Math.max((header?.offsetHeight||0)+24,window.innerHeight*.3);
 const active=[...sections].reverse().find(section=>section.getBoundingClientRect().top<=threshold)||sections[0];
 document.querySelectorAll('.site-header nav a').forEach(link=>{
  const selected=link.getAttribute('href')===`#${active.id}`;
  link.classList.toggle('active',selected);
  if(selected)link.setAttribute('aria-current','location');else link.removeAttribute('aria-current');
 });
}
function updateScroll(){
  const y=window.scrollY;
  if(header)header.classList.toggle('scrolled',y>90);
  updateNavigation();
  if(!reducedMotion){
    if(sectionStar)sectionStar.style.transform=`rotate(${y*.035-10}deg)`;
  }
  scrollFrame=false;
}
function scheduleScroll(){if(!scrollFrame){scrollFrame=true;requestAnimationFrame(updateScroll)}}
window.addEventListener('scroll',scheduleScroll,{passive:true});
window.addEventListener('resize',scheduleScroll);
updateScroll();
if('IntersectionObserver' in window){
  if(!reducedMotion){
    const revealObserver=new IntersectionObserver(entries=>entries.forEach(entry=>{
      if(entry.isIntersecting){entry.target.classList.add('is-revealed');revealObserver.unobserve(entry.target)}
    }),{threshold:.06,rootMargin:'0px 0px -18px 0px'});
    document.querySelectorAll('.section-heading,.project-card,.about-copy,.about-portrait,.play-copy,.embroidery-frame,.case-detail,.case-identity,.next-project').forEach((item,index)=>{
      item.classList.add('scroll-reveal');item.style.setProperty('--reveal-delay',`${item.classList.contains('project-card')&&index%2?100:0}ms`);revealObserver.observe(item);
    });
  }
}

// A botanical textile made from small words, crosses and individual colored threads.
const garden=document.getElementById('thread-garden');
const palettes=[
  {name:'Iris',petals:['#425e9a','#706b9c','#7299af','#c0aaa8'],stem:['#5e7260','#8a9472','#929b83']},
  {name:'Coral',petals:['#c76569','#d37d75','#a77387','#e0b392'],stem:['#667257','#87927b','#aaa879']},
  {name:'Sunlight',petals:['#b99845','#caaa5b','#cbbb84','#99a8b4'],stem:['#687b69','#909766','#9ba487']}
];
const flowerPositions=[{x:245,y:175,s:.92,r:-7},{x:350,y:315,s:.68,r:18},{x:170,y:275,s:.66,r:-24},{x:425,y:235,s:.65,r:12},{x:90,y:355,s:.50,r:-18},{x:310,y:92,s:.59,r:12}];
const irisPetals='M0 6C-20-25-32-85-8-113C12-142 40-97 35-58C38-35 15-4 0 6ZM-6 10C-16-4-55-30-77-21C-107-13-77 26-48 33C-19 40-19 29-6 10ZM9 10C35-34 78-41 97-21C118 13 67 24 32 24C22 23 19 12 9 10ZM-7 15C-44 26-48 76-22 94C2 111 19 72 16 53C13 37 10 28-7 15ZM23 23C42 35 48 72 72 73C104 75 109 39 91 26C66 18 39 17 23 23Z';
const leaves='M-25 440C-30 280-120 184-114 188C-116 297-45 440-25 440ZM-20 440C44 195 98 81 100 95C90 272 40 395-20 440Z';
let flowerCount=3,paletteIndex=0;
function threadPattern(id,colors){
  return `<pattern id="${id}" width="100" height="28" patternUnits="userSpaceOnUse"><text x="0" y="5" font-family="monospace" font-size="5.1" fill="${colors[0]}">ideas shape bloom grow</text><text x="-11" y="11.7" font-family="monospace" font-size="5" fill="${colors[1]}">detail space words form</text><text x="0" y="18.4" font-family="monospace" font-size="5.3" fill="${colors[2]}">+ × × + design × × +</text><text x="-9" y="25.3" font-family="monospace" font-size="5" fill="${colors[0]}">curiosity nature play</text></pattern>`;
}
function renderGarden(){
  if(!garden)return;
  const palette=palettes[paletteIndex];
  let svg=`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 560 620" aria-hidden="true"><defs>${threadPattern('petal-thread',palette.petals)}${threadPattern('leaf-thread',palette.stem)}</defs>`;
  flowerPositions.slice(0,flowerCount).forEach((p,index)=>{
    const stemLength=(585-p.y)/p.s;
    svg+=`<g class="iris-bloom" data-flower="${index}"><g transform="translate(${p.x} ${p.y}) rotate(${p.r}) scale(${p.s})"><path d="M0 25C-5 110 12 230-35 ${stemLength}" fill="none" stroke="url(#leaf-thread)" stroke-width="7"/><path d="${leaves}" fill="url(#leaf-thread)" opacity=".9"/><path d="${irisPetals}" fill="${palette.petals[1]}" opacity=".07"/><path d="${irisPetals}" fill="url(#petal-thread)"/><path d="M-10 5Q7 19 25 8M-19 36Q4 31 15 51" fill="none" stroke="${palette.petals[3]}" stroke-width="3" opacity=".75"/></g></g>`;
  });
  svg+='</svg>';garden.innerHTML=svg;
  garden.setAttribute('aria-label',`${flowerCount} embroidered iris flowers in the ${palette.name.toLowerCase()} palette, made from tiny words and cross stitches.`);
}
function updateGardenStatus(message){const status=document.querySelector('.garden-status');if(status)status.textContent=message}
if(garden){
  renderGarden();
  const bloom=document.getElementById('bloom-button');
  bloom.addEventListener('click',()=>{
    if(flowerCount<flowerPositions.length){flowerCount++;renderGarden();updateGardenStatus(`${flowerCount} flowers in your garden. Keep growing.`)}
    if(flowerCount===flowerPositions.length){bloom.disabled=true;updateGardenStatus('Six flowers in full bloom. Try another color, or start again.')}
  });
  document.getElementById('palette-button').addEventListener('click',()=>{
    paletteIndex=(paletteIndex+1)%palettes.length;renderGarden();updateGardenStatus(`${palettes[paletteIndex].name} threads. ${flowerCount} flowers. A different feeling.`);
  });
  document.getElementById('reset-button').addEventListener('click',()=>{
    flowerCount=3;paletteIndex=0;bloom.disabled=false;renderGarden();updateGardenStatus('Three flowers. A fresh beginning.');
  });
}
// One image coordinate system across Work and Contact: no repeated or mirrored ripples.
{
 const flow=document.querySelector('.work-contact-flow');
 const work=document.querySelector('#projects');
 const contact=document.querySelector('.contact-ripple');
 if(flow&&work&&contact){
  const alignRipples=()=>{
   const section=flow.getBoundingClientRect();
   const workBox=work.getBoundingClientRect(),contactBox=contact.getBoundingClientRect();
   const size=Math.max(950,Math.min(1900,section.width*1.18),contactBox.height/1.12);
   const origin=workBox.bottom-section.top;
   flow.style.setProperty('--work-ripple-width',`${size}px`);
   flow.style.setProperty('--work-ripple-height',`${size*2}px`);
   flow.style.setProperty('--contact-start',`${workBox.bottom-section.top}px`);
   flow.style.setProperty('--work-ripple-left',`${-size*.10}px`);
   flow.style.setProperty('--work-ripple-top',`${origin-size*.84}px`);
  };
  alignRipples();document.fonts.ready.then(alignRipples);
  const observer=new ResizeObserver(alignRipples);observer.observe(flow);observer.observe(work);
 }
}

// A local-only draft composer. Delivery remains in the visitor's email app.
function buildContactDraft(form){
 const values=new FormData(form);
 const email=String(values.get('email')||'').trim();
 const subject=String(values.get('subject')||'').trim();
 const message=String(values.get('message')||'').trim();
 return `mailto:ale.orengo@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(`${message}\n\nReply email: ${email}`)}`;
}
const contactForm=document.querySelector('#contact-form');
if(contactForm){
 contactForm.addEventListener('submit',event=>{
  event.preventDefault();
  for(const name of ['subject','message']){
   const field=contactForm.elements.namedItem(name);
   field.setCustomValidity(field.value.trim()?'':'Please fill in this field.');
  }
  if(!contactForm.reportValidity())return;
  const draft=buildContactDraft(contactForm);
  const status=contactForm.querySelector('.contact-form-status');
  status.textContent='Your draft is ready. Review it in your email app and press send. If it doesn’t open, email me using the link on the left.';
  window.location.href=draft;
 });
 contactForm.addEventListener('input',event=>{
  event.target.setCustomValidity?.('');
  contactForm.querySelector('.contact-form-status').textContent='';
 });
}
