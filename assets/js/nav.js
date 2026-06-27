/* ═══════════════════════════════════════════════════
   ESNET — Shared Navigation
   assets/js/nav.js
   ═══════════════════════════════════════════════════ */
(function(){
  'use strict';

  /* ── Path detection ── */
  var path = window.location.pathname;
  var inSub = path.indexOf('/about/') > -1 || path.indexOf('/service/') > -1;
  var base  = inSub ? '..' : '.';

  /* ── Arrow SVG ── */
  var arrowSvg = '<svg viewBox="0 0 14 14" fill="none" style="width:14px;height:14px;opacity:.6;vertical-align:middle;margin-left:3px"><path d="M3 5l4 4 4-4" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>';

  /* ── Remote icon ── */
  var remoteIcon = '<svg viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" style="width:16px;height:16px"><rect x="2" y="3" width="16" height="11" rx="2"/><path d="M6 17h8M10 14v3"/><path d="M7 8l2 2 4-3"/></svg>';

  /* ── CSS injection ── */
  var css = `
/* NAV BASE */
.nav{position:fixed;top:0;left:0;right:0;z-index:1000;padding:0 5%;
  background:rgba(11,26,46,0);backdrop-filter:blur(0px);
  border-bottom:1px solid transparent;
  transition:background .35s,backdrop-filter .35s,border-color .35s,box-shadow .35s}
.nav.scrolled{background:rgba(255,255,255,.97);backdrop-filter:blur(14px);
  border-bottom:1px solid rgba(0,0,0,.06);box-shadow:0 1px 12px rgba(0,0,0,.06)}
.nav-inner{max-width:1280px;margin:0 auto;display:flex;align-items:center;
  justify-content:space-between;height:72px;gap:24px}
.nav-logo{height:30px;filter:brightness(0) invert(1);transition:filter .3s;flex-shrink:0}
.nav.scrolled .nav-logo{filter:none}

/* NAV LINKS */
.nav-links{display:flex;gap:28px;font-size:14px;font-weight:500;
  color:rgba(255,255,255,.75);transition:color .3s;align-items:center}
.nav.scrolled .nav-links{color:#5a6070}
.nav-links a:hover{color:#fff}
.nav.scrolled .nav-links a:hover{color:#2668A3}
.nav-item{position:static}
.nav-item::after{content:'';position:fixed;top:72px;left:0;right:0;height:20px;pointer-events:none}
.nav-item:hover::after{pointer-events:auto}

/* REMOTE BUTTON */
.nav-remote{display:flex;align-items:center;gap:7px;font-size:13px;font-weight:600;
  color:rgba(255,255,255,.75);padding:8px 14px;border-radius:8px;
  border:1px solid rgba(255,255,255,.2);transition:all .2s;white-space:nowrap;
  text-decoration:none;flex-shrink:0}
.nav-remote:hover{color:#fff;border-color:rgba(255,255,255,.5);background:rgba(255,255,255,.08)}
.nav.scrolled .nav-remote{color:#5a6070;border-color:#e2e5ea}
.nav.scrolled .nav-remote:hover{color:#2668A3;border-color:#2668A3;background:rgba(38,104,163,.06)}

/* MEGA DROP */
.mega-drop{position:fixed;top:72px;left:0;right:0;padding:36px 5% 40px;
  opacity:0;visibility:hidden;pointer-events:none;transform:translateY(-10px);
  transition:opacity .3s cubic-bezier(.16,1,.3,1),transform .3s,visibility .3s;
  z-index:999;background:rgba(255,255,255,.97);backdrop-filter:blur(28px);
  border-top:1px solid rgba(0,0,0,.06);border-bottom:1px solid rgba(0,0,0,.06);
  box-shadow:0 16px 48px rgba(0,0,0,.1)}
.mega-drop.mega-open{opacity:1;visibility:visible;pointer-events:auto;transform:translateY(0)}
.mega-inner{max-width:1280px;margin:0 auto;display:grid;grid-template-columns:160px 1fr;gap:48px;align-items:start}
.mega-cat{font-family:'Space Grotesk',sans-serif;font-size:clamp(24px,2.5vw,36px);
  font-weight:800;color:#1d1d2c;letter-spacing:-.02em;line-height:1.1}

/* MEGA ITEMS — single column default */
.mega-items{display:flex;flex-direction:column;gap:2px}
/* 2-column grid for Business (5 items) */
.mega-items-2col{display:grid;grid-template-columns:1fr 1fr;gap:2px 8px}
.mega-items a,.mega-items-2col a{
  display:flex;align-items:center;gap:12px;padding:11px 16px;border-radius:10px;
  font-size:14px;font-weight:500;color:#4a5568;
  opacity:0;transform:translateY(8px);
  transition:background .18s,color .18s,transform .22s;text-decoration:none}
.mega-drop.mega-open .mega-items a:nth-child(1),
.mega-drop.mega-open .mega-items-2col a:nth-child(1){animation:mIn .32s .04s cubic-bezier(.16,1,.3,1) forwards}
.mega-drop.mega-open .mega-items a:nth-child(2),
.mega-drop.mega-open .mega-items-2col a:nth-child(2){animation:mIn .32s .09s cubic-bezier(.16,1,.3,1) forwards}
.mega-drop.mega-open .mega-items a:nth-child(3),
.mega-drop.mega-open .mega-items-2col a:nth-child(3){animation:mIn .32s .14s cubic-bezier(.16,1,.3,1) forwards}
.mega-drop.mega-open .mega-items a:nth-child(4),
.mega-drop.mega-open .mega-items-2col a:nth-child(4){animation:mIn .32s .19s cubic-bezier(.16,1,.3,1) forwards}
.mega-drop.mega-open .mega-items a:nth-child(5),
.mega-drop.mega-open .mega-items-2col a:nth-child(5){animation:mIn .32s .24s cubic-bezier(.16,1,.3,1) forwards}
@keyframes mIn{to{opacity:1;transform:translateY(0)}}
.mega-items a:hover,.mega-items-2col a:hover{background:rgba(38,104,163,.07);color:#2668A3;transform:translateX(4px)}
.mega-items a .num,.mega-items-2col a .num{
  font-family:'Space Grotesk',sans-serif;font-size:11px;font-weight:700;
  color:#2668A3;min-width:26px}

/* MEGA DESC */
.mega-desc{opacity:0;transform:translateY(8px)}
.mega-drop.mega-open .mega-desc{animation:mIn .32s .04s cubic-bezier(.16,1,.3,1) forwards}
.mega-desc-title{font-size:18px;font-weight:700;margin-bottom:8px;color:#1d1d2c}
.mega-desc-text{font-size:13px;line-height:1.8;color:#6b7185}
.mega-desc-link{display:inline-flex;margin-top:14px;font-size:13px;font-weight:600;
  padding:9px 18px;border-radius:8px;background:rgba(38,104,163,.08);
  color:#2668A3;text-decoration:none;transition:background .2s}
.mega-desc-link:hover{background:rgba(38,104,163,.15)}

@media(max-width:960px){.nav-links{display:none}.nav-remote{display:none}}
  `;
  var styleEl = document.createElement('style');
  styleEl.setAttribute('id','nav-shared-css');
  styleEl.textContent = css;
  document.head.appendChild(styleEl);

  /* ── HTML generation ── */
  var nav = document.getElementById('mainNav');
  if(!nav) return;
  nav.className = 'nav';

  nav.innerHTML =
    '<div class="nav-inner">' +
      '<a href="' + base + '/index.html"><img src="' + base + '/uploads/pasted-1781487699647-0.png" alt="ESNET" class="nav-logo"></a>' +
      '<div class="nav-links">' +

        /* 회사소개 */
        '<div class="nav-item">' +
          '<a href="' + base + '/about/index.html">회사소개' + arrowSvg + '</a>' +
          '<div class="mega-drop"><div class="mega-inner">' +
            '<div class="mega-cat">Company</div>' +
            '<div class="mega-items">' +
              '<a href="' + base + '/about/index.html#greeting"><span class="num">01</span>인사말</a>' +
              '<a href="' + base + '/about/index.html#history"><span class="num">02</span>주요 연혁</a>' +
              '<a href="' + base + '/about/index.html#location"><span class="num">03</span>오시는 길</a>' +
              '<a href="' + base + '/about/index.html#safety"><span class="num">04</span>안전보건경영</a>' +
            '</div>' +
          '</div></div>' +
        '</div>' +

        /* 사업영역 — 2컬럼 */
        '<div class="nav-item">' +
          '<a href="' + base + '/service/index.html">사업영역' + arrowSvg + '</a>' +
          '<div class="mega-drop"><div class="mega-inner">' +
            '<div class="mega-cat">Business</div>' +
            '<div class="mega-items-2col">' +
              '<a href="' + base + '/service/index.html#ni"><span class="num">NI</span>네트워크 구축</a>' +
              '<a href="' + base + '/service/index.html#si"><span class="num">SI</span>시스템 통합</a>' +
              '<a href="' + base + '/service/index.html#om"><span class="num">O&M</span>유지보수</a>' +
              '<a href="' + base + '/service/index.html#plan"><span class="num">기획</span>기획/제안</a>' +
              '<a href="' + base + '/service/index.html#kt"><span class="num">KT</span>SA 대리점</a>' +
            '</div>' +
          '</div></div>' +
        '</div>' +

        /* 레퍼런스 */
        '<div class="nav-item">' +
          '<a href="' + base + '/reference.html">레퍼런스' + arrowSvg + '</a>' +
          '<div class="mega-drop"><div class="mega-inner">' +
            '<div class="mega-cat">Reference</div>' +
            '<div class="mega-desc">' +
              '<div class="mega-desc-title">구축 레퍼런스</div>' +
              '<div class="mega-desc-text">ESNET이 수행한 네트워크 구축 및 유지보수 사례.<br>충청북도 지자체부터 공공기관·연구기관·민간기업까지.</div>' +
              '<a href="' + base + '/reference.html" class="mega-desc-link">레퍼런스 보기 →</a>' +
            '</div>' +
          '</div></div>' +
        '</div>' +

        /* 문의 */
        '<div class="nav-item">' +
          '<a href="' + base + '/contact.html">문의' + arrowSvg + '</a>' +
          '<div class="mega-drop"><div class="mega-inner">' +
            '<div class="mega-cat">Contact</div>' +
            '<div class="mega-desc">' +
              '<div class="mega-desc-title">무엇이든 물어보세요</div>' +
              '<div class="mega-desc-text">네트워크, 시스템, 컨설팅, 유지보수 관련<br>전문 담당자가 빠르게 답변 드립니다.</div>' +
              '<a href="' + base + '/contact.html" class="mega-desc-link">043-292-1800 →</a>' +
            '</div>' +
          '</div></div>' +
        '</div>' +

      '</div>' +
      '<a href="' + base + '/remote.html" class="nav-remote">' + remoteIcon + '원격지원</a>' +
    '</div>';

  /* ── Scroll behavior ── */
  function onScroll(){nav.classList.toggle('scrolled', window.scrollY > 60);}
  window.addEventListener('scroll', onScroll, {passive:true});
  onScroll();

  /* ── Mega-drop hover ── */
  var navItems = nav.querySelectorAll('.nav-item');
  var hideTimers = new Map();
  navItems.forEach(function(item){
    var drop = item.querySelector('.mega-drop');
    if(!drop) return;
    function show(){
      clearTimeout(hideTimers.get(item));
      navItems.forEach(function(o){
        if(o !== item){ var d = o.querySelector('.mega-drop'); if(d) d.classList.remove('mega-open'); }
      });
      drop.classList.add('mega-open');
    }
    function hide(d){ hideTimers.set(item, setTimeout(function(){ drop.classList.remove('mega-open'); }, d||180)); }
    item.addEventListener('mouseenter', show);
    item.addEventListener('mouseleave', function(){ hide(180); });
    drop.addEventListener('mouseenter', function(){ clearTimeout(hideTimers.get(item)); });
    drop.addEventListener('mouseleave', function(){ hide(80); });
  });

})();
