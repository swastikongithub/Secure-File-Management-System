import { useState, useEffect } from "react";
import {
  AlertCircle,
  CheckCircle,
  EyeOff,
  Eye,
  File,
  FileText,
  Image,
  Download,
  Share2,
  Trash2,
  Lock,
  Shield,
  User,
  LogOut,
  Settings,
  Plus,
  X,
} from "lucide-react";

export default function SecureFileManagement() {
  // Authentication state
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isTwoFactorComplete, setIsTwoFactorComplete] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [loginError, setLoginError] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [twoFactorCode, setTwoFactorCode] = useState("");
  const [verificationState, setVerificationState] = useState(null);

  // File management state
  const [files, setFiles] = useState([]);
  const [selectedFile, setSelectedFile] = useState(null);
  const [showShareModal, setShowShareModal] = useState(false);
  const [shareEmail, setShareEmail] = useState("");
  const [sharePermission, setSharePermission] = useState("read");
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [uploadName, setUploadName] = useState("");
  const [uploadType, setUploadType] = useState("document");
  const [notification, setNotification] = useState(null);

  // Sample files data
  useEffect(() => {
    if (isAuthenticated && isTwoFactorComplete) {
      setFiles([
        {
          id: 1,
          name: "Financial Report 2025.pdf",
          type: "document",
          size: "2.4 MB",
          modified: "2025-04-10",
          owner: "me",
          shared: ["alice@example.com"],
          encrypted: true,
        },
        {
          id: 2,
          name: "Project Roadmap.docx",
          type: "document",
          size: "1.1 MB",
          modified: "2025-04-05",
          owner: "me",
          shared: [],
          encrypted: true,
        },
        {
          id: 3,
          name: "Team Photo.jpg",
          type: "image",
          size: "3.8 MB",
          modified: "2025-03-22",
          owner: "bob@example.com",
          shared: ["me"],
          encrypted: true,
        },
        {
          id: 4,
          name: "Security Protocol.pdf",
          type: "document",
          size: "0.9 MB",
          modified: "2025-04-12",
          owner: "me",
          shared: [],
          encrypted: true,
        },
        {
          id: 5,
          name: "Budget 2025.xlsx",
          type: "spreadsheet",
          size: "1.6 MB",
          modified: "2025-04-01",
          owner: "me",
          shared: ["charlie@example.com", "dave@example.com"],
          encrypted: true,
        },
      ]);
    }
  }, [isAuthenticated, isTwoFactorComplete]);

  // Authentication handlers
  const handleLogin = (e) => {
    e.preventDefault();
    if (username === "demo" && password === "secure123") {
      setLoginError("");
      setIsAuthenticated(true);
    } else {
      setLoginError("Invalid username or password");
    }
  };

  const handleTwoFactorSubmit = (e) => {
    e.preventDefault();
    if (twoFactorCode === "123456") {
      setIsTwoFactorComplete(true);
      showNotification("Successfully authenticated", "success");
    } else {
      setVerificationState("error");
      setTimeout(() => setVerificationState(null), 2000);
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setIsTwoFactorComplete(false);
    setUsername("");
    setPassword("");
    setTwoFactorCode("");
  };

  // File operations
  const handleFileSelect = (file) => {
    setSelectedFile(file === selectedFile ? null : file);
  };

  const handleFileDelete = (id) => {
    setFiles(files.filter((file) => file.id !== id));
    if (selectedFile && selectedFile.id === id) {
      setSelectedFile(null);
    }
    showNotification("File deleted securely", "success");
  };

  const handleFileDownload = (file) => {
    showNotification(`Decrypting and downloading ${file.name}`, "success");
  };

  const handleFileShare = () => {
    if (!shareEmail) {
      showNotification("Please enter an email address", "error");
      return;
    }

    if (selectedFile) {
      const updatedFiles = files.map((file) => {
        if (file.id === selectedFile.id) {
          return {
            ...file,
            shared: [...file.shared, shareEmail],
          };
        }
        return file;
      });

      setFiles(updatedFiles);
      setShowShareModal(false);
      setShareEmail("");
      showNotification(
        `Securely shared ${selectedFile.name} with ${shareEmail}`,
        "success"
      );
    }
  };

  const handleFileUpload = () => {
    if (!uploadName) {
      showNotification("Please enter a file name", "error");
      return;
    }

    const newFile = {
      id: files.length + 1,
      name: uploadName + getFileExtension(uploadType),
      type: uploadType,
      size: Math.floor(Math.random() * 5 + 0.5).toFixed(1) + " MB",
      modified: new Date().toISOString().split("T")[0],
      owner: "me",
      shared: [],
      encrypted: true,
    };

    setFiles([newFile, ...files]);
    setShowUploadModal(false);
    setUploadName("");
    showNotification("File encrypted and uploaded securely", "success");
  };

  const getFileExtension = (type) => {
    switch (type) {
      case "document":
        return ".pdf";
      case "spreadsheet":
        return ".xlsx";
      case "image":
        return ".jpg";
      default:
        return ".txt";
    }
  };

  // Helper functions
  const showNotification = (message, type) => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3000);
  };

  const getFileIcon = (type) => {
    switch (type) {
      case "document":
        return <FileText className="w-5 h-5 text-blue-500" />;
      case "spreadsheet":
        return <FileText className="w-5 h-5 text-green-500" />;
      case "image":
        return <Image className="w-5 h-5 text-purple-500" />;
      default:
        return <File className="w-5 h-5 text-gray-500" />;
    }
  };

  // Render login screen
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col justify-center">
        <div className="max-w-md w-full mx-auto">
          <div className="bg-white p-8 rounded-lg shadow-lg">
            <div className="flex justify-center mb-6">
              <Shield className="h-12 w-12 text-blue-600" />
            </div>
            <h2 className="text-center text-2xl font-bold text-gray-800 mb-6">
              Secure File Manager
            </h2>

            <form onSubmit={handleLogin}>
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-medium mb-2">
                  Username
                </label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                />
              </div>

              <div className="mb-6">
                <label className="block text-gray-700 text-sm font-medium mb-2">
                  Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-500"
                  >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
              </div>

              {loginError && (
                <div className="mb-4 p-2 bg-red-100 text-red-700 rounded-md flex items-center">
                  <AlertCircle size={16} className="mr-2" />
                  {loginError}
                </div>
              )}

              <button
                type="submit"
                className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              >
                Log In
              </button>

              <div className="mt-4 text-center text-sm text-gray-500">
                <p>Demo credentials: demo / secure123</p>
              </div>
            </form>
          </div>
        </div>
      </div>
    );
  }

  // Render 2FA screen
  if (isAuthenticated && !isTwoFactorComplete) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col justify-center">
        <div className="max-w-md w-full mx-auto">
          <div className="bg-white p-8 rounded-lg shadow-lg">
            <div className="flex justify-center mb-6">
              <Lock className="h-12 w-12 text-blue-600" />
            </div>
            <h2 className="text-center text-2xl font-bold text-gray-800 mb-2">
              Two-Factor Authentication
            </h2>
            <p className="text-center text-gray-600 mb-6">
              Enter the verification code sent to your device
            </p>

            <form onSubmit={handleTwoFactorSubmit}>
              <div className="mb-6">
                <input
                  type="text"
                  className={`w-full px-3 py-2 border text-center text-xl tracking-widest
                    ${
                      verificationState === "error"
                        ? "border-red-500 bg-red-50"
                        : "border-gray-300"
                    } 
                    rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500`}
                  maxLength="6"
                  value={twoFactorCode}
                  onChange={(e) =>
                    setTwoFactorCode(e.target.value.replace(/[^0-9]/g, ""))
                  }
                  required
                />
                {verificationState === "error" && (
                  <p className="mt-2 text-sm text-red-600">
                    Invalid verification code
                  </p>
                )}
              </div>

              <button
                type="submit"
                className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              >
                Verify
              </button>

              <div className="mt-4 text-center text-sm text-gray-500">
                <p>Demo code: 123456</p>
              </div>
            </form>
          </div>
        </div>
      </div>
    );
  }

  // Main file manager UI
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <div className="flex items-center">
            <Shield className="h-8 w-8 text-blue-600 mr-3" />
            <h1 className="text-xl font-bold text-gray-800">
              Secure File Manager
            </h1>
          </div>
          <div className="flex items-center space-x-4">
            <button className="text-gray-500 hover:text-gray-700 p-1">
              <Settings size={20} />
            </button>
            <div className="flex items-center">
              <div className="bg-blue-100 text-blue-800 rounded-full p-1 mr-2">
                <User size={18} />
              </div>
              <span className="text-sm font-medium text-gray-700">
                {username}
              </span>
            </div>
            <button
              onClick={handleLogout}
              className="text-gray-500 hover:text-red-600 p-1"
            >
              <LogOut size={20} />
            </button>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="flex-grow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          {/* Notification */}
          {notification && (
            <div
              className={`mb-4 p-3 rounded-md flex items-center justify-between ${
                notification.type === "success" ? "bg-green-100" : "bg-red-100"
              }`}
            >
              <div className="flex items-center">
                {notification.type === "success" ? (
                  <CheckCircle size={18} className="text-green-600 mr-2" />
                ) : (
                  <AlertCircle size={18} className="text-red-600 mr-2" />
                )}
                <span
                  className={
                    notification.type === "success"
                      ? "text-green-800"
                      : "text-red-800"
                  }
                >
                  {notification.message}
                </span>
              </div>
              <button
                onClick={() => setNotification(null)}
                className="text-gray-500 hover:text-gray-700"
              >
                <X size={16} />
              </button>
            </div>
          )}

          {/* Action buttons */}
          <div className="mb-6 flex">
            <button
              onClick={() => setShowUploadModal(true)}
              className="bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 flex items-center"
            >
              <Plus size={18} className="mr-1" />
              Upload New File
            </button>
          </div>

          {/* Files list */}
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <div className="border-b border-gray-200 bg-gray-50 py-3 px-4 flex items-center justify-between">
              <h2 className="text-sm font-medium text-gray-700">
                Secure Files
              </h2>
              <div className="text-sm text-gray-500">{files.length} files</div>
            </div>

            <ul className="divide-y divide-gray-200">
              {files.map((file) => (
                <li
                  key={file.id}
                  className={`px-4 py-3 hover:bg-gray-50 cursor-pointer ${
                    selectedFile && selectedFile.id === file.id
                      ? "bg-blue-50"
                      : ""
                  }`}
                  onClick={() => handleFileSelect(file)}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center min-w-0">
                      <div className="flex-shrink-0 mr-3">
                        {getFileIcon(file.type)}
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate">
                          {file.name}
                        </p>
                        <div className="flex items-center mt-1">
                          <p className="text-xs text-gray-500 mr-2">
                            {file.size}
                          </p>
                          <p className="text-xs text-gray-500 mr-2">•</p>
                          <p className="text-xs text-gray-500 mr-2">
                            Modified {file.modified}
                          </p>
                          {file.encrypted && (
                            <>
                              <p className="text-xs text-gray-500 mr-2">•</p>
                              <div className="flex items-center">
                                <Lock
                                  size={12}
                                  className="text-green-600 mr-1"
                                />
                                <p className="text-xs text-green-600">
                                  Encrypted
                                </p>
                              </div>
                            </>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center">
                      {file.shared.length > 0 && (
                        <div className="flex items-center mr-4">
                          <Share2 size={16} className="text-blue-500 mr-1" />
                          <span className="text-xs text-gray-500">
                            {file.shared.length}
                          </span>
                        </div>
                      )}

                      <div className="flex space-x-2">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleFileDownload(file);
                          }}
                          className="text-gray-400 hover:text-blue-600 p-1"
                        >
                          <Download size={16} />
                        </button>

                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedFile(file);
                            setShowShareModal(true);
                          }}
                          className="text-gray-400 hover:text-blue-600 p-1"
                        >
                          <Share2 size={16} />
                        </button>

                        {file.owner === "me" && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleFileDelete(file.id);
                            }}
                            className="text-gray-400 hover:text-red-600 p-1"
                          >
                            <Trash2 size={16} />
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </li>
              ))}

              {files.length === 0 && (
                <li className="px-4 py-8 text-center">
                  <File className="mx-auto h-12 w-12 text-gray-300" />
                  <p className="mt-2 text-sm text-gray-500">
                    No files available
                  </p>
                </li>
              )}
            </ul>
          </div>
        </div>
      </main>

      {/* File metadata panel */}
      {selectedFile && (
        <div className="fixed inset-y-0 right-0 w-80 bg-white shadow-lg border-l border-gray-200 p-5 overflow-auto">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-medium text-gray-900">File Details</h3>
            <button
              onClick={() => setSelectedFile(null)}
              className="text-gray-400 hover:text-gray-500"
            >
              <X size={20} />
            </button>
          </div>

          <div className="mb-6 flex flex-col items-center">
            <div className="p-4 bg-gray-100 rounded-lg mb-3">
              {getFileIcon(selectedFile.type)}
            </div>
            <h4 className="text-md font-medium text-gray-900 text-center break-all">
              {selectedFile.name}
            </h4>
          </div>

          <div className="space-y-4">
            <div>
              <h5 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
                Properties
              </h5>
              <dl className="grid grid-cols-2 gap-x-4 gap-y-2">
                <dt className="text-sm text-gray-500">Type</dt>
                <dd className="text-sm text-gray-900 font-medium">
                  {selectedFile.type}
                </dd>

                <dt className="text-sm text-gray-500">Size</dt>
                <dd className="text-sm text-gray-900 font-medium">
                  {selectedFile.size}
                </dd>

                <dt className="text-sm text-gray-500">Modified</dt>
                <dd className="text-sm text-gray-900 font-medium">
                  {selectedFile.modified}
                </dd>

                <dt className="text-sm text-gray-500">Owner</dt>
                <dd className="text-sm text-gray-900 font-medium">
                  {selectedFile.owner === "me" ? "You" : selectedFile.owner}
                </dd>

                <dt className="text-sm text-gray-500">Encryption</dt>
                <dd className="text-sm text-gray-900 font-medium flex items-center">
                  {selectedFile.encrypted ? (
                    <>
                      <Lock size={14} className="text-green-600 mr-1" />
                      <span className="text-green-600">Encrypted</span>
                    </>
                  ) : (
                    "None"
                  )}
                </dd>
              </dl>
            </div>

            <div>
              <h5 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
                Shared With
              </h5>
              {selectedFile.shared.length > 0 ? (
                <ul className="space-y-1">
                  {selectedFile.shared.map((person, index) => (
                    <li
                      key={index}
                      className="text-sm flex items-center justify-between"
                    >
                      <span className="text-gray-900">{person}</span>
                      <span className="text-xs text-gray-500">Read</span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-sm text-gray-500">Not shared</p>
              )}
            </div>

            <div className="pt-4">
              <button
                onClick={() => handleFileDownload(selectedFile)}
                className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 flex items-center justify-center"
              >
                <Download size={16} className="mr-2" />
                Download
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Share modal */}
      {showShareModal && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium text-gray-900">Share File</h3>
              <button
                onClick={() => setShowShareModal(false)}
                className="text-gray-400 hover:text-gray-500"
              >
                <X size={20} />
              </button>
            </div>

            <div className="mb-4">
              <p className="text-sm text-gray-500">
                Sharing "{selectedFile?.name}"
              </p>
            </div>

            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email Address
              </label>
              <input
                type="email"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="example@email.com"
                value={shareEmail}
                onChange={(e) => setShareEmail(e.target.value)}
              />
            </div>

            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Permission
              </label>
              <select
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={sharePermission}
                onChange={(e) => setSharePermission(e.target.value)}
              >
                <option value="read">Read only</option>
                <option value="edit">Can edit</option>
                <option value="admin">Full access</option>
              </select>
            </div>

            <div className="flex justify-end">
              <button
                onClick={() => setShowShareModal(false)}
                className="mr-3 px-4 py-2 text-sm text-gray-700 hover:text-gray-500"
              >
                Cancel
              </button>
              <button
                onClick={handleFileShare}
                className="bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              >
                Share
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Upload modal */}
      {showUploadModal && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium text-gray-900">
                Upload New File
              </h3>
              <button
                onClick={() => setShowUploadModal(false)}
                className="text-gray-400 hover:text-gray-500"
              >
                <X size={20} />
              </button>
            </div>

            <div className="mb-6">
              <div className="p-4 border-2 border-dashed border-gray-300 rounded-md text-center bg-gray-50">
                <div className="flex justify-center mb-2">
                  <Plus size={24} className="text-gray-400" />
                </div>
                <p className="text-sm text-gray-500">
                  Click to select a file or drag and drop
                </p>
                <p className="text-xs text-gray-400 mt-1">
                  Files will be encrypted before upload
                </p>
              </div>
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                File Name
              </label>
              <input
                type="text"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter file name"
                value={uploadName}
                onChange={(e) => setUploadName(e.target.value)}
              />
            </div>

            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                File Type
              </label>
              <select
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={uploadType}
                onChange={(e) => setUploadType(e.target.value)}
              >
                <option value="document">Document (.pdf)</option>
                <option value="spreadsheet">Spreadsheet (.xlsx)</option>
                <option value="image">Image (.jpg)</option>
              </select>
            </div>

            <div className="flex justify-end">
              <button
                onClick={() => setShowUploadModal(false)}
                className="mr-3 px-4 py-2 text-sm text-gray-700 hover:text-gray-500"
              >
                Cancel
              </button>
              <button
                onClick={handleFileUpload}
                className="bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              >
                Upload
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
