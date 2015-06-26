var global_search = true;
var secf;


function load_brand_by_category_id(category_id){
    $.post(
        '/module/ajax/get_brand_by_category_id',
        {
            category_id: category_id,
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
    $.post('/module/ajax/get_model_by_brand_id',
        {
            brand_id: brand_id,
            cateory_id: cateory_id,
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
    $.post('/module/ajax/get_year_by_model',
    {
        brand_id: brand_id,
        model: model,
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

    $.post('/module/ajax/get_model_by_brand_id_and_model_name_and_year',
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
            $('#year_autocomplete').parent().append('<input type="hidden" name="model_id" value="'+model_id+'" />');
        });
}


$(document).ready(function(){

    secf = $('#secure_x201');
    $('#category_autocomplete').combobox({
        select: function(e, ui){
            load_brand_by_category_id(ui.item.value);
        }
    });

});
