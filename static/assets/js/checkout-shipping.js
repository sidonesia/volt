// const couriers = [
//   {
//     courier: '96669',
//     price: '20k',
//     desc: 'Custom',
//     img: 'courier@3x.png'
//   },
//   {
//     courier: 'jne_reg',
//     price: '9k',
//     desc: 'COD (REG) 1-2 days',
//     img: 'jne.png'
//   },
//   {
//     courier: 'sicepat_reg',
//     price: '10k',
//     desc: 'COD (REG) 1-4 days',
//     img: 'sicepat.png'
//   },
//   {
//     courier: 'tiki_ons',
//     price: '12k',
//     desc: '(ONS) 1 days',
//     img: 'tiki.png'
//   },
//   {
//     courier: 'sicepat_best',
//     price: '13k',
//     desc: '(BEST) 1-2 days',
//     img: 'sicepat.png'
//   },
//   {
//     courier: 'jne_yes',
//     price: '18k',
//     desc: '(YES) 1 days',
//     img: 'jne.png'
//   }
// ]

// const shipments = document.querySelectorAll('[data-shipment]')
// const couriersElement = document.querySelectorAll('[data-couriers]')
// const checkoutBtn = document.querySelector('[data-checkout]')

// let shipmentIndex = null

// shipments.forEach((shipment, index) => {
//   shipment.addEventListener('click', () => {   
//     shipmentIndex = index      
//   })
// })

// let arrayShipments = [...shipments]

// couriersElement.forEach((courier, index) => {

  // courier.addEventListener('click', () => {    
  //   MicroModal.close('modal-1');        
  //   const selectedCourier = couriers.find(obj => obj.courier === courier.id)
  //   const selectedElement = shipments[shipmentIndex]
  //   const courierElementDetails = selectedElement.querySelector('[data-courier-detail]')
  //   let html = `
  //   <div data-courier-detail class="P(8px) Bdrs(6px) Bd($c7) D(f) Ai(c) Jc(sb)" style="background-color: #fff;"> 
  //     <div class="D(f) Ai(c) Fz(14px)">
  //       <div class="Bd($c7) Bdrs(4px) P(4px) D(f) Jc(c) Ai(c) Mend(8px) Ov(h)" style="width: 39px;height: 28px;">
  //         <img style="${selectedCourier.courier === 'custom' ? 'height:120%;' : 'width:90%'} "  src="/static/assets/imgs/shipping_company/${selectedCourier.img}" alt="">
  //       </div>        
  //       <span data-text class="">${selectedCourier.desc} (IDR ${selectedCourier.price})</span>
  //     </div>
  //     <div class="Mend(12px)">
  //       <div class="arrow right" style="border: solid #2AB57D;border-width: 0 2px 2px 0;padding: 2px;height: 12px;width: 12px;"></div>
  //     </div>
  //   </div>
  //   `
  //   courierElementDetails.innerHTML = html      

    // const check = arrayShipments.every(el => {
    //   return el.querySelector('[data-text]').textContent !== 'Select shipping methods'  
    // })  
    
    // if (check) {
    //   checkoutBtn.disabled = false
    // } else {
    //   checkoutBtn.disabled = true
    // }

  // })
// })