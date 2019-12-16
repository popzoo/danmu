//点击导入按钮,使files触发点击事件,然后完成读取文件的操作 rgba(218,165,32,0.7) rgba(132,112,255,0.7)  #9400D3;
const prefix ='https://danmu-1253626683.cos.ap-beijing.myqcloud.com/';
function fileImport() {
    //获取读取我文件的File对象
    var selectedFile = document.getElementById('files').files[0];
    var name = selectedFile.name;//读取选中文件的文件名
    var size = selectedFile.size;//读取选中文件的大小
    var fileFlag = false;
    if(parseInt(size)>1024){
    	size = Math.ceil(size/1024)+"KB";
    }else if(parseInt(size)<1024){
    	size = size +"B";
    }else if(parseInt(size)>1024*1024){
    	size = Math.ceil(size/(1024*1024))+"MB";
    }
	console.info("文件名:"+name+"; 大小:"+size);
	// console.info(name.substr(0,name.length-5));
    if(parseInt(selectedFile.size)<1024*1024*5 && name.substr(name.length-5)==".json"){
    	// 这里对接播酱查验用户名查看用户真伪
        fetch('https://bojianger.com/data/api/common/search.do?keyword='+name.substr(0,name.length-5), {
            method: 'GET',
            mode: 'cors',
            cache: 'default',
            credentials: 'omit'
        }).then(result => {
            return result.json();
        }).then(json => {
            let userName = json.data.audienceVo.audience_name;
            let level = json.data.audienceVo.level;
            console.info("用户名："+userName+";等级："+level)
            if(userName == name.substr(0,name.length-5) && parseInt(level)>-1){
            	// fileFlag = true;
    			var reader = new FileReader();//这是核心,读取操作就是由它完成.
    			reader.readAsText(selectedFile);//读取文件的内容,也可以读取文件的URL,默认编码utf-8
    			reader.onload = function () {
    			    //当读取完成后回调这个函数,然后此时文件的内容存储到了result中,直接操作即可
    			    // console.log(this.result);
    			    if(isJSON(this.result)){
    			    	console.info("JSON格式校验正确，正在上传");
    			    	putCOS(this.result,name);
    			    }else{
    			    	alert('JSON文件格式校验错误，请重新编辑JSON文件内容！');
    			    }
    			}
            }else{
                alert("用户名格式不正确，请重新输入");
            }
        }).catch(err => {
        	alert("斗鱼用户名检测不存在，请将文本名命名为斗鱼昵称");
            // console.error('REQUEST ERROR', err);
        })              	
    }else{
    	alert("请上传不大于5MB且为JSON格式的文件");
    }
}
// json validation
function isJSON(str) {
    if (typeof str == 'string') {
        try {
            var obj=JSON.parse(str);
            if(typeof obj == 'object' && obj ){
                return true;
            }else{
                return false;
            }

        } catch(e) {
            console.log('error：'+str+'!!!'+e);
            return false;
        }
    }
    return false;
} 
// ============================= New COS Operate =========================
function putCOS(file,fileName){
    var key = 'userDanmu/'+fileName;
    var fd = new FormData();
    fd.append('key', key);
    fd.append('Content-Type','');
    fd.append('file', file);
    fetch(prefix,{
        method: 'POST',
        mode: 'cors',
        body: fd,
        credentials: "omit",
    }).then(response => {
        // console.info(response);
        if(response.headers.get('ETag')!=null){
            alert("恭喜您，自定义弹幕成功，赶快去重启浏览器试试新弹幕吧！");
            document.getElementById("fill_data_tag").style.display="inherit";
            document.getElementById("visit_self_danmu").setAttribute('href',prefix+key);
        }else{
            alert('文件上传失败，请重试');
        }
    }).catch(err => {
        console.error(err);
        console.error("FireRoomPut:failure");
    })
}
//check auth
function headCOS(obj){
    let nickName = document.getElementById("seek_self_danmu").value.trim();
    let reqUrl =prefix+'userDanmu/'+nickName+'.json';
    fetch(reqUrl,{
        method: 'HEAD',
        mode: 'cors',
        credentials: "omit",
    }).then(response => {
    console.info(response.headers.get('ETag'));   
        if(response.headers.get('ETag')!=null){
            sessionStorage.setItem("personalDanmu", "true");
            if(obj.id=="open_hide_func"){
                window.location.href = "https://popzoo.github.io/zoo/hiddenManual.html";
            }else if(obj.id=="open_fire_room"){
                window.location.href = "https://popzoo.github.io/pop/fireroom.html";
            }
        }else{
            alert("昵称验证失败");
        }
    }).catch(err => {
        console.error(err);
        alert("昵称验证失败");
    })
}
// get Danmu content
function getCOS(){
    alert("网址受到许多次恶意攻击，为大家数据安全，暂时不支持下载，还请谅解！");
    // let nickName = document.getElementById("seek_self_danmu").value.trim();
    // let reqUrl =prefix+'userDanmu/'+nickName+'.json';
    // fetch(reqUrl,{
    //     method: 'GET',
    //     mode: 'cors',
    //     cache: 'default',
    //     credentials: "omit",
    // }).then(res => {
    //     return res.text();
    // }).then(text => {  
    //     if(text!=null){
    //         saveJsonContent(text,nickName+".json");
    //     }else{
    //         alert("没有找到该用户名匹配云弹幕，请检查昵称是否正确！");
    //     }
    // }).catch(err => {
    //     alert("没有找到该用户名匹配云弹幕，请检查昵称是否正确！");
    //     // console.error(err);
    // })
}
//download json file
// function saveJsonContent (content, fileName) {
//     let downLink = document.createElement('a')
//     downLink.download = fileName;
//     let blob = new Blob([content]);//字符内容转换为blod地址
//     downLink.href = URL.createObjectURL(blob);
//     document.body.appendChild(downLink);// 链接插入到页面
//     downLink.click();
//     document.body.removeChild(downLink);// 移除下载链接
// }
