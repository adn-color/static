var counter = 0;
var NUMBER_TON = 0;
var MONO_TON = '1';
var MULTI_TON = 'x';
var photo_frame_loaded = false;
var load_new_model_done = false;
var load_new_model_year_done = false;
var global_search = false;
var available_color_type_special_id = [
    'SC',
    'VE',
    'LI'
];

$.fn.jPicker.defaults.images.clientPath='/js/jpick/images/';
function load_final_color_code(brand_id){
    $.post(
        '/ajax/get_final_tints',
        {
            brand_id: brand_id,
            secure_x201: secf.text()
        },
        function(data) {
            $('#model_color_code').html(data);
        }
    );

}

function show_link_model_multiton(tint_id){

    //if multiton
    if($('#is_multi_ton_select_'+tint_id).attr('rel') == '1'){
        $('#multiton_parts_zone').html('');
        $('#main_tint_layer_info').html('');
        $.post(
            '/ajax/show_link_model_multiton',
            {
                tint_id: tint_id,
                secure_x201: secf.text()
            },
            function(data) {
                $('#multiton_parts_zone').html(data);
            }
        );
    }else{
        $('#multiton_parts_zone').html('');
        $('#main_tint_layer_info').html('');
    }
}


function getUrlParameter(sParam){
    var sPageURL = window.location.search.substring(1);
    var sURLVariables = sPageURL.split('&');
    for (var i = 0; i < sURLVariables.length; i++){
        var sParameterName = sURLVariables[i].split('=');
        if (sParameterName[0] == sParam){
            return sParameterName[1];
        }
    }
}
var secf;

$(document).ready(function(){
    secf = $('#secure_x201');
    $(".photo_zoom").each( function(){
        $(this).elevateZoom({
            zoomWindowPosition: 3,
            zoomWindowWidth: 400,
            zoomWindowHeight: 300,
            constrainType: 'width',
            constrainSize: 400

        });
    });
    $.post(
        '/ajax/get_color_code_id',
        {
            secure_x201: secf.text()
        },
        function(data) {
            $('#main_color_code').html(data);
            $('#main_color_code').combobox({});
            $('#main_color_code').next().children('input').attr('placeholder', 'Code');
        }
    );

    var url_category_id = getUrlParameter('category_id');
    var url_brand = getUrlParameter('brand');
    var url_model = decodeURIComponent(getUrlParameter('model')).replace( /\+/g, ' ');
    var url_year = getUrlParameter('year');
    var url_color_code = decodeURIComponent(getUrlParameter('color_code')).replace( /\+/g, ' ');
    var url_color_type = getUrlParameter('color_type');
    var url_color_group = getUrlParameter('color_group');
    var url_part = getUrlParameter('part');
    var url_packages = decodeURIComponent(getUrlParameter('tint_packagings')).split(',');
    var url_not_available_only = getUrlParameter('not_available_only');
    var url_available_only = getUrlParameter('available_only');

    if(url_not_available_only){
        $('#not_available_only').attr('checked', 'checked');
    }
    if(url_available_only){
        $('#available_only').attr('checked', 'checked');
    }

    if(url_packages){
        $('#packaging_checkboxes').find('input[name="tint_packagings[]"]').each(function(i, cb){
            if(url_packages.indexOf(cb.value) != -1){
                $(cb).attr('checked', 'checked');
            }
        });
    }

    if(url_color_group){
        $('select[name="color_group"]').find('option[value="'+url_color_group+'"]').attr("selected", "selected");
    }
    if(url_color_type){
        $('#color_type_menu_select').find('option[value="'+url_color_type+'"]').attr("selected", "selected");
    }
    if(url_part){
        $('select[name="part"]').find('option[value="'+url_part+'"]').attr("selected", "selected");
    }
    if(url_category_id){
        $.ajaxSetup({async: false});
        $('#category_autocomplete').find('option[value="'+url_category_id+'"]').attr("selected", "selected");
        $('#category_autocomplete').next().children('input').val($('#category_autocomplete').find('option[value="'+url_category_id+'"]').text());
        load_brand_by_category_id(url_category_id);
    }
    if(url_brand && url_category_id){
        if(url_category_id) {
            $('#brand_autocomplete').find('option[value="'+url_brand+'"]').attr("selected", true);
            $('#brand_autocomplete').next('span').children('input').val($('#brand_autocomplete').find('option[value="'+url_brand+'"]').text());
            load_models_by_brand_id(url_category_id, url_brand);
        }
    }
    if(url_model && url_brand && url_category_id){
        if(url_category_id && url_brand) {
            $('#model_autocomplete').find('option[value="'+url_model+'"]').attr("selected", "selected");
            $('#model_autocomplete').next('span').children('input').val(url_model);
            load_years_by_model(url_brand, url_model);
        }
    }
    if(url_year && url_model && url_brand && url_category_id){
        $('#year_autocomplete').find('option[value="'+url_year+'"]').attr("selected", "selected");
        $('#year_autocomplete').next('span').children('input').val(url_year);
    }
    if(url_color_code){
        $('#main_color_code').find('option[value="'+url_color_code+'"]').attr("selected", "selected");
        $('#main_color_code').next('span').children('input').val(url_color_code);
    }
    $.ajaxSetup({async: true});


    $('.alert-box-close').click(function(){
        $(this).parent().hide();
        return false;
    });

    var test = $('#id_constructor_type_default_add').val();
    if(test == 'on'){
        var some_value = $('#category_autocomplete_add').val();
        load_brand_by_category_id_add(some_value);
    }

    $('#model_color_code').combobox({
        select: function(e, ui){
            show_link_model_multiton(ui.item.value);
        }

    });

    $('#model_color_code').next().children('input').attr('placeholder', 'Code Couleur');
    $('#category_autocomplete').combobox({
        select: function(e, ui){
            load_brand_by_category_id(ui.item.value);
        }
    });
    $('#category_autocomplete').next().children('input').attr('placeholder', 'Categorie');

    $('#category_autocomplete_add').combobox({
        select: function(e, ui){
            load_brand_by_category_id_add(ui.item.value);
        }
    });
    $('#category_autocomplete_add').next().children('input').attr('placeholder', 'Categorie');

    if($('#id_constructor_type_default').attr('checked') == "checked"){
        var vall = $('#id_constructor_type_default').next().val();
        var vall2 = $('#id_constructor_type_default').next().next().val();
        $('#category_autocomplete option[value="'+vall+'"]').attr("selected", "selected");
        $('#category_autocomplete').next().children('input').val(vall2);

        load_brand_by_category_id(vall);
    }
    if($('#id_color_type_default').attr('checked') == "checked"){
        var vall = $('input[name="color_type_to_use_by_default"]').val();
        $('#color_type_menu_select').val(vall);
    }

    $('#color_group_code_pick').jPicker();
});

