var flag = true;
	var aa = $("a");
	$("#nav").click(function() {
		$("#hou").remove();
		if(flag) {
			var Div = "<div id = 'hou'></div>"
			$("#header").after(Div);
			$("#hou").css({
				width: "300px",
				height: "300px",
				background: "gray",
				position: "absolute",
				zIndex:"1",
				right: "0",
				top: "68px",
				opacity:"0.5"
			})
			var a = aa.clone(true);
			$("#hou").append(a);
			a.css({
				textDecoration: "none",
				color: "red",
				display: "block",
				height: "36px",
				lineHeight: "36px",
				padding: "0 5px",
				borderRadius: "5px"
			})
			flag = false;
		} else {
			flag = true;
		}
	})
	

//底部
	$("#footer ul img").each(function(i,e){
		//移入函数
		$(e).mouseenter(function(){
			$(this).attr("src","img/img1/footer" + i + "_h.jpg");
		})
		$(e).mouseleave(function(){
			$(this).attr("src","img/img1/footer" + i + ".jpg");
		})	
	})
