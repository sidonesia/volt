let cardArrays = []


function toggleOpen(el, src) {       
  
  
  const id = (new Date()).getTime()
  let height = 150

  if (el.id === '') {
    el.id = id
    cardArrays.push(
      {id : id}
    )    
  }else {
    const check = cardArrays.find(card => card.id == el.id)
    height = check.height
  }  

  const dataDropEl = el.querySelector('[data-drop]')
  const iframe = el.querySelector('iframe') 

  if (iframe.src === window.location.href || iframe.src + '#' === window.location.href) {    
    iframe.src = src
    $(iframe).on('load', function(){
      height = iframe.contentWindow.document.body.scrollHeight            
      let check = cardArrays.findIndex(card => card.id == el.id)    
      cardArrays[check].height = height                    
      if (el.classList.contains('open-details')) {
        dataDropEl.style.height = `${height}px`                  
      }else {
        dataDropEl.style.height = `0`                  
      }
    });      
  }

  el.classList.toggle('open-details')      
  if (el.classList.contains('open-details')) {
    dataDropEl.style.height = `${height}px`                  
  }else {
    dataDropEl.style.height = `0`                  
  }
}
