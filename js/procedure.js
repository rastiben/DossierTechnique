$(document).ready(function () {
    $.ajax({
        url: 'https://srvmaint.viennedoc.com/ProceduresServices.asmx/getProcedures'
        , type: "POST"
        , crossDomain: true
        , success: function (data) {
            $lesProcedures = $(data).find("string").text();
            $json = $.parseJSON($lesProcedures);
            if (Cookies.get("admin")) {
                if (Cookies.get("admin").indexOf("1") >= 0) {
                    $(".container.tuiles").append('<div class="tuile col-md-4 addTuile">' + '<div class="display" style="background-color:#97bf0d">' + '<a class="glyphicon glyphicon-plus"></a>' + '<h5>Ajouter une tuile</h5></div>' + '</div>');
                }
            }
            $.each($json, function ($number, $obj) {
                if (Cookies.get("admin")) {
                    if (Cookies.get("admin").indexOf("1") >= 0) {
                        $(".container.tuiles").prepend('<div class="tuile col-md-4">' + '<div class="under" id="' + $obj["id"] + '"> <h4>Supprimer</h4> </div><div class="display texte" style="background-color:' + $obj["couleur"] + '">' + '<h5 class="texte">' + $obj["texte"] + '</h5> </div>' + '<div class="tuileHover col-md-12">' + '<div class="icons"></div>' + '<div class="buttons">' + '<a href="' + $obj["lienPDF"] + '" target="_blank" class="btn btn-primary see">' + '<div href="#"><span class="glyphicon glyphicon-eye-open"></span> </div>' + '</a>' + '<a href="' + $obj["lienWORD"] + '" class="btn btn-success download">' + '<div href="#"><span class="glyphicon glyphicon-save"></span> </div>' + '</a>' + '</div>' + '</div>' + '</div>');
                    }
                }
                else {
                    $(".overlay").remove();
                    $(".container.tuiles").prepend('<div class="tuile col-md-4">' + '<div class="display" style="background-color:' + $obj["couleur"] + '">' + '<h5>' + $obj["texte"] + '</h5> </div>' + '<div class="tuileHover col-md-12">' + '<div class="icons"></div>' + '<div class="buttons">' + '<a href="' + $obj["lienPDF"] + '" target="_blank" class="btn btn-primary see">' + '<div href="#"><span class="glyphicon glyphicon-eye-open"></span> </div>' + '</a>' + '<a href="' + $obj["lienWORD"] + '" class="btn btn-success download">' + '<div href="#"><span class="glyphicon glyphicon-save"></span> </div>' + '</a>' + '</div>' + '</div>' + '</div>');
                }
            });
        }
        , error: function (xhr, status, error) {
            alert(error); //do something if there is an error
        }
    });
    $('#cp1').colorpicker();
    $(document).on("click", ".addTuile", function () {
        $("#addTuile-Modal").modal("toggle");
    });
    $(".send-procedure").click(function () {
        //http://localhost:54071/WebService.asmx/uploadfile
        var data = new FormData();
        var files = $(".fichierPDF").get(0).files;
        if (files.length > 0) {
            data.append("UploadedPDF", files[0]);
        }
        files = $(".fichierWORD").get(0).files;
        if (files.length > 0) {
            data.append("UploadedWORD", files[0]);
        }
        var ajaxRequest = $.ajax({
            type: "POST"
            , url: "https://srvmaint.viennedoc.com/ProceduresServices.asmx/uploadfile"
            , contentType: false
            , processData: false
            , data: data
        });
        var texte = $("input.texte").val();
        var couleur = $("input.couleur").val();
        var fichierPDF = $("input.fichierPDF").val().split('\\').pop();
        var fichierWORD = $("input.fichierWORD").val().split('\\').pop();
        $.ajax({
            type: "POST"
            , url: "https://srvmaint.viennedoc.com/ProceduresServices.asmx/addProcedures"
            , data: {
                texte: texte
                , couleur: couleur
                , lienPDF: fichierPDF
                , lienWORD: fichierWORD
            }
            , success: function (data) {
                $("#addTuile-Modal").modal("toggle");
                $(".container.tuiles").prepend('<div class="tuile col-md-4">' + '<div class="under"> <h4>Supprimer</h4> </div><div class="display texte" style="background-color:' + couleur + '">' + '<h5 class="texte">' + texte + '</h5> </div>' + '<div class="tuileHover col-md-12">' + '<div class="icons"></div>' + '<div class="buttons">' + '<a href="" target="_blank" class="btn btn-primary see">' + '<div href="#"><span class="glyphicon glyphicon-eye-open"></span> </div>' + '</a>' + '<a href="" class="btn btn-success download">' + '<div href="#"><span class="glyphicon glyphicon-save"></span> </div>' + '</a>' + '</div>' + '</div>' + '</div>');
            }
        });
    });
    $(".gererlesprocedures").click(function () {
        $(this).text($(this).text() == "Gerer les procédures" ? "Arreter la gestion" : "Gerer les procédures");
        if ($(".display").css("margin-top") == "0px") {
            $(".display.texte").css("margin-top", "-35px");
            $(".tuile h5.texte").css("margin-top", "75px");
            $(".buttons").css("margin-top", "55px");
        }
        else {
            $(".display.texte").css("margin-top", "0px");
            $(".tuile h5.texte").css("margin-top", "50px");
            $(".buttons").css("margin-top", "30px");
        }
    });
    $(document).on("click",".under",function () {
        var id = $(this).attr("id");
        var toRemove = $(this).closest(".tuile");
        $.ajax({
            type: "POST"
            , url: "https://srvmaint.viennedoc.com/ProceduresServices.asmx/removeProcedures"
            , data: {
                id:id
            }
            , success: function (data) {
                //toRemove.remove();
                toRemove.hide('slow', function(){ $target.remove(); });
            }
        });
    });
});
