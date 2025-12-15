import React, { useState, useEffect } from 'react';
import {
  initializeGoogleDrive,
  authorizeGoogleDrive,
  isSignedIn,
  signOutGoogleDrive,
  uploadFile,
  listFiles,
  deleteFile,
  createFolder,
  searchFiles,
  getFileMetadata,
  type DriveFile
} from '../services/googleDrive';

interface GoogleDriveUploadProps {
  onFileUploaded?: (file: DriveFile) => void;
  onError?: (error: Error) => void;
}

const GoogleDriveUpload: React.FC<GoogleDriveUploadProps> = ({
  onFileUploaded,
  onError
}) => {
  const [isInitialized, setIsInitialized] = useState(false);
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [files, setFiles] = useState<DriveFile[]>([]);
  const [loading, setLoading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [selectedFolder, setSelectedFolder] = useState<string>('root');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const init = async () => {
      try {
        await initializeGoogleDrive();
        setIsInitialized(true);
        
        const signedIn = await isSignedIn();
        setIsAuthorized(signedIn);
        
        if (signedIn) {
          await loadFiles();
        }
      } catch (error) {
        console.error('Failed to initialize Google Drive:', error);
        onError?.(error as Error);
      }
    };
    
    init();
  }, []);

  const loadFiles = async () => {
    try {
      setLoading(true);
      const fileList = await listFiles(selectedFolder);
      setFiles(fileList);
    } catch (error) {
      console.error('Failed to load files:', error);
      onError?.(error as Error);
    } finally {
      setLoading(false);
    }
  };

  const handleAuthorize = async () => {
    try {
      await authorizeGoogleDrive();
      setIsAuthorized(true);
      await loadFiles();
    } catch (error) {
      console.error('Authorization failed:', error);
      onError?.(error as Error);
    }
  };

  const handleSignOut = async () => {
    try {
      await signOutGoogleDrive();
      setIsAuthorized(false);
      setFiles([]);
    } catch (error) {
      console.error('Sign out failed:', error);
      onError?.(error as Error);
    }
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const fileInput = event.target.files?.[0];
    if (!fileInput) return;

    try {
      setLoading(true);
      setUploadProgress(0);
      
      const uploadedFile = await uploadFile(
        fileInput,
        selectedFolder,
        (progress) => setUploadProgress(progress)
      );
      
      onFileUploaded?.(uploadedFile);
      await loadFiles();
      setUploadProgress(0);
    } catch (error) {
      console.error('Upload failed:', error);
      onError?.(error as Error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteFile = async (fileId: string) => {
    try {
      setLoading(true);
      await deleteFile(fileId);
      await loadFiles();
    } catch (error) {
      console.error('Delete failed:', error);
      onError?.(error as Error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateFolder = async () => {
    const folderName = prompt('Enter folder name:');
    if (!folderName) return;

    try {
      setLoading(true);
      await createFolder(folderName, selectedFolder);
      await loadFiles();
    } catch (error) {
      console.error('Create folder failed:', error);
      onError?.(error as Error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async () => {
    if (!searchQuery.trim()) {
      await loadFiles();
      return;
    }

    try {
      setLoading(true);
      const searchResults = await searchFiles(searchQuery);
      setFiles(searchResults);
    } catch (error) {
      console.error('Search failed:', error);
      onError?.(error as Error);
    } finally {
      setLoading(false);
    }
  };

  if (!isInitialized) {
    return <div className="google-drive-loading">Initializing Google Drive...</div>;
  }

  if (!isAuthorized) {
    return (
      <div className="google-drive-auth">
        <h3>Google Drive Integration</h3>
        <p>Connect your Google Drive to upload and manage files</p>
        <button onClick={handleAuthorize} className="auth-button">
          Connect Google Drive
        </button>
      </div>
    );
  }

  return (
    <div className="google-drive-container">
      <div className="google-drive-header">
        <h3>Google Drive</h3>
        <button onClick={handleSignOut} className="sign-out-button">
          Sign Out
        </button>
      </div>

      <div className="google-drive-controls">
        <div className="search-bar">
          <input
            type="text"
            placeholder="Search files..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
          />
          <button onClick={handleSearch}>Search</button>
        </div>

        <div className="action-buttons">
          <button onClick={handleCreateFolder} disabled={loading}>
            Create Folder
          </button>
          <label className="upload-button">
            Upload File
            <input
              type="file"
              onChange={handleFileUpload}
              disabled={loading}
              style={{ display: 'none' }}
            />
          </label>
        </div>
      </div>

      {uploadProgress > 0 && uploadProgress < 100 && (
        <div className="upload-progress">
          <div className="progress-bar">
            <div
              className="progress-fill"
              style={{ width: `${uploadProgress}%` }}
            />
          </div>
          <span>{uploadProgress}%</span>
        </div>
      )}

      <div className="google-drive-files">
        {loading && files.length === 0 ? (
          <div className="loading">Loading files...</div>
        ) : files.length === 0 ? (
          <div className="no-files">No files found</div>
        ) : (
          <ul className="file-list">
            {files.map((file) => (
              <li key={file.id} className="file-item">
                <div className="file-info">
                  <span className="file-icon">
                    {file.mimeType === 'application/vnd.google-apps.folder'
                      ? '📁'
                      : '📄'}
                  </span>
                  <div className="file-details">
                    <span className="file-name">{file.name}</span>
                    {file.size && (
                      <span className="file-size">
                        {(parseInt(file.size) / 1024 / 1024).toFixed(2)} MB
                      </span>
                    )}
                  </div>
                </div>
                <div className="file-actions">
                  {file.webViewLink && (
                    <a
                      href={file.webViewLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="file-action-button"
                    >
                      View
                    </a>
                  )}
                  <button
                    onClick={() => handleDeleteFile(file.id)}
                    disabled={loading}
                    className="file-action-button delete"
                  >
                    Delete
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default GoogleDriveUpload;
