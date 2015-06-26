var counter = 0;
var MONO_TON = 1;
var BI_TON = 2;
var TRI_TON = 3;
var photo_frame_loaded = false;
var load_new_model_done = false;
var load_new_model_year_done = false;
var global_search = false;
var available_color_type_special_id = [
    'SC',
    'VE',
    'LI'
];
var secf;
$.fn.jPicker.defaults.images.clientPath='/js/jpick/images/';

$(document).ready(function(){

    secf = $('#secure_x201');
    $('#color_group_code_pick').jPicker();
});

