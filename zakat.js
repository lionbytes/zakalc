"use strict";

// Vanilla JavaScript custom shortcuts
const dselect = (string) => { return document.querySelector(string); }
// CLEAR
const getCurrSign = (string) => {
  let sign;

  switch (string) {
    case "TRY":
      sign = "₺";
      break;

    case "USD":
      sign = "$";
      break;

    case "EURO":
      sign = "€";
      break;

    case "GOLD":
      sign = "g";
      break;
  
    default:
      break;
  }
  return sign;
}
// CLEAR
const getData = () => {
  const date_default = new Date();
  const fundata = {
    date: {
      greg:   date_default.toISOString(),
      hijri:  new Intl.DateTimeFormat('en-US-u-ca-islamic', 
                {day: 'numeric', month: 'numeric',year : 'numeric'}).format(Date.now()), 
      hijriyr:new Intl.DateTimeFormat('en-US-u-ca-islamic', {year : 'numeric'}).format(Date.now()).substring(0, 4),
    },
    currency: {
      local:    dselect('#currLocal').value,
      signloc:  getCurrSign(dselect('#currLocal').value),
      savings:  dselect('#currSavings').value,
      signsav:  getCurrSign(dselect('#currSavings').value),
    },
    rate: {
      usd:    dselect('#convert input').value, 
      gold:   dselect('#rateGold input').value, 
      silver: dselect('#rateSilver input').value
    },
  };

  return fundata;
}

const getQuorum = () => {
  return {
    gold: {
      quorloc: getData().rate.gold * 85,
      quorsav: Math.ceil((getData().rate.gold * 85) / getData().rate.usd),
    },
    silver: {
      quorloc: getData().rate.silver * 600,
      quorsav: Math.ceil((getData().rate.silver * 600) / getData().rate.usd),
    },

  };
}
// CLEAR
const emptyResults = () => {
  dselect("#cmdline-rates").classList.add("d-none");
  dselect("#cmdline-savings").classList.add("d-none");
  dselect("#cmdline-result").classList.add("d-none");
}
const revealResults = () => {
  dselect("#cmdline-rates").classList.remove("d-none");
  dselect("#cmdline-savings").classList.remove("d-none");
  dselect("#cmdline-result").classList.remove("d-none");
}
const msgSuccess = (msg) => {
  const cmdline_msg = dselect('#cmdline-msg .msg-success');
  cmdline_msg.classList.add('d-block');
  cmdline_msg.classList.remove('d-none');
  cmdline_msg.innerHTML = msg;
  return msg;
}
const msgError = (msg) => {
  const cmdline_msg = dselect('#cmdline-msg .msg-error');
  cmdline_msg.classList.add('d-block');
  cmdline_msg.classList.remove('d-none');
  cmdline_msg.innerHTML = msg;
  emptyResults();
  return msg;
}
// CLEAR
const getDates = () => { 
  // Print Hijri date
  dselect("#hijri").value = getData().date.hijri;
  // Print Gregorian date
  dselect("#gregorian").value = getData().date.greg;
}
// CLEAR
const formValidator = (str="form") => {
  let valid = true;
  let forms = document.querySelectorAll(str)

  forms.forEach((form) => { 
    let inputs = form.querySelectorAll("input[required]");
    let selects = form.querySelectorAll("select[required]");
    
    if (inputs){
      inputs.forEach(input => {
        if (!input.value) {
          valid = false;
        }
      });
    }
    if (selects){
      selects.forEach(select => {
        if (!select.value) {
          valid = false;
        }
      });
    }
  });
  return valid;
}

const defineCurrencyData = (fundata) => {

  document.querySelectorAll("#formRates .col-auto input").forEach(input => {
    input.setAttribute('placeholder',`In ${fundata.currency.local}`);
  });

  // Print conversion label
  dselect('#convert label').innerHTML = `${fundata.currency.savings} to ${fundata.currency.local}`;

  // Replace currency signs of fund sources
  const sav_records = document.querySelectorAll('#formSavings .input-group')
  try {
    sav_records.forEach(record => { 
      record.querySelector('.input-group-prepend>.input-group-text').innerHTML = fundata.currency.signsav;
      record.querySelector('input').setAttribute('placeholder',`In ${fundata.currency.savings}`);
    });
  } catch (error) {
    console.log('Error in saving records', error.message);      
  }
}

const printRatesNQuorum = (fundata) => {
  dselect("#cmdline-rates").innerHTML = `<strong>Rates</strong>
${fundata.currency.savings}: <span class="text-info">${fundata.currency.signloc}${fundata.rate.usd}</span> ${fundata.currency.local}   Gold: <span class="text-info">${fundata.currency.signloc}${fundata.rate.gold}</span> ${fundata.currency.local}   Silver: <span class="text-info">${fundata.currency.signloc}${fundata.rate.silver}</span> ${fundata.currency.local}

<strong>Annum Quorum</strong>
Gold Quorum: ${fundata.currency.signloc}${fundata.rate.gold} x 85 = <span class="text-info">${fundata.currency.signloc}${getQuorum().gold.quorloc}</span> ${fundata.currency.local}   = <span class="text-success">${fundata.currency.signsav}${getQuorum().gold.quorsav}</span> ${fundata.currency.savings}  
Silver Quorum: ${fundata.currency.signloc}${fundata.rate.silver} x 600 = <span class="text-info">${fundata.currency.signloc}${getQuorum().silver.quorloc}</span> ${fundata.currency.local}  = <span class="text-success">${fundata.currency.signsav}${getQuorum().silver.quorsav}</span> ${fundata.currency.savings}\n\n`;
}