/*
$(document).on('change', '.possible_add_new', function(){
    if($(this).val() == 'adn_new'){
        show_add_pop_up($(this).attr('name'))
    }
});
*/
function hexToRgb(hex) {
    var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16)
    } : null;
}

$(document).on('change', '#color_group_code', function(){
    var rel = $('#color_group_code option:selected').attr('rel');
    rel = hexToRgb('#'+rel);
    var rg = $.jPicker.List[0].color.active.val('rgb');

    $.jPicker.List[0].color.active.val('rgb', { r: rel.r, g: rel.g, b: rel.b});
});



$(document).on('change', '#color_type_menu_select', function(){
    function change_interface_add_linker(){
        '#title_adn_color_code_td'
        '#title_color_code_td'
        '#main_tint_name_title'
        '#adn_color_code_selection'
    }
    if($(this).find("option:selected").attr("class") == 'LI'
        || $(this).find("option:selected").attr("class") == 'SC'
        || $(this).find("option:selected").attr("class") == 'VE'
            ){
        interface_set_mono_couche();
        $('#photo_bank').hide();
    }else{
        interface_set_mono_couche(true);
        $('#photo_bank').show();
    }
});

function interface_set_mono_couche(reset){
    $('#adn_color_code_selection > option').each(function(){
        if(reset){
            $(this).removeAttr('disabled');
        }else {
            if($(this).val() != '1'){
                $(this).attr('disabled','disabled');
            }
        }
    });
}

$(document).on('click', '#add_new_model_year', function(){
    if($('#model_autocomplete').val() == 'Choisissez un Modele'){
        alert('Choisissez un model');
    }else
    if($('#model_autocomplete').val() == 'Choisissez un Modele'
        || $('#model_autocomplete').val() == ''){
        alert('Choisissez un model');
    } else{
        load_new_model_year();
    }
});

$(document).on('click', '#add_new_model', function(){
    if($('#brand_autocomplete').val() == 'Choisissez une Categorie'){
        alert('Choisissez une categorie');
    }else if($('#brand_autocomplete').val() == 'Choisissez une Categorie'
        || $('#brand_autocomplete').val() == ''){
        alert('Choisissez une Marque');
    } else{
        load_new_model($('#category_autocomplete').val(),
            $('#brand_autocomplete').val());
    }
});

$(document).on('click', '#photo_bank', function(){
    load_photo_frame();
    return false;
});

