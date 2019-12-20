window.onload = () => {
	const CANVAS = document.getElementsByTagName("canvas")[0];
	const CTX = CANVAS.getContext("2d");
	const CHARS = [];
	const MAX_CHARS = 200;
	const SEPARATION = 1.8;

	let ww, wh, camera;

	class Vector {
		constructor(x, y, z) {
			this.x = x;
			this.y = y;
			this.z = z;
		}

		rotate(dir, ang) {
			const X = this.x;
			const Y = this.y;
			const Z = this.z;

			const SIN = Math.sin(ang);
			const COS = Math.cos(ang);

			if (dir === "x") {
				this.y = Y * COS - Z * SIN;
				this.z = Y * SIN + Z * COS;
			} else if (dir === "y") {
				this.x = X * COS - Z * SIN;
				this.z = X * SIN + Z * COS;
			}
		}

		project() {
			const ZP = this.z + camera.z;
			const DIV = ZP / 600;
			const XP = (this.x + camera.x) / DIV;
			const YP = (this.y + camera.y) / DIV;
			const CENTER = getCenter();
			return [XP + CENTER[0], YP + CENTER[1], ZP];
		}
	}

	class Char {
		constructor(letter, pos) {
			this.letter = letter;
			this.pos = pos;
		}

		rotate(dir, ang) {
			this.pos.rotate(dir, ang);
		}

		render() {
			const PIXEL = this.pos.project();
			const XP = PIXEL[0];
			const YP = PIXEL[1];
			const MAX_SIZE = 50;
			const SIZE = (1 / PIXEL[2] * MAX_SIZE) | 0;
			const BRIGHTNESS = SIZE / MAX_SIZE;
			const COL = `rgba(255, ${200 * BRIGHTNESS| 0 + 150}, ${200 * BRIGHTNESS | 0 + 50}, ${BRIGHTNESS})`;
			
			CTX.beginPath();
			CTX.fillStyle = COL;
			CTX.font = SIZE + "px monospace";
			CTX.fillText(this.letter, XP, YP);
			CTX.fill();
			CTX.closePath();
		}
	}

	function getCenter() {
		return [ww / 2, wh / 2];
	}

	function signedRandom() {
		return Math.random() - Math.random();
	}

	function render() {
		for (let i = 0; i < CHARS.length; i++) {
			CHARS[i].render();
		}
	}
	
	let time = 0;
	function update() {
		CTX.clearRect(0, 0, ww, wh);
		for (let i = 0; i < CHARS.length; i++) {
			const DX = 0.005 * Math.sin(time * 0.001);
			const DY = 0.005 * Math.cos(time * 0.001);
			CHARS[i].rotate("x", DX);
			CHARS[i].rotate("y", DY);
		}
		++time;
	}

	function loop() {
		window.requestAnimationFrame(loop);
		update();
		render();
	}
	
	function getRandomInt(min, max) {
		return Math.floor(Math.random() * (max - min + 1)) + min;
	};

	function createChars() {
		let arrCommon = ["主播加油💪","666🤘🤘🤘","点击关注，不会迷路","🐤冲鸭🐤冲鸭🐤","我来冒个泡，🧐憨憨","火力全开","暴躁起来","小礼物🎁刷起来","一发入魂哈🔫","憨憨","热度","键盘敲稀巴烂","火力全开中ญ๊๊๊๊๊๊๊๊๊๊๊๊๊๊๊๊๊๊๊๊๊๊๊๊๊๊๊๊๊๊中ญ๊๊๊๊๊๊๊๊๊๊๊๊๊๊๊๊๊๊๊๊๊๊๊๊๊๊๊๊๊๊中ญ๊๊๊๊๊๊๊๊๊๊๊๊๊๊๊๊๊๊๊๊๊๊๊๊๊๊๊๊๊๊",
                     "可以夸下🐷播","懒得打字","神奇的主播","优质的弹幕","水军来捧，主播威猛","铁粉驾到，热度必爆","自家人，别误伤","幻神","加油助威🚀*10！","这谁顶得住","好了","什么车队","666","奈斯","左边拉满",
                     "🛸*1000","越来越红","越来越火","越来越富","越来越强👍","กิิิิิ荧กิิิิิิิิิิิ光กิิิิิิิิิิิ棒กิิิิิ","来个办卡💳","我又回来了","打卡签到","感谢小礼物","火力必中","欢迎","小伙伴","来波福利吧","丸子不止","弹幕不停","不服来战",
                     "给主播点个赞","了解一下","🀄🀄🀄","喜欢","什么游戏","带头大哥","高手","主播无敌","哈哈哈","厉害呀","这样呀","对面不行","没用滴","福利姬","粉丝节","鱼吧","带节奏","小黑屋","舒服","开盘",
                     "精选","一见倾心点关注","两眼沉沦送礼物","三顾房间有归宿","情到深处开贵族","来的潇洒走得酷","点点关注不迷路","北京第九区交通委提醒您","道路千万条，关注第一条","文明刷弹幕，远离小黑屋","咸阳古道音尘短",
                     "斗鱼房间弹幕长","斗鱼不倒，陪你到老","网络不断，与你相伴","身无彩凤刷礼物","心有灵犀点关注","主播颜值高","没什么好夸的","生活不止眼前的苟且","水电费和鱼翅费","十年修得同船渡","点点关注不迷路",
                     "百年修得共枕眠","刷刷鱼丸不要钱","关注主播不迷路","开启缘分第一步","看上主播刷礼物","迈向成功第一步"];
		for (let i = 0; i < MAX_CHARS; i++) {
			// const CHARACTER = String.fromCharCode((Math.random() * 93 + 34) | 0);
			const CHARACTER = arrCommon[parseInt(Math.random()*arrCommon.length)];
			const X = signedRandom() * SEPARATION;
			const Y = signedRandom() * SEPARATION;
			const Z = signedRandom() * SEPARATION;
			const POS = new Vector(X, Y, Z);
			const CHAR = new Char(CHARACTER, POS);
			CHARS.push(CHAR);
		}
	}

	function setDim() {
		ww = window.innerWidth;
		wh = window.innerHeight;
		CANVAS.width = ww;
		CANVAS.height = wh;
	}

	function initCamera() {
		camera = new Vector(0, 0, SEPARATION + 1);
	}

	window.onresize = setDim;

	(() => {
		setDim();
		initCamera();
		createChars();
		loop();
	})();
};