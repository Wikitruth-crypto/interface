interface ImageResult {
    dataUrl: string;
    image: File;
}

// interface TextConfig {
//     font: string;
//     size: number;
//     y: number;
// }

import fonts from '@assets/font/STSONG.ttf'

const textY = [490,570,820,860,930] // 5个起始Y坐标 - 第4个字段Y=860, 第5个字段Y=930
const fontSize = [45,30,30,30,25] // 5个字体大小

// 为所有字段定义底部边界
const fieldBottomBounds = [
  560,  // 第1个字段底部边界 (Y起点490 + 70px空间)
  790,  // 第2个字段底部边界 (Y起点570 + 220px空间)
  900,  // 第3个字段底部边界 (Y起点820 + 80px空间)
  950,  // 第4个字段底部边界 (Y起点860 + 90px空间) - 增加空间
  1000 // 第5个字段底部边界 (Y起点930 + 70px空间)
];

const AddImageProps = {
    startX: 102,
    startY: 500,
    width: 876,
    height: 478,
    radius_top_left: 0,
    radius_top_right: 0,
    radius_bottom_left: 30,
    radius_bottom_right: 30,
};

// 加载字体
const loadFont = async () => {
    try {
        // 创建一个新的样式元素
        const style = document.createElement('style');
        style.textContent = `
            @font-face {
                font-family: 'STSong';
                src: url('${fonts}') format('truetype');
                font-weight: normal;
                font-style: normal;
            }
        `;
        document.head.appendChild(style);

        // 创建并加载字体
        const fontFace = new FontFace('STSong', `url(${fonts})`);
        const loadedFont = await fontFace.load();
        document.fonts.add(loadedFont);

        // 等待字体完全加载
        await document.fonts.ready;

        // 验证字体是否加载成功
        const testDiv = document.createElement('div');
        testDiv.style.fontFamily = 'STSong';
        testDiv.style.visibility = 'hidden';
        testDiv.textContent = 'Testing text';
        document.body.appendChild(testDiv);
        
        // 确保字体已应用
        await new Promise(resolve => setTimeout(resolve, 100));
        
        document.body.removeChild(testDiv);
        return true;
    } catch (error) {
        console.error('Font loading failed:', error);
        return false;
    }
};

