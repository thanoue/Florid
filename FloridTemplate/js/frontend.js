

jQuery(document).ready(function(){
    

    // custom number input
    jQuery('<div class="quantity-button quantity-down">-</div>').insertBefore('.prodQuantity input');
    jQuery('<div class="quantity-button quantity-up">+</div>').insertAfter('.prodQuantity input');
    jQuery('.prodQuantity').each(function() {
        var spinner = jQuery(this),
            input = spinner.find('input[type="number"]'),
            btnUp = spinner.find('.quantity-up'),
            btnDown = spinner.find('.quantity-down'),
            min = input.attr('min');
  
        btnUp.click(function() {
            var oldValue = parseFloat(input.val());
            var newVal = oldValue + 1;
            spinner.find("input").val(newVal);
            spinner.find("input").trigger("change");
            });
  
        btnDown.click(function() {
          var oldValue = parseFloat(input.val());
          if (oldValue <= min) {
            var newVal = oldValue;
          } else {
            var newVal = oldValue - 1;
          }
          spinner.find("input").val(newVal);
          spinner.find("input").trigger("change");
        });
  
    });
})
function popUp(e){
    jQuery("body").append("<div class='overlay-dark'></div>");
    var popup_id = "#"+e; 
    jQuery(popup_id).fadeIn(350); 
    jQuery(".overlay-dark").click(function(){
        jQuery(popup_id).hide(250);
        jQuery(this).remove();
    });
}
function customerSupport(e){
    jQuery("body").append("<div class='overlay-dark'></div>");
        jQuery(".customer-support").css({
            "left":"0",
            "opacity":"1"
        });
        jQuery(".overlay-dark").click(function(){
            jQuery(".customer-support").css({
                "left":"-80vw",
                "opacity":"0"
            });
            jQuery(this).remove();
        });
}
function slideUp(e)
{
    jQuery("body").append("<div class='overlay-dark'></div>");
    var slideup_id = "#"+e; 
    jQuery(slideup_id).slideDown(350);
    jQuery(".overlay-dark").click(function(){
        jQuery(slideup_id).slideUp(250);
        jQuery(this).remove();
    });
}