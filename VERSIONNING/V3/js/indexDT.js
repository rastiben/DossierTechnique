$(document).ready(function () {
    $(".nav.navbar-nav").load("navbar.html");
    //GETCOMMERCIAL
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
    $(document).on("click", ".dropdown-menu.intervention li a", function () {
        var id = $(this).parent().parent().attr("id");
        var button = $("button.btn.dropdown-toggle.intervention");
        var newText = $(this).text() + ' <span class="caret"></span>';
        button.html(newText);
    });
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
    $(".btn.btn-default.dropdown-toggle").click(function () {
        if ($(".dropdown.dropdown-lg.resultAffaire").hasClass("open")) $(".dropdown.dropdown-lg.resultAffaire").toggleClass("open");
        else {
            $(".dropdown.dropdown-lg.filtre").toggleClass("open");
        }
        $("span.toggle").toggleClass("caret");
        $("span.toggle").toggleClass("caret-top");
    });
    $(document).on("click", ".datepicker table tbody tr td.day", function () {
        $(this).closest(".datepicker-days").css("display", "none");
    });
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
    $(".objets .list-group-item").click(function () {
        if ($(this).text() === "Poste") $(".etapes #1").toggleClass("visible");
        if ($(this).text() === "Sauvegarde") $(".etapes #2").toggleClass("visible");
        if ($(this).text() === "Firewall") $(".etapes #3").toggleClass("visible");
        if ($(this).text() === "Téléphonie") $(".etapes #4").toggleClass("visible");
        if ($(this).text() === "Office 365") $(".etapes #5").toggleClass("visible");
    });
    $(".etape").click(function () {
        if ($(this).attr("id") === "0") {
            $(".container.body.col-md-9.col-md-offset-1.col-sm-8.col-sm-offset-1").siblings().removeClass("visible");
            $("#1.container.body.col-md-9.col-md-offset-1.col-sm-8.col-sm-offset-1").addClass("visible");
        }
        if ($(this).attr("id") === "1") {
            $(".container.body.col-md-9.col-md-offset-1.col-sm-8.col-sm-offset-1").siblings().removeClass("visible");
            $("#2.container.body.col-md-9.col-md-offset-1.col-sm-8.col-sm-offset-1").addClass("visible");
        }
        if ($(this).attr("id") === "2") {
            $(".container.body.col-md-9.col-md-offset-1.col-sm-8.col-sm-offset-1").siblings().removeClass("visible");
            $("#3.container.body.col-md-9.col-md-offset-1.col-sm-8.col-sm-offset-1").addClass("visible");
        }
        if ($(this).attr("id") === "3") {
            $(".container.body.col-md-9.col-md-offset-1.col-sm-8.col-sm-offset-1").siblings().removeClass("visible");
        }
        if ($(this).attr("id") === "4") {
            $(".container.body.col-md-9.col-md-offset-1.col-sm-8.col-sm-offset-1").siblings().removeClass("visible");
        }
        if ($(this).attr("id") === "5") {
            $(".container.body.col-md-9.col-md-offset-1.col-sm-8.col-sm-offset-1").siblings().removeClass("visible");
        }
        if ($(this).attr("id") != null) {
            $(this).siblings().removeClass("active");
            $(this).addClass("active");
        }
    });
    $(".suivant").click(function () {
        var objets = $(".objets .list-group-item.active");
        var host = window.location.host;
        var getParam = "";
        var toto = objets.length;
        for (var i = 1; i < objets.length; i++) {
            getParam += "etape" + (i + 1) + "=" + $(objets[i]).text().toLocaleLowerCase() + "&";
        }
        getParam = getParam.substr(0, getParam.length - 1);
        window.location.replace("http://" + host + "/" + $(objets[0]).text().toLowerCase() + ".html?" + getParam);
    });
    var loadFile = function (url, callback) {
        JSZipUtils.getBinaryContent(url, callback);
    }
    $(".generer").click(function () {
        loadFile("examples/tagExample.docx", function (err, content) {
            if (err) {
                throw e
            };
            doc = new DocxGen(content);
            //GET POSTES
            var poste;
            var sauvegarde;
            //var listes = $(".objets .list-group-item.active");
            var postes = $(".objets .list-group-item.active:contains('Poste')").length > 0 ? "POSTES" : "";
            if (postes !== "") poste = getPostesVariables();
            var sauvegardes = $(".objets .list-group-item.active:contains('Sauvegarde')").length > 0 ? "SAUVEGARDES" : "";
            if (sauvegardes !== "") sauvegarde = getSauvegardeVariables();
            doc.setData({
                    "client": $("input.client").val()
                    , "adresse": $("textarea.adresse").val()
                    , "contact": $("input.contact").val()
                    , "intervention": $("button.intervention").text()
                    , "planPrepa": $("input.planPrepa").val()
                    , "planInstal": $("input.planInstal").val()
                    , "descriptif": $("textarea.descriptif").val()
                    , "affaire": $("input.affaire").val()
                    , "poste": poste
                    , "postes": postes
                    , "sauvegarde": sauvegarde
                    , "sauvegardes": sauvegardes
                }) //set the templateVariables
            doc.render() //apply them (replace all occurences of {first_name} by Hipp, ...)
            out = doc.getZip().generate({
                    type: "blob"
                }) //Output the document using Data-URI
            saveAs(out, "output.docx")
        })
    });
});
