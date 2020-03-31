jQuery(document).ready(function(){
    jQuery(".mainMenu li.hasChildren").append(`<span class="showSubMenu"></span>`);
    jQuery(".showSubMenu").click(function(){
        jQuery(this).parent().toggleClass("show");
    });

    jQuery(".menuToggle").click(function(){
        jQuery(".adminWrapper").toggleClass("mini");
    })
})