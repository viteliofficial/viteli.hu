$(document).ready(function(){

    $.getJSON("JSON/fejlesztők.json", function(data){
        console.log(data)

        $('.Név').html(data.Név);
        $('.Hozzáférés').html(data.Hozzáférés);
        $('.Verzió').html(data.weboldal_verzio);
        $('.update_info').html(data.update_info);
        $('.Születésnap').html(data.Születésnap);


    }).fail(function(){
        console.error("Hiba a Kódban!")
    })
})