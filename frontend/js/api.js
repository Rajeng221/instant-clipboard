// Automatically current host IP detect karega (localhost ya 192.168.x.x)
const HOSTNAME = window.location.hostname;
const API_BASE_URL = `http://${HOSTNAME}:5001/api`;

/**
 * Share text or file metadata
 */
window.apiShareClipboard = async function(payload) {
  try {
    const response = await fetch(`${API_BASE_URL}/share`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.error || 'Failed to share data');
    }
    return data;
  } catch (err) {
    console.error('API share error:', err);
    throw err;
  }
};

/**
 * Retrieve data using 6-digit code
 */
window.apiRetrieveClipboard = async function(code) {
  try {
    const response = await fetch(`${API_BASE_URL}/retrieve/${code}`);
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || 'Failed to retrieve data');
    }
    return data.data;
  } catch (err) {
    console.error('API retrieve error:', err);
    throw err;
  }
};

/**
 * Request Cloud Presigned Upload URL
 */
window.getUploadUrl = async function(fileName, fileType) {
  try {
    const response = await fetch(`${API_BASE_URL}/upload-url`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ fileName, fileType }),
    });

    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.error || 'Failed to get upload URL');
    }
    return data;
  } catch (err) {
    console.error('API upload URL error:', err);
    throw err;
  }
};