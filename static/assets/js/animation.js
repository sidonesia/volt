const tl = gsap.timeline();

tl.from('.animate-img', 
  {
    x: function(){ return getRand(-500,500) },
    y: function(){ return getRand(-500,500) },    
    repeat: -1,
    duration: 3,
    rotate: 360,
    stagger: 0.3,
    ease: "slow(0.3, 0.4, false)",
    autoAlpha: 0,   
  }
);

function getRand(min,max){
  return Math.random() * (max - min) + min;
}

