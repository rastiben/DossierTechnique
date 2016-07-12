$(document).ready(function () {
    instantiationDossierTechnique();
    //GET AFFAIRE
    $(document).on("click", ".searchAffaire", function () {
        var commerial = $(".selectpicker").selectpicker('val');
        var date = $(".dateAffaire").val();
        $.ajax({
            url: 'http://localhost:8080/Convertir.asmx/GetAffaire'
            , type: "POST"
            , data: {
                Commercial: commerial
                , AnneeMois: date
            }
            , crossDomain: true
            , success: function (data) {
                $lesAffaires = $(data).find("string").text();
                $json = $.parseJSON($lesAffaires);
                $.each($json, function ($number, $obj) {
                    $(".dropdown.dropdown-lg.resultAffaire .list-group").append('<a href="#" id="' + $number + '" class="list-group-item tech">' + $obj + '</a>');
                });
                $(".dropdown.dropdown-lg.resultAffaire").toggleClass("open");
            }
        });
        $(".dropdown.dropdown-lg.filtre").toggleClass("open");
    });
    //GET CLIENT (ADRESSE - NOM - CONTACT)
    $(".dropdown-menu.dropdown-menu-right .list-group").on("click", ".list-group-item", function () {
        $("#affaire-search input:first").val($(this).html());
        $.ajax({
            url: 'http://localhost:8080/Convertir.asmx/GetClient'
            , type: "POST"
            , data: {
                Affaire: $(this).html()
            }
            , crossDomain: true
            , success: function (data) {
                var client = $(data).find("string").text();
                var json = $.parseJSON(client);
                //name adresse contact
                $(".client input").val(json["name"]);
                $(".adresse textarea").val(json["adresse"]);
                $(".contact input").val(json["contact"]);
            }
        });
    });
    $(document).on("click", ".datepicker table tbody tr td.day", function () {
        $(this).closest(".datepicker-days").css("display", "none");
    });
    //AFFICHER ETAPES EN FONCTION DES CHOIX DANS COMPOSANTS
    $(".objets .list-group-item").on("click", function () {
        if ($(this).text() === "Poste") $(".etapes #1").toggleClass("visible");
        if ($(this).text() === "Sauvegarde") $(".etapes #2").toggleClass("visible");
        if ($(this).text() === "Firewall") $(".etapes #3").toggleClass("visible");
        if ($(this).text() === "Téléphonie") $(".etapes #4").toggleClass("visible");
        if ($(this).text() === "Office 365") $(".etapes #5").toggleClass("visible");
    });
    //CHANGEMENT DU TEXTE DANS INTEVENTION EN FONCTION DU CHOIX FAIT
    $(document).on("click", ".dropdown-menu.intervention li a", function () {
        var id = $(this).parent().parent().attr("id");
        var button = $("button.btn.dropdown-toggle.intervention");
        var newText = $(this).text() + ' <span class="caret"></span>';
        button.html(newText);
    });
});

function instantiationDossierTechnique() {
    //GET COMMERCIAUX
    $.ajax({
        url: 'http://localhost:8080/Convertir.asmx/getCommercial'
        , type: "POST"
        , crossDomain: true
        , success: function (data) {
            $lesCommerciaux = $(data).find("string").text();
            $json = $.parseJSON($lesCommerciaux);
            $.each($json, function ($number, $obj) {
                $(".selectpicker").append("<option id=" + $number + ">" + $obj.toString() + "</option>");
            });
            $(".selectpicker").selectpicker('refresh');
        }
    });
    //MODIFIER ORIENTATION CARET
    $(".btn.btn-default.dropdown-toggle").click(function () {
        if ($(".dropdown.dropdown-lg.resultAffaire").hasClass("open")) $(".dropdown.dropdown-lg.resultAffaire").toggleClass("open");
        else {
            $(".dropdown.dropdown-lg.filtre").toggleClass("open");
        }
        $("span.toggle").toggleClass("caret");
        $("span.toggle").toggleClass("caret-top");
    });
    //...
    //INSTANTIATION DES DATEPICKERS
    $('.input-group.date.normal').datepicker({
        format: "DD dd MM yyyy"
        , language: "fr"
        , orientation: "bottom auto"
        , autoclose: true
    });
    $('.input-group.date.filtre').datepicker({
        format: "yyyy-mm"
        , language: "fr"
        , orientation: "bottom auto"
        , autoclose: true
        , startView: "years"
        , minViewMode: "months"
    });
};

function getValue(){
    client = $("input.client").val();
    adresse = $("textarea.adresse").val();
    contact = $("input.contact").val();
    intervention = $("button.intervention").text();
    plannificationP = $("input.planPrepa").val();
    plannificationI = $("input.planInstal").val();
    descriptif = $("textarea.descriptif").val();
    affaire = $("input.affaire").val();
};

function setValue(){
    $("input.client").val(client);
    $("textarea.adresse").val(adresse);
    $("input.contact").val(contact);
    $("button.intervention").text(intervention);
    $("input.planPrepa").val(plannificationP);
    $("input.planInstal").val(plannificationI);
    $("textarea.descriptif").val(descriptif);
    $("input.affaire").val(affaire);
};
