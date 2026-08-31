/**
 * Direct Cloud Upload Handler.
 * Uploads files directly to S3/R2 via presigned URLs.
 * Automatically falls back to base64 encoding if cloud storage is unconfigured or fails.
 *
 * @param {File} file - The file object from input or clipboard paste
 * @returns {Promise<{fileUrl: string, fileName: string, fileType: string}>}
 */
window.handleFileUpload = async function (file) {
  if (!file) return null;

  // 1. Attempt Cloud Presigned Upload if API function exists
  if (typeof window.getUploadUrl === 'function') {
    try {
      const uploadDetails = await window.getUploadUrl(file.name, file.type || 'application/octet-stream');

      if (uploadDetails && uploadDetails.uploadUrl) {
        const uploadRes = await fetch(uploadDetails.uploadUrl, {
          method: 'PUT',
          headers: {
            'Content-Type': file.type || 'application/octet-stream',
          },
          body: file,
        });

        if (uploadRes.ok) {
          const publicUrl = uploadDetails.fileUrl || uploadDetails.uploadUrl.split('?')[0];
          return {
            fileUrl: publicUrl,
            fileName: file.name,
            fileType: file.type || 'application/octet-stream',
          };
        }
      }
    } catch (err) {
      console.warn('Cloud upload bypassed or failed, using local base64 fallback:', err.message);
    }
  }

  // 2. Fallback for Local Development / Testing without S3 credentials (< 5MB)
  if (file.size <= 5 * 1024 * 1024) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        resolve({
          fileUrl: reader.result,
          fileName: file.name,
          fileType: file.type || 'application/octet-stream',
        });
      };
      reader.onerror = () => reject(new Error('Failed to read local file data.'));
      reader.readAsDataURL(file);
    });
  }

  throw new Error('File exceeds 5MB. Cloud storage configuration required for large files.');
};