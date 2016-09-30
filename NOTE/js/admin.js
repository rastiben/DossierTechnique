$(document).ready(function () {
    var admins;
    var admin;
    var id;
    var lastId;
    $('.selectpicker').selectpicker();
    $.ajax({
        url: 'https://srvmaint.viennedoc.com/NotesService.asmx/getAdmins'
        , type: "GET"
        , crossDomain: true
        , success: function (data) {
            $lesAdmins = $(data).find("string").text();
            $json = $.parseJSON($lesAdmins);
            admins = $json;
            $.each($json, function ($number, $obj) {
                $("tbody").append('<tr id="' + $number + '"><td>' + $obj["login"] + '</td><td>' + $obj["MDP"] + '</td><td><a href="#" class="btn btn-primary modifier" style="width:40px"><span class="glyphicon glyphicon-pencil"></span> </a></td><td><a href="#" class="btn btn-danger supprimer"><span class="glyphicon glyphicon-trash"></span> </a></td></tr>');
                lastId = $number;
            });
        }
        , error: function (xhr, status, error) {
            alert(error); //do something if there is an error
        }
    });
    $(document).on("click", ".modifier", function () {
        id = $(this).closest("tr").attr("id");
        admin = admins[id];
        $("#exampleModal").modal('toggle');
        $(".input-login").val(admin["login"]);
        $(".input-mdp").val(admin["MDP"]);
    });
    $(document).on("click", ".supprimer", function () {
        id = $(this).closest("tr").attr("id");
        admin = admins[id];
        $(".remove").modal("toggle");
    });
    $(".modifier-admin").click(function () {
        var login = $(".input-login").val();
        var mdp = $(".input-mdp").val();
        var idAdmin = admin["_id"];
        $.ajax({
            url: 'https://srvmaint.viennedoc.com/NotesService.asmx/changeLoginMDP'
            , type: "POST"
            , data: {
                id: idAdmin
                , login: login
                , mdp: mdp
            }
            , crossDomain: true
            , success: function (data) {
                $("#exampleModal").modal('toggle');
                $("tr#" + id + " td:nth-child(1)").text(login);
                $("tr#" + id + " td:nth-child(2)").text(mdp);
            }
        });
    });
    $(".remove-admin").click(function () {
        var idAdmin = admin["_id"];
        $.ajax({
            url: 'https://srvmaint.viennedoc.com/NotesService.asmx/removeAdmin'
            , type: "POST"
            , data: {
                id: idAdmin
            }
            , crossDomain: true
            , success: function (data) {
                $(".remove").modal("toggle");
                $("tr#" + id).remove();
            }
        });
    });
    $(".ajout-admin").click(function () {
        $("#ajoutAdmin").modal("toggle");
    });
    $(".ajouter-admin").click(function () {
        //addAdmin
        var login = $(".input-newLogin").val();
        var mdp = $(".input-newMdp").val();
        $.ajax({
            url: 'https://srvmaint.viennedoc.com/NotesService.asmx/addAdmin'
            , type: "POST"
            , data: {
                login: login
                , mdp: mdp
            }
            , crossDomain: true
            , success: function (data) {
                $("#ajoutAdmin").modal('toggle');
                $("tbody").append('<tr id="' + (lastId + 1) + '"><td>' + login + '</td><td>' + mdp + '</td><td></td><td></td></tr>')
            }
        });
    });
    $(".refresh-admin").click(function () {
        $("tbody").empty();
        $.ajax({
            url: 'https://srvmaint.viennedoc.com/NotesService.asmx/getAdmins'
            , type: "GET"
            , crossDomain: true
            , success: function (data) {
                $lesAdmins = $(data).find("string").text();
                $json = $.parseJSON($lesAdmins);
                admins = $json;
                $.each($json, function ($number, $obj) {
                    $("tbody").append('<tr id="' + $number + '"><td>' + $obj["login"] + '</td><td>' + $obj["MDP"] + '</td><td><a href="#" class="btn btn-primary modifier" style="width:40px"><span class="glyphicon glyphicon-pencil"></span> </a></td><td><a href="#" class="btn btn-danger supprimer"><span class="glyphicon glyphicon-trash"></span> </a></td></tr>');
                    lastId = $number;
                });
            }
            , error: function (xhr, status, error) {
                alert(error); //do something if there is an error
            }
        });
    });
    //GESTION DE LA SIDEBAR
    $(document).on("click", ".glyphicon-chevron-left", function () {
        //SET TO 70PX
        $("#sidebar-wrapper").css("width", "70px");
        $(".glyphicon-chevron-left").toggleClass("glyphicon-chevron-left glyphicon-chevron-right");
        $(".col-md-sidebar").toggleClass("col-md-2 col-md-1 col-xs-2 col-xs-1");
        $(".col-md-admin").toggleClass("col-md-10 col-md-11 col-xs-10 col-xs-11");
    });
    $(document).on("click", ".glyphicon-chevron-right", function () {
        $("#sidebar-wrapper").css("width", "225px");
        $(".glyphicon-chevron-right").toggleClass("glyphicon-chevron-left glyphicon-chevron-right");
        $(".col-md-sidebar").toggleClass("col-md-2 col-md-1 col-xs-2 col-xs-1");
        $(".col-md-admin").toggleClass("col-md-10 col-md-11 col-xs-10 col-xs-11");
    });
});