$(document).on('click', '#photo_bank_close', function(){
    $('#photo_frame').hide();
    return false;
});

$(document).on('click', '.del_photo_dyna', function(){
    $(this).parent().remove();
    return false;
});

$(document).on('click', '#add_photo_dynamic',function(){
    add_photo_dynamic();
    return false;
});

$(document).on('submit','#add_cons_wer', function(){
    $.post('/add/color_type',
        {
            add_new_color_type_input_name: $('#add_cons_wer_input_color_type').val(),
            secure_x201: secf.text()
        },
        function(response){

            $('#color_type_menu_select').prepend(
                '<option value="'+response.data+'">'
                    +$('#add_cons_wer_input_color_type').val()
                    +'</option>'
            );
            var options = $('#color_type_menu_select option');
            var arr = options.map(function(_, o) { return { t: $(o).text(), v: o.value }; }).get();
            arr.sort(function(o1, o2) { return o1.t > o2.t ? 1 : o1.t < o2.t ? -1 : 0; });
            options.each(function(i, o) {
                o.value = arr[i].v;
                $(o).text(arr[i].t);
            });

            $("#color_type_menu_select option").filter(function() {
                //may want to use $.trim in here
                return $(this).val() == response.data;
            }).prop('selected', true);
        });
    return false;
});

$(document).on('change', '#is_multi_couche_select', function(){
    var nb_layer = $('#is_multi_couche_select option:selected').val();
    $('#main_tint_layer_info').html('');
    if(nb_layer == 'B'){
        $.post(
            '/ajax/get_tint_list',
            {
                secure_x201: secf.text()
            },
            function(data) {
                $('#main_tint_layer_info').html('<p>'
                    +data
                    +'</p>');
            }
        );

    }else if(nb_layer == 'T'){
        $.post(
            '/ajax/get_tint_list',
            {
                secure_x201: secf.text()
            },
            function(data) {
                $('#main_tint_layer_info').html('<p>'
                    +data
                    +data
                    +'</p>');
            }
        );

    }
});

function remove_multiton_input(ton_cell_id){
    if(NUMBER_TON == 1){
        return;
    }
    $('#'+ton_cell_id).remove();
    NUMBER_TON = NUMBER_TON - 1;
}


$(document).on('change', '#adn_color_code_selection', function(){
    /*
    $("#main_color_code_and_tint_name").html('');
    */
    $('#is_multi_couche_select').show();
    if($(this).val() == MONO_TON){
        NUMBER_TON = 0;
        $("#main_color_code_and_tint_name").html('');
        $("#main_tint_layer_info").html('');
    }else{
        $("#main_tint_layer_info").html('');
        $('#is_multi_couche_select').hide();
        load_multiton();
    }
});

function load_multiton(){
    var main_color_code_and_tint_name = $('#main_color_code_and_tint_name');
    $.post(
        '/ajax/get_multi_ton_template',
        {
            number_ton: NUMBER_TON+1,
            secure_x201: secf.text()
        },
        function(data) {
            var some_p = document.createElement('div');
            $(some_p).html(data);
            main_color_code_and_tint_name.append(some_p);
            NUMBER_TON++;
            $('.layer_auto_select_2').combobox();
        });
}

function load_brand_by_category_id_add(category_id){
    $.post(
        '/ajax/get_brand_by_category_id',
        {
            category_id: category_id,
            secure_x201: secf.text()


        },
        function(data) {
            $('#brand_autocomplete_add').attr('disabled', false);
            $('#brand_autocomplete_add').html(data);
            $('#brand_autocomplete_add').combobox({});
            $('#brand_autocomplete_add').next().children('input').val('');
            $('#brand_autocomplete_add').next().children('input').attr('placeholder', 'Marque');
        }
    );
}
function load_brand_by_category_id(category_id){
    $.post(
        '/ajax/get_brand_by_category_id',
        {
            category_id: category_id ,
            secure_x201: secf.text()
        },
        function(data) {
            $('#brand_autocomplete').attr('disabled', false);
            $('#brand_autocomplete').html(data);
            $('#year_autocomplete').next().children('input').val("");
            $('#model_autocomplete').next().children('input').val("");
            $('#brand_autocomplete').combobox({
                select:function(e, ui){
                    load_models_by_brand_id(category_id, ui.item.value);
                }
            });
            $('#brand_autocomplete').next().children('input').val('');

            $('#brand_autocomplete').next().children('input').attr('placeholder', 'Marque');
        }
    );
}

