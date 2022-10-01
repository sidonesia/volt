const allMonths = ["Jan", "Feb", "Mar", "Apr", "May","Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
const monthsContainer = document.querySelector('[data-months]')
const yearsContainer = document.querySelector('[data-year]')
const selectedContainer = document.querySelector('[data-selected-date]')

MicroModal.init();

function generateArrayOfYears() {
  const minYear = 2020
  const maxYear = new Date().getFullYear()
  const years = []
  for (let i = maxYear; i >= minYear; i--) {
    years.push(i)
  }
  return years
}

function putTodaysYearAndMonth() {  
  const todaysYear = new Date().getFullYear()
  const todaysMonth = new Date().getMonth()  
  selectedContainer.textContent = `${allMonths[todaysMonth]} - ${todaysYear}`
  yearsContainer.textContent = todaysYear  
  allMonths.reverse().forEach( month => {  
    const html = `
      <div class="choose-month">
        <input id="${month}" class="D(n)" type="radio" value="${month}" name="month">
        <label for="${month}">${month}</label>
      </div> 
    `
    monthsContainer.insertAdjacentHTML('afterbegin', html)
  })  
}

function updateYearAndMonths() {
  const chosenYear = yearsContainer.textContent
  const chosenMonth = document.querySelector('input[name=month]:checked').value
  selectedContainer.textContent = `${chosenMonth} - ${chosenYear}`
  MicroModal.close('modalCalendar');
}

function chooseYear(bool) {  
  let currentTxt = parseInt(yearsContainer.textContent)
  const min = generateArrayOfYears().pop()  
  const max = new Date().getFullYear()
  bool ? currentTxt += 1 : currentTxt -= 1        
  if (currentTxt >= min && currentTxt <= max) {
    yearsContainer.textContent = currentTxt  
  }  
}

putTodaysYearAndMonth()

function d1(e, t){
  allMonths.reverse();
  const chosenYear  = yearsContainer.textContent
  const chosenMonth = document.querySelector('input[name=month]:checked')?document.querySelector('input[name=month]:checked').value:`${allMonths[new Date().getMonth()]}`
 
  $.ajax({
    url: '/admin/orders/download/xls?y=' + `${chosenYear}` + '&m=' + `${chosenMonth}`,
    method: 'GET',
    xhrFields: {
        responseType: 'blob'
    },
    beforeSend: function(e) {
      t.innerHTML = "<div class='small20wloader'></div>";
    },
    success: function (data) {
        var a = document.createElement('a');
        var url = window.URL.createObjectURL(data);
        a.href = url;
        a.download = 'myorder.xlsx';
        document.body.append(a);
        a.click();
        a.remove();
        window.URL.revokeObjectURL(url);
        t.innerHTML = '<img src="/static/assets/imgs/feather-ico/arrow_white.svg" alt="">';
    },
    error: function(xhr) {
        alert("Error occured.please try again");
    }
  });

}