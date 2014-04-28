var defaultValues = {"post_name":"名前","post_key":"キー","post_comment":"コメントを入力してください。"};
var isInput = {"post_name":false,"post_key":false,"post_comment":false};

$(function(){
	//.post関連処理
    $(".post").focus(function() {
    	//focus時にdefaultValuesの値だった場合は入力値を削除
        if($(this).val() == defaultValues[$(this).attr("id")]){
        	$(this).css('color', '#fff').val('');
        }
    }).blur(function() {
    	//blur時に入力値が空だった場合はdefaultValuesを入れる
        if(jQuery.trim($(this).val()) == "") {
            $(this).css('color', '#999').val(defaultValues[$(this).attr("id")]);
        }
    }).ready(function(){
		//入力フォームのデフォルト値設定
		for(key in defaultValues){
			$("#" + key).css('color', '#999').val(defaultValues[key]);
		}
	});
    
    //テキストエリア高さの自動調整
    var ta = $("#post_comment")[0];
    ta.style.overflow = "hidden";
    
    function resize () {
    	ta.style.height = 'auto';
    	ta.style.height = ta.scrollHeight+'px';
    }
    $("#post_comment").change(function(){resize()}).keydown(function(){resize()});
});