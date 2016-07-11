$(document).ready(function () {
    //Nombre de postes
    var nombrePostes = 1;
    var id = 1;
    var parameters = [];
    //FUNCTIONS
    function ajoutPoste() {
        id += 1;
        var toAppend = $("div.poste.template").clone();
        toAppend.removeClass("template");
        toAppend.find(".posteNum span").text("Poste " + (id-1).toString());
        toAppend.css("display", "block");
        //CHANGE ID OF typeDePoste
        toAppend.find(".typeDePoste").attr("id", id);
        //CHANGE ID OF antivirus
        toAppend.find(".antivirus").attr("id", id);
        //CHANGE ID OF office
        toAppend.find(".office").attr("id", id);
        //CHANGE ID OF officeV
        toAppend.find(".officeV").attr("id", id);
        //CHANGE ID OF os
        toAppend.find(".os").attr("id", id);
        //CHANGE ID OF input[name="office"]
        toAppend.find('input[name="office"]').attr("id", id);
        //CHANGE ID OF input[name="sauvegarde"]
        toAppend.find('input[name="sauvegarde"]').attr("id", id);
        //CHANGE ID OF officediv
        toAppend.find('.officediv').attr("id", id);
        //CHANGE ID OF utilisateur
        toAppend.find('input[name="utilisateur"]').attr("id", id);
        //CHANGE ID OF input nomUser
        toAppend.find('input[name="nomUser"]').attr("id", id);
        //CHANGE ID OF div nomUser
        toAppend.find('div.nomUser').attr("id", id);
        //CHANGE ID OF nomContact
        toAppend.find('input[name="nomContact"]').attr("id", id);
        //CHANGE ID OF div nomContact
        toAppend.find('div.nomContact').attr("id", id);
        //CHANGE ID OF backup
        toAppend.find('.backup').attr("id", id);
        //CHANGE ID OF svg
        toAppend.find('.svg').attr("id", id);
        //CHANGE ID OF logiciels
        toAppend.find('.logiciels').attr("id", id);
        //CHANGE ID OF addLogiciel
        toAppend.find('.addLogiciel').attr("id", id);
        //CHANGE ID OF removeLogiciel
        toAppend.find('.removeLogiciel').attr("id", id);
        //CHANGE ID OF peripheriques
        toAppend.find('.peripheriques').attr("id", id);
        //CHANGE ID OF addPeripherique
        toAppend.find('.addPeripherique').attr("id", id);
        //CHANGE ID OF removePeripherique
        toAppend.find('.removePeripherique').attr("id", id);
        //CHANGE ID OF remplacement
        toAppend.find('.remplacement').attr("id", id);
        //CHANGE ID OF remplacement name
        toAppend.find('.remplacement').attr("name", "optradio" + id);
        //CHANGE ID OF ajout
        toAppend.find('.ajout').attr("id", id);
        //CHANGE ID OF ajout name
        toAppend.find('.ajout').attr("name", "optradio" + id);
        //CHANGE ID OF remplacementDiv
        toAppend.find('.remplacementDiv').attr("id", id);
        //SET ajout CHECKED
        toAppend.find('.ajout').prop('checked', true);
        $(".container.info").append(toAppend);
        $(".container.info").append('<div class="col-md-12"><hr></div>');
        toAppend.find("[type='checkbox']").bootstrapSwitch();
    };
    //Ajout d'un poste
    ajoutPoste();
    $(".genererPoste").click(function () {
        var nombreDePoste = $(".nbrPoste").val();
        //Faut t'il supprimer ou ajouter des postes par rapport a ce qu'il y a deja
        if (nombreDePoste <= nombrePostes) {
            for (nombrePostes; nombrePostes > nombreDePoste; nombrePostes--) {
                id -= 1;
                $(".container.info").find("hr:last").parent().remove();
                $(".container.info").find(".poste.col-md-12:last").remove();
            }
        }
        else {
            var nombreDePosteAjouter = nombreDePoste - nombrePostes;
            for (var i = 0; i < parseInt(nombreDePosteAjouter); i++) {
                ajoutPoste();
            }
        }
        nombrePostes = nombreDePoste;
    });
    $(document).on('switchChange.bootstrapSwitch', 'input[name="office"]', function (event, state) {
        var id = $(this).attr("id");
        state ? $("#" + id + ".officediv").css("display", "block") : $("#" + id + ".officediv").css("display", "none");
    });
    $(document).on('switchChange.bootstrapSwitch', 'input[name="sauvegarde"]', function (event, state) {
        var id = $(this).attr("id");
        state ? $("#" + id + ".backup").css("display", "block") : $("#" + id + ".backup").css("display", "none");
        state ? $("#" + id + ".svg").css("display", "block") : $("#" + id + ".svg").css("display", "none");
    });
    //Event choix du type de poste
    $(document).on("click", ".dropdown-menu.typeDePoste li a", function () {
        var id = $(this).parent().parent().attr("id");
        var button = $("button#" + id + ".btn.dropdown-toggle.typeDePoste");
        var newText = $(this).text() + ' <span class="caret"></span>';
        button.html(newText);
    });
    //Event choix de l'emplacement de l'antivirus
    $(document).on("click", ".dropdown-menu.antivirus li a", function () {
        var id = $(this).parent().parent().attr("id");
        var button = $("button#" + id + ".btn.dropdown-toggle.antivirus");
        var newText = $(this).text() + ' <span class="caret"></span>';
        button.html(newText);
    });
    //Event choix du type d'office
    $(document).on("click", ".dropdown-menu.office li a", function () {
        var id = $(this).parent().parent().attr("id");
        var button = $("button#" + id + ".btn.dropdown-toggle.office");
        var newText = $(this).text() + ' <span class="caret"></span>';
        button.html(newText);
    });
    //Event choix de la version d'office
    $(document).on("click", ".dropdown-menu.officeV li a", function () {
        var id = $(this).parent().parent().attr("id");
        var button = $("button#" + id + ".btn.dropdown-toggle.officeV");
        var newText = $(this).text() + ' <span class="caret"></span>';
        button.html(newText);
    });
    //Event choix de l'O.S
    $(document).on("click", ".dropdown-menu.os li a", function () {
        var id = $(this).parent().parent().attr("id");
        var button = $("button#" + id + ".btn.dropdown-toggle.os");
        var newText = $(this).text() + ' <span class="caret"></span>';
        button.html(newText);
    });
    //Event Ajout/Remplacement lors du clique sur remplacement
    $(document).on("click", ".remplacement", function () {
        var id = $(this).attr("id");
        $("#" + id + ".remplacementDiv").css("display", "block");
    });
    //Event Ajout/Remplacement lors du clique sur ajout
    $(document).on("click", ".ajout", function () {
        var id = $(this).attr("id");
        $("#" + id + ".remplacementDiv").css("display", "none");
    });
    //Event ajout d'un logiciel dans le tableau
    $(document).on("click", ".addLogiciel", function () {
        var id = $(this).attr("id");
        $(".logiciels#" + id + " tbody").append('<tr><th><input type="text" class="form-control" id="usr"> </th></tr>');
    });
    //Event suppression d'un logiciel dans le tableau
    $(document).on("click", ".removeLogiciel", function () {
        var id = $(this).attr("id");
        var numberOfLogiciels = $(".logiciels#" + id + " tbody tr").length;
        if (numberOfLogiciels > 0) $(".logiciels#" + id + " tbody tr:last").remove();
    });
    //Event ajout d'un peripherique dans le tableau
    $(document).on("click", ".addPeripherique", function () {
        var id = $(this).attr("id");
        $(".peripheriques#" + id + " tbody").append('<tr><th><input type="text" class="form-control" id="usr"> </th></tr>');
    });
    //Event supression d'un peripherique dans le tableau
    $(document).on("click", ".removePeripherique", function () {
        var id = $(this).attr("id");
        var numberOfLogiciels = $(".peripheriques#" + id + " tbody tr").length;
        if (numberOfLogiciels > 0) $(".peripheriques#" + id + " tbody tr:last").remove();
    });
    $(document).on('switchChange.bootstrapSwitch', 'input[name="utilisateur"]', function (event, state) {
        var id = $(this).attr("id");
        state ? $("div#" + id + ".nomUser").css("display", "block") : $("div#" + id + ".nomUser").css("display", "none");
        state ? $("div#" + id + ".nomContact").css("display", "block") : $("div#" + id + ".nomContact").css("display", "none");
    });
});

