var secf;
$(function() {
    secf = $('#secure_x201');
    $('.unslider').unslider({
        speed: 600,
        delay: 5000,
        dots: true
    });

    $('#category').combobox({
        select: function(e, ui){
            load_brand_by_category_id(ui.item.value);
        }
    });
});


function popup(message){
    message = message.replace("\n", '<br />');

    var pp = document.createElement('p');
    pp.innerHTML = message;

    var div = document.createElement('div');
    div.id = "popup_1";
    div.style.position = 'absolute';
    div.style.width = '400px';
    div.style.height = '200px';
    div.style.background = 'url(/images/popup.png) no-repeat';
    div.style.backgroundPosition = '0 10px';
    div.style.left = "50%";
    div.style.top = "50%";
    div.style.margin = "-100px 0 0 -200px";
    div.style.padding = "10px";
    div.style.color = "white";

    var span = document.createElement('span');
    span.style.zIndex = 1000;
    span.style.background = 'url(/images/cross.png) no-repeat';
    span.style.height = "28px";
    span.style.width = "28px";
    span.style.float = "right";
    span.onclick = function(){
        $('#popup_1').remove();
    };

    var p = document.createElement('p');
    p.style.height = "28px";
    p.appendChild(span);

    div.appendChild(p);
    div.appendChild(pp);

    document.body.appendChild(div)
}


function load_brand_by_category_id(category_id){
    $.post(
        '/ajax/get_brand_by_category_id',
        {category_id: category_id ,
            secure_x201: secf.text()
        },
        function(data) {
            $('#customer_brand_id').attr('disabled', false);
            $('#customer_brand_id').html(data);
            $('#customer_brand_id').combobox({
                select:function(e, ui){
                    load_models_by_brand_id(category_id, ui.item.value);
                }
            });
            $('#customer_brand_id').next().children('input').val('');
            if(data == ttt){
                $('#customer_brand_id').next().children('input').attr('placeholder', 'Aucune Marque');
            }else{
                $('#customer_brand_id').next().children('input').attr('placeholder', 'Marque');
            }
        }
    );
}
var ttt = '<option></option>';
function load_models_by_brand_id(category_id, brand_id){
    $.post('/ajax/get_model_by_brand_id',
        {brand_id: brand_id, category_id: category_id,
            secure_x201: secf.text()
        },
        function(data) {
            $('#customer_model_id').html(data);
            $('#customer_model_id').attr('disabled', false);
            $('#customer_model_id').combobox({
                select:function(e, ui){
                    load_years_by_model(brand_id, ui.item.value);
                }
            });
            if(data == ttt){
                $('#customer_model_id').next().children('input').attr('placeholder', 'Aucun Modèle');
                popup('Désolé! \n' +
                    'Aucun modèle n\'a été trouvé avec vos critères. \n' +
                    'N\'hésitez pas à nous contacter!');
            }else{
                $('#customer_model_id').next().children('input').attr('placeholder', 'Modele');
            }


        });
}

function load_years_by_model(brand_id, model){
    $.post('/ajax/get_year_by_model',
        {brand_id: brand_id, model: model,
            secure_x201: secf.text()
        },
        function(data) {
            $('#customer_year').html(data);
            $('#customer_year').attr('disabled', false);

            $('#customer_year').combobox({
            //    select:function(e, ui){
            //        load_model_id();
            //    }
            });
            $('#customer_year').next().children('input').attr('placeholder', 'Année');
        });
}


function load_model_id(){
    var brand_id = $('#brand_autocomplete').val();
    var year = $('#year_autocomplete').val();
    var model = $('#model_autocomplete').val();

    $.post('/ajax/get_model_by_brand_id_and_model_name_and_year',
        {brand_id: brand_id, year: year ,model: model,
            secure_x201: secf.text()
        },
        function(data) {
            //var model = JSON.parse(data);
            var model_id = data.id;
            alert(model_id);

    });
}