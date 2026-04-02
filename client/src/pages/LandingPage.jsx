import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import frontImg from '../img/FRONT-MSAJCE.webp'
import backImg  from '../img/BACK-MSAJCE.webp'
import sathakLogoFull from '../img/sathak-logo-full1.png'
import sathakLogoIcon from '../img/sathak-logo-icon1.png'

export default function LandingPage() {
  const navigate = useNavigate()

  // Always navigate to top of /home with fresh intro animation
  const goToMain = (e) => {
    e && e.preventDefault()
    // Clear "already shown" flag so animation always plays when coming from landing
    sessionStorage.removeItem('hbl-intro-shown')
    sessionStorage.setItem('hbl-from-landing', '1')
    navigate('/home')
  }

  useEffect(() => {
    // ── Inject CSS (all classes prefixed with hbl- to avoid collisions) ──
    const style = document.createElement('style')
    style.id = 'hbl-styles'
    style.textContent = `
@import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@300;400;700;900&family=Poppins:wght@300;400;600;800&display=swap');

#hbl-root *,#hbl-root *::before,#hbl-root *::after{margin:0;padding:0;box-sizing:border-box}
#hbl-root{font-family:'Poppins',sans-serif;background:#000;color:#fff;overflow-x:hidden;min-height:100vh}
body.hbl-active{cursor:none;overflow-x:hidden}

/* CURSOR */
#hbl-cur{width:24px;height:24px;border:2px solid #ff007f;border-radius:50%;position:fixed;top:0;left:0;pointer-events:none;z-index:9999;transform:translate(-50%,-50%);transition:transform .12s,border-color .2s,width .2s,height .2s;mix-blend-mode:difference}
#hbl-cur-dot{width:5px;height:5px;background:#ff007f;border-radius:50%;position:fixed;top:0;left:0;pointer-events:none;z-index:9999;transform:translate(-50%,-50%)}
#hbl-cur.big{width:50px;height:50px;border-color:#ffd700}

/* PROGRESS */
#hbl-prog{position:fixed;top:0;left:0;height:3px;background:linear-gradient(90deg,#ff6b35,#ff007f,#bf00ff,#00f5ff);z-index:9998;width:0;pointer-events:none;transition:width 0.1s}

/* NAV */
#hbl-nav{position:fixed;top:0;left:0;width:100%;z-index:1000;padding:22px 60px;display:flex;align-items:center;justify-content:space-between;transition:background .4s,padding .4s,border-color .4s;will-change:background}
#hbl-nav.solid{background:rgba(3,2,20,.94);backdrop-filter:blur(20px);-webkit-backdrop-filter:blur(20px);padding:14px 60px;border-bottom:1px solid rgba(255,255,255,.06)}
.hbl-nav-logo-wrap{display:flex;align-items:center;gap:0;cursor:pointer;border:none;background:none;padding:0}
.hbl-nav-logo{font-family:'Montserrat',sans-serif;font-weight:900;font-size:1.3rem;letter-spacing:5px;background:linear-gradient(135deg,#ff8c35,#ff007f);-webkit-background-clip:text;-webkit-text-fill-color:transparent;cursor:pointer}
.hbl-nav-links{display:flex;gap:30px;list-style:none}
.hbl-nav-links a{color:rgba(255,255,255,.8);text-decoration:none;font-size:.78rem;letter-spacing:2px;text-transform:uppercase;transition:color .3s}
.hbl-nav-links a:hover{color:#ffd700}
.hbl-nav-cta{background:linear-gradient(135deg,#ff6b35,#ff007f)!important;color:#fff!important;padding:9px 22px;border-radius:30px;font-weight:700!important;box-shadow:0 0 20px rgba(255,0,127,.4)}
@media(max-width:768px){.hbl-nav-links{display:none}#hbl-nav,#hbl-nav.solid{padding:16px 24px}}

/* WORLD */
#hbl-world{position:relative;width:100%}
#hbl-world-canvas{position:fixed;top:0;left:0;width:100%;height:100%;pointer-events:none;z-index:0;will-change:transform}
#hbl-hero-particles{will-change:transform}
#hbl-fw-canvas{will-change:transform}

/* SCENES */
.hbl-scene{position:relative;min-height:100vh;display:flex;align-items:center;justify-content:center;z-index:10}
#hbl-s1{overflow:hidden}

/* HERO */
.hbl-hero-content{position:relative;z-index:5;text-align:center;padding:20px 24px;display:flex;flex-direction:column;align-items:center;justify-content:center;min-height:100vh;width:100%}
.hbl-hero-eye{font-size:.68rem;letter-spacing:8px;text-transform:uppercase;color:rgba(255,220,150,.9);margin-bottom:20px;opacity:0;animation:hblFadeUp 1s .3s both}
.hbl-hero-title{margin-bottom:5px; font-family:'Montserrat',sans-serif;font-weight:900;font-size:clamp(3.5rem,18vw,16rem);line-height:.87;letter-spacing:-3px;background:linear-gradient(135deg,#fff9e0 0%,#ffd700 28%,#ff8c69 60%,#ff3d7f 100%);-webkit-background-clip:text;-webkit-text-fill-color:transparent;filter:drop-shadow(0 0 60px rgba(255,160,60,.6)) drop-shadow(0 4px 20px rgba(0,0,0,.8));opacity:0;animation:hblFadeUp 1.2s .6s both;position:relative}
.hbl-hero-title::before{content:'SATHAK';position:absolute;top:0;left:0;right:0;background:inherit;-webkit-background-clip:text;-webkit-text-fill-color:transparent;animation:hblGlitchA 6s 3s infinite;clip-path:inset(0 0 96% 0)}
@keyframes hblGlitchA{0%,92%,100%{transform:none;opacity:0}93%{transform:translate(-3px,0);opacity:.7;clip-path:inset(10% 0 80% 0)}95%{transform:translate(3px,0);clip-path:inset(40% 0 50% 0)}97%{transform:translate(-2px,0);clip-path:inset(70% 0 20% 0)}}
.hbl-hero-sub{font-size:clamp(.7rem,1.8vw,.95rem);font-weight:300;letter-spacing:3px;color:rgba(255,240,210,.85);margin-top:14px;text-transform:uppercase;text-shadow:0 2px 20px rgba(0,0,0,.8);opacity:0;animation:hblFadeUp 1s .9s both}
.hbl-hero-badges{display:flex;gap:16px;margin-top:36px;flex-wrap:wrap;justify-content:center;opacity:0;animation:hblFadeUp 1s 1.1s both}
.hbl-badge{padding:12px 28px;border-radius:50px;font-size:.75rem;letter-spacing:3px;position:relative;overflow:hidden}
.hbl-badge-main{background:linear-gradient(135deg,rgba(255,140,50,.15),rgba(255,0,127,.15));border:1px solid rgba(255,200,100,.4);color:rgba(255,230,180,.95)}
.hbl-badge-main::before{content:'';position:absolute;top:0;left:-100%;width:100%;height:100%;background:linear-gradient(90deg,transparent,rgba(255,200,100,.2),transparent);animation:hblShimmer 3s 2s infinite}
.hbl-badge-alt{background:linear-gradient(135deg,#ff007f,#bf00ff);color:#fff;font-weight:700;box-shadow:0 0 30px rgba(191,0,255,.5),0 0 60px rgba(255,0,127,.2);text-decoration:none;transition:box-shadow .3s;display:flex;align-items:center;gap:8px;cursor:pointer;border:none;font-family:'Poppins',sans-serif;font-size:.75rem;letter-spacing:3px}
.hbl-badge-alt:hover{box-shadow:0 0 50px rgba(191,0,255,.8),0 0 100px rgba(255,0,127,.4);transform:scale(1.04)}
.hbl-scroll-hint{position:absolute;bottom:36px;left:50%;transform:translateX(-50%);display:flex;flex-direction:column;align-items:center;gap:8px;opacity:0;animation:hblFadeUp 1s 1.5s both;z-index:5}
.hbl-scroll-hint span{font-size:.6rem;letter-spacing:4px;color:rgba(255,200,150,.7)}
.hbl-scroll-line{width:1px;height:56px;background:linear-gradient(to bottom,rgba(255,200,150,.7),transparent);animation:hblScrollLine 2s ease-in-out infinite}

/* CONTENT BLOCKS */
#hbl-s2{background:transparent}
.hbl-blk{text-align:center;padding:70px 40px;max-width:940px;margin:0 auto;position:relative;z-index:5}
.hbl-lbl{font-size:.68rem;letter-spacing:6px;text-transform:uppercase;color:rgba(255,180,100,.75);margin-bottom:14px;opacity:0;transform:translateY(18px);transition:all .8s}
.hbl-lbl.in{opacity:1;transform:none}
.hbl-h2{font-family:'Montserrat',sans-serif;font-weight:900;font-size:clamp(2.2rem,6.5vw,5.5rem);line-height:1.05;opacity:0;transform:translateY(34px);transition:all .9s .15s}
.hbl-h2.in{opacity:1;transform:none}
.hbl-bod{font-size:clamp(.9rem,2.2vw,1.2rem);font-weight:300;color:rgba(255,230,200,.75);max-width:590px;margin:18px auto 0; marginLeft:620px; line-height:1.75;opacity:0;transform:translateY(24px);transition:all .9s .3s}
.hbl-bod.in{opacity:1;transform:none}
.hbl-gs{background:linear-gradient(135deg,#ff8c35,#ff3d7f,#c026d3);-webkit-background-clip:text;-webkit-text-fill-color:transparent}
.hbl-gn{background:linear-gradient(135deg,#00f5ff,#bf00ff,#ff007f);-webkit-background-clip:text;-webkit-text-fill-color:transparent}

/* CARDS */
.hbl-cards{display:flex;gap:16px;justify-content:center;flex-wrap:wrap;margin-top:44px}
.hbl-card{background:rgba(255,255,255,.04);border:1px solid rgba(255,180,100,.18);border-radius:16px;padding:24px 28px;min-width:148px;backdrop-filter:blur(16px);text-align:center;opacity:0;transform:translateY(28px) scale(.95);transition:all .8s;cursor:default;position:relative;overflow:hidden}
.hbl-card::before{content:'';position:absolute;inset:0;background:linear-gradient(135deg,rgba(255,140,50,.1),rgba(200,40,150,.1));opacity:0;transition:.3s}
.hbl-card:hover::before{opacity:1}
.hbl-card:hover{transform:translateY(-6px) scale(1.04)!important;border-color:rgba(255,200,100,.5);box-shadow:0 12px 40px rgba(255,100,50,.18)}
.hbl-card.in{opacity:1;transform:translateY(0) scale(1)}
.hbl-card-ico{font-size:2rem;margin-bottom:8px}
.hbl-card-lbl{font-size:.72rem;letter-spacing:2px;text-transform:uppercase;color:rgba(255,220,180,.8)}

/* S3 DANCE ARENA */
#hbl-s3{background:transparent}
.hbl-lasers{position:absolute;inset:0;pointer-events:none;overflow:hidden;z-index:2}
.hbl-lz{position:absolute;top:0;width:2px;height:100%;transform-origin:top;mix-blend-mode:screen;animation:hblLaserSwing ease-in-out infinite}
.hbl-lz:nth-child(1){left:10%;background:linear-gradient(to bottom,#ff007f,transparent 60%);animation-duration:4s}
.hbl-lz:nth-child(2){left:27%;background:linear-gradient(to bottom,#00f5ff,transparent 60%);animation-duration:3.2s;animation-delay:.7s}
.hbl-lz:nth-child(3){left:50%;background:linear-gradient(to bottom,#bf00ff,transparent 60%);animation-duration:5s;animation-delay:1.3s}
.hbl-lz:nth-child(4){left:73%;background:linear-gradient(to bottom,#ffd700,transparent 60%);animation-duration:3.7s;animation-delay:.4s}
.hbl-lz:nth-child(5){left:90%;background:linear-gradient(to bottom,#ff6b35,transparent 60%);animation-duration:4.5s;animation-delay:2s}
@keyframes hblLaserSwing{0%,100%{transform:rotate(-22deg)}50%{transform:rotate(22deg)}}
.hbl-led{position:absolute;left:0;right:0;height:4px;border-radius:4px;animation:hblLedPulse .7s ease-in-out infinite alternate;z-index:2}
.hbl-led-a{top:28%;background:linear-gradient(90deg,#ff007f,#bf00ff,#00f5ff,#ff007f)}
.hbl-led-b{top:52%;background:linear-gradient(90deg,#00f5ff,#ffd700,#ff007f,#00f5ff);animation-delay:.35s}
@keyframes hblLedPulse{0%{opacity:.3;box-shadow:none}100%{opacity:1;box-shadow:0 0 28px 7px rgba(191,0,255,.7)}}

/* S4 PARTY */
#hbl-s4{position:relative}
.hbl-ring{position:absolute;border-radius:50%;border:2px solid;pointer-events:none;animation:hblRingPulse 3s ease-in-out infinite}
.hbl-ring-a{width:340px;height:340px;top:8%;right:2%;border-color:rgba(255,0,127,.22)}
.hbl-ring-b{width:220px;height:220px;top:14%;right:7%;border-color:rgba(191,0,255,.32);animation-delay:.6s}
.hbl-ring-c{width:540px;height:540px;bottom:-130px;left:-130px;border-color:rgba(0,245,255,.15);animation-delay:1.2s}
@keyframes hblRingPulse{0%,100%{transform:scale(1);opacity:.45}50%{transform:scale(1.06);opacity:1}}
.hbl-bars{display:flex;gap:6px;align-items:flex-end;height:64px;margin:28px auto;width:fit-content}
.hbl-bar{width:9px;border-radius:5px 5px 0 0;background:linear-gradient(to top,#ff007f,#bf00ff);animation:hblBarDance .7s ease-in-out infinite alternate}
.hbl-bar:nth-child(1){height:30%;animation-delay:0s}.hbl-bar:nth-child(2){height:70%;animation-delay:.08s}.hbl-bar:nth-child(3){height:45%;animation-delay:.16s}.hbl-bar:nth-child(4){height:90%;animation-delay:.24s}.hbl-bar:nth-child(5){height:55%;animation-delay:.32s}.hbl-bar:nth-child(6){height:80%;animation-delay:.40s}.hbl-bar:nth-child(7){height:38%;animation-delay:.48s}.hbl-bar:nth-child(8){height:100%;animation-delay:.56s}.hbl-bar:nth-child(9){height:62%;animation-delay:.64s}.hbl-bar:nth-child(10){height:75%;animation-delay:.72s}
@keyframes hblBarDance{0%{transform:scaleY(.25)}100%{transform:scaleY(1)}}
.hbl-evgrid{display:grid;grid-template-columns:repeat(auto-fit,minmax(180px,1fr));gap:14px;margin-top:38px}
.hbl-ev{background:rgba(255,255,255,.03);border:1px solid rgba(191,0,255,.25);border-radius:14px;padding:18px;text-align:center;opacity:0;transform:scale(.9);transition:all .7s;position:relative;overflow:hidden}
.hbl-ev.in{opacity:1;transform:scale(1)}
.hbl-ev::after{content:'';position:absolute;inset:0;background:linear-gradient(135deg,rgba(191,0,255,.1),rgba(255,0,127,.1));opacity:0;transition:.3s}
.hbl-ev:hover::after{opacity:1}
.hbl-ev:hover{border-color:rgba(191,0,255,.65);transform:scale(1.04)!important}
.hbl-ev-cat{font-size:.72rem;letter-spacing:2px;text-transform:uppercase;color:#ff007f;margin-bottom:5px}
.hbl-ev-name{font-size:1rem;font-weight:700}

/* S5 FINALE */
#hbl-s5{min-height:100vh;flex-direction:column;padding:80px 0;position:relative;overflow:hidden}
#hbl-fw-canvas{position:absolute;inset:0;width:100%;height:100%;pointer-events:none}
.hbl-finale-title{font-family:'Montserrat',sans-serif;font-weight:900;font-size:clamp(4rem,14vw,12rem);line-height:.88;letter-spacing:-3px;background:linear-gradient(135deg,#fff 0%,#ffd700 28%,#ff007f 58%,#bf00ff 100%);-webkit-background-clip:text;-webkit-text-fill-color:transparent;filter:drop-shadow(0 0 80px rgba(191,0,255,.5));opacity:0;transform:scale(.82);transition:all 1.2s cubic-bezier(.16,1,.3,1)}
.hbl-finale-title.in{opacity:1;transform:scale(1)}
.hbl-finale-yr{display:block;font-size:clamp(1.4rem,5vw,3.8rem);background:linear-gradient(135deg,#bf00ff,#ff007f,#00f5ff);-webkit-background-clip:text;-webkit-text-fill-color:transparent}
.hbl-finale-tag{font-size:clamp(.85rem,2vw,1.2rem);font-weight:300;letter-spacing:4px;color:rgba(255,255,255,.65);margin-top:18px;opacity:0;transform:translateY(18px);transition:all 1s .45s}
.hbl-finale-tag.in{opacity:1;transform:none}
.hbl-cta-btn{display:inline-block;margin-top:38px;padding:17px 50px;background:linear-gradient(135deg,#ff007f,#bf00ff);border-radius:50px;font-family:'Montserrat',sans-serif;font-weight:700;font-size:.88rem;letter-spacing:3px;text-transform:uppercase;color:#fff;text-decoration:none;position:relative;overflow:hidden;box-shadow:0 0 40px rgba(191,0,255,.5);opacity:0;transform:translateY(18px);transition:opacity 1s .75s,transform 1s .75s,box-shadow .3s;border:none;cursor:pointer}
.hbl-cta-btn.in{opacity:1;transform:none}
.hbl-cta-btn::before{content:'';position:absolute;top:0;left:-100%;width:100%;height:100%;background:linear-gradient(90deg,transparent,rgba(255,255,255,.2),transparent);transition:.5s}
.hbl-cta-btn:hover::before{left:100%}
.hbl-cta-btn:hover{box-shadow:0 0 70px rgba(191,0,255,.85),0 0 120px rgba(255,0,127,.4);transform:scale(1.04)}
.hbl-cd-row{display:flex;gap:28px;justify-content:center;margin-top:48px;flex-wrap:wrap;opacity:0;transition:opacity 1s 1s}
.hbl-cd-row.in{opacity:1}
.hbl-cd-unit{text-align:center}
.hbl-cd-n{font-family:'Montserrat',sans-serif;font-weight:900;font-size:clamp(2rem,6vw,3.5rem);background:linear-gradient(135deg,#fff,rgba(191,0,255,.85));-webkit-background-clip:text;-webkit-text-fill-color:transparent;line-height:1}
.hbl-cd-l{font-size:.58rem;letter-spacing:3px;color:rgba(255,255,255,.45);margin-top:3px}

/* FOOTER */
#hbl-footer{position:relative;z-index:10;background:#000;padding:38px 60px;display:flex;align-items:center;justify-content:space-between;border-top:1px solid rgba(255,255,255,.06);flex-wrap:wrap;gap:18px}
.hbl-f-logo{font-family:'Montserrat',sans-serif;font-weight:900;font-size:1.1rem;letter-spacing:4px;background:linear-gradient(135deg,#ff8c35,#ff007f);-webkit-background-clip:text;-webkit-text-fill-color:transparent}
.hbl-f-copy{font-size:.68rem;color:rgba(255,255,255,.35);letter-spacing:1px}
.hbl-f-soc{display:flex;gap:14px}
.hbl-soc-btn{width:36px;height:36px;border:1px solid rgba(255,255,255,.14);border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:.82rem;color:rgba(255,255,255,.45);text-decoration:none;transition:.3s}
.hbl-soc-btn:hover{border-color:#ff007f;color:#ff007f;box-shadow:0 0 16px rgba(255,0,127,.4)}
@media(max-width:768px){#hbl-footer{padding:26px 24px;flex-direction:column;text-align:center}.hbl-evgrid{grid-template-columns:1fr 1fr}}

/* KEYFRAMES */
@keyframes hblFadeUp{from{opacity:0;transform:translateY(36px)}to{opacity:1;transform:none}}
@keyframes hblShimmer{to{left:100%}}

/* REGISTER CTA BUTTON */
.hbl-reg-cta{display:inline-flex;align-items:center;gap:14px;padding:18px 44px;background:linear-gradient(135deg,#ff007f,#bf00ff,#ff6b35);border-radius:60px;font-family:'Montserrat',sans-serif;font-weight:800;font-size:1rem;letter-spacing:3px;text-transform:uppercase;color:#fff;border:none;cursor:pointer;position:relative;overflow:hidden;box-shadow:0 0 50px rgba(255,0,127,.55),0 0 100px rgba(191,0,255,.25);transition:box-shadow .35s,transform .25s;margin-top:8px}
.hbl-reg-cta::before{content:'';position:absolute;top:0;left:-100%;width:100%;height:100%;background:linear-gradient(90deg,transparent,rgba(255,255,255,.25),transparent);transition:.5s}
.hbl-reg-cta:hover::before{left:100%}
.hbl-reg-cta:hover{box-shadow:0 0 70px rgba(255,0,127,.85),0 0 140px rgba(191,0,255,.45);transform:scale(1.06) translateY(-2px)}
.hbl-reg-icon{font-size:1.25rem;animation:hblPulse 1.8s ease-in-out infinite}
@keyframes hblPulse{0%,100%{transform:scale(1)}50%{transform:scale(1.18)}}
.hbl-reg-arrow{font-size:1.2rem;transition:transform .25s}
.hbl-reg-cta:hover .hbl-reg-arrow{transform:translateX(6px)}
.hbl-nav-cta-btn{padding:8px 20px;font-size:.72rem;letter-spacing:2px;margin-top:0;box-shadow:0 0 20px rgba(255,0,127,.4)}
@keyframes hblScrollLine{0%{transform:scaleY(0);transform-origin:top}50%{transform:scaleY(1);transform-origin:top}51%{transform:scaleY(1);transform-origin:bottom}100%{transform:scaleY(0);transform-origin:bottom}}

/* ══ MOBILE RESPONSIVE ══════════════════════════════════════ */
@media(max-width:768px){
  /* Nav */
  #hbl-nav,#hbl-nav.solid{padding:14px 16px}
  .hbl-nav-links{display:none}
  .hbl-nav-logo{font-size:1rem;letter-spacing:3px}
  .hbl-reg-icon{font-size:1rem;animation:hblPulse 1.8s ease-in-out infinite}
  .hbl-reg-icon span{font-size : .5rem;}
  /* Hero scene */
  .hbl-scene{min-height:100svh;padding:0}
  #hbl-s1{min-height:100svh}
  .hbl-hero-content{padding:80px 20px 40px;width:100%}
  .hbl-hero-eye{font-size:.55rem;letter-spacing:4px;margin-bottom:14px}
  .hbl-hero-title{font-size:clamp(3.5rem,18vw,8rem);letter-spacing:-1px}
  .hbl-hero-sub{font-size:.65rem;letter-spacing:2px;margin-top:16px}
  .hbl-hero-badges{flex-direction:column;align-items:center;gap:12px;margin-top:28px}
  .hbl-badge{padding:10px 22px;font-size:.68rem;letter-spacing:2px;width:auto;text-align:center}
  .hbl-badge-alt{justify-content:center}
  .hbl-scroll-hint{bottom:20px}

  /* Content blocks */
  .hbl-blk{padding:50px 20px;max-width:100%}
  .hbl-h2{font-size:clamp(1.8rem,8vw,3.5rem)}
  .hbl-bod{font-size:.88rem}

  /* Feature cards */
  .hbl-cards{gap:12px}
  .hbl-card{min-width:120px;padding:18px 16px}
  .hbl-card-ico{font-size:1.6rem}
  .hbl-card-lbl{font-size:.65rem}

  /* Event grid in party section */
  .hbl-evgrid{grid-template-columns:1fr 1fr;gap:10px}
  .hbl-ev{padding:14px}
  .hbl-ev-name{font-size:.88rem}

  /* Finale */
  .hbl-finale-title{font-size:clamp(3rem,16vw,7rem);letter-spacing:-2px}
  .hbl-finale-yr{font-size:clamp(1.1rem,5vw,2.2rem)}
  .hbl-finale-tag{font-size:.75rem;letter-spacing:2px}
  .hbl-cta-btn{padding:14px 32px;font-size:.78rem;letter-spacing:2px;margin-top:28px}
  .hbl-cd-row{gap:18px;margin-top:32px}
  .hbl-cd-n{font-size:clamp(1.6rem,7vw,2.5rem)}
  .hbl-cd-l{font-size:.5rem;letter-spacing:2px}

  /* Rings in party section — too large on mobile */
  .hbl-ring-a{width:200px;height:200px}
  .hbl-ring-b{width:130px;height:130px;right:5%}
  .hbl-ring-c{width:280px;height:280px;bottom:-60px;left:-60px}

  /* Laser bars */
  .hbl-bars{height:48px}
  .hbl-bar{width:7px}
}


/* PERFORMANCE: hide canvas on low-power devices */
@media(prefers-reduced-motion:reduce){#hbl-world-canvas,#hbl-hero-particles{display:none}#hbl-root{background:radial-gradient(ellipse at 50% 30%,#1a0830,#000)}}

/* MOBILE TOUCH */
@media(hover:none) and (pointer:coarse){body.hbl-active{cursor:auto}#hbl-cur,#hbl-cur-dot{display:none}.hbl-badge-alt,.hbl-cta-btn,.hbl-reg-cta{cursor:pointer}}

/* SAFE AREA */
@supports(padding:max(0px)){#hbl-s1{padding-top:max(0px,env(safe-area-inset-top))}#hbl-footer{padding-bottom:max(24px,env(safe-area-inset-bottom))}}

@media(max-width:420px){
  .hbl-hero-title{font-size:clamp(3rem,16vw,6rem)}
  .hbl-hero-eye{font-size:.5rem;letter-spacing:3px}
  .hbl-blk{padding:40px 16px}
  .hbl-evgrid{grid-template-columns:1fr}
  .hbl-cd-row{gap:12px}
}
`
    document.head.appendChild(style)
    document.body.classList.add('hbl-active')

    // ── Cursor ──
    const cur  = document.getElementById('hbl-cur')
    const cdot = document.getElementById('hbl-cur-dot')
    let cx = 0, cy = 0, dx = 0, dy = 0
    const onMove = e => { cx = e.clientX; cy = e.clientY; cdot.style.left = cx + 'px'; cdot.style.top = cy + 'px' }
    document.addEventListener('mousemove', onMove)
    let curRaf
    const curLoop = () => { dx += (cx - dx) * .14; dy += (cy - dy) * .14; cur.style.left = dx + 'px'; cur.style.top = dy + 'px'; curRaf = requestAnimationFrame(curLoop) }
    curLoop()
    document.querySelectorAll('#hbl-root a, #hbl-root button').forEach(el => {
      el.addEventListener('mouseenter', () => cur.classList.add('big'))
      el.addEventListener('mouseleave', () => cur.classList.remove('big'))
    })

    // ── Nav + progress bar ──
    const nav  = document.getElementById('hbl-nav')
    const prog = document.getElementById('hbl-prog')
    const onScroll = () => {
      nav.classList.toggle('solid', window.scrollY > 60)
      const max = document.body.scrollHeight - window.innerHeight
      prog.style.width = (max > 0 ? window.scrollY / max : 0) * 100 + '%'
    }
    window.addEventListener('scroll', onScroll, { passive: true })

    // ── Scroll reveal ──
    const io = new IntersectionObserver(entries => {
      entries.forEach(x => { if (x.isIntersecting) x.target.classList.add('in') })
    }, { threshold: .12, rootMargin: '0px 0px -40px 0px' })
    document.querySelectorAll('.hbl-anim').forEach(el => io.observe(el))

    // ── Countdown ──
    const tick = () => {
      const d = new Date('2026-04-06T09:00:00') - new Date()
      const pad = n => String(Math.max(0, n)).padStart(2, '0')
      const set = (id, v) => { const el = document.getElementById(id); if (el) el.textContent = v }
      set('hbl-cd-d', pad(Math.floor(d / 864e5)))
      set('hbl-cd-h', pad(Math.floor(d % 864e5 / 36e5)))
      set('hbl-cd-m', pad(Math.floor(d % 36e5 / 6e4)))
      set('hbl-cd-s', pad(Math.floor(d % 6e4 / 1e3)))
    }
    tick()
    const cdInt = setInterval(tick, 1000)

    // ══ WORLD CANVAS ══
    const canvas = document.getElementById('hbl-world-canvas')
    const ctx    = canvas.getContext('2d', { alpha: false })
    let W, H
    let resizeTimer
    const resize = () => {
      clearTimeout(resizeTimer)
      resizeTimer = setTimeout(() => {
        W = canvas.width = window.innerWidth
        H = canvas.height = window.innerHeight
      }, 100)
    }
    W = canvas.width = window.innerWidth
    H = canvas.height = window.innerHeight
    window.addEventListener('resize', resize, { passive: true })

    const getT    = () => { const max = document.body.scrollHeight - window.innerHeight; return max > 0 ? Math.min(window.scrollY / max, 1) : 0 }
    const lerp    = (a, b, t) => a + (b - a) * t
    const clamp   = (v, a, b) => Math.max(a, Math.min(b, v))
    const easeIO  = t => t < .5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2

    const SKY = [
      { top: '#0c0420', mid: '#7a2c88', bot: '#ff9040' },
      { top: '#110830', mid: '#581858', bot: '#b05030' },
      { top: '#08041c', mid: '#2a104a', bot: '#4a2060' },
      { top: '#040118', mid: '#12062a', bot: '#200840' },
      { top: '#000008', mid: '#05021a', bot: '#0a0530' },
    ]
    const SKY_T = [0, .25, .5, .75, 1]
    const hx = h => { const v = parseInt(h.slice(1), 16); return [v >> 16, (v >> 8) & 255, v & 255] }
    const lerpHex = (a, b, t) => { const ca = hx(a), cb = hx(b); return `rgb(${lerp(ca[0],cb[0],t)|0},${lerp(ca[1],cb[1],t)|0},${lerp(ca[2],cb[2],t)|0})` }
    const getSky = t => {
      for (let i = 0; i < SKY_T.length - 1; i++) {
        if (t <= SKY_T[i + 1]) { const f = (t - SKY_T[i]) / (SKY_T[i + 1] - SKY_T[i]); return { top: lerpHex(SKY[i].top, SKY[i+1].top, f), mid: lerpHex(SKY[i].mid, SKY[i+1].mid, f), bot: lerpHex(SKY[i].bot, SKY[i+1].bot, f) } }
      }
      return SKY[SKY.length - 1]
    }

    // Reduced counts for performance (160 stars, 12 lanterns, 55 particles)
    const STARS = Array.from({ length: 160 }, () => ({ x: Math.random(), y: Math.random() * .72, r: Math.random() * 1.9 + .4, tw: Math.random() * Math.PI * 2, ts: Math.random() * .04 + .01 }))
    let shoots = []
    const shootInt = setInterval(() => { shoots.push({ x: Math.random() * .85 + .05, y: Math.random() * .3, vx: .007 + Math.random() * .009, vy: .003 + Math.random() * .005, life: 1, len: .09 + Math.random() * .13 }) }, 3500)

    const LANTERNS = Array.from({ length: 12 }, () => ({ x: Math.random(), y: .5 + Math.random() * .7, spd: .00038 + Math.random() * .0004, sw: Math.random() * Math.PI * 2, sws: .012 + Math.random() * .016, sz: 9 + Math.random() * 10, col: ['#ffd700','#ff8c00','#ffaa44'][Math.floor(Math.random() * 3)] }))
    const PARTS = Array.from({ length: 55 }, () => ({ x: Math.random(), y: Math.random(), vx: (Math.random() - .5) * .0003, vy: -(Math.random() * .0006 + .0001), r: Math.random() * 2.5 + .5, life: Math.random(), dec: .003 + Math.random() * .005, hue: Math.random() * 60 + 10 }))

    const IMG_CAMPUS = new Image(); IMG_CAMPUS.loading = 'eager'; IMG_CAMPUS.src = frontImg
    const IMG_STAGE  = new Image(); IMG_STAGE.loading  = 'eager'; IMG_STAGE.src  = backImg

    let worldRaf
    function drawWorld() {
      const t = getT()
      ctx.clearRect(0, 0, W, H)
      const campusAlpha = clamp(1 - t / .38, 0, 1)
      const stageAlpha  = clamp((t - .22) / .30, 0, 1) * clamp(1 - (t - .55) / .28, 0, 1)
      const sc = getSky(t)
      const g = ctx.createLinearGradient(0, 0, 0, H)
      g.addColorStop(0, sc.top); g.addColorStop(.5, sc.mid); g.addColorStop(1, sc.bot)
      ctx.fillStyle = g; ctx.fillRect(0, 0, W, H)

      if (campusAlpha > 0.01 && IMG_CAMPUS.complete) {
        ctx.save(); ctx.globalAlpha = campusAlpha
        const py = window.scrollY * 0.18, sc2 = 1.08, iw = W * sc2, ih = H * sc2
        ctx.drawImage(IMG_CAMPUS, (W - iw) / 2, (H - ih) / 2 - py * campusAlpha, iw, ih)
        const ov = ctx.createLinearGradient(0, 0, 0, H)
        ov.addColorStop(0, 'rgba(5,2,25,.45)'); ov.addColorStop(.45, 'rgba(5,2,25,.08)'); ov.addColorStop(.75, 'rgba(5,2,25,.50)'); ov.addColorStop(1, 'rgba(0,0,10,.97)')
        ctx.fillStyle = ov; ctx.fillRect(0, 0, W, H)
        const sv = ctx.createLinearGradient(0, 0, W, 0)
        sv.addColorStop(0, 'rgba(80,0,60,.28)'); sv.addColorStop(.35, 'transparent'); sv.addColorStop(.65, 'transparent'); sv.addColorStop(1, 'rgba(40,0,90,.22)')
        ctx.fillStyle = sv; ctx.fillRect(0, 0, W, H); ctx.restore()
      }

      if (stageAlpha > 0.01 && IMG_STAGE.complete) {
        ctx.save(); ctx.globalAlpha = stageAlpha
        const sc3 = 1.04 + (t - .22) * .04, iw2 = W * sc3, ih2 = H * sc3
        ctx.drawImage(IMG_STAGE, (W - iw2) / 2, (H - ih2) / 2, iw2, ih2)
        const ov2 = ctx.createLinearGradient(0, 0, 0, H)
        ov2.addColorStop(0, 'rgba(2,1,18,.55)'); ov2.addColorStop(.4, 'rgba(2,1,18,.15)'); ov2.addColorStop(.8, 'rgba(2,1,18,.60)'); ov2.addColorStop(1, 'rgba(0,0,8,.97)')
        ctx.fillStyle = ov2; ctx.fillRect(0, 0, W, H); ctx.restore()
      }

      const stA = clamp((t - .10) / .30, 0, 1)
      if (stA > 0.01) STARS.forEach(s => { s.tw += s.ts; ctx.save(); ctx.globalAlpha = stA * (0.4 + 0.6 * Math.abs(Math.sin(s.tw))); ctx.beginPath(); ctx.arc(s.x * W, s.y * H, s.r, 0, Math.PI * 2); ctx.fillStyle = '#fff'; ctx.shadowColor = '#fff'; ctx.shadowBlur = 7; ctx.fill(); ctx.restore() })

      for (let i = shoots.length - 1; i >= 0; i--) {
        const s = shoots[i]; s.x += s.vx; s.y += s.vy; s.life -= .022
        if (s.life <= 0) { shoots.splice(i, 1); continue }
        ctx.save(); ctx.globalAlpha = stA * s.life * .85; ctx.strokeStyle = '#fff'; ctx.lineWidth = 1.6; ctx.shadowColor = '#cce'; ctx.shadowBlur = 10
        ctx.beginPath(); ctx.moveTo(s.x * W, s.y * H); ctx.lineTo((s.x - s.len) * W, (s.y - s.len * .5) * H); ctx.stroke(); ctx.restore()
      }

      const moonT = clamp((t - 0.28) / (0.60 - 0.28), 0, 1)
      if (moonT > 0.01) {
        const em = easeIO(moonT), mx = W * lerp(0.88, 0.72, em), my = H * lerp(0.82, 0.14, em), mr = lerp(28, 52, em)
        ctx.save(); ctx.globalAlpha = Math.min(1, moonT * 2.2)
        const halo = ctx.createRadialGradient(mx, my, 0, mx, my, mr * 6.5); halo.addColorStop(0, 'rgba(180,210,255,.18)'); halo.addColorStop(.4, 'rgba(130,170,240,.07)'); halo.addColorStop(1, 'transparent'); ctx.fillStyle = halo; ctx.beginPath(); ctx.arc(mx, my, mr * 6.5, 0, Math.PI * 2); ctx.fill()
        const ig = ctx.createRadialGradient(mx, my, mr * .8, mx, my, mr * 2); ig.addColorStop(0, 'rgba(200,220,255,.12)'); ig.addColorStop(1, 'transparent'); ctx.fillStyle = ig; ctx.beginPath(); ctx.arc(mx, my, mr * 2, 0, Math.PI * 2); ctx.fill()
        ctx.fillStyle = '#e8f0ff'; ctx.shadowColor = '#b0c8ff'; ctx.shadowBlur = 45; ctx.beginPath(); ctx.arc(mx, my, mr, 0, Math.PI * 2); ctx.fill()
        ctx.globalCompositeOperation = 'destination-out'; ctx.fillStyle = 'rgba(0,0,0,.87)'; ctx.beginPath(); ctx.arc(mx + mr * .40, my - mr * .10, mr * .90, 0, Math.PI * 2); ctx.fill(); ctx.globalCompositeOperation = 'source-over'
        ctx.globalAlpha = Math.min(1, moonT * 2.2) * .3
        ;[[-.25,-.22,.11],[.14,.12,.07],[-.09,.26,.055],[.22,-.18,.044]].forEach(([ddx,ddy,cr]) => { ctx.fillStyle = 'rgba(120,150,210,.55)'; ctx.beginPath(); ctx.arc(mx + ddx * mr, my + ddy * mr, cr * mr, 0, Math.PI * 2); ctx.fill() })
        if (moonT > .4) { ctx.globalAlpha = (moonT - .4) * .7; for (let i = 0; i < 8; i++) { const a = i * Math.PI / 4 + t * 0.8, dist = mr * (2.2 + i * .32); ctx.fillStyle = '#fff'; ctx.shadowColor = '#aaccff'; ctx.shadowBlur = 8; ctx.beginPath(); ctx.arc(mx + Math.cos(a) * dist, my + Math.sin(a) * dist, 1.2 + i * .1, 0, Math.PI * 2); ctx.fill() } }
        if (moonT > .3 && stageAlpha > .1) { ctx.globalAlpha = (moonT - .3) * .4 * stageAlpha; const beam = ctx.createLinearGradient(mx, my, mx, H * .75); beam.addColorStop(0, 'rgba(180,210,255,.25)'); beam.addColorStop(1, 'transparent'); ctx.fillStyle = beam; ctx.beginPath(); ctx.moveTo(mx - mr * .6, my); ctx.lineTo(mx + mr * .6, my); ctx.lineTo(mx + mr * 1.5, H * .75); ctx.lineTo(mx - mr * 1.5, H * .75); ctx.closePath(); ctx.fill() }
        ctx.restore()
      }

      const lnA = clamp(t < .12 ? 0 : t > .70 ? 1 - (t - .70) / .18 : (t - .12) / .16, 0, 1)
      if (lnA > .01) LANTERNS.forEach(l => { l.y -= l.spd; l.sw += l.sws; if (l.y < -.18) { l.y = 1.12; l.x = Math.random() } const lx = (l.x + Math.sin(l.sw) * .022) * W, ly = l.y * H; ctx.save(); ctx.globalAlpha = lnA * .88; const gl = ctx.createRadialGradient(lx, ly, 0, lx, ly, l.sz * 3.2); gl.addColorStop(0, l.col + 'bb'); gl.addColorStop(1, 'transparent'); ctx.fillStyle = gl; ctx.beginPath(); ctx.arc(lx, ly, l.sz * 3.2, 0, Math.PI * 2); ctx.fill(); ctx.fillStyle = l.col; ctx.shadowColor = l.col; ctx.shadowBlur = 20; ctx.beginPath(); ctx.ellipse(lx, ly, l.sz * .55, l.sz * .82, 0, 0, Math.PI * 2); ctx.fill(); ctx.globalAlpha = lnA * .4; ctx.strokeStyle = 'rgba(255,220,150,.5)'; ctx.lineWidth = .9; ctx.beginPath(); ctx.moveTo(lx, ly + l.sz * .82); ctx.lineTo(lx, ly + l.sz * 1.5); ctx.stroke(); ctx.restore() })

      PARTS.forEach(p => { p.x += p.vx; p.y += p.vy; p.life -= p.dec; if (p.life <= 0) { p.x = Math.random(); p.y = .88 + Math.random() * .12; p.vx = (Math.random() - .5) * .0003; p.vy = -(Math.random() * .0006 + .0001); p.life = .8 + Math.random() * .2; p.hue = t < .42 ? Math.random() * 60 + 10 : Math.random() * 280 + 160 } ctx.save(); ctx.globalAlpha = p.life * .65; ctx.beginPath(); ctx.arc(p.x * W, p.y * H, p.r, 0, Math.PI * 2); ctx.fillStyle = `hsl(${p.hue},100%,70%)`; ctx.shadowColor = `hsl(${p.hue},100%,70%)`; ctx.shadowBlur = 9; ctx.fill(); ctx.restore() })

      const hgC = t < .4 ? `rgba(255,${(140 - t * 280)|0},30,${.4 - t * .18})` : `rgba(80,20,${180 + t * 40|0},${Math.max(.06, .18 - t * .1)})`
      const hg = ctx.createRadialGradient(W * .5, H, 0, W * .5, H, W * .72); hg.addColorStop(0, hgC); hg.addColorStop(1, 'transparent'); ctx.fillStyle = hg; ctx.fillRect(0, 0, W, H)

      worldRaf = requestAnimationFrame(drawWorld)
    }
    let imgLoaded = 0
    const onImgLoad = () => { imgLoaded++; if (imgLoaded >= 2) drawWorld() }
    IMG_CAMPUS.onload = onImgLoad; IMG_STAGE.onload = onImgLoad
    if (IMG_CAMPUS.complete) onImgLoad()
    if (IMG_STAGE.complete) onImgLoad()
    if (imgLoaded < 2) setTimeout(drawWorld, 200)

    // ══ HERO PARTICLES ══
    const hpc = document.getElementById('hbl-hero-particles')
    const hctx = hpc.getContext('2d')
    let hW, hH
    const hResize = () => { hW = hpc.width = hpc.offsetWidth; hH = hpc.height = hpc.offsetHeight }
    hResize(); window.addEventListener('resize', hResize)
    class HP { constructor() { this.reset(true) } reset(init) { this.x = Math.random() * hW; this.y = init ? Math.random() * hH : hH + 10; this.vx = (Math.random() - .5) * .4; this.vy = -(Math.random() * .9 + .2); this.r = Math.random() * 2.5 + .8; this.life = 0; this.max = Math.random() * 180 + 80; this.hue = Math.random() < .5 ? Math.random() * 50 + 15 : Math.random() * 280 + 160 } update() { this.x += this.vx; this.y += this.vy; this.life++; if (this.life > this.max || this.y < 0) this.reset() } draw() { const a = Math.sin(this.life / this.max * Math.PI) * .85; hctx.save(); hctx.globalAlpha = a; hctx.beginPath(); hctx.arc(this.x, this.y, this.r, 0, Math.PI * 2); hctx.fillStyle = `hsl(${this.hue},100%,70%)`; hctx.shadowColor = `hsl(${this.hue},100%,70%)`; hctx.shadowBlur = 10; hctx.fill(); hctx.restore() } }
    class HS { constructor() { this.reset() } reset() { this.x = Math.random() * hW; this.y = Math.random() * hH * .55; this.len = 80 + Math.random() * 100; this.spd = 2 + Math.random() * 3; this.ang = .2 + Math.random() * .5; this.life = 0; this.max = 55; this.hue = Math.random() * 60 + 10 } update() { this.x += Math.cos(this.ang) * this.spd; this.y += Math.sin(this.ang) * this.spd * .25; this.life++; if (this.life > this.max) this.reset() } draw() { const a = Math.sin(this.life / this.max * Math.PI) * .55; hctx.save(); hctx.globalAlpha = a; hctx.strokeStyle = `hsl(${this.hue},100%,80%)`; hctx.lineWidth = 1.5; hctx.shadowColor = `hsl(${this.hue},100%,80%)`; hctx.shadowBlur = 8; hctx.beginPath(); hctx.moveTo(this.x, this.y); hctx.lineTo(this.x - Math.cos(this.ang) * this.len, this.y - Math.sin(this.ang) * this.len * .25); hctx.stroke(); hctx.restore() } }
    const hParts   = Array.from({ length: 60 }, () => new HP())
    const hStreaks  = Array.from({ length: 8 },  () => new HS())
    const heroEl = document.querySelector('.hbl-hero-content')
    const onHeroScroll = () => { if (!heroEl) return; const sy = window.scrollY, vh = window.innerHeight; if (sy < vh * 1.3) { heroEl.style.transform = `translateY(${sy * .30}px)`; heroEl.style.opacity = 1 - sy / (vh * .72) } }
    window.addEventListener('scroll', onHeroScroll, { passive: true })
    let heroRaf
    const hLoop = () => { hctx.clearRect(0, 0, hW, hH); hParts.forEach(p => { p.update(); p.draw() }); hStreaks.forEach(s => { s.update(); s.draw() }); heroRaf = requestAnimationFrame(hLoop) }
    hLoop()

    // ══ CONFETTI (S4) ══
    const s4el = document.getElementById('hbl-s4')
    const ccv = document.createElement('canvas')
    ccv.style.cssText = 'position:absolute;inset:0;width:100%;height:100%;pointer-events:none;z-index:1'
    s4el.insertBefore(ccv, s4el.firstChild)
    const cctx = ccv.getContext('2d'); let cW, cH
    const cResize = () => { cW = ccv.width = s4el.offsetWidth || window.innerWidth; cH = ccv.height = s4el.offsetHeight || window.innerHeight }
    cResize(); window.addEventListener('resize', cResize)
    const cCols = ['#ff007f','#bf00ff','#00f5ff','#ffd700','#ff6b35','#39ff14','#fff']
    const pcs = Array.from({ length: 80 }, () => ({ x: Math.random(), y: Math.random(), w: 4 + Math.random() * 10, h: 2 + Math.random() * 4, col: cCols[Math.floor(Math.random() * cCols.length)], vy: 1 + Math.random() * 2, vx: (Math.random() - .5) * 1.2, ang: Math.random() * Math.PI * 2, spin: (Math.random() - .5) * .2, g: .018 }))
    let confRaf
    const cLoop = () => { cctx.clearRect(0, 0, cW, cH); pcs.forEach(p => { p.vy += p.g; p.x += p.vx / cW; p.y += p.vy / cH; p.ang += p.spin; if (p.y > 1.04) { p.y = -.02; p.x = Math.random() } cctx.save(); cctx.translate(p.x * cW, p.y * cH); cctx.rotate(p.ang); cctx.globalAlpha = .85; cctx.fillStyle = p.col; cctx.shadowColor = p.col; cctx.shadowBlur = 5; cctx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h); cctx.restore() }); confRaf = requestAnimationFrame(cLoop) }
    cLoop()

    // ══ FIREWORKS (S5) ══
    const fwc = document.getElementById('hbl-fw-canvas')
    const fctx = fwc.getContext('2d'); let fW, fH
    const fResize = () => { const s5 = document.getElementById('hbl-s5'); fW = fwc.width = s5.offsetWidth || window.innerWidth; fH = fwc.height = s5.offsetHeight || window.innerHeight }
    fResize(); window.addEventListener('resize', fResize)
    const fCols = ['#ff007f','#bf00ff','#00f5ff','#ffd700','#ff6b35','#fff','#39ff14']
    let fParts = [], rockets = []
    class FP { constructor(x, y, c) { this.x = x; this.y = y; const a = Math.random() * Math.PI * 2, sp = Math.random() * 7 + 2; this.vx = Math.cos(a) * sp; this.vy = Math.sin(a) * sp; this.c = c; this.life = 1; this.dec = Math.random() * .018 + .008 } tick() { this.vx *= .965; this.vy *= .965; this.vy += .11; this.x += this.vx; this.y += this.vy; this.life -= this.dec } draw() { fctx.save(); fctx.globalAlpha = this.life; fctx.fillStyle = this.c; fctx.shadowColor = this.c; fctx.shadowBlur = 10; fctx.beginPath(); fctx.arc(this.x, this.y, 2.5, 0, Math.PI * 2); fctx.fill(); fctx.restore() } }
    class FR { constructor() { this.x = fW * (.2 + Math.random() * .6); this.y = fH; this.vy = (fH * (.08 + Math.random() * .42) - fH) / 58; this.c = fCols[Math.floor(Math.random() * fCols.length)]; this.trail = []; this.done = false } tick() { this.trail.push({ x: this.x, y: this.y }); if (this.trail.length > 10) this.trail.shift(); this.vy += .065; this.y += this.vy; return this.vy >= 0 && !this.done } draw() { this.trail.forEach((p, i) => { fctx.save(); fctx.globalAlpha = (i / this.trail.length) * .5; fctx.fillStyle = '#ffd700'; fctx.shadowColor = '#ff8800'; fctx.shadowBlur = 4; fctx.beginPath(); fctx.arc(p.x, p.y, 2, 0, Math.PI * 2); fctx.fill(); fctx.restore() }) } }
    const spawnR = () => rockets.push(new FR())
    const ft1 = setTimeout(spawnR, 300), ft2 = setTimeout(spawnR, 1100), ft3 = setTimeout(spawnR, 2700)
    const fwInt = setInterval(() => { if (Math.random() < .55) spawnR() }, 1400)
    let fwRaf
    const fwLoop = () => { fctx.fillStyle = 'rgba(0,0,8,.14)'; fctx.fillRect(0, 0, fW, fH); rockets = rockets.filter(r => { const ex = r.tick(); if (ex) { r.done = true; const c = r.c, c2 = fCols[Math.floor(Math.random() * fCols.length)]; for (let i = 0; i < 90; i++) fParts.push(new FP(r.x, r.y, c)); for (let i = 0; i < 30; i++) { const p = new FP(r.x, r.y, c2), a = (i / 30) * Math.PI * 2, sp2 = 5 + Math.random() * 2.5; p.vx = Math.cos(a) * sp2; p.vy = Math.sin(a) * sp2; fParts.push(p) } return false } r.draw(); return true }); fParts = fParts.filter(p => { p.tick(); p.draw(); return p.life > 0 }); fwRaf = requestAnimationFrame(fwLoop) }
    fwLoop()

    return () => {
      cancelAnimationFrame(curRaf)
      cancelAnimationFrame(worldRaf)
      cancelAnimationFrame(heroRaf)
      cancelAnimationFrame(confRaf)
      cancelAnimationFrame(fwRaf)
      clearInterval(cdInt); clearInterval(shootInt); clearInterval(fwInt)
      clearTimeout(ft1); clearTimeout(ft2); clearTimeout(ft3)
      clearTimeout(resizeTimer)
      document.removeEventListener('mousemove', onMove)
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('scroll', onHeroScroll)
      window.removeEventListener('resize', resize)
      window.removeEventListener('resize', hResize)
      window.removeEventListener('resize', cResize)
      window.removeEventListener('resize', fResize)
      io.disconnect()
      document.getElementById('hbl-styles')?.remove()
      document.body.classList.remove('hbl-active')
      if (ccv.parentNode) ccv.parentNode.removeChild(ccv)
    }
  }, [])

  return (
    <div id="hbl-root">
      {/* Cursor */}
      <div id="hbl-cur" />
      <div id="hbl-cur-dot" />
      <div id="hbl-prog" />

      {/* World canvas (fixed, behind everything) */}
      <canvas id="hbl-world-canvas" />

      {/* NAV — LandingPage only nav (separate from HomePage Navbar) */}
      <nav id="hbl-nav">
        <button className="hbl-nav-logo-wrap" onClick={goToMain} style={{border:'none',background:'none',padding:0,cursor:'pointer',display:'flex',alignItems:'center',gap:'8px'}}>
          <img src={sathakLogoIcon} alt="" style={{width:'34px',height:'34px',objectFit:'contain',mixBlendMode:'lighten',filter:'brightness(1.2)',flexShrink:0}} />
          <img src={sathakLogoFull} alt="Sathak Thiruvizha" style={{height:'28px',width:'auto',maxWidth:'140px',objectFit:'contain',mixBlendMode:'lighten',filter:'brightness(1.1)'}} />
        </button>
        <ul className="hbl-nav-links">
          <li><a href="#hbl-s2">About</a></li>
          <li><a href="#hbl-s3">Stage</a></li>
          <li><a href="#hbl-s4">Party</a></li>
          <li><a href="#hbl-s5">Finale</a></li>
          <li><button className="hbl-reg-cta hbl-nav-cta-btn" style={{border:'none',padding:'9px 14px',fontSize:'.78rem',letterSpacing:'2px'}} onClick={goToMain}>🎟 Enter Fest</button></li>
        </ul>
      </nav>

      <div id="hbl-world">

        {/* S1 — HERO */}
        <section className="hbl-scene" id="hbl-s1">
          <canvas id="hbl-hero-particles" style={{ position:'absolute', inset:0, width:'100%', height:'100%', pointerEvents:'none', zIndex:3 }} />
          <div className="hbl-hero-content">
            <p className="hbl-hero-eye">Mohamed Sathak AJ College of Engineering · Silver Jubilee 2025–26</p>
            <div className="hbl-hero-title" style={{display:'flex',flexDirection:'column',alignItems:'center',gap:'12px',background:'none',WebkitTextFillColor:'unset',filter:'none',opacity:1,animation:'hblFadeUp 1.2s .6s both' , marginBottom:'10px'}}>
              <img src={sathakLogoIcon} alt="Sathak Symbol"
                style={{width:'clamp(120px,22vw,220px)',height:'auto',objectFit:'contain',mixBlendMode:'lighten',filter:'brightness(1.3) drop-shadow(0 0 40px rgba(255,200,80,0.7))',animation:'hblFadeUp 1.2s .6s both'}} />
              <img src={sathakLogoFull} alt="Thiruvizha"
                style={{width:'clamp(200px,45vw,520px)',height:'auto',objectFit:'contain',mixBlendMode:'lighten',filter:'brightness(1.2) drop-shadow(0 0 30px rgba(255,160,60,0.5))',animation:'hblFadeUp 1.2s .7s both'}} />
            </div>
            <p className="hbl-hero-sub">The Grand Cultural Celebration</p>
            <div className="hbl-hero-badges" style={{marginTop:'4px', display:'flex', padding:'5px', alignItems:'center',}}>
              <span className="hbl-badge hbl-badge-main" style={{padding:'8px'}}>April 6–17, 2026 · MSAJCE, Chennai</span>
              <button className="hbl-reg-cta" onClick={goToMain} style={{padding:'4px' , paddingLeft:'4px'}}><span className="hbl-reg-icon" style={{display:'flex' , justifyContent:"center" , alignItems: "center" , padding: '2px' ,}} >🎟</span><span>Enter Fest</span><span className="hbl-reg-arrow">→</span></button>
            </div>
          </div>
          <div className="hbl-scroll-hint"><span>SCROLL</span><div className="hbl-scroll-line" /></div>
        </section>

        {/* S2 — ARRIVAL */}
        <section className="hbl-scene" id="hbl-s2">
          <div className="hbl-blk" style={{display : 'flex' , flexDirection : 'column',alignItems : 'center'}}>
            <p className="hbl-lbl hbl-anim">The Campus Comes Alive</p>
            <h2 className="hbl-h2 hbl-anim"><span className="hbl-gs">A 10 days of </span><br/>grand celebration</h2>
            <p className="hbl-bod hbl-anim" >As dusk paints the sky above our campus, every corner transforms. Food stalls glow, music rises, and the festival begins.</p>
            {/*<div className="hbl-cards">
              {[['🎭','Cultural Shows'],[' 🍢','Food Fiesta'],['🎨','Art Gallery'],['🎤','Live Music'],['🪔','Light Show']].map(([ico,lbl],i) => (
                <div key={lbl} className="hbl-card hbl-anim" style={{ transitionDelay: `${(i+1)*.08}s` }}>
                  <div className="hbl-card-ico">{ico}</div>
                  <div className="hbl-card-lbl">{lbl}</div>
                </div>
              ))}
            </div>*/}
          </div>
        </section>

        {/* S3 — DANCE ARENA */}
        <section className="hbl-scene" id="hbl-s3">
          <div className="hbl-lasers">{[...Array(5)].map((_,i) => <div key={i} className="hbl-lz" />)}</div>
          <div className="hbl-led hbl-led-a" /><div className="hbl-led hbl-led-b" />
          <div className="hbl-blk" style={{display : 'flex' , flexDirection : 'column',alignItems : 'center'}}>
            <p className="hbl-lbl hbl-anim">The Main Stage</p>
            <h2 className="hbl-h2 hbl-anim"><span className="hbl-gn">Feel the Beat.</span><br/>Feel the Energy.</h2>
            <p className="hbl-bod hbl-anim">The arena ignites under the open sky. DJ lights sweep across a thousand cheering faces. The bass drops and everything disappears.</p>
            {/*<div className="hbl-cards" style={{ marginTop:'36px' }}>
              {[['🎧','DJ Night','rgba(0,245,255,.25)'],['💃','Dance Battle','rgba(191,0,255,.25)'],['🎸','Band Clash','rgba(255,0,127,.25)'],['🎤','Open Mic','rgba(255,215,0,.25)']].map(([ico,lbl,bc],i) => (
                <div key={lbl} className="hbl-card hbl-anim" style={{ borderColor:bc, transitionDelay:`${(i+1)*.08}s` }}>
                  <div className="hbl-card-ico">{ico}</div><div className="hbl-card-lbl">{lbl}</div>
                </div>
              ))}
            </div>*/}
          </div>
        </section>

        {/* S4 — PARTY */}
        <section className="hbl-scene" id="hbl-s4">
          <div className="hbl-ring hbl-ring-a" /><div className="hbl-ring hbl-ring-b" /><div className="hbl-ring hbl-ring-c" />
          <div className="hbl-blk" >
            <p className="hbl-lbl hbl-anim">Peak Celebration</p>
            <h2 className="hbl-h2 hbl-anim">Where Friends<br/><span className="hbl-gn">Become Memories</span></h2>
            {/*<div className="hbl-bars">{[...Array(10)].map((_,i) => <div key={i} className="hbl-bar" />)}</div>*/}
            <div style={{display : 'flex' , flexDirection : 'column',alignItems : 'center' , margin: '5px' , marginBottom : '10px '}}>
              <p className="hbl-bod hbl-anim">Confetti rains down. Neon floods every face. This is the moment you'll still be talking about years from now.</p>
            </div>
            
            <div className="hbl-evgrid">
              {[[' Competition','🏆  Hackathon'],['Showcase','🏅 Technical Events'],[' Art','🎶 Non-Technical Events'],['Fun','💃 Cultural'],[' Food','🍕 Food Stalls'],['Conducted','🎓 Workshop'],[' Fun','🔥 Flash mob'],['Physical activity','🏅 Sport meet']].map(([cat,name],i) => (
                <div key={name} className="hbl-ev hbl-anim" style={{ transitionDelay:`${(i+1)*.06}s` }}>
                  <div className="hbl-ev-cat">{cat}</div>
                  <div className="hbl-ev-name">{name}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* S5 — FINALE */}
        <section className="hbl-scene" id="hbl-s5">
          <canvas id="hbl-fw-canvas" />
          <div className="hbl-blk">
            <div className="hbl-finale-title hbl-anim" style={{display:'flex',flexDirection:'column',alignItems:'center',gap:'16px',background:'none',WebkitTextFillColor:'unset',filter:'none'}}>
              <img src={sathakLogoIcon} alt="Sathak Symbol"
                style={{width:'clamp(100px,16vw,180px)',height:'auto',objectFit:'contain',mixBlendMode:'lighten',filter:'brightness(1.4) drop-shadow(0 0 60px rgba(191,0,255,0.6))'}} />
              <img src={sathakLogoFull} alt="Thiruvizha"
                style={{width:'clamp(180px,38vw,480px)',height:'auto',objectFit:'contain',mixBlendMode:'lighten',filter:'brightness(1.3) drop-shadow(0 0 40px rgba(255,0,127,0.5))'}} />
              <span className="hbl-finale-yr" style={{display:'block'}}>2026</span>
            </div>
            <p className="hbl-finale-tag hbl-anim">Silver Jubilee Celebration · April 6–17, 2026 · Chennai</p>
            <button className="hbl-cta-btn hbl-anim" onClick={goToMain}  style={{border:'none',padding:'9px 14px',fontSize:'.78rem',letterSpacing:'2px', margin:'5px'}} >🎟 Enter Sathak Thiruvizha →</button>
            <div className="hbl-cd-row hbl-anim">
              <div className="hbl-cd-unit"><div className="hbl-cd-n" id="hbl-cd-d">00</div><div className="hbl-cd-l">DAYS</div></div>
              <div className="hbl-cd-unit"><div className="hbl-cd-n" id="hbl-cd-h">00</div><div className="hbl-cd-l">HOURS</div></div>
              <div className="hbl-cd-unit"><div className="hbl-cd-n" id="hbl-cd-m">00</div><div className="hbl-cd-l">MINUTES</div></div>
              <div className="hbl-cd-unit"><div className="hbl-cd-n" id="hbl-cd-s">00</div><div className="hbl-cd-l">SECONDS</div></div>
            </div>
          </div>
        </section>

      </div>{/* #hbl-world */}

      <footer id="hbl-footer">
        <div style={{display:'flex',alignItems:'center',gap:'8px'}}>
          <img src={sathakLogoIcon} alt="" style={{width:'26px',height:'26px',objectFit:'contain',mixBlendMode:'lighten',filter:'brightness(1.2)'}} />
          <img src={sathakLogoFull} alt="Sathak Thiruvizha" style={{height:'20px',width:'auto',objectFit:'contain',mixBlendMode:'lighten',filter:'brightness(1.1)'}} />
        </div>
        <div className="hbl-f-copy">© 2026 Sathak Thiruvizha Fest · Mohamed Sathak AJ College of Engineering</div>
        <div className="hbl-f-soc">
          <a href="#" className="hbl-soc-btn">📷</a>
          <a href="#" className="hbl-soc-btn">🐦</a>
          <a href="#" className="hbl-soc-btn">▶️</a>
          <a href="#" className="hbl-soc-btn">💬</a>
        </div>
      </footer>
    </div>
  )
}
