var defaultValues = {"post_name":"名前","post_comment":"コメントを入力してください。"};
var dsStringMaxLength = 500;

$(function(){
    //.post関連処理
    $(".post").focus(function() {
        //focus時にdefaultValuesの値だった場合は入力値を削除
        if($(this).val() == defaultValues[$(this).attr("id")]){
        	$(this).val('');
        }
    }).blur(function() {
        //blur時に入力値が空だった場合はdefaultValuesを入れる
        if(jQuery.trim($(this).val()) == "") {
            $(this).val(defaultValues[$(this).attr("id")]);
        }
    }).ready(function(){
        //入力フォームのデフォルト値設定
        for(key in defaultValues){
            $("#" + key).val(defaultValues[key]);
        }
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
        if ($("#post_comment")[0].value.length > dsStringMaxLength){
            alert("文字数は" + dsStringMaxLength + "文字以内です。");
            return false;
        }
        return true;
    });

    //読み込みが完了したら親フレーム側の縦幅を変更
    $(window).load(function() {
        frameResize();
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
        var target = parent.postMessage ? parent : (parent.document.postMessage ? parent.document : undefined);
        if (typeof target != "undefined" && document.body.scrollHeight){
            target.postMessage(document.body.scrollHeight, "http://localhost:8080");
            //target.postMessage(document.body.scrollHeight, "http://laila-diary.tumblr.com");
        }
    }

    function checkCharCountAndShowErrorPopup(text, maxCount) {
        var alertCount = maxCount - 20;
        if(text.length > alertCount && text.length <= maxCount){
            $("#msg").html("※" + maxCount + "文字を超えそうです。<br>現在→" + text.length + "文字");
            $("#msg").removeClass("hide");
            $("#msg").removeClass("error");

        }else if (text.length > maxCount) {
            $("#msg").html("※" + maxCount + "文字を超えました。<br>現在→" + text.length + "文字");
            $("#msg").removeClass("hide");
            $("#msg").addClass("error");
        }else{
            $("#msg").html("");
            $("#msg").addClass("hide");
        }
    }

    // コメントメッセージ欄のリサイズ
    $("#post_comment").change(function(){
        resize();
    }).keydown(function(){
        resize();
    }).keyup(function(){
        checkCharCountAndShowErrorPopup($("#post_comment")[0].value, dsStringMaxLength);
    });
});
