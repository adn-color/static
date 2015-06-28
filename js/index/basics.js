var secf;

$(document).ready(function(){
    secf = $('#secure_x201');
    $('.change-for').click(function(){
        $('body').css({'background': "top no-repeat url('"+$(this).children('img').attr('src')+"') black"});
    });

});
