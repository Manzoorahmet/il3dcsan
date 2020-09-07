var $registrationForm = $('#myForm');
if($registrationForm.length){
  $registrationForm.validate({
      rules:{
          address: {
              required: true
          },
          state: {
              required: true
          },
          zipCode: {
              required: true
          },
          city: {
              required: true
          },
          sqFootage: {
              required: true
          },
          access: {
              required: true
          },
          orderType: {required: true}
          
      },
      errorPlacement: function(){
        return false;  // suppresses error message text
    },
    highlight: function(element) {
        // 

        if($(element).attr('type') == 'radio'){
            $(element.form).find("input[type=radio]").each(function(which){
                $(element.form).find("label[for=" + this.id + "]").addClass('input-error');
                $(this).addClass('input-error');
            });
        } else {
           $(element).css('background', '#ffdddd');
        }


    },
    unhighlight: function(element) {
        //

        if($(element).attr('type') == 'radio'){
            $(element.form).find("input[type=radio]").each(function(which){
                $(element.form).find("label[for=" + this.id + "]").removeClass('input-error');
                $(this).removeClass('input-error');
            });
        }else {
             $(element).css('background', '#ffffff')
        }
    }

  });
}




// Contact form
var $contactForm = $('#contactForm');
if($contactForm.length){
  $contactForm.validate({
      rules:{
          firstName: {
              required: true
          },
          lastName: {
              required: true
          },
          email: {
              required: true
          },
          message: {
              required: true
          }
          
      },
      errorPlacement: function(){
        return false;  // suppresses error message text
    },
    highlight: function(element) {
           $(element).css('background', '#ffdddd');

    },
    unhighlight: function(element) {
       
             $(element).css('background', '#ffffff')
    }

  });
}


// Order 4 page (client-details) form
var $messageForm = $('#messageForm');
if($messageForm.length){
  $messageForm.validate({
      rules:{
          firstName: {
              required: true
          },
          lastName: {
              required: true
          },
          email: {
              required: true
          },
          companyName: {
              required: true
          },
          phoneNumber: {required: true}
          
      },
      errorPlacement: function(){
        return false;  // suppresses error message text
    },
    highlight: function(element) {
           $(element).css('background', '#ffdddd');

    },
    unhighlight: function(element) {
       
             $(element).css('background', '#ffffff')
    }

  });
}