function getPostesVariables() {
    var postes = $(".poste").not(".template");
    var poste = [];
    $.each(postes, function ($number, $obj) {
        //OFFICE
        var office = $($obj).find("input[name='office']").prop('checked') ? "Oui" : "Non";
        var annee = "Non";
        var version = "";
        var licence = "";
        if (office === "Oui") {
            annee = $($obj).find("button#" + (parseInt($number) + 2) + ".btn.dropdown-toggle.office").text();
            version = "Version : " + $($obj).find("button#" + (parseInt($number) + 2) + ".btn.dropdown-toggle.officeV").text();
            licence = "Récupération licence : " + ($($obj).find("input[name='licence']").prop('checked') ? "Oui" : "Non");
        }
        //AJOUT - REMPLACEMENT
        var ajoutRemplacement = $($obj).find(".ajout").prop("checked");
        //"Ajout" : "Remplacement";
        if (ajoutRemplacement === false) {
            if ($($obj).find("input[name='recupDonnee']").prop("checked")) ajoutRemplacement = "Remplacement avec sauvegarde de donnée";
            else ajoutRemplacement = "Remplacement sans sauvegarde de donnée"
        }
        else {
            ajoutRemplacement = "Ajout";
        }
        //Nouvel Utilisateur
        var utilisateur = $($obj).find("input[name='utilisateur']").prop('checked') ? "Oui" : "Non";
        var nomUser = "";
        var nomContact = "";
        if (utilisateur === "Oui") {
            nomUser = $($obj).find("input[name='nomUser']").val();
            nomContact = $($obj).find("input[name='nomContact']").val();
        }
        //SAUVEGARDE
        var svg = $($obj).find("input[name='sauvegarde']").prop('checked') ? "Oui" : "Non";
        var backup = "";
        var destination = "";
        if (svg === "Oui") {
            backup = "Logiciel de backup : " + $($obj).find("input[name='backup']").val();
            destination = "Destination de sauvegarde : " + $($obj).find("input[name='destSvg']").val();
        }
        //Logiciels
        var logiciels = $($obj).find(".logiciels tbody tr");
        var logiciel = [];
        $.each(logiciels, function ($number, $obj) {
            logiciel[$number] = {
                "value": $(logiciels[$number]).find("input").val()
            };
        });
        //peripheriques
        var peripheriques = $($obj).find(".peripheriques tbody tr");
        var peripherique = [];
        $.each(peripheriques, function ($number, $obj) {
            peripherique[$number] = {
                "value": $(peripheriques[$number]).find("input").val()
            };
        });
        poste[$number] = {
            "title": $($obj).find(".posteNum span").text()
            , "os": $($obj).find("button#" + (parseInt($number) + 2) + ".btn.dropdown-toggle.os").text()
            , "type": $($obj).find("button#" + (parseInt($number) + 2) + ".btn.dropdown-toggle.typeDePoste").text()
            , "antivirus": $($obj).find("button#" + (parseInt($number) + 2) + ".btn.dropdown-toggle.antivirus").text()
            , "annee": annee
            , "version": version
            , "licence": licence
            , "ajoutRemplacement": ajoutRemplacement
            , "utilisateur": utilisateur
            , "nomUser": nomUser
            , "nomContact": nomContact
            , "svg": svg
            , "backup": backup
            , "destination": destination
            , "logiciels": logiciel
            , "peripheriques": peripherique
            , "commentaires": $($obj).find("textarea.commentaire").val()
        };
    });
    return poste;
}
