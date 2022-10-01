$(document).ready(function(){
    onTimeChange()
        });

  var inputEleOnetimeStart = document.getElementById('one_start_time');
  var oneTimeStartOutput = document.getElementById('oneTimeStartOutput');
  function onTimeChange() {
    var timeSplit = inputEleOnetimeStart.value.split(':'),
      hours,
      minutes,
      meridian;
    hours = timeSplit[0];
    minutes = timeSplit[1];
    if (hours > 12) {
      meridian = 'PM';
      hours -= 12;
    } else if (hours < 12) {
      meridian = 'AM';
      if (hours == 0) {
        hours = 12;
      }
    } else {
      meridian = 'PM';
    }
  oneTimeStartOutput.value = hours + ':' + minutes + ' ' + meridian;
  }
    const placeholders = [
      {id: "gmeetP", placehoder: "joinclubhouse.com/event/lynkid"},
      {id: "zoomP", placehoder: "us02web.zoom.us/lynkid"},
      {id: "otherP", placehoder: "Any URL"},           
    ];    
    const radios = document.querySelectorAll('input[name="service"]');
    radios.forEach(radio => {
      radio.addEventListener('change', (e) => {
        if (e.target.checked) {          
          const test = placeholders.find(el => el.id == e.target.id);
          document.querySelector('[data-service-input]').setAttribute('placeholder', test.placehoder)
        }
      });
    });
    const activeInput = document.querySelector('[data-active]');
    const starIcon = document.querySelector('[data-star]');  
    activeInput.addEventListener('change', e => e.target.checked ? starIcon.style.fill = "#ffc107" : starIcon.style.fill = "gray");
    // Toast 
    function showAToast() {
      iqwerty.toast.toast('Copied!', {
        settings: {
          duration: 1000,
        },
        style: {
          main: {
            width: '110px',              
            bottom: "50%"          
          }
        }
      });
    };

    function copyFunction() {
      // make element containing the href
      const el = `<input data-input-container type="text" value="${window.location.href}">`
      // append the element in the body
      document.body.insertAdjacentHTML('afterbegin', el);
      // select the container
      const urlContainer = document.querySelector('[data-input-container]');
      //selects the input field
      urlContainer.select();
      urlContainer.setSelectionRange(0, 99999); /* For mobile devices */      
      /* Copy the text inside the text field */
      document.execCommand("copy");
      // remove the element from dom
      urlContainer.remove();        
    } 

    // Radio Sched
    const allSchedRad = document.querySelectorAll('input[name="days"]');
    allSchedRad.forEach(rad => {
      rad.addEventListener('change', (e) => {
        const el = e.target;
        el.checked ? el.parentNode.previousElementSibling.classList.add('C($green)') : el.parentNode.previousElementSibling.classList.remove('C($green)');        
      })
    });

     // show or hide divs in scheds
     const schedRads = document.querySelectorAll('input[name="schedule"]');
    const schedDivs = document.querySelectorAll('[data-sched]');
    const fieldSets = document.querySelectorAll('[data-field-set]');
    schedRads.forEach((rad, i) => {
      rad.addEventListener('change', (e) => {
        const el = e.target;
        schedDivs.forEach(div => div.classList.add('D(n)'));
        fieldSets.forEach(field => field.disabled = true);
        if (el.checked) {
          schedDivs[i].classList.add('D(b)');
          schedDivs[i].classList.remove('D(n)');
          fieldSets[i].disabled = false;
        };
      });
    });  
  
  document.querySelector('[data-custom-price-input]').addEventListener('change', (e) => {
    // checkbox input
    const inputEl = e.target;
    // inputs parent
    const priceInputParent = document.querySelector('[data-custom-price]');
    // all input min,select,suggested price
    const priceInputs = priceInputParent.querySelectorAll('[data-input]');
    // hide and show toggle
    priceInputParent.classList.toggle('D(n)');
    // toggle disabled for all inputs
    priceInputs.forEach(input => input.toggleAttribute('disabled'));
    const priceRealInput = document.querySelector('[data-real-price]');
    priceRealInput.classList.toggle('D(n)');
  });

  $('#base_price, #sale_price').on("keypress keyup blur",function (event) {    
  $(this).val($(this).val().replace(/[^0-9\.]/g,'').replace(/[^0-9\,]/g,''))
  if ((event.which != 46 || $(this).val().indexOf('.') != -1) && (event.which < 48 || event.which > 57)) {
      event.preventDefault()}
  })

  $('#duration').on("keypress keyup blur",function (event) {    
  $(this).val($(this).val().replace(/[^0-9\.]/g,'').replace(/[^0-9\,]/g,''))
  if ((event.which != 46 || $(this).val().indexOf('.') != -1) && (event.which < 48 || event.which > 57)) {
      event.preventDefault()}
  })

  $(document).ready(function () {
      $("#bg_image").click(function () {
        $("#dataImg").click();
      });
    });

    $(document).ready(function () {
      $("input[id=dataImg]").change(function () {
        const file = $("#dataImg").prop('files')[0];

        if (file.size <= 1000000) {
          const reader = new FileReader();
          reader.readAsDataURL(file);
          reader.onload = () => {
            $("#file_image").prop("value", reader.result);
            $("#background_img").attr('src',reader.result);
            $('input[name="card"]').prop('checked', false);
            $("#background_image").prop("checked", true);
            $("#img_con").removeClass('D(n)');
            $("#empty_img").addClass('D(n)');
          };
        }
      });
      $("input[name=card]").change(function () {
        $("#background_image").prop("checked", false);
        $("#background_img").attr('src','');
        $("#dataImg").val('');
        $("#img_con").addClass('D(n)');
        $("#empty_img").removeClass('D(n)');
      });
    });