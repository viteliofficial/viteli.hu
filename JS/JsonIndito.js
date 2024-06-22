$(document).ready(function(){

    $.getJSON("../JSON/fejlesztők.json", function(data){
        console.log(data)

        $('.Név').html(data.Név);
        $('.Hozzáférés').html(data.Hozzáférés);
        $('.Verzió').html(data.weboldal_verzio);
        $('.Születésnap').html(data.Születésnap);

    }).fail(function(){
        console.error("Hiba a Kódban!")
    })
})