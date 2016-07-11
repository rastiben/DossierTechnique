$(document).ready(function () {
    //FUNCTIONS
    var nbServeur = 0;

    function addServeur() {
        nbServeur += 1;
        var newServeur = $(".tableServeurs tbody tr.template").clone();
        var newCommentary = $(".tableServeurs tbody tr.templateCommentary").clone();
        newServeur.removeClass("template");
        newServeur.css("display","table-row");
        newCommentary.css("display","table-row");
        //Changement de l'id du boutton VMHOTE et de la dropdown associé
        newServeur.find(".btn.dropdown-toggle.vmHote").attr("id", nbServeur);
        newServeur.find(".dropdown-menu.vmHote").attr("id", nbServeur);
        //Changement de l'id du boutton destination et de la dropdown associé
        newServeur.find(".btn.dropdown-toggle.destination").attr("id", nbServeur);
        newServeur.find(".dropdown-menu.destination").attr("id", nbServeur);
        //Changement de l'id du boutton destinationr et de la dropdown associé
        newServeur.find(".btn.dropdown-toggle.destinationR").attr("id", nbServeur);
        newServeur.find(".dropdown-menu.destinationR").attr("id", nbServeur);
        newCommentary.removeClass("templateCommentary");
        $(".tableServeurs tbody").append(newServeur);
        $(".tableServeurs tbody").append(newCommentary);
        newServeur.find("[type='checkbox']").bootstrapSwitch();
    };
    //$("[type='checkbox']").bootstrapSwitch();
    addServeur();
    $(document).on("click", ".dropdown-menu.vmHote li a", function () {
        var id = $(this).parent().parent().attr("id");
        var button = $("button#" + id + ".btn.dropdown-toggle.vmHote");
        var newText = $(this).text() + ' <span class="caret"></span>';
        button.html(newText);
    });
    $(document).on("click", ".dropdown-menu.destination li a", function () {
        var id = $(this).parent().parent().attr("id");
        var button = $("button#" + id + ".btn.dropdown-toggle.destination");
        var newText = $(this).text() + ' <span class="caret"></span>';
        button.html(newText);
    });
    $(document).on("click", ".dropdown-menu.destinationR li a", function () {
        var id = $(this).parent().parent().attr("id");
        var button = $("button#" + id + ".btn.dropdown-toggle.destinationR");
        var newText = $(this).text() + ' <span class="caret"></span>';
        button.html(newText);
    });
    $(".addServeur").click(function () {
        addServeur();
    });
    $(".removeServeur").click(function () {
        if ($(".tableServeurs tbody tr").length > 2) {
            $(".tableServeurs tbody tr:last").remove();
            $(".tableServeurs tbody tr:last").remove();
        }
    });
    $(document).on("keyup", "textarea", function () {
        autosize($(this));
    });
});

function getSauvegardeVariables() {
    var sauvegardes = $(".tableServeurs tbody tr").not(".template, .templateCommentary");
    var sauvegarde = [];
    var number = 0;
    for (var i = 0; i < sauvegardes.length; i += 2) {
        sauvegarde[number] = {
            "commentaires": $(sauvegardes[i + 1]).find(".commentaires").val()
            , "title": $(sauvegardes[i]).find(".nomServeur").val()
            , "vmHote": $(sauvegardes[i]).find("button.vmHote").text()
            , "volume": $(sauvegardes[i]).find(".volume").val()
            , "logiciel": $(sauvegardes[i]).find(".logiciel").val()
            , "svgFichiers": $(sauvegardes[i]).find("input[name='svgFichiers']").prop("checked") ? "Oui" : "Non"
            , "svgHyperV": $(sauvegardes[i]).find("input[name='svgHyperV']").prop("checked") ? "Oui" : "Non"
            , "destination": $(sauvegardes[i]).find("button.destination").text()
            , "replication": $(sauvegardes[i]).find("input[name='replication']").prop("checked") ? "Oui" : "Non"
            , "destinationR": $(sauvegardes[i]).find("button.destinationR").text()
        }
        number += 1;
    }
    return sauvegarde;
};
