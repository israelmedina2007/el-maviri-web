(() => {
 'use strict';
 const navButton=document.querySelector('.nav-toggle'), nav=document.querySelector('#navigation');
 function closeNav(){nav.classList.remove('is-open');navButton.setAttribute('aria-expanded','false');}
 navButton.addEventListener('click',()=>{const open=navButton.getAttribute('aria-expanded')!=='true';navButton.setAttribute('aria-expanded',String(open));nav.classList.toggle('is-open',open);});
 nav.querySelectorAll('a').forEach(a=>a.addEventListener('click',closeNav));
 document.addEventListener('keydown',e=>{if(e.key==='Escape')closeNav();});
 const box=document.querySelector('#lightbox'), photo=box.querySelector('img');
 document.querySelectorAll('[data-gallery]').forEach(button=>button.addEventListener('click',()=>{photo.src=button.dataset.gallery;photo.alt=button.querySelector('img').alt;if(typeof box.showModal==='function'){box.showModal();}else{window.open(photo.src,'_blank','noopener');}}));
 box.querySelector('button').addEventListener('click',()=>box.close());
 box.addEventListener('click',e=>{if(e.target===box){const r=box.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)box.close();}});
 const items=Array.isArray(window.MAVIRI_MENU)?window.MAVIRI_MENU:[], search=document.querySelector('#menu-search'), select=document.querySelector('#menu-category'), filters=document.querySelector('#category-filters'), results=document.querySelector('#menu-results'), count=document.querySelector('#menu-count');
 const categories=[...new Set(items.map(item=>item.category))];
 const normalize=t=>String(t||'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase();
 const money=new Intl.NumberFormat('es-MX',{style:'currency',currency:'MXN',maximumFractionDigits:2});
 const el=(tag,text,cls)=>{const node=document.createElement(tag);if(text!==undefined)node.textContent=text;if(cls)node.className=cls;return node;};
 categories.forEach(category=>{const option=el('option',category);option.value=category;select.append(option);});
 if(items.length){document.querySelector('#menu-pending').hidden=true;['Todas',...categories].forEach((category,index)=>{const button=el('button',category);button.type='button';button.dataset.category=index?category:'all';button.setAttribute('aria-pressed',String(!index));button.addEventListener('click',()=>{select.value=button.dataset.category;render();});filters.append(button);});}
 function render(){results.replaceChildren();if(!items.length){count.textContent='Menú pendiente de incorporar desde el PDF.';return;}const term=normalize(search.value);const found=items.filter(item=>(select.value==='all'||item.category===select.value)&&normalize([item.name,item.description,item.category].join(' ')).includes(term));count.textContent=found.length+' platillo'+(found.length===1?'':'s');filters.querySelectorAll('button').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.category===select.value)));if(!found.length){results.append(el('p','No encontramos ese antojo. Prueba otra búsqueda o categoría.','empty'));return;}found.forEach(item=>{const card=el('article',undefined,'dish');card.append(el('p',item.category,'eyebrow blue'),el('h3',item.name));if(item.description)card.append(el('p',item.description));const sizes=el('dl');(item.sizes||[]).forEach(size=>{const row=el('div');row.append(el('dt',size.label),el('dd',Number.isFinite(size.price)?money.format(size.price):'Consultar'));sizes.append(row);});card.append(sizes);results.append(card);});}
 const featured=document.querySelector('#featured-menu');
 if(featured)items.filter(item=>item.featured).forEach(item=>{const card=el('article',undefined,'dish');card.append(el('p','DE NUESTRA CARTA','eyebrow blue'),el('h3',item.name),el('p',item.description));const prices=el('dl');item.sizes.forEach(size=>{const row=el('div');row.append(el('dt',size.label),el('dd',money.format(size.price)));prices.append(row);});card.append(prices);featured.append(card);});
 if(items.length){document.querySelector('.menu-section .section-top>p').textContent='Carta transcrita del PDF del restaurante. Precios en MXN; confirma su vigencia al ordenar.';}
 search.addEventListener('input',render);select.addEventListener('change',render);render();
})();
