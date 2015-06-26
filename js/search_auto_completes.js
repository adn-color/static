var secf;

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
        {model_id : model_id,
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




var global_search = true;
$(document).ready(function(){
    secf = $('#secure_x201');
    $.post(
        '/ajax/get_color_code_id',
        {
            secure_x201: secf.text()
        },
        function(data) {
            $('#main_color_code').html(data);
            $('#main_color_code').combobox({});
        }
    );


    $('#category_autocomplete').combobox({
        select: function(e, ui){
            load_brand_by_category_id(ui.item.value);
        }
    });
    //$('.datepicker').datepicker({'dateFormat': 'yy-mm-dd'});
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

    $(".photo_zoom").each( function(){
        $(this).elevateZoom(
            {
                zoomWindowPosition: 3,
                zoomWindowWidth: 400,
                zoomWindowHeight: 300,
                constrainType: 'width',
                constrainSize: 400

            });
    });


});



function load_brand_by_category_id(category_id){
    $.post(
        '/ajax/get_brand_by_category_id',
        {category_id: category_id ,
            secure_x201: secf.text()
        },
        function(data) {
            $('#brand_autocomplete').attr('disabled', false);
            $('#brand_autocomplete').html(data);
            $('#brand_autocomplete').combobox({
                select:function(e, ui){
                    load_models_by_brand_id(category_id, ui.item.value);
                }
            });
            $('#brand_autocomplete').next().children('input').val('');
        }
    );
}

function load_models_by_brand_id(cateory_id, brand_id){
    $.post('/ajax/get_model_by_brand_id',
        {brand_id: brand_id, cateory_id: cateory_id ,
            secure_x201: secf.text()
        },
        function(data) {
            if(data == "<option></option>" && !global_search){
                $('#add_new_model').click();
                return;
            }
            $("input[name='new_year']").hide();
            $("input[name='new_year']").attr("disabled", "disabled");
            $("input[name='new_model']").attr("disabled", "disabled");
            $("input[name='new_model']").hide();
            $('#year_autocomplete').show();
            $('#model_autocomplete').html(data);
            $('#model_autocomplete').attr('disabled', false);
            $('#model_autocomplete').combobox({
            select:function(e, ui){
                load_years_by_model(brand_id, ui.item.value);
            }
        });
    });
}

function load_years_by_model(brand_id, model){
    $.post('/ajax/get_year_by_model',
    {brand_id: brand_id, model: model,
        secure_x201: secf.text()
    },
    function(data) {
        $('#year_autocomplete').html(data);
        $('#year_autocomplete').attr('disabled', false);
        $('#year_autocomplete').combobox({
            select:function(e, ui){
                load_model_id();
            }
        });
    });
}

function load_model_id(){
    var brand_id = $('#category_autocomplete').val();
    var year = $('#year_autocomplete').val();
    var model = $('#model_autocomplete').val();

    $.post('/ajax/get_model_by_brand_id_and_model_name_and_year',
        {brand_id: brand_id, year: year ,model: model,
            secure_x201: secf.text()
        },
        function(data) {
            //var model = JSON.parse(data);
            var model_id = data.id;
            //alert(model_id);
            $('#year_autocomplete').parent().append('<input type="hidden" name="model_id" value="'+model_id+'" />');
        });
}















function show_link_model_multiton(tint_id){

    //if multiton
    if($('#is_multi_ton_select_'+tint_id).attr('rel') == '1'){
        $('#multiton_parts_zone').html('');
        $('#no_multiton_parts_zone').hide();

        $.post(
            '/ajax/show_link_model_multiton',
            {tint_id: tint_id},
            function(data) {
                $('#multiton_parts_zone').html(data);
            }
        );
    }else{
        $('#multiton_parts_zone').html('');
        $('#no_multiton_parts_zone').show();
    }



}