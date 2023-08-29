const useFile = () => {
    /**
     * --------------------------------------------------------------------------------
     * resolves path url of images. path should be reference to
     * client/src/assets folder
     * --------------------------------------------------------------------------------
     */
    const resolvePathUrl = (
        assetPath: string,
        pathPrefix: string = '../../assets/'
    ): string => {
        const path = `${pathPrefix}${assetPath}`;
        return new URL(path, import.meta.url).href;
    };

    const toBase64 = async (file: File): Promise<string> => {
        return new Promise((resolve, reject) => {
            try {
                const reader = new FileReader();

                reader.onload = event => {
                    if (
                        event.target &&
                        event.target.result &&
                        typeof event.target.result === 'string'
                    ) {
                        resolve(event.target.result);
                    } else {
                        resolve('');
                    }
                };

                reader.readAsDataURL(file);
            } catch (error) {
                reject('');
            }
        });
    };

    const resizeAndConvertToBase64 = async (
        file: File,
        dimension: { width: number; height: number }
    ): Promise<string> => {
        return new Promise(async resolve => {
            const imageDimension = await getImageDimensions(file);

            if (
                imageDimension.width < dimension.width ||
                imageDimension.height < dimension.height
            ) {
                const base64 = await toBase64(file);
                resolve(base64);
            }

            try {
                const reader = new FileReader();
                reader.onload = async () => {
                    const img = new Image();
                    img.onload = async () => {
                        const canvas = document.createElement('canvas');
                        const ctx = canvas.getContext('2d');

                        canvas.width = dimension.width;
                        canvas.height = dimension.height;

                        if (!ctx) {
                            const base64 = await toBase64(file);
                            resolve(base64);
                        }

                        if (ctx) {
                            ctx.drawImage(
                                img,
                                0,
                                0,
                                dimension.width,
                                dimension.height
                            );
                            const base64 = canvas.toDataURL('image/png');
                            resolve(base64);
                        }
                    };
                    img.src = URL.createObjectURL(file);
                };
                reader.readAsDataURL(file);
            } catch (error) {
                const base64 = await toBase64(file);
                resolve(base64);
            }
        });
    };

    const getImageDimensions = (
        file: File | string
    ): Promise<{ width: number; height: number; ratio: number }> => {
        return new Promise(resolve => {
            const img = new Image();
            img.onload = () =>
                resolve({
                    width: img.width,
                    height: img.height,
                    ratio: img.width / img.height,
                });
            img.src =
                typeof file === 'string' ? file : URL.createObjectURL(file);
        });
    };

    return {
        resolvePathUrl,
        toBase64,
        getImageDimensions,
        resizeAndConvertToBase64,
    };
};

export default useFile;
