gsap.registerPlugin(MotionPathPlugin);

const el = document.getElementById('centerEl').getBoundingClientRect();
const imgs = document.querySelectorAll('.animated-imgs img');

gsap.to(imgs, {
  duration: imgs.length *  2,  
  repeat: -1, 
  ease: Power0.easeNone,  
  stagger: {
    each: (imgs.length / imgs.length) * 2,
    repeat: -1,     
  },
  motionPath: {
    path: [
      {x:0,y:0},                
      {x:el.width ,y:el.height/2},
      {x:0,y:el.height + 130},
      {x:-el.width ,y:(el.height)/2},
      {x:0,y:0}
    ],
    curviness: 1.5,     
  }
})
