// Phone-only arc browsing. Deck order and card identities never change here.
export const PHONE_QUERY='(max-width: 650px)';
export const SWIPE_THRESHOLD=10;
export function arcPosition(index,center){const angle=(index-center)*11;return {angle,visible:Math.abs(angle)<78};}
export function isSwipe(dx,dy){return Math.hypot(dx,dy)>SWIPE_THRESHOLD;}
export function mountMobileFan(wrap,onSelect){
  const fan=wrap.querySelector('.fan'),cards=[...fan.querySelectorAll('[data-index]')],mq=matchMedia(PHONE_QUERY);
  let center=38.5,frame=0,gesture=null,pressed=null,disposed=false;
  const clamp=x=>Math.max(0,Math.min(cards.length-1,x));
  function paint(){frame=0;if(disposed)return;
    fan.classList.toggle('touch-fan',mq.matches);wrap.classList.toggle('touch-viewport',mq.matches);
    if(!mq.matches){cards.forEach(b=>{b.style.removeProperty('--arc');b.style.removeProperty('--lift');b.style.removeProperty('visibility');b.style.removeProperty('pointer-events');b.classList.remove('touch-pressed');b.removeAttribute('aria-hidden');b.removeAttribute('tabindex')});return;}
    const shuffling=fan.classList.contains('shuffling');
    cards.forEach((b,i)=>{const p=arcPosition(i,center),visible=shuffling||p.visible;b.style.setProperty('--arc',`${p.angle}deg`);b.style.setProperty('--lift',b===pressed?'-12px':'0px');b.style.visibility=visible?'visible':'hidden';b.style.pointerEvents=visible?'':'none';b.classList.toggle('touch-pressed',b===pressed);b.setAttribute('aria-hidden',String(!visible));b.tabIndex=visible&&!b.disabled?0:-1;});
  }
  const schedule=()=>{if(!frame)frame=requestAnimationFrame(paint)};
  function clear(){pressed=null;gesture=null;schedule()}
  function down(e){if(!mq.matches||fan.classList.contains('shuffling')||!e.isPrimary||e.button>0)return;
    const b=e.target.closest('[data-index]');gesture={id:e.pointerId,x:e.clientX,y:e.clientY,center,card:b&&!b.disabled&&!b.classList.contains('picked')?b:null,moved:false,axis:null};pressed=gesture.card;wrap.setPointerCapture(e.pointerId);schedule();
  }
  function move(e){if(!gesture||e.pointerId!==gesture.id)return;const dx=e.clientX-gesture.x,dy=e.clientY-gesture.y;
    if(isSwipe(dx,dy)){gesture.moved=true;pressed=null;if(!gesture.axis)gesture.axis=Math.abs(dx)>Math.abs(dy)?'x':'y';}
    if(gesture.axis==='x'){e.preventDefault();center=clamp(gesture.center-dx/25);schedule()}else if(gesture.moved)schedule();
  }
  function up(e){if(!gesture||e.pointerId!==gesture.id)return;const g=gesture;const tap=!g.moved&&!isSwipe(e.clientX-g.x,e.clientY-g.y);clear();if(wrap.hasPointerCapture(e.pointerId))wrap.releasePointerCapture(e.pointerId);if(tap&&g.card)onSelect(+g.card.dataset.index,g.card);}
  function click(e){if(!mq.matches)return;const b=e.target.closest('[data-index]');if(!b)return;e.preventDefault();e.stopImmediatePropagation();if(e.detail===0&&!b.disabled)onSelect(+b.dataset.index,b);}
  function keys(e){if(!mq.matches||!['ArrowLeft','ArrowRight','Home','End'].includes(e.key))return;e.preventDefault();center=e.key==='Home'?0:e.key==='End'?77:clamp(center+(e.key==='ArrowRight'?1:-1));schedule();}
  wrap.addEventListener('pointerdown',down);wrap.addEventListener('pointermove',move,{passive:false});wrap.addEventListener('pointerup',up);wrap.addEventListener('pointercancel',clear);wrap.addEventListener('lostpointercapture',clear);wrap.addEventListener('click',click,true);wrap.addEventListener('keydown',keys);mq.addEventListener('change',schedule);
  const observer=new MutationObserver(schedule);observer.observe(fan,{attributes:true,attributeFilter:['class']});paint();
  return ()=>{disposed=true;cancelAnimationFrame(frame);observer.disconnect();mq.removeEventListener('change',schedule);wrap.removeEventListener('pointerdown',down);wrap.removeEventListener('pointermove',move);wrap.removeEventListener('pointerup',up);wrap.removeEventListener('pointercancel',clear);wrap.removeEventListener('lostpointercapture',clear);wrap.removeEventListener('click',click,true);wrap.removeEventListener('keydown',keys);};
}
export function phoneFlight(fly,from,to){
  Object.assign(fly.style,{left:'0px',top:'0px',width:to.width+'px',height:to.height+'px',transformOrigin:'0 0',transition:'transform .55s cubic-bezier(.15,.7,.25,1)',transform:`translate3d(${from.left}px,${from.top}px,0) scale(${from.width/to.width},${from.height/to.height})`});
  requestAnimationFrame(()=>requestAnimationFrame(()=>fly.style.transform=`translate3d(${to.left}px,${to.top}px,0) scale(1,1)`));
}
