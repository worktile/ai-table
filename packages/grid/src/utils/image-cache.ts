interface AITableImageOption {
    crossOrigin?: boolean;
}

export const imageCache = (() => {
    const imageMap: {
        [name: string]: {
            img: HTMLImageElement;
            success: boolean;
        };
    } = {};
    const imgPromises: any = [];

    function loadImage(name: string, src: string, option?: AITableImageOption) {
        imgPromises.push(
            new Promise((resolve, reject) => {
                const img = new Image();

                img.src = src;
                img.referrerPolicy = 'no-referrer';

                if (!option?.crossOrigin) {
                    img.crossOrigin = 'Anonymous';
                }

                imageMap[name] = {
                    img,
                    success: false
                };

                try {
                    img.onload = () => {
                        imageMap[name] = {
                            img,
                            success: true
                        };
                        resolve({
                            name,
                            img
                        });
                    };
                } catch (err) {
                    imageMap[name] = {
                        img,
                        success: false
                    };
                    reject(err);
                }
            })
        );
    }

    function imageMapOnload(callback: any) {
        Promise.all(imgPromises).then(callback);
    }

    function getImage(name: string) {
        const imgInfo = imageMap[name];

        if (imgInfo == null) {
            return null;
        }

        const { img, success } = imgInfo;

        if (!success) return false;
        return img;
    }

    return {
        loadImage,
        getImage,
        imageMapOnload,
        imageMap
    };
})();