const CreateNftImage = (
    obj: Record<string, any>,
    name: string,
    nftBackground: string | HTMLImageElement,
    insertImageUrl: string | File,
    quality = 0.8
): Promise<ImageResult> => {
    return new Promise(async (resolve, reject) => {
        try {
            // 先加载字体并等待完成
            await loadFont();
            
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');
            if (!ctx) throw new Error('Can`t create canvas context');

            // 设置画布尺寸为1080x1080
            canvas.width = 1080;
            canvas.height = 1080;

            // 加载背景图片
            const backgroundImage = new Image();
            backgroundImage.crossOrigin = 'anonymous';
            backgroundImage.src = typeof nftBackground === 'string' ? nftBackground : nftBackground.src;

            backgroundImage.onload = () => {
                try {
                    // 检查图片是否为正方形
                    if (backgroundImage.width !== backgroundImage.height) {
                        throw new Error('The background image must be a square');
                    }

                    // 绘制背景图片
                    ctx.drawImage(backgroundImage, 0, 0, canvas.width, canvas.height);
                    
                    // 加载插入图片
                    const insertImage = new Image();
                    insertImage.crossOrigin = 'anonymous';
                    if (typeof insertImageUrl === 'string') {
                        insertImage.src = insertImageUrl;
                    } else {
                        insertImage.src = URL.createObjectURL(insertImageUrl);
                    }
                    
                    insertImage.onload = () => {
                        try {
                            // 创建临时canvas用于处理渐变
                            const tempCanvas = document.createElement('canvas');
                            tempCanvas.width = AddImageProps.width;
                            tempCanvas.height = AddImageProps.height;
                            const tempCtx = tempCanvas.getContext('2d')!;
                            
                            // 绘制插入图片到临时canvas（保持原比例，居中裁剪）
                            const imgRatio = insertImage.width / insertImage.height;
                            const containerRatio = AddImageProps.width / AddImageProps.height;
                            
                            let sourceX = 0;
                            let sourceY = 0;
                            let sourceWidth = insertImage.width;
                            let sourceHeight = insertImage.height;
                            
                            // 计算裁剪区域，保持原比例
                            if (imgRatio > containerRatio) {
                                // 图片较宽，裁剪左右
                                sourceWidth = insertImage.height * containerRatio;
                                sourceX = (insertImage.width - sourceWidth) / 2;
                            } else if (imgRatio < containerRatio) {
                                // 图片较高，裁剪上下
                                sourceHeight = insertImage.width / containerRatio;
                                sourceY = (insertImage.height - sourceHeight) / 2;
                            }
                            
                            // 应用圆角路径
                            tempCtx.beginPath();
                            tempCtx.moveTo(0, 0);
                            tempCtx.lineTo(AddImageProps.width, 0);
                            tempCtx.lineTo(AddImageProps.width, AddImageProps.height - AddImageProps.radius_bottom_right);
                            tempCtx.arcTo(
                                AddImageProps.width, 
                                AddImageProps.height, 
                                AddImageProps.width - AddImageProps.radius_bottom_right, 
                                AddImageProps.height, 
                                AddImageProps.radius_bottom_right
                            );
                            tempCtx.lineTo(AddImageProps.radius_bottom_left, AddImageProps.height);
                            tempCtx.arcTo(
                                0, 
                                AddImageProps.height, 
                                0, 
                                AddImageProps.height - AddImageProps.radius_bottom_left, 
                                AddImageProps.radius_bottom_left
                            );
                            tempCtx.closePath();
                            tempCtx.clip();
                            
                            // 绘制图片（保持原比例）
                            tempCtx.drawImage(
                                insertImage,
                                sourceX, sourceY, sourceWidth, sourceHeight,
                                0, 0, AddImageProps.width, AddImageProps.height
                            );
                            
                            // 创建线性渐变蒙版（顶部透明，底部不透明）
                            const gradient = tempCtx.createLinearGradient(0, 0, 0, AddImageProps.height);
                            gradient.addColorStop(0, 'rgba(0,0,0,0)'); // 顶部完全透明
                            gradient.addColorStop(1, 'rgba(0,0,0,1)'); // 底部完全不透明
                            
                            // 应用渐变蒙版
                            tempCtx.globalCompositeOperation = 'destination-in';
                            tempCtx.fillStyle = gradient;
                            tempCtx.fillRect(0, 0, AddImageProps.width, AddImageProps.height);
                            
                            // 重置混合模式
                            tempCtx.globalCompositeOperation = 'source-over';
                            
                            // 将处理好的带渐变效果的图片绘制到主canvas上
                            ctx.drawImage(
                                tempCanvas,
                                AddImageProps.startX, AddImageProps.startY
                            );
                            
                            // 设置文字基本样式
                            ctx.fillStyle = '#FFFFFF';
                            ctx.textAlign = 'center';
                            ctx.textBaseline = 'middle';

                            // 判断是否为英文字符
                            const isEnglishChar = (char: string): boolean => {
                                return /[a-zA-Z]/.test(char);
                            };

                            // 改进的文本换行函数
                            const wrapText = (text: string, maxWidth: number): string[] => {
                                const lines: string[] = [];
                                let currentLine = '';
                                let currentWord = '';
                                let isInEnglishWord = false;

                                for (let i = 0; i < text.length; i++) {
                                    const char = text[i];
                                    
                                    // 处理英文单词
                                    if (isEnglishChar(char)) {
                                        currentWord += char;
                                        isInEnglishWord = true;
                                        
                                        // 如果是最后一个字符，需要处理剩余的单词
                                        if (i === text.length - 1) {
                                            const testLine = currentLine + currentWord;
                                            if (ctx.measureText(testLine).width <= maxWidth) {
                                                currentLine = testLine;
                                            } else {
                                                if (currentLine) lines.push(currentLine);
                                                currentLine = currentWord;
                                            }
                                        }
                                        continue;
                                    }
                                    
                                    // 英文单词结束（遇到空格或标点）
                                    if (isInEnglishWord) {
                                        const testLine = currentLine + currentWord + char;
                                        if (ctx.measureText(testLine).width <= maxWidth) {
                                            currentLine = testLine;
                                        } else {
                                            if (currentLine) lines.push(currentLine);
                                            currentLine = currentWord + char;
                                        }
                                        currentWord = '';
                                        isInEnglishWord = false;
                                        continue;
                                    }

                                    // 处理中文字符
                                    const testLine = currentLine + char;
                                    if (ctx.measureText(testLine).width <= maxWidth) {
                                        currentLine = testLine;
                                    } else {
                                        if (currentLine) lines.push(currentLine);
                                        currentLine = char;
                                    }
                                }

                                // 添加最后一行
                                if (currentLine) {
                                    lines.push(currentLine);
                                }

                                return lines;
                            };

                            // 自适应文本绘制函数 - 在边界内动态调整字体大小和行高
                            const drawTextWithinBounds = (
                                text: string, 
                                startY: number, 
                                bottomBound: number, 
                                initialFontSize: number, 
                                maxWidth: number,
                                allowWrap: boolean = true
                            ): { fontSize: number; lineHeight: number; lines: string[] } => {
                                let currentFontSize = initialFontSize;
                                const minFontSize = initialFontSize * 0.6; // 最小字体系数
                                
                                while (currentFontSize >= minFontSize) {
                                    // 设置当前字体大小
                                    ctx.font = `normal ${currentFontSize}px STSong, "华文宋体", SimSun`;
                                    
                                    // 计算行高（动态调整，保持可读性）
                                    const lineHeight = currentFontSize * (currentFontSize >= 25 ? 1.8 : 1.6);
                                    
                                    // 根据是否允许换行来决定文本处理方式
                                    let lines: string[];
                                    if (allowWrap) {
                                        // 允许换行：使用wrapText函数
                                        lines = wrapText(text, maxWidth);
                                    } else {
                                        // 不允许换行：检查单行是否超出宽度，如果超出则截断
                                        const textMetrics = ctx.measureText(text);
                                        if (textMetrics && textMetrics.width <= maxWidth) {
                                            lines = [text]; // 单行显示
                                        } else {
                                            // 文本超出宽度，需要截断
                                            let truncatedText = text;
                                            while (truncatedText.length > 0) {
                                                const testMetrics = ctx.measureText(truncatedText);
                                                if (testMetrics && testMetrics.width <= maxWidth) {
                                                    break;
                                                }
                                                truncatedText = truncatedText.slice(0, -1);
                                            }
                                            lines = [truncatedText];
                                        }
                                    }
                                    
                                    // 计算所需总高度
                                    const totalHeight = lines.length * lineHeight;
                                    
                                    // 检查是否超出边界
                                    if (startY + totalHeight <= bottomBound) {
                                        return {
                                            fontSize: currentFontSize,
                                            lineHeight: lineHeight,
                                            lines: lines
                                        };
                                    }
                                    
                                    // 如果超出边界，减小字体大小
                                    currentFontSize *= 0.9; // 每次减少10%
                                }
                                
                                // 如果即使是最小字体也超出边界，使用最小字体和最小行高
                                ctx.font = `normal ${minFontSize}px STSong, "华文宋体", SimSun`;
                                const finalLineHeight = minFontSize * 1.5;
                                
                                // 最终处理：根据是否允许换行决定文本处理方式
                                let finalLines: string[];
                                if (allowWrap) {
                                    finalLines = wrapText(text, maxWidth);
                                } else {
                                    // 不允许换行：截断文本
                                    let truncatedText = text;
                                    while (truncatedText.length > 0) {
                                        const testMetrics = ctx.measureText(truncatedText);
                                        if (testMetrics && testMetrics.width <= maxWidth) {
                                            break;
                                        }
                                        truncatedText = truncatedText.slice(0, -1);
                                    }
                                    finalLines = [truncatedText];
                                }
                                
                                return {
                                    fontSize: minFontSize,
                                    lineHeight: finalLineHeight,
                                    lines: finalLines
                                };
                            };

                            // 绘制值 - 使用自适应边界约束
                            Object.values(obj).forEach((value, index) => {
                                const text = String(value);
                                const startY = textY[index];
                                const bottomBound = fieldBottomBounds[index];
                                const initialFontSize = fontSize[index];
                                
                                // 只有第二个字段（index=1）允许换行，其他字段不允许换行
                                const allowWrap = index === 1;
                                
                                // 使用自适应函数获取最优的字体大小、行高和文本行
                                const result = drawTextWithinBounds(text, startY, bottomBound, initialFontSize, 700, allowWrap);
                                
                                // 设置最终的字体大小
                                ctx.font = `normal ${result.fontSize}px STSong, "华文宋体", SimSun`;
                                
                                // 绘制多行文本
                                let currentY = startY;
                                result.lines.forEach((line) => {
                                    ctx.fillText(line, canvas.width / 2, currentY);
                                    currentY += result.lineHeight;
                                });
                            });

                            // 生成JPEG格式的DataURL
                            const dataUrl = canvas.toDataURL('image/jpeg', quality);

                            // 创建File对象
                            const blobBin = atob(dataUrl.split(',')[1]);
                            const array = [];
                            for(let i = 0; i < blobBin.length; i++) {
                                array.push(blobBin.charCodeAt(i));
                            }
                            const file = new File([new Uint8Array(array)], `${name}.jpg`, {type: 'image/jpeg'});

                            resolve({ dataUrl, image: file });
                        } catch (error) {
                            reject(error);
                        }
                    };

                    insertImage.onerror = () => {
                        reject(new Error('Failed to load insert image'));
                    };
                } catch (error) {
                    reject(error);
                }
            };

            backgroundImage.onerror = () => {
                reject(new Error('Failed to load background image'));
            };
        } catch (error) {
            reject(error);
        }
    });
};

export default CreateNftImage;