const totalSavings = () => {
  let total = 0;
  
  document.querySelectorAll(
   `#formSavings .fndsrc-row input[required], 
    #formSavings .fndsrc-grp-header input[required]`
    ).forEach( input => {
        total += parseFloat(input.value);
  });
  return total;
}

const printSavings = (fundata) => {

  removeAllSavingsChildNodes(dselect('#cmdline-savings tbody'));

  document.querySelectorAll('#savingsTable tr:not(.template)').forEach( form_row => {
    if(!form_row.classList.contains('fndsrc-grp-body')) {
        if(form_row.classList.contains('fndsrc-subrow')) {
          printARow(form_row, 'pl-4');
        } else {
          printARow(form_row);
        }
    }
  });
}

const printARow = (form_row, cls="pl-0") => {
  const print_table = dselect('#cmdline-savings tbody');
  const print_row = dselect('#cmdline-savings tbody .savrow.template').cloneNode(true);
  const td1 = print_row.querySelector('td:nth-child(1)');
  const td2 = print_row.querySelector('td:nth-child(2)');
  
  print_row.classList.remove('d-none', 'template');
  if (cls === "pl-4")
    print_row.classList.add('text-muted');
  td1.classList.add(cls);
  td2.classList.add(cls);
  td1.innerHTML = form_row.querySelector('label').innerHTML;
  td2.innerHTML = getData().currency.signsav + form_row.querySelector('input').value;
  print_table.appendChild(print_row);
}
const printZakat = (fundata) => {
  if (totalSavings() >= getQuorum().gold.quorsav) {
    dselect("#cmdline-result").innerHTML = `
------------------------------------------------------
Total Savings   <span class="text-success">${fundata.currency.signsav}${totalSavings()}</span>

<strong>Zakat</strong>
${fundata.currency.signsav}${totalSavings()} x 0.025 = ${fundata.currency.signsav}${Math.ceil(totalSavings() * 0.025)}

<span>Your Zakat for this Hijri year <span class="text-success">${fundata.date.hijriyr}</span> is: 
<strong class="text-success h3">${fundata.currency.signsav}${Math.ceil(totalSavings() * 0.025)} ${fundata.currency.savings}</strong> </span>
  `;
  } 
  else {
dselect("#cmdline-result").innerHTML = ` 
------------------------------------------------------
Total Savings   <span class="text-success">${fundata.currency.signsav}${totalSavings()}</span>

<strong>Zakat</strong>
${fundata.currency.signsav}${totalSavings()} < ${fundata.currency.signsav}${getQuorum().gold.quorsav}

<span>Your total savings are less than the gold quorum!</span>
<span>Your Zakat for this Hijri year <span class="text-success">${fundata.date.hijriyr}</span> is: 
<strong class="text-success h3">${fundata.currency.signsav}0 ${fundata.currency.savings}</strong> </span>
  `;
  }
}

function removeAllSavingsChildNodes(parent) {
  parent.querySelectorAll('tr:not(.template)').forEach(row => {
    parent.removeChild(row);
  });
}

const zakalc = (fundata) => {
  // if formValidator() with currency form is true
  if (formValidator('#formCurrency')) {
    getDates();
    defineCurrencyData(getData());
    let msg = msgSuccess('<i class="fa fa-check"></i> Currencies have been defined.\n');
    msgError('2. Please fill in all the Rates form fields.\n');

    if (formValidator('#formRates')) {
      msg = msgSuccess(msg + '<i class="fa fa-check"></i> Rates have been calculated.\n');
      msgError('3. Please add new fields to My Savings form.\n   List saving sources (i.e Wallet, Safe, Bank, etc.)\nClick the Zakalc button when you\'re ready\n');
      dselect('#bigGreen').focus();

      if (formValidator('#formSavings')) {
        if (!dselect('#formSavings input[required]')) {
          msgError('3. Please add new fields to My Savings form.\n   List saving sources (i.e Wallet, Safe, Bank, etc.)\nClick the Zakalc button when you\'re ready\n');
          return false;
        } else {
          msgSuccess(msg + '<i class="fa fa-check"></i> Your savings have been calculated.\n\n');
          // dselect('#cmdline-msg .msg-success').classList.add('d-none');
          // dselect('#cmdline-msg .msg-success').classList.remove('d-block');
          dselect('#cmdline-msg .msg-error').classList.add('d-none');
          dselect('#cmdline-msg .msg-error').classList.remove('d-block');

          printRatesNQuorum(getData());
          printSavings(getData());
          printZakat(getData());
          revealResults();
          return true;
        }
      } else {
        msgError('3. Please fill in the added fields in My Savings form.\n');
        return false;
      }
    } else {
      msgError('2. Please fill in all the Rates form fields.\n');
      return false;
    }
  } else {
    msgSuccess('');
    msgError('1. Please fill in the Currency form fields.\n');
    return false;
  }
}


