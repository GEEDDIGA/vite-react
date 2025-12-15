/**
 * Google Drive Service for Goolle Shop
 * Handles file uploads, downloads, and management with Google Drive API
 */

// Type declarations for Google APIs
declare const gapi: any;
declare const google: any;

const CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID;
const API_KEY = import.meta.env.VITE_GOOGLE_API_KEY;
const SCOPES = 'https://www.googleapis.com/auth/drive.file';
const DISCOVERY_DOC = 'https://www.googleapis.com/discovery/v1/apis/drive/v3/rest';

let gapiInited = false;
let gisInited = false;
let tokenClient: any;

export interface DriveFile {
  id: string;
  name: string;
  mimeType: string;
  webViewLink?: string;
  thumbnailLink?: string;
  createdTime?: string;
  size?: string;
}

/**
 * Initialize Google Drive API client
 */
export const initializeGoogleDrive = (): Promise<void> => {
  return new Promise((resolve, reject) => {
    try {
      // Initialize Google API client
      gapi.load('client', async () => {
        try {
          await gapi.client.init({
            apiKey: API_KEY,
            discoveryDocs: [DISCOVERY_DOC],
          });
          gapiInited = true;
          console.log('Google Drive API initialized');
          resolve();
        } catch (error) {
          console.error('Error initializing GAPI client:', error);
          reject(error);
        }
      });

      // Initialize Google Identity Services
      tokenClient = google.accounts.oauth2.initTokenClient({
        client_id: CLIENT_ID,
        scope: SCOPES,
        callback: '', // defined at request time
      });
      gisInited = true;
    } catch (error) {
      console.error('Error initializing Google Drive:', error);
      reject(error);
    }
  });
};

/**
 * Request access token and authorize user
 */
export const authorizeGoogleDrive = (): Promise<any> => {
  return new Promise((resolve, reject) => {
    try {
      tokenClient.callback = async (response: any) => {
        if (response.error !== undefined) {
          reject(response);
        }
        resolve(response);
      };

      if (gapi.client.getToken() === null) {
        // Prompt the user to select a Google Account and ask for consent
        tokenClient.requestAccessToken({ prompt: 'consent' });
      } else {
        // Skip display of account chooser and consent dialog
        tokenClient.requestAccessToken({ prompt: '' });
      }
    } catch (error) {
      reject(error);
    }
  });
};

/**
 * Sign out from Google Drive
 */
export const signOutGoogleDrive = () => {
  const token = gapi.client.getToken();
  if (token !== null) {
    google.accounts.oauth2.revoke(token.access_token);
    gapi.client.setToken('');
  }
};

/**
 * Check if user is currently signed in
 */
export const isSignedIn = (): boolean => {
  return gapi.client.getToken() !== null;
};

/**
 * Upload a file to Google Drive
 */
export const uploadFile = async (
  file: File,
  folderId?: string
): Promise<DriveFile> => {
  try {
    const metadata: any = {
      name: file.name,
      mimeType: file.type,
    };

    if (folderId) {
      metadata.parents = [folderId];
    }

    const form = new FormData();
    form.append(
      'metadata',
      new Blob([JSON.stringify(metadata)], { type: 'application/json' })
    );
    form.append('file', file);

    const token = gapi.client.getToken();
    const response = await fetch(
      'https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart&fields=id,name,mimeType,webViewLink,thumbnailLink,createdTime,size',
      {
        method: 'POST',
        headers: new Headers({ Authorization: `Bearer ${token.access_token}` }),
        body: form,
      }
    );

    if (!response.ok) {
      throw new Error(`Upload failed: ${response.statusText}`);
    }

    const result = await response.json();
    console.log('File uploaded successfully:', result);
    return result as DriveFile;
  } catch (error) {
    console.error('Error uploading file:', error);
    throw error;
  }
};

/**
 * List files from Google Drive
 */
export const listFiles = async (pageSize: number = 10): Promise<DriveFile[]> => {
  try {
    const response = await gapi.client.drive.files.list({
      pageSize,
      fields: 'files(id, name, mimeType, webViewLink, thumbnailLink, createdTime, size)',
      orderBy: 'createdTime desc',
    });

    return response.result.files as DriveFile[];
  } catch (error) {
    console.error('Error listing files:', error);
    throw error;
  }
};

/**
 * Delete a file from Google Drive
 */
export const deleteFile = async (fileId: string): Promise<void> => {
  try {
    await gapi.client.drive.files.delete({
      fileId,
    });
    console.log('File deleted successfully:', fileId);
  } catch (error) {
    console.error('Error deleting file:', error);
    throw error;
  }
};

/**
 * Get file metadata
 */
export const getFileMetadata = async (fileId: string): Promise<DriveFile> => {
  try {
    const response = await gapi.client.drive.files.get({
      fileId,
      fields: 'id, name, mimeType, webViewLink, thumbnailLink, createdTime, size',
    });

    return response.result as DriveFile;
  } catch (error) {
    console.error('Error getting file metadata:', error);
    throw error;
  }
};

/**
 * Create a folder in Google Drive
 */
export const createFolder = async (
  folderName: string,
  parentFolderId?: string
): Promise<DriveFile> => {
  try {
    const metadata: any = {
      name: folderName,
      mimeType: 'application/vnd.google-apps.folder',
    };

    if (parentFolderId) {
      metadata.parents = [parentFolderId];
    }

    const response = await gapi.client.drive.files.create({
      resource: metadata,
      fields: 'id, name',
    });

    console.log('Folder created successfully:', response.result);
    return response.result as DriveFile;
  } catch (error) {
    console.error('Error creating folder:', error);
    throw error;
  }
};

/**
 * Search files by name
 */
export const searchFiles = async (query: string): Promise<DriveFile[]> => {
  try {
    const response = await gapi.client.drive.files.list({
      q: `name contains '${query}'`,
      fields: 'files(id, name, mimeType, webViewLink, thumbnailLink, createdTime, size)',
      orderBy: 'createdTime desc',
    });

    return response.result.files as DriveFile[];
  } catch (error) {
    console.error('Error searching files:', error);
    throw error;
  }
};

export default {
  initializeGoogleDrive,
  authorizeGoogleDrive,
  signOutGoogleDrive,
  isSignedIn,
  uploadFile,
  listFiles,
  deleteFile,
  getFileMetadata,
  createFolder,
  searchFiles,
};