function load_models_by_brand_id(cateory_id, brand_id){
    load_new_model_done = false;
    $.post('/ajax/get_model_by_brand_id',
        {
            brand_id: brand_id,
            cateory_id: cateory_id ,
            secure_x201: secf.text()
        },
        function(data) {
            load_final_color_code(brand_id);
            if(data == "<option></option>" ){
                $('#model_autocomplete').html(data);
                $('#model_autocomplete').next().children('input').val("");
                $('#year_autocomplete').html(data);
                $('#year_autocomplete').next().children('input').val("");
                $('#model_id_deee').remove();

                $('#add_new_model').click();
                return;
            }
            $("input[name='new_year']").hide();
            $("input[name='new_year']").attr("disabled", "disabled");
            $("input[name='new_model']").attr("disabled", "disabled");
            $("input[name='new_model']").hide();
            //$('#year_autocomplete').hide();
            $('#year_autocomplete').next().children('input').val("");
            $('#model_autocomplete').next().children('input').val("");
            $('#model_autocomplete').html(data);
            $('#model_autocomplete').attr('disabled', false);
            $('#model_autocomplete').combobox({
                select:function(e, ui){
                    load_years_by_model(brand_id, ui.item.value);
                }
            });
            $('#model_autocomplete').next().children('input').attr('placeholder', 'Modele');
        }
    );
}

function load_years_by_model(brand_id, model){
    load_new_model_done = false;
    $.post('/ajax/get_year_by_model',
    {
        brand_id: brand_id,
        model: model,
        secure_x201: secf.text()
    },
    function(data) {
        if(data == "<option></option>" ){
            alert();
            $('#year_autocomplete').html(data);
            $('#model_id_deee').remove();

            $('#year_autocomplete').next().children('input').val("");
            $('#add_new_model').click();
            return;
        }
        $('#year_autocomplete').next().children('input').val("");

        $('#year_autocomplete').html(data);
        $('#year_autocomplete').attr('disabled', false);
        $('#year_autocomplete').combobox({
            select:function(e, ui){
                load_model_id();
            }
        });
        $('#year_autocomplete').next().children('input').attr('placeholder', 'Année');
    });
}

function load_model_id(){
    var brand_id = $('#brand_autocomplete').val();
    //alert(brand_id);
    var year = $('#year_autocomplete').val();
    var model = $('#model_autocomplete').val();

    $.post('/ajax/get_model_by_brand_id_and_model_name_and_year',
        {
            brand_id: brand_id,
            year: year ,
            model: model,
            secure_x201: secf.text()
        },
        function(data) {
            //var model = JSON.parse(data);
            var model_id = data.id;
            //alert(model_id);
            $('#year_autocomplete').parent().append('<input type="hidden" id="model_id_deee" name="model_id" value="'+model_id+'" />');
        });
}


function load_new_model_year(){
    if(load_new_model_year_done){
        return;
    }
    $('#year_autocomplete').next().hide();
    $('#year_autocomplete').parent().append(
        '<input class="big_input" type="text" name="new_year"/>'
    );
    load_new_model_year_done = true;
}



function load_new_model(category_id, brand_id){
    if(load_new_model_done){
       return;
    }

    $("input[name='new_year']").attr("disabled", "");
    $("input[name='new_model']").attr("disabled", "");

    $('#model_autocomplete').next().hide();
    $('#model_autocomplete').hide();
    $('#year_autocomplete').next().hide();
    $('#year_autocomplete').hide();

    $('#model_autocomplete').parent().append(
        '<input class="big_input" type="text" name="new_model"/>'
    );
    $('#year_autocomplete').parent().append(
        '<input class="big_input" type="text" name="new_year"/>'
    );
    $('#year_autocomplete').attr("disabled", 'disabled');
    $('#model_autocomplete').attr("disabled", 'disabled');

    load_new_model_done = true;
}



function load_photo_frame(){
    $('#photo_frame').show();
}

function add_photo_dynamic(){
    $('#photo_dynamic_add_zone').append(
        '<p><input type="file" name="model_photo[]" /> <span class="del_photo_dyna">Supprimer</span></p>'
    );
}


function create_some_tag(tag){
    var a_tag = document.createElement('span');
    a_tag.innerHTML = tag || '';
    a_tag.style.fontFamily = 'Courier';
    a_tag.style.fontSize = '14px';
    a_tag.style.fontWeight= 'bold';
    return a_tag;
}

function create_tint_name_input(tint_name_input_id, tint_name_input_placeholder){
    var tint_name_input = document.createElement('input');
    tint_name_input.id = tint_name_input_id;
    tint_name_input.name = tint_name_input_id;
    tint_name_input.type = 'text';
    tint_name_input.placeholder = tint_name_input_placeholder;
    return tint_name_input;
}

