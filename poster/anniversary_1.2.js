class drawImg {
    constructor(options = {}) {
        const { width, height } = options
        this.ratio = 1;
        this.canvas = document.getElementById('canvas');
        this.downloadPoster = document.querySelector('.download-poster')
        if (width && height) {
            this.canvas.width = width
            this.canvas.height = height
        }
        this.ctx = this.canvas.getContext('2d')
        this.converted_img = document.getElementById('converted_img')
        this.posterBg = document.querySelector('.poster-bg')
        this.sxFont = new FontFace('sxFont', 'url(https://static.xitaoinfo.com/poster/CALIFI.TTF)');
        this.sxFont.load().then((font) => {
            document.fonts.add(font);
            this.init(options);
        })

    }

    init(options) {
        this.convertCanvasToImage(options);
    }

    async convertCanvasToImage(options) {
        this.ctx.save(); // 保存当前状态
        await this.draw(options).catch(err => err);
        await this.draw1(options).catch(err => err);
        await this.draw2(options).catch(err => err);
        await this.draw3(options).catch(err => err);
        this.canvasToUrl(options)
    }

    setOptions(options) {
        this.convertCanvasToImage(options)
    }

    draw(options) {
        const { src1, src2, src3 } = options.data || {}
        return new Promise((resolve, reject) => {
            // this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
            let image = new Image();
            image.src = "https://static.xitaoinfo.com/poster/anniversary_1.2.jpg";

            image.crossOrigin = "anonymous"
            image.onload = () => {
                this.ctx.drawImage(image, 0, 0, this.canvas.width, this.canvas.height);
                resolve()
            }
            image.onerror = () => {
                reject()
            }
        })

    }
    roundRect(x, y, width, height, radius) {
        this.ctx.beginPath()
        this.ctx.moveTo(x + radius, y)
        this.ctx.arcTo(x + width, y, x + width, y + height, radius);
        this.ctx.arcTo(x + width, y + height, x, y + height, radius);
        this.ctx.arcTo(x, y + height, x, y, radius);
        this.ctx.arcTo(x, y, x + width, y, radius);
        this.ctx.closePath();
    }
    draw1(options) {
        const { src1, src2, src3 } = options.data || {}
        return new Promise((resolve, reject) => {
            let image = new Image();
            image.src = src1;
            image.crossOrigin = "anonymous"
            image.onload = () => {
                this.ctx.save();
                this.roundRect(293, 520, 692, 451, 10)
                this.ctx.clip()
                this.ctx.drawImage(image, 293, 520, 692, 451);
                this.ctx.restore();
                resolve()
            }
            image.onerror = () => {
                reject()
            }
        })

    }
    draw2(options) {
        const { src2 } = options.data || {}
        return new Promise((resolve, reject) => {
            // this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
            let image = new Image();
            image.src = src2;
            image.crossOrigin = "anonymous"
            image.onload = () => {
                this.ctx.save();
                this.roundRect(293, 1007, 692, 451, 10)
                this.ctx.clip()
                this.ctx.drawImage(image, 293, 1007, 692, 451);
                this.ctx.restore();
                resolve()
            }
            image.onerror = () => {
                reject()
            }
        })

    }
    draw3(options) {
        const { src3 } = options.data || {}
        return new Promise((resolve, reject) => {
            // this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
            let image = new Image();
            image.src = src3;
            image.crossOrigin = "anonymous"
            image.onload = () => {
                this.ctx.save();
                this.roundRect(293, 1494, 692, 451, 10)
                this.ctx.clip()
                this.ctx.drawImage(image, 293, 1494, 692, 451);
                this.ctx.restore();
                resolve()
            }
            image.onerror = () => {
                reject()
            }
        })

    }
    drawCut() {
        return new Promise((resolve, reject) => {
            let image = new Image();
            image.src = "https://static.xitaoinfo.com/poster/cut_4.png";
            image.crossOrigin = "anonymous"
            image.onload = () => {
                this.ctx.drawImage(image, 800, 300, 400, 752);
                resolve()
            }
            image.onerror = () => {
                reject()
            }
        })
    }
    canvasToUrl(options) {
        this.ctx.restore(); // 保存当前状态
        const { anniversaryTime } = options.data || {};
        const myFont = this.sxFont;
        this.ctx.beginPath();
        const len = anniversaryTime.length

        this.ctx.font = "500 266px sxFont"
        this.ctx.fillStyle = '#A76A0B';
        this.ctx.textAlign = "start";
        this.ctx.textBaseline = "top";
        this.ctx.fillText(anniversaryTime, 431 - (66 + (len - 1) * 90), 119);

        // 设置阴影属性
        // this.ctx.shadowColor = "rgba(255, 255, 255, 0.2)"; // 淡淡的白色阴影，透明度为 0.5
        // this.ctx.shadowOffsetX = -5; // 水平偏移量
        // this.ctx.shadowOffsetY = 0; // 垂直偏移量
        // this.ctx.shadowBlur = 18; // 模糊程度

        // this.ctx.font = "500 319px "
        // this.ctx.textBaseline = "top";
        // this.ctx.fillText("周", 825, 410);


        // // 设置阴影属性
        // this.ctx.shadowColor = "rgba(255, 255, 255, 1)"; // 淡淡的白色阴影，透明度为 0.5
        // this.ctx.shadowOffsetX = -2; // 水平偏移量
        // this.ctx.shadowOffsetY = 0; // 垂直偏移量
        // this.ctx.shadowBlur = 30; // 模糊程度

        // this.ctx.font = "500 319px 宋体"
        // this.ctx.textBaseline = "top";
        // this.ctx.fillText("年", 870, 710);

        converted_img.src = this.canvas.toDataURL("image/jpeg");
        this.downloadPoster.setAttribute('href', converted_img.src)
    }
}

