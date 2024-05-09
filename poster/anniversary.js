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
            image.src = "https://static.xitaoinfo.com/poster/anniversary.jpg";

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
            this.ctx.rotate(5.2 * Math.PI / 180);
            image.crossOrigin = "anonymous"
            image.onload = () => {
                this.ctx.drawImage(image, 420, -30, 917, 600);
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
                this.ctx.drawImage(image, 415, 650, 917, 600);
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
                this.ctx.drawImage(image, 410, 1330, 917, 600);
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
        // this.ctx.lineWidth = 6 * this.ratio;
        this.ctx.font = "100 504px sxFont"
        this.ctx.fillStyle = '#313131';
        this.ctx.textBaseline = "top";
        this.ctx.fillText(anniversaryTime, 80, -100);
        converted_img.src = this.canvas.toDataURL("image/jpeg");
        this.downloadPoster.setAttribute('href', converted_img.src)
    }
}

