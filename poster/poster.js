class drawImg {
    constructor(options = {}) {
        const {width, height} = options
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
        this.sxFont = new FontFace('sxFont', 'url(https://static.xitaoinfo.com/poster/plsx.ttf)');
        this.sxFont.load().then((font) => {
            document.fonts.add(font);
            this.init(options);
        })

    }

    init(options) {
        this.convertCanvasToImage(options);
    }

    async convertCanvasToImage(options) {
        await this.draw(options).catch(err => err);
        this.canvasToUrl(options)
    }

    setOptions(options) {
        this.convertCanvasToImage(options)
    }

    draw(options) {
        const {bgUrl} = options
        return new Promise((resolve, reject) => {
            // this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
            let image = new Image();
            image.src = bgUrl;
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

    getWeek(dateTime) {
        // 创建一个表示特定日期的 Date 对象
        const date = new Date(dateTime);
        const dayOfWeek = date.getDay();
        const weekdays = ['周天', '周一', '周二', '周三', '周四', '周五', '周六'];
        return weekdays[dayOfWeek]

    }

    canvasToUrl(options) {
        const {nameTextValue, dateTextValue, timeTextValue, storeTextValue, addressTextValue,codeTextValue, brandText, yhText} = options;
        const myFont = this.sxFont;
        const dateStr = dateTextValue.replace(/-/g, '.') + ' | ' + timeTextValue + '（' + this.getWeek(dateTextValue) + '）'
        this.ctx.beginPath();
        this.ctx.lineWidth = 6 * this.ratio;
        this.ctx.font = "600 58px 宋体"
        this.ctx.fillStyle = '#313131';
        this.ctx.fillText('诚邀', 116, 726);

        this.ctx.font = "500 130px sxFont"
        this.ctx.fillStyle = '#313131';
        this.ctx.fillText(nameTextValue, 258, 726);

        this.ctx.font = "600 90px 宋体"
        this.ctx.fillStyle = '#313131';
        this.ctx.fillText(brandText, 116, 860);

        this.ctx.font = "600 90px 宋体"
        this.ctx.fillStyle = 'rgba(4, 128, 108, 0.97)'
        this.ctx.fillText(yhText, 116, 973);

        this.ctx.font = "600 48px 宋体"
        this.ctx.fillStyle = '#313131'
        this.ctx.fillText(dateStr, 116, 1638);

        this.ctx.font = "600 48px 宋体"
        this.ctx.fillStyle = '#313131'
        this.ctx.fillText(storeTextValue, 116, 1716);

        this.ctx.font = "600 36px 宋体"
        this.ctx.fillStyle = '#313131'
        this.ctx.fillText(addressTextValue, 116, 1786);

        this.ctx.font = "600 36px 宋体"
        this.ctx.fillStyle = '#313131'
        this.ctx.fillText('预约码 ', 116, 2030);

        this.ctx.font = "600 36px 宋体"
        this.ctx.fillStyle = '#313131'
        this.ctx.fillText(' ： ', 225, 2022);

        this.ctx.font = "600 36px 宋体"
        this.ctx.fillStyle = '#313131'
        this.ctx.fillText(codeTextValue, 270, 2030);

        converted_img.src = this.canvas.toDataURL("image/jpeg");
        this.downloadPoster.setAttribute('href', converted_img.src)
    }
}

