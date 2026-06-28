/* ─── NAV SCROLL ─── */
(function(){
  var nav=document.getElementById('mainNav');
  function onScroll(){if(nav)nav.classList.toggle('scrolled',window.scrollY>60);}
  window.addEventListener('scroll',onScroll,{passive:true});
  onScroll();
})();

/* ─── NAV MEGA DROP ─── */
(function(){
  var navItems=document.querySelectorAll('.nav-item');
  var hideTimers=new Map();
  navItems.forEach(function(item){
    var drop=item.querySelector('.mega-drop');
    if(!drop)return;
    var show=function(){clearTimeout(hideTimers.get(item));navItems.forEach(function(o){if(o!==item&&o.querySelector('.mega-drop'))o.querySelector('.mega-drop').classList.remove('mega-open');});drop.classList.add('mega-open');};
    var hide=function(d){hideTimers.set(item,setTimeout(function(){drop.classList.remove('mega-open');},(d||180)));};
    item.addEventListener('mouseenter',show);
    item.addEventListener('mouseleave',function(){hide(180);});
    drop.addEventListener('mouseenter',function(){clearTimeout(hideTimers.get(item));});
    drop.addEventListener('mouseleave',function(){hide(80);});
  });
})();

/* ─── HERO PARTICLE NETWORK ─── */
(function(){
  var canvas=document.getElementById('heroCanvas');
  if(!canvas)return;
  var ctx=canvas.getContext('2d');
  var W,H,nodes=[];
  function resize(){W=canvas.width=canvas.offsetWidth;H=canvas.height=canvas.offsetHeight;initNodes();}
  function initNodes(){
    nodes=[];
    var n=Math.floor((W*H)/18000);
    for(var i=0;i<n;i++)nodes.push({x:Math.random()*W,y:Math.random()*H,vx:(Math.random()-.5)*.4,vy:(Math.random()-.5)*.4,r:Math.random()*2+1});
  }
  function draw(){
    ctx.clearRect(0,0,W,H);
    nodes.forEach(function(n){n.x+=n.vx;n.y+=n.vy;if(n.x<0||n.x>W)n.vx*=-1;if(n.y<0||n.y>H)n.vy*=-1;});
    for(var i=0;i<nodes.length;i++){
      for(var j=i+1;j<nodes.length;j++){
        var dx=nodes[i].x-nodes[j].x,dy=nodes[i].y-nodes[j].y;
        var d=Math.sqrt(dx*dx+dy*dy);
        if(d<140){
          var alpha=(1-d/140).toFixed(2);
          ctx.strokeStyle='rgba(61,143,212,'+alpha+')';
          ctx.lineWidth=.6;ctx.beginPath();ctx.moveTo(nodes[i].x,nodes[i].y);ctx.lineTo(nodes[j].x,nodes[j].y);ctx.stroke();
        }
      }
    }
    nodes.forEach(function(n){ctx.fillStyle='rgba(61,143,212,.9)';ctx.beginPath();ctx.arc(n.x,n.y,n.r,0,Math.PI*2);ctx.fill();});
    requestAnimationFrame(draw);
  }
  window.addEventListener('resize',resize);
  resize();draw();
})();

/* ─── COUNTER ANIMATION ─── */
function animateCounter(el,target,suffix,duration){
  var start=performance.now();
  function step(now){
    var p=Math.min((now-start)/duration,1);
    var ease=1-Math.pow(1-p,3);
    var val=Math.round(ease*target);
    el.textContent=val+suffix;
    if(p<1)requestAnimationFrame(step);
  }
  requestAnimationFrame(step);
}

/* ─── STABLE REVEAL ─── */
function initReveal(){
  var revEls=document.querySelectorAll('[data-reveal]');
  var revOb=new IntersectionObserver(function(entries){
    entries.forEach(function(e,i){if(e.isIntersecting){setTimeout(function(){e.target.classList.add('revealed');},i*80);revOb.unobserve(e.target);}});
  },{threshold:.1});
  revEls.forEach(function(el){revOb.observe(el);});

  /* logo + project per section */
  document.querySelectorAll('.cat-section').forEach(function(sec){
    var logos=sec.querySelectorAll('.cat-logo');
    var projs=sec.querySelectorAll('.cat-project');
    var done=false;
    var ob=new IntersectionObserver(function(entries){
      if(entries[0].isIntersecting&&!done){
        done=true;
        logos.forEach(function(el,i){setTimeout(function(){el.classList.add('logo-in');},i*80);});
        projs.forEach(function(el,i){setTimeout(function(){el.classList.add('proj-in');},200+i*90);});
        ob.disconnect();
      }
    },{threshold:.1,rootMargin:'0px 0px -40px 0px'});
    ob.observe(sec);
  });

  /* fallback - show everything after 4s */
  setTimeout(function(){
    document.querySelectorAll('.cat-logo').forEach(function(el){el.classList.add('logo-in');});
    document.querySelectorAll('.cat-project').forEach(function(el){el.classList.add('proj-in');});
    revEls.forEach(function(el){el.classList.add('revealed');});
  },4000);
}

/* ─── LOGO HOVER → PROJECT HIGHLIGHT ─── */
function initLogoHighlight(){
  document.querySelectorAll('.cat-logo[data-logo]').forEach(function(logo){
    var org=logo.dataset.logo;
    logo.addEventListener('mouseenter',function(){
      document.querySelectorAll('.cat-project[data-org="'+org+'"]').forEach(function(p){p.classList.add('proj-highlighted');});
    });
    logo.addEventListener('mouseleave',function(){
      document.querySelectorAll('.cat-project').forEach(function(p){p.classList.remove('proj-highlighted');});
    });
  });
}

/* ─── DOT NAV ─── */
function initDotNav(){
  var dots=document.querySelectorAll('.dot');
  var secs=['sec1','sec2','sec3','sec4','sec5'].map(function(id){return document.getElementById(id);}).filter(Boolean);
  function update(){
    var mid=window.scrollY+window.innerHeight*.5;
    var cur=0;
    secs.forEach(function(s,i){if(s.offsetTop<=mid)cur=i;});
    dots.forEach(function(d,i){d.classList.toggle('active',i===cur);});
  }
  window.addEventListener('scroll',update,{passive:true});
  dots.forEach(function(d,i){
    d.addEventListener('click',function(e){
      e.preventDefault();
      var sec=secs[i];
      if(sec)window.scrollTo({top:sec.offsetTop-80,behavior:'smooth'});
    });
  });
  update();
}

/* ─── HERO STATS (stagger + counter) ─── */
function initHeroStats(){
  setTimeout(function(){
    document.querySelectorAll('.hero-stats .stat').forEach(function(el,i){setTimeout(function(){el.classList.add('stat-in');},400+i*150);});
  },200);
  var statCfg=[{v:70,s:'+'},{v:5,s:''},{v:8,s:'년+'}];
  var statEls=document.querySelectorAll('.stat .v');
  var heroStats=document.querySelector('.hero-stats');
  if(heroStats){
    var heroOb=new IntersectionObserver(function(entries){
      if(entries[0].isIntersecting){
        statEls.forEach(function(el,i){if(statCfg[i])setTimeout(function(){animateCounter(el,statCfg[i].v,statCfg[i].s,1200);},500);});
        heroOb.disconnect();
      }
    },{threshold:.5});
    heroOb.observe(heroStats);
  }
}

function runInit(){initReveal();initHeroStats();initLogoHighlight();initDotNav();}
runInit();
