
export function generateNFTPreviewHTML(dataUrl: string, imageName: string): string {
    return `
    <!DOCTYPE html>
    <html lang="zh-CN">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>NFT Preview - ${imageName}</title>
        <style>
          * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
          }

          body {
            margin: 0;
            padding: 20px;
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            min-height: 100vh;
            background: linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%);
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen',
              'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif;
          }

          .container {
            display: flex;
            flex-direction: column;
            align-items: center;
            gap: 20px;
            max-width: 95vw;
          }

          .image-wrapper {
            position: relative;
            border-radius: 12px;
            overflow: hidden;
            box-shadow: 
              0 10px 40px rgba(0, 0, 0, 0.6),
              0 0 80px rgba(138, 43, 226, 0.2);
            background: #000;
          }

          img {
            display: block;
            max-width: 90vw;
            max-height: 80vh;
            width: auto;
            height: auto;
            object-fit: contain;
          }

          .info-bar {
            background: rgba(255, 255, 255, 0.05);
            backdrop-filter: blur(10px);
            border: 1px solid rgba(255, 255, 255, 0.1);
            border-radius: 8px;
            padding: 16px 24px;
            color: #fff;
            display: flex;
            align-items: center;
            gap: 16px;
            min-width: 300px;
          }

          .info-item {
            display: flex;
            align-items: center;
            gap: 8px;
          }

          .label {
            color: rgba(255, 255, 255, 0.6);
            font-size: 14px;
          }

          .value {
            color: #fff;
            font-size: 14px;
            font-weight: 500;
          }

          .success-badge {
            display: inline-flex;
            align-items: center;
            gap: 6px;
            background: rgba(46, 213, 115, 0.15);
            border: 1px solid rgba(46, 213, 115, 0.3);
            color: #2ed573;
            padding: 6px 12px;
            border-radius: 20px;
            font-size: 13px;
            font-weight: 500;
          }

          .success-badge::before {
            content: "✓";
            font-weight: bold;
          }

          .download-btn {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            border: none;
            padding: 12px 24px;
            border-radius: 8px;
            font-size: 14px;
            font-weight: 500;
            cursor: pointer;
            transition: all 0.3s ease;
            box-shadow: 0 4px 15px rgba(102, 126, 234, 0.4);
          }

          .download-btn:hover {
            transform: translateY(-2px);
            box-shadow: 0 6px 20px rgba(102, 126, 234, 0.6);
          }

          .download-btn:active {
            transform: translateY(0);
          }

          @media (max-width: 768px) {
            body {
              padding: 10px;
            }

            .info-bar {
              flex-direction: column;
              align-items: flex-start;
              min-width: unset;
              width: 100%;
            }

            img {
              max-width: 95vw;
              max-height: 70vh;
            }
          }

          /* Loading animation */
          .loading {
            opacity: 0;
            animation: fadeIn 0.3s ease-in forwards;
          }

          @keyframes fadeIn {
            to {
              opacity: 1;
            }
          }
        </style>
      </head>
      <body>
        <div class="container loading">
          <div class="image-wrapper">
            <img src="${dataUrl}" alt="NFT Image Preview" id="nftImage" />
          </div>
          
          <div class="info-bar">
            <div class="success-badge">Success</div>
            <div class="info-item">
              <span class="label">File Name:</span>
              <span class="value">${imageName}.jpg</span>
            </div>
            <button class="download-btn" onclick="downloadImage()">
              💾 Download
            </button>
          </div>
        </div>

        <script>
          // When the image is loaded, display the fade-in animation
          const img = document.getElementById('nftImage');
          img.onload = function() {
            document.querySelector('.container').classList.add('loading');
          };

          // Download image function
          function downloadImage() {
            const link = document.createElement('a');
            link.href = "${dataUrl}";
            link.download = "${imageName}.jpg";
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
          }

          // Keyboard shortcut: Ctrl/Cmd + S download
          document.addEventListener('keydown', function(e) {
            if ((e.ctrlKey || e.metaKey) && e.key === 's') {
              e.preventDefault();
              downloadImage();
            }
          });
        </script>
      </body>
    </html>
  `;
}

/**
 * Open NFT preview in a new window
 * 
 * @param dataUrl - Base64 encoded image data
 * @param imageName - Image name
 * @returns New window object (if opened successfully)
 */
export function openNFTPreview(dataUrl: string, imageName: string): Window | null {
    try {

        const newWindow = window.open('', '_blank');

        if (!newWindow) {
            console.warn('[NFT Preview] Failed to open window - likely blocked by popup blocker');
            alert('⚠️ Browser blocked the popup, please allow the popup and try again, or manually view the generated NFT image.');
            return null;
        }

        // console.log('[NFT Preview] Window opened successfully, writing HTML content...');
        
        const htmlContent = generateNFTPreviewHTML(dataUrl, imageName);
        newWindow.document.write(htmlContent);
        newWindow.document.close();
        
        // console.log('[NFT Preview] HTML content written successfully');
        
        return newWindow;
    } catch (error) {
        console.error('[NFT Preview] Error opening preview:', error);
        alert(`❌ Failed to open preview window: ${error instanceof Error ? error.message : 'Unknown error'}`);
        return null;
    }
}

