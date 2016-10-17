$(document).ready(function () {
    var admins;
    var droits;
    var admin;
    var id;
    var lastId;
    var removeDroit = [];
    var cookie = Cookies.get('admin');

    var referrer =  document.referrer;

    $.ajax({
        url: 'https://srvmaint.viennedoc.com/AdminServices.asmx/getDroits'
        , type: "POST"
        , crossDomain: true
        , data: {
            cookie: cookie
        }
        , success: function (data) {
            $lesDroits = $(data).find("string").text();
            if ($lesDroits != "") {
                //$json = $.parseJSON($lesDroits);
                $json = JSON.parse($lesDroits);
                droits = $json;
                $.each($json, function ($number, $obj) {
                    $('.selectpicker').append("<option>" + $obj["Nom"] + "</option>")
                });
                $('.selectpicker').selectpicker();
                $('.btn-group.bootstrap-select.show-tick').addClass('form-control');
                $.each($(".btn-group.bootstrap-select.show-tick.form-control.add li"), function ($number, $obj) {
                    $($obj).attr("id", $json[$number]["id"]);
                });
                $.each($(".btn-group.bootstrap-select.show-tick.form-control.modify li"), function ($number, $obj) {
                    $($obj).attr("id", $json[$number]["id"]);
                });
            }
        }
        , error: function (xhr, status, error) {
            alert(error); //do something if there is an error
        }
    });
    $.ajax({
        url: 'https://srvmaint.viennedoc.com/AdminServices.asmx/getAdmins'
        , type: "POST"
        , crossDomain: true
        , data: {
            cookie: cookie
        }
        , success: function (data) {
            $lesAdmins = $(data).find("string").text();
            if ($lesAdmins != "") {
                $json = $.parseJSON($lesAdmins);
                admins = $json;
                $.each($json, function ($number, $obj) {
                    $("tbody").append('<tr id="' + $number + '"><td>' + $obj["login"] + '</td><td>' + $obj["MDP"] + '</td><td><a href="#" class="btn btn-primary modifier" style="width:40px"><span class="glyphicon glyphicon-pencil"></span> </a></td><td><a href="#" class="btn btn-danger supprimer"><span class="glyphicon glyphicon-trash"></span> </a></td></tr>');
                    lastId = $number;
                });
            }
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
        //SET DROITS FOR ADMIN
        removeDroit = admins[id]["droits"].split(',');
        removeDroit.splice(removeDroit.length - 1, 1);
        //CLEAR
        $.each($(".btn-group.bootstrap-select.show-tick.form-control.modify li"), function ($number, $obj) {
            $($obj).removeClass("selected");
        });
        var arrayToSelect = [];
        $.each($(".btn-group.bootstrap-select.show-tick.form-control.modify li"), function ($number, $obj) {
            if ($.inArray($($obj).attr('id'), removeDroit) != -1) {
                arrayToSelect[$number] = droits[$number]["Nom"];
            }
        });
        $('.modify .selectpicker').selectpicker('val', arrayToSelect);
        //console.log(droit);
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
        //ADDDROIT
        var addDroits = $('.modify li.selected');
        var ids = "";
        $.each(addDroits, function ($number, $obj) {
            ids += $($obj).attr("id") + ",";
        });
        //REMOVEDROIT
        var toRemove = "";
        $.each(removeDroit, function ($number, $obj) {
            if (ids.indexOf(removeDroit[$number]) == -1) {
                toRemove += removeDroit[$number] + ",";
            }
        });
        $.ajax({
            url: 'https://srvmaint.viennedoc.com/AdminServices.asmx/changeLoginMDPDroits'
            , type: "POST"
            , data: {
                id: idAdmin
                , login: login
                , mdp: mdp
                , addDroits: ids
                , removeDroits: toRemove
                , cookie: cookie
            }
            , crossDomain: true
            , success: function (data) {
                $isLogin = $(data).find("string").text();
                if ($isLogin != "") {
                    $("#exampleModal").modal('toggle');
                    $("tr#" + id + " td:nth-child(1)").text(login);
                    $("tr#" + id + " td:nth-child(2)").text(mdp);
                }
            }
        });
    });
    $(".remove-admin").click(function () {
        var idAdmin = admin["_id"];
        $.ajax({
            url: 'https://srvmaint.viennedoc.com/AdminServices.asmx/removeAdmin'
            , type: "POST"
            , data: {
                id: idAdmin
                , cookie: cookie
            }
            , crossDomain: true
            , success: function (data) {
                $isLogin = $(data).find("string").text();
                if ($isLogin != "") {
                    $(".remove").modal("toggle");
                    $("tr#" + id).remove();
                }
            }
        });
    });
    $(".ajout-admin").click(function () {
        $("#ajoutAdmin").modal("toggle");
    });
    $(".ajouter-admin").click(function () {
        //addAdmin
        //GET DROITS
        var droits = $('.add li.selected');
        var ids = "";
        $.each(droits, function ($number, $obj) {
            ids += $($obj).attr("id") + ",";
        });
        //console.log(droits);
        //console.log(ids);
        var login = $(".input-newLogin").val();
        var mdp = $(".input-newMdp").val();
        $.ajax({
            url: 'https://srvmaint.viennedoc.com/AdminServices.asmx/addAdmin'
            , type: "POST"
            , data: {
                login: login
                , mdp: mdp
                , droits: ids
                , cookie: cookie
            }
            , crossDomain: true
            , success: function (data) {
                $isLogin = $(data).find("string").text();
                if ($isLogin != "") {
                    $("#ajoutAdmin").modal('toggle');
                    $("tbody").append('<tr id="' + (lastId + 1) + '"><td>' + login + '</td><td>' + mdp + '</td><td></td><td></td></tr>')
                }
            }
        });
    });
    $(".refresh-admin").click(function () {
        $("tbody").empty();
        $.ajax({
            url: 'https://srvmaint.viennedoc.com/AdminServices.asmx/getAdmins'
            , type: "POST"
            , crossDomain: true
            , data: {
                cookie: cookie
            }
            , success: function (data) {
                $lesAdmins = $(data).find("string").text();
                if ($lesAdmins != "") {
                    $json = $.parseJSON($lesAdmins);
                    admins = $json;
                    $.each($json, function ($number, $obj) {
                        $("tbody").append('<tr id="' + $number + '"><td>' + $obj["login"] + '</td><td>' + $obj["MDP"] + '</td><td><a href="#" class="btn btn-primary modifier" style="width:40px"><span class="glyphicon glyphicon-pencil"></span> </a></td><td><a href="#" class="btn btn-danger supprimer"><span class="glyphicon glyphicon-trash"></span> </a></td></tr>');
                        lastId = $number;
                    });
                }
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
