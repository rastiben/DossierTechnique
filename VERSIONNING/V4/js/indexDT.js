$(document).ready(function () {
    $(".nav.navbar-nav").load("navbar.html");
    var client = "";
    var adresse = "";
    var contact = "";
    var intervention = "";
    var plannificationP = "";
    var plannificationI = "";
    var affaire = "";
    var descriptif = "";
    //var Composants = "";
    //GETCOMMERCIAL
    $(".etape").click(function () {
        //REMOVE CURRENT CONTAINER
        $(".container.body.col-md-9.col-md-offset-1.col-sm-8.col-sm-offset-1").empty();
        if ($(this).attr("id") != null) {
            $(".col-md-12.loading .etapes").after('<div class="loader-inner ball-clip-rotate text-center"><div></div></div>');
        }
        //GETVALUE
        if ($(this).siblings(".active").attr("id") === "0") {
            getValue();
        }
        if ($(this).siblings(".active").attr("id") === "1") {
            getPostesValue();
        }
        var toLoad = "";
        switch (parseInt($(this).attr("id"))) {
        case 0:
            toLoad = "dossierTechnique.html";
            break;
        case 1:
            toLoad = "poste.html"
            break;
        case 2:
            toLoad = "sauvegarde.html"
            break;
        }
        //LOAD NEXT CONTAINER
        $(".container.body.col-md-9.col-md-offset-1.col-sm-8.col-sm-offset-1").load(toLoad, function () {
            $(".loader-inner.ball-clip-rotate.text-center").nextAll().css("display", "none");
            switch (parseInt($(this).attr("id"))) {
            case 0:
                instantiationDossierTechnique();
                setValue();
                break;
            case 1:
                instantiationPoste();
                setPosteValue();
                break;
            }
            $(".loader-inner.ball-clip-rotate.text-center").nextAll().css("display", "block");
            $(".loader-inner.ball-clip-rotate.text-center").remove();
        });
        if ($(this).attr("id") === "2") {
            $(".container.body.col-md-9.col-md-offset-1.col-sm-8.col-sm-offset-1").load("sauvegarde.html");
        }
        if ($(this).attr("id") != null) {
            $(this).siblings().removeClass("active");
            $(this).addClass("active");
        }
    });
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
            getValue();
            doc.setData({
                    "client": client
                    , "adresse": adresse
                    , "contact": contact
                    , "intervention": intervention
                    , "planPrepa": plannificationP
                    , "planInstal": plannificationI
                    , "descriptif": descriptif
                    , "affaire": affaire
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