/**
 * Event Listeners
 * 
 */
// Activate delete button for new fields
const activateDelBtn = (button) => {
  button.addEventListener('click', function(event){
    const row = event.target.parentNode.closest('.fndsrc');
    if (row.classList.contains("fndsrc-grp-header")) {
      if(confirm("Attention!\nYou are about to delete a field group.\nAre you sure you want to delete this field group?")) {
        row.parentNode.removeChild(row.nextElementSibling);
        row.parentNode.removeChild(row);
      }
    } else {
      if(confirm("Are you sure you want to delete this input?")) row.parentNode.removeChild(row);
    }
  });
}

// Focuses on input child of passed parent
const focusInputOf = (row) => {
  setTimeout(function(){
    row.querySelector('input').focus();
  }, 250);
}

// Create new row on clicking Add button
dselect('.btn-addsrc').addEventListener('click', function(event){
  const newlabel = prompt("New field label:");
  if(newlabel) {
    const main_list = dselect('#savingsTable tbody');
    const new_row = dselect('.fndsrc-row.template').cloneNode(true);
    
    new_row.classList.remove('d-none', 'template');
    new_row.querySelector('label').innerHTML = newlabel;
    new_row.querySelector('input').setAttribute('required','true');
    main_list.appendChild(new_row);
    
    activateDelBtn(new_row.querySelector('.btn-delsrc'));  
    focusInputOf(new_row);
  }
});

// Create new group on clicking Add Group button
dselect('.btn-addsrc-grp').addEventListener('click', function(event){
  const newlabel = prompt("New field label:");
  if(newlabel) {
    const main_list = dselect('#savingsTable tbody');
    
    // 1. Create group header
    const new_grp_header = dselect('#savingsTable tbody .fndsrc-grp-header.template').cloneNode(true);
    new_grp_header.classList.remove('d-none', 'template');
    new_grp_header.querySelector('label').innerHTML = newlabel;
    new_grp_header.querySelector('input').setAttribute('required','true');
    main_list.appendChild(new_grp_header);
    activateDelBtn(new_grp_header.querySelector('.btn-delsrc'));        
    
    // 2. Create group body
    const new_grp_body = dselect('#savingsTable tbody .fndsrc-grp-body.template').cloneNode(true);
    new_grp_body.classList.remove('d-none', 'template');
    main_list.appendChild(new_grp_body);

    const btngrp_add =  new_grp_body.querySelector('.btn-success');
    $(btngrp_add).tooltip();
    btngrp_add.focus();
    activateDelBtn(new_grp_body.querySelector('.btn-delsrc'));

    // On clicking mini add button, add a new sub-row
    new_grp_body.querySelector('.btn-addsrc-sub').addEventListener('click', function(event){
      const newlabel = prompt("New field label:");
      if(newlabel) {
        const sub_list = event.target.parentNode.closest('.addsrc-sm').previousElementSibling.querySelector('tbody');
        const new_subrow = sub_list.querySelector('.fndsrc-subrow.template').cloneNode(true);
        
        new_subrow.classList.remove('d-none', 'template');
        new_subrow.querySelector('label').innerHTML = newlabel;
        new_subrow.querySelector('input').setAttribute('required','true');
        sub_list.appendChild(new_subrow);
        activateDelBtn(new_subrow.querySelector('.btn-delsrc'));     
        focusInputOf(new_subrow);

        // On blur of sub-field, get the sum of all subfields and print sum in its header input
        new_subrow.querySelector('input').addEventListener('blur', event => { 
          let sum = 0;
          let subbody = event.target.parentNode.closest('.fndsrc-grp-body');
          let prev_sibling = subbody.previousElementSibling;
          let sum_input = prev_sibling.querySelector('input');

          subbody.querySelectorAll('tr input[required]').forEach( inputitem => {
            if (inputitem.value)
              sum += parseFloat(inputitem.value);
          });
          sum_input.value = sum;
        });

      }
    });
  }
});

// On pressing Enter focus on field and sub-field
document.addEventListener('keydown', (event) => {
  if (event.key == 'Enter' &&
      document.activeElement.classList.value === 'form-control pr-1' && 
      formValidator('#formSavings')
      ) 
  { 
    event.preventDefault();
    document.activeElement.parentNode.closest('table').nextElementSibling.querySelector('.btn-success:not(.dropdown-toggle)').focus();
  }
});

// Print zakat data on clicking Calculate Zakat button
let btn_zakalc = dselect('#zakalc');
btn_zakalc.addEventListener('click', event =>{
    zakalc();
});

// Inject local currency name in form
let btn_currencies = dselect('#defineCurrency');
btn_currencies.addEventListener('click', ()=>{
  btn_zakalc.click();
});
