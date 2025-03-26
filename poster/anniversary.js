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
        this.sxFont = new FontFace('sxFont', 'url(https://static.xitaoinfo.com/poster/SavoyeStd.otf)');
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
        await this.drawCut().catch(err => err)
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
            image.src = "https://static.xitaoinfo.com/poster/anniversary_2025320.jpg";

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
    draw1(options) {
        const { src1, src2, src3 } = options.data || {}
        return new Promise((resolve, reject) => {
            // this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
            let image = new Image();
            image.src = src1;
            // this.ctx.rotate(5.2 * Math.PI / 180);
            image.crossOrigin = "anonymous"
            image.onload = () => {
                this.ctx.drawImage(image, 102, 474, 822, 550);
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
                this.ctx.drawImage(image, 102, 1070, 822, 550);
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
                this.ctx.drawImage(image, 102, 1680, 822, 550);
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

        this.ctx.font = "500 500px 宋体"
        this.ctx.fillStyle = '#343434';
        this.ctx.textBaseline = "top";
        this.ctx.fillText(anniversaryTime, 980, -40);

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

