interface ImageResult {
    dataUrl: string;
    image: File;
}

// interface TextConfig {
//     font: string;
//     size: number;
//     y: number;
// }

import fonts from '/font/STSONG.ttf'

const textY = [490,570,820,860,930] // 5 starting Y coordinates - the 4th field Y=860, the 5th field Y=930
const fontSize = [45,30,30,30,25] // 5 font sizes

// Define bottom boundaries for all fields
const fieldBottomBounds = [
  560,  // The 1st field bottom boundary (Y start 490 + 70px space)
  790,  // The 2nd field bottom boundary (Y start 570 + 220px space)
  900,  // The 3rd field bottom boundary (Y start 820 + 80px space)
  950,  // The 4th field bottom boundary (Y start 860 + 90px space) - increase space
  1000 // The 5th field bottom boundary (Y start 930 + 70px space)
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

// Load font
const loadFont = async () => {
    try {
        // Create a new style element
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

        // Create and load font
        const fontFace = new FontFace('STSong', `url(${fonts})`);
        const loadedFont = await fontFace.load();
        document.fonts.add(loadedFont);

        // Wait for font to load completely
        await document.fonts.ready;

        // Verify if font loaded successfully
        const testDiv = document.createElement('div');
        testDiv.style.fontFamily = 'STSong';
        testDiv.style.visibility = 'hidden';
        testDiv.textContent = 'Testing text';
        document.body.appendChild(testDiv);
        
        // Ensure font is applied
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
            // First load font and wait for completion
            await loadFont();
            
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');
            if (!ctx) throw new Error('Can`t create canvas context');

            // Set canvas size to 1080x1080
            canvas.width = 1080;
            canvas.height = 1080;

            // Load background image
            const backgroundImage = new Image();
            backgroundImage.crossOrigin = 'anonymous';
            backgroundImage.src = typeof nftBackground === 'string' ? nftBackground : nftBackground.src;

            backgroundImage.onload = () => {
                try {
                    // Check if image is a square
                    if (backgroundImage.width !== backgroundImage.height) {
                        throw new Error('The background image must be a square');
                    }

                    // Draw background image
                    ctx.drawImage(backgroundImage, 0, 0, canvas.width, canvas.height);
                    
                    // Load insert image
                    const insertImage = new Image();
                    insertImage.crossOrigin = 'anonymous';
                    if (typeof insertImageUrl === 'string') {
                        insertImage.src = insertImageUrl;
                    } else {
                        insertImage.src = URL.createObjectURL(insertImageUrl);
                    }
                    
                    insertImage.onload = () => {
                        try {
                            // Create temporary canvas for handling gradient
                            const tempCanvas = document.createElement('canvas');
                            tempCanvas.width = AddImageProps.width;
                            tempCanvas.height = AddImageProps.height;
                            const tempCtx = tempCanvas.getContext('2d')!;
                            
                            // Draw insert image to temporary canvas (keep original ratio, center crop)
                            const imgRatio = insertImage.width / insertImage.height;
                            const containerRatio = AddImageProps.width / AddImageProps.height;
                            
                            let sourceX = 0;
                            let sourceY = 0;
                            let sourceWidth = insertImage.width;
                            let sourceHeight = insertImage.height;
                            
                            // Calculate crop area, keep original ratio
                            if (imgRatio > containerRatio) {
                                // Image is wider, crop left and right
                                sourceWidth = insertImage.height * containerRatio;
                                sourceX = (insertImage.width - sourceWidth) / 2;
                            } else if (imgRatio < containerRatio) {
                                // Image is taller, crop top and bottom
                                sourceHeight = insertImage.width / containerRatio;
                                sourceY = (insertImage.height - sourceHeight) / 2;
                            }
                            
                            // Apply rounded path
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
                            
                            // Draw image (keep original ratio)
                            tempCtx.drawImage(
                                insertImage,
                                sourceX, sourceY, sourceWidth, sourceHeight,
                                0, 0, AddImageProps.width, AddImageProps.height
                            );
                            
                            // Create linear gradient mask (top transparent, bottom opaque)
                            const gradient = tempCtx.createLinearGradient(0, 0, 0, AddImageProps.height);
                            gradient.addColorStop(0, 'rgba(0,0,0,0)'); // Top completely transparent
                            gradient.addColorStop(1, 'rgba(0,0,0,1)'); // Bottom completely opaque
                            
                            // Apply gradient mask
                            tempCtx.globalCompositeOperation = 'destination-in';
                            tempCtx.fillStyle = gradient;
                            tempCtx.fillRect(0, 0, AddImageProps.width, AddImageProps.height);
                            
                            // Reset blend mode
                            tempCtx.globalCompositeOperation = 'source-over';
                            
                            // Draw the processed image with gradient effect to the main canvas
                            ctx.drawImage(
                                tempCanvas,
                                AddImageProps.startX, AddImageProps.startY
                            );
                            
                            // Set basic text style
                            ctx.fillStyle = '#FFFFFF';
                            ctx.textAlign = 'center';
                            ctx.textBaseline = 'middle';

                            // Check if it is an English character
                            const isEnglishChar = (char: string): boolean => {
                                return /[a-zA-Z]/.test(char);
                            };

                            // Improved text wrapping function
                            const wrapText = (text: string, maxWidth: number): string[] => {
                                const lines: string[] = [];
                                let currentLine = '';
                                let currentWord = '';
                                let isInEnglishWord = false;

                                for (let i = 0; i < text.length; i++) {
                                    const char = text[i];
                                    
                                    // Process English word
                                    if (isEnglishChar(char)) {
                                        currentWord += char;
                                        isInEnglishWord = true;
                                        
                                        // If it is the last character, need to process the remaining word
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
                                    
                                    // English word ends (encounter space or punctuation)
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

                                    // Process Chinese characters
                                    const testLine = currentLine + char;
                                    if (ctx.measureText(testLine).width <= maxWidth) {
                                        currentLine = testLine;
                                    } else {
                                        if (currentLine) lines.push(currentLine);
                                        currentLine = char;
                                    }
                                }

                                // Add the last line
                                if (currentLine) {
                                    lines.push(currentLine);
                                }

                                return lines;
                            };

                            // Adaptive text drawing function - dynamically adjust font size and line height within boundaries
                            const drawTextWithinBounds = (
                                text: string, 
                                startY: number, 
                                bottomBound: number, 
                                initialFontSize: number, 
                                maxWidth: number,
                                allowWrap: boolean = true
                            ): { fontSize: number; lineHeight: number; lines: string[] } => {
                                let currentFontSize = initialFontSize;
                                const minFontSize = initialFontSize * 0.6; // Minimum font size coefficient
                                
                                while (currentFontSize >= minFontSize) {
                                    // Set current font size
                                    ctx.font = `normal ${currentFontSize}px STSong, "华文宋体", SimSun`;
                                    
                                    // Calculate line height (dynamically adjust, keep readability)
                                    const lineHeight = currentFontSize * (currentFontSize >= 25 ? 1.8 : 1.6);
                                    
                                    // Determine text processing based on whether wrapping is allowed
                                    let lines: string[];
                                    if (allowWrap) {
                                        // Allow wrapping: use wrapText function
                                        lines = wrapText(text, maxWidth);
                                    } else {
                                        // Do not allow wrapping: check if single line exceeds width, if it does, truncate
                                        const textMetrics = ctx.measureText(text);
                                        if (textMetrics && textMetrics.width <= maxWidth) {
                                            lines = [text]; // Single line display
                                        } else {
                                            // Text exceeds width, need to truncate
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
                                    
                                    // Calculate total required height
                                    const totalHeight = lines.length * lineHeight;
                                    
                                    // Check if it exceeds boundaries
                                    if (startY + totalHeight <= bottomBound) {
                                        return {
                                            fontSize: currentFontSize,
                                            lineHeight: lineHeight,
                                            lines: lines
                                        };
                                    }
                                    
                                    // If it exceeds boundaries, decrease font size
                                    currentFontSize *= 0.9; // 每次减少10%
                                }
                                
                                // If even the smallest font exceeds boundaries, use the smallest font and the smallest line height
                                ctx.font = `normal ${minFontSize}px STSong, "华文宋体", SimSun`;
                                const finalLineHeight = minFontSize * 1.5;
                                
                                // Final processing: determine text processing based on whether wrapping is allowed
                                let finalLines: string[];
                                if (allowWrap) {
                                    finalLines = wrapText(text, maxWidth);
                                } else {
                                    // Do not allow wrapping: truncate text
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

                            // Draw value - use adaptive boundary constraint
                            Object.values(obj).forEach((value, index) => {
                                const text = String(value);
                                const startY = textY[index];
                                const bottomBound = fieldBottomBounds[index];
                                const initialFontSize = fontSize[index];
                                
                                // Only the second field (index=1) allows wrapping, other fields do not allow wrapping
                                const allowWrap = index === 1;
                                
                                // Use adaptive function to get the optimal font size, line height and text lines
                                const result = drawTextWithinBounds(text, startY, bottomBound, initialFontSize, 700, allowWrap);
                                
                                // Set final font size
                                ctx.font = `normal ${result.fontSize}px STSong, "华文宋体", SimSun`;
                                
                                // Draw multiple lines of text
                                let currentY = startY;
                                result.lines.forEach((line) => {
                                    ctx.fillText(line, canvas.width / 2, currentY);
                                    currentY += result.lineHeight;
                                });
                            });

                            // Generate JPEG format DataURL
                            const dataUrl = canvas.toDataURL('image/jpeg', quality);

                            // Create File object
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