function create_color_code_input(color_code_input_id, color_code_input_placeholder){
    var color_code_input = document.createElement('input');
    color_code_input.id = color_code_input_id;
    color_code_input.name = color_code_input_id;
    color_code_input.type = 'text';
    color_code_input.placeholder = color_code_input_placeholder;
    color_code_input.style.marginRight = "4px";
    color_code_input.style.marginLeft = "4px";
    return color_code_input;
}

$(document).on('click', '.qefibqibf', function(){
    var id = $(this).attr('id');
    $('.ghuij_'+id).toggle();
    $('#color_group_code_pick').jPicker();
});

function data_middle(Xwidth, Ywidth){
    var scrolledX, scrolledY;
    if( self.pageYOffset ) {
        scrolledX = self.pageXOffset;
        scrolledY = self.pageYOffset;
    } else if( document.documentElement && document.documentElement.scrollTop ) {
        scrolledX = document.documentElement.scrollLeft;
        scrolledY = document.documentElement.scrollTop;
    } else if( document.body ) {
        scrolledX = document.body.scrollLeft;
        scrolledY = document.body.scrollTop;
    }

    // Next, determine the coordinates of the center of browser's window

    var centerX, centerY;
    if( self.innerHeight ) {
        centerX = self.innerWidth;
        centerY = self.innerHeight;
    } else if( document.documentElement && document.documentElement.clientHeight ) {
        centerX = document.documentElement.clientWidth;
        centerY = document.documentElement.clientHeight;
    } else if( document.body ) {
        centerX = document.body.clientWidth;
        centerY = document.body.clientHeight;
    }
    var leftOffset = scrolledX + (centerX - Xwidth) / 2;
    var topOffset = scrolledY + (centerY - Ywidth) / 2;
    return [leftOffset, topOffset];
}

function add_tint_to_model_popup_close(){
    $('#add_tint_to_model_popup_box').remove();
    $('#add_tint_to_model_popup_background').remove();
    return false;
}

function add_tint_to_model_popup(model_id){
    $.post(
        '/ajax/add_tint_to_model_popup',
        {
            model_id : model_id,
            secure_x201: secf.text()
        },
        function(data) {
            var div2 = document.createElement('div');
            div2.id = "add_tint_to_model_popup_background";
            var r2 = div2.style;
            r2.position = "absolute";
            r2.width = "100%";
            r2.height = "100%";
            r2.display = "block";
            r2.zIndex = "100";
            r2.background = "black";
            r2.left = 0;
            r2.top = 0;

            var divx = document.createElement("div");
            divx.id = "add_tint_to_model_popup_box";
            var r=divx.style;
            var Offesets = data_middle(400, 300);
            r.left = Offesets[0] + 'px';
            r.top = Offesets[1] + 'px';
            r.position = 'absolute';
            r.display = "block";
            r.background = "white";
            r.padding = "5px";
            r.color = "black";
            r.border= "3px solid lightblue";
            r.width= "400px";
            r.minHeight= "300px";
            r.zIndex= "200";

            var title_close = document.createElement('p');
            var close = document.createElement('a');

            close.href = "javascript: void(0);";
            close.textContent = "fermer";
            close.style.float = "right";
            close.onclick = function(){
                return add_tint_to_model_popup_close();
            }
            title_close.textContent="Ajout de teinte au modele";
            title_close.style.fontSize="14px";

            title_close.appendChild(close);

            divx.appendChild(title_close);
            document.body.appendChild(div2);
            document.body.appendChild(divx);
            $('#add_tint_to_model_popup_box').append(data);

            return false;
        }
    );
    return false;
}


function delete_tint_from_model(tint_id){
    return window.confirm('Etes vous sure de vouloir supprimer la teinte?');
}
if($('#id_constructor_type_default').attr('checked') == "checked"){
    var vall = $('#id_constructor_type_default').next().val();
    var vall2 = $('#id_constructor_type_default').next().next().val();
    $('#category_autocomplete option[value="'+vall+'"]').attr("selected", "selected");
    $('#category_autocomplete').next().children('input').val(vall2);

    load_brand_by_category_id(vall);
}
if($('#id_color_type_default').attr('checked') == "checked"){
    var vall = $('input[name="color_type_to_use_by_default"]').val();
    //alert(vall);
    $('#color_type_menu_select').val(vall);
    //var vall2 = $('#id_color_type_default').next().next().val();
    //$('#color_type_menu_select').next().children('input').val(vall2);
}



/*
function show_add_pop_up(name){
    $.post('/ajax/get_add_popup',
        {name: name},
    function(data) {
        $(document.body).prepend(data);
    });
}

*/