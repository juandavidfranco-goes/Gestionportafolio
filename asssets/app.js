(function(){
  var PAGE=document.body.getAttribute('data-page')||'toolkit';
  var KEY='kiowa-toolkit:'+PAGE;
  var statusEl=document.querySelector('.saved');
  function qs(s,r){return (r||document).querySelector(s)}
  function qsa(s,r){return Array.prototype.slice.call((r||document).querySelectorAll(s))}

  /* ---- repeaters: filas que se pueden agregar ---- */
  var repeats={};
  function addRow(box){
    var key=box.getAttribute('data-repeat');
    var i=repeats[key]=(repeats[key]||0)+1;
    var tpl=qs('template',box);
    var target=qs('[data-rows]',box)||box;
    var holder=document.createElement(target.tagName.toLowerCase()==='tbody'?'tbody':'div');
    holder.innerHTML=tpl.innerHTML.replace(/__i__/g,String(i));
    while(holder.firstChild){target.appendChild(holder.firstChild)}
    bind(target);
    return i;
  }
  qsa('[data-repeat]').forEach(function(box){
    var min=parseInt(box.getAttribute('data-min')||'1',10);
    for(var k=0;k<min;k++)addRow(box);
    var btn=qs('[data-add]',box);
    if(btn)btn.addEventListener('click',function(){addRow(box);save();});
  });

  /* ---- flechas ↑ ↓ ---- */
  function paintDir(btn,hid){var v=hid.value;btn.setAttribute('data-v',v);btn.textContent=v==='up'?'↑':v==='down'?'↓':'↑↓';}
  function bind(root){
    qsa('button.dir',root).forEach(function(btn){
      if(btn._b)return;btn._b=1;
      var hid=btn.previousElementSibling;
      paintDir(btn,hid);
      btn.addEventListener('click',function(){hid.value=hid.value===''?'up':hid.value==='up'?'down':'';paintDir(btn,hid);save();recalc();});
    });
    qsa('textarea.f',root).forEach(function(t){if(t._b)return;t._b=1;});
  }
  bind(document);

  /* ---- estado ---- */
  function collect(){
    var st={fields:{},repeats:JSON.parse(JSON.stringify(repeats)),at:new Date().toISOString()};
    qsa('[name]').forEach(function(el){
      var n=el.name;
      if(el.type==='radio'){if(el.checked)st.fields[n]=el.value;}
      else if(el.type==='checkbox'){st.fields[n]=el.checked;}
      else st.fields[n]=el.value;
    });
    return st;
  }
  function apply(st){
    if(!st)return;
    Object.keys(st.repeats||{}).forEach(function(k){
      var box=qs('[data-repeat="'+k+'"]');
      while(box&&(repeats[k]||0)<st.repeats[k])addRow(box);
    });
    qsa('[name]').forEach(function(el){
      var n=el.name;if(!(n in st.fields))return;var v=st.fields[n];
      if(el.type==='radio')el.checked=(el.value===v);
      else if(el.type==='checkbox')el.checked=!!v;
      else el.value=v;
    });
    qsa('button.dir').forEach(function(b){paintDir(b,b.previousElementSibling)});
  }
  function save(){
    try{localStorage.setItem(KEY,JSON.stringify(collect()));if(statusEl)statusEl.textContent='Guardado en este navegador · '+new Date().toLocaleTimeString('es',{hour:'2-digit',minute:'2-digit'});}
    catch(e){if(statusEl)statusEl.textContent='No se pudo guardar en el navegador: use «Guardar archivo»';}
  }
  function load(){try{var s=localStorage.getItem(KEY);if(s)apply(JSON.parse(s));}catch(e){}}
  function recalc(){if(typeof window.recalc==='function')window.recalc();}
  window.__recalc=recalc;
  document.addEventListener('input',function(e){if(e.target.closest('.sheet')){save();recalc();}});
  document.addEventListener('change',function(e){if(e.target.closest('.sheet')){save();recalc();}});
  load();recalc();

  /* ---- barra de herramientas ---- */
  var p=qs('[data-act="print"]');if(p)p.addEventListener('click',function(){window.print();});
  var x=qs('[data-act="export"]');
  if(x)x.addEventListener('click',function(){
    var blob=new Blob([JSON.stringify(collect(),null,2)],{type:'application/json'});
    var a=document.createElement('a');a.href=URL.createObjectURL(blob);
    var sol=(qs('[name="m_solucion"]')||{}).value||'';
    a.download='toolkit-'+PAGE+(sol?'-'+sol.replace(/[^\w\-]+/g,'_'):'')+'.json';
    document.body.appendChild(a);a.click();a.remove();setTimeout(function(){URL.revokeObjectURL(a.href)},500);
  });
  var imp=qs('[data-act="import"]'),file=qs('#importFile');
  if(imp&&file){
    imp.addEventListener('click',function(){file.click();});
    file.addEventListener('change',function(){
      var f=file.files[0];if(!f)return;var r=new FileReader();
      r.onload=function(){try{apply(JSON.parse(r.result));save();recalc();}catch(e){alert('El archivo no es un toolkit válido.');}};
      r.readAsText(f);file.value='';
    });
  }
  var c=qs('[data-act="clear"]');
  if(c)c.addEventListener('click',function(){
    if(confirm('¿Borrar todo lo escrito en esta hoja? Esta acción no se puede deshacer.')){
      try{localStorage.removeItem(KEY);}catch(e){}
      location.reload();
    }
  });
})();
