var defaultValues = {"post_name":"名前","post_key":"削除キー","post_comment":"コメントを入力してください。"};
var isInput = {"post_name":false,"post_key":false,"post_comment":false};

$(function(){
    //.post関連処理
    $(".post").focus(function() {
        //focus時にdefaultValuesの値だった場合は入力値を削除
        if($(this).val() == defaultValues[$(this).attr("id")]){
        	$(this).css('color', '#fff').val('');
            //post_keyの場合、入力値使用としたタイミングでtypeをpasswordへ
            if(this.id == "post_key"){
                $("#post_key")[0].type = "password";
            }
        }
    }).blur(function() {
        //blur時に入力値が空だった場合はdefaultValuesを入れる
        if(jQuery.trim($(this).val()) == "") {
            $(this).css('color', '#999').val(defaultValues[$(this).attr("id")]);
            //post_keyの場合入力が完了して空文字だった場合はtypeをtextへ
            if(this.id == "post_key"){
                $("#post_key")[0].type = "text";
            }
        }
    }).ready(function(){
        //入力フォームのデフォルト値設定
        for(key in defaultValues){
            $("#" + key).css('color', '#999').val(defaultValues[key]);
            if(key == "post_key"){
                $("#" + key)[0].type = "text";
            }
        }
    });
/*
    //読み込みが完了したら親フレーム側の縦幅を変更
    $.ready(function() {
        frameResize();
    });
*/
    // 親フレームの準備完了時
    $("#cbfns", window.parent.document).ready(function() {
        frameResize();
    });

    // submit時の操作
    $("form").submit(function() {
        //名前の入力チェックを行う。
        if ($("#post_name")[0].value == defaultValues["post_name"] || $("#post_name")[0].value == ""){
            alert("名前を入力してください。");
            return false;
        }
        //コメントの入力チェックを行う
        if ($("#post_comment")[0].value == defaultValues["post_comment"] || $("#post_comment")[0].value == ""){
            alert("コメントを入力してください。");
            return false;
        }
        return true;
    });
    
    //テキストエリア高さの自動調整
    var ta = $("#post_comment")[0];
    ta.style.overflow = "hidden";
    
    function resize () {
        ta.style.height = 'auto';
        ta.style.height = ta.scrollHeight+'px';
        frameResize();
    }

    function frameResize () {
        $("#cbfns", window.parent.document).height(document.body.scrollHeight);
    }

    $("#post_comment").change(function(){resize()}).keydown(function(){resize()});
});
