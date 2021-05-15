/**
 * In Pseudocode
 * 
function getData()
  create fundata object
    date
      greg:     from system
      hijri:    from system
    currency
      local     from Currency input
      signloc:  call getCurrSign() of input
      savings:  from Currency input
      signsav:  call getCurrSign() of input
    rate
      usd:      from Rates input
      gold:     from Rates input
      silver:   from Rates input
    quorum
      gold
        qcrloc: (gold * 85) in local currency
        qcrsav: calculate gold quorum in other currency
      silver
        qcrloc: (silver * 600) in local currency
        qcrsav: calculate silver quorum in other currency
      },

end function

onclick currencey submit button
  call submitforms()
onclick savings submit button
  call submitforms()

function zakalc()
  if formValidator() with currency form is true
    call getDates(): injects date into inputs
    call defineCurrencyData(): injects currency into inputs
    show msgSuccess()
    show msgError(): next form

    if formValidator() with rates form is true
      show msgSuccess()
      show msgError(): next form

      if formValidator() with savings form is true
        if savings form has no inputs[required]
          show msgError()
          return false 
        else
          hide all msgSuccess()'s
          hide all msgError()'s

          call printRatesNQuorum()
          call printSavings()
          call printZakat( totalSavings() >= getData.gold_quorum )
          return true
        end if
        
      else
        show msgError()
        return false 
      end if
      
    else 
      show msgError()
      return false
    end if
    
  else
    show msgError()
    return false
  end if

end function
*/
