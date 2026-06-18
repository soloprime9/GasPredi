'use client';
import React, { useState, useRef, useMemo } from 'react';
import JSZip from 'jszip';
import { saveAs } from 'file-saver';
import { FolderUp, FileCheck, Archive, RefreshCw, Layers, Trash2, X, FileCode } from 'lucide-react';

export default function ZipExporter() {
  const [files, setFiles] = useState([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [compressionProgress, setCompressionProgress] = useState(0);
  const [downloadReady, setDownloadReady] = useState(false);
  const [zipBlob, setZipBlob] = useState(null);
  
  // Custom manual array of files that user actively removes from layout
  const [manuallyIgnoredPaths, setManuallyIgnoredPaths] = useState(new Set());
  
  // Default base strict ignore config array (to stop heavy dumps parsing instantly)
  const [ignoredInput, setIgnoredInput] = useState('node_modules, .git, dist, build, .next, .vite, .cache');
  
  const fileInputRef = useRef(null);

  // Helper utility function to translate native bytes count to readable scale string
  const formatFileSize = (bytes) => {
    if (!bytes || bytes === 0) return '0 KB';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  // Convert comma separated input values to tracking filter array
  const baseIgnoredKeywords = useMemo(() => {
    return ignoredInput
      .split(',')
      .map(item => item.trim())
      .filter(item => item.length > 0);
  }, [ignoredInput]);

  // Handle direct folder selection input event hook
  const handleFolderSelect = (e) => {
    const selectedFiles = Array.from(e.target.files);
    if (selectedFiles.length === 0) return;
    
    // Reset structural state flags dynamically on a brand new upload loop
    setFiles(selectedFiles);
    setManuallyIgnoredPaths(new Set());
    setDownloadReady(false);
    setZipBlob(null);
    setCompressionProgress(0);
  };

  // Main pipeline sorting filter mapping loop
  const filteredFilesList = useMemo(() => {
    return files.filter(file => {
      const relativePath = file.webkitRelativePath || file.name;
      
      // 1. Check if manually removed via UI Cancel Trigger actions
      if (manuallyIgnoredPaths.has(relativePath)) return false;
      
      // 2. Check keyword block conditions
      const pathParts = relativePath.split('/');
      const matchesBaseIgnore = pathParts.some(part => baseIgnoredKeywords.includes(part));
      
      return !matchesBaseIgnore;
    });
  }, [files, manuallyIgnoredPaths, baseIgnoredKeywords]);

  // Live total computed bundle metrics state tracking
  const totalComputedSize = useMemo(() => {
    return filteredFilesList.reduce((acc, file) => acc + (file.size || 0), 0);
  }, [filteredFilesList]);

  const totalIgnoredCount = files.length - filteredFilesList.length;

  // Single click active removal trigger action handler updates
  const handleRemoveFileLive = (relativePath) => {
    setManuallyIgnoredPaths(prev => {
      const updated = new Set(prev);
      updated.add(relativePath);
      return updated;
    });
    // Invalidate ready binaries since tracking modified manifests
    if (downloadReady) {
      setDownloadReady(false);
      setZipBlob(null);
    }
  };

  // Run native JSZip archive compilation pipeline
  const handleGenerateZip = async () => {
    if (filteredFilesList.length === 0) return;

    setIsProcessing(true);
    setCompressionProgress(1);
    
    const zip = new JSZip();

    try {
      for (let i = 0; i < filteredFilesList.length; i++) {
        const file = filteredFilesList[i];
        const relativePath = file.webkitRelativePath || file.name;
        
        // Append raw storage unit inside sandbox directory architecture
        zip.file(relativePath, file);
        
        const currentProgress = Math.round(((i + 1) / filteredFilesList.length) * 50);
        setCompressionProgress(currentProgress);
      }

      // Generate optimized zip blob container wrapper pipeline mapping routines
      const contentBlob = await zip.generateAsync({ 
        type: 'blob',
        compression: 'DEFLATE',
        compressionOptions: { level: 6 } // Balanced level for faster browser response execution
      }, (metadata) => {
        setCompressionProgress(50 + Math.round(metadata.percent / 2));
      });

      setZipBlob(contentBlob);
      setDownloadReady(true);
    } catch (error) {
      console.error("Browser zip compiler fault exception:", error);
      alert("Compression execution failure. Your folder may exceed total browser memory buffers.");
    } finally {
      setIsProcessing(false);
    }
  };

  // Fixed the file name string here to look clean and professional
  const triggerDownload = () => {
    if (!zipBlob) return;
    saveAs(zipBlob, 'project-archive.zip');
  };

  return (
    <div className="max-w-5xl mx-auto my-2 bg-slate-900 border border-slate-800 rounded-xl shadow-2xl overflow-hidden font-sans">
      
      {/* Top Header Panel Section */}
      <div className="bg-slate-950 px-6 py-4 border-b border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="bg-amber-500/10 text-amber-500 p-2 rounded-lg border border-amber-500/20 shrink-0">
            <Layers className="h-5 w-5" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-slate-200 uppercase tracking-wider">ZIP Archive Tool Engine</h2>
            <p className="text-xs text-slate-400">Filter parameters, review file sizes, and export clean builds.</p>
          </div>
        </div>
        
        {files.length > 0 && (
          <div className="bg-slate-900 px-4 py-1.5 rounded-lg border border-slate-800 flex gap-4 text-xs font-mono text-slate-400">
            <div>Active Size: <span className="text-amber-400 font-bold">{formatFileSize(totalComputedSize)}</span></div>
            <div className="border-l border-slate-800 pl-4">Files: <span className="text-emerald-400 font-bold">{filteredFilesList.length}</span></div>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 divide-y lg:divide-y-0 lg:divide-x divide-slate-800">
        
        {/* Left Side: Setup & Operational Actions */}
        <div className="p-6 space-y-6 lg:col-span-1 bg-slate-900/50">
          
          {/* Action 1: Select directory tree parameters */}
          <div>
            <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
              1. Load Target System Directory
            </label>
            <input
              type="file"
              ref={fileInputRef}
              webkitdirectory="true"
              directory="true"
              multiple
              onChange={handleFolderSelect}
              className="hidden"
            />
            <button
              onClick={() => fileInputRef.current.click()}
              className="w-full flex items-center justify-center gap-2.5 bg-slate-800 hover:bg-slate-700 active:bg-slate-700/50 border border-slate-700 text-slate-200 py-3 px-4 rounded-lg font-semibold transition cursor-pointer text-sm shadow-sm"
            >
              <FolderUp className="h-4 w-4 text-amber-500" />
              <span>Browse Local Folder</span>
            </button>
          </div>

          {/* Action 2: Setup dynamic string base exclusion layer arrays */}
          <div>
            <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
              2. Base Directory Exclusions
            </label>
            <textarea
              rows={2}
              value={ignoredInput}
              onChange={(e) => {
                setIgnoredInput(e.target.value);
                setDownloadReady(false);
              }}
              placeholder="node_modules, dist, .git..."
              className="w-full bg-slate-950 border border-slate-800 rounded-lg p-3 text-xs text-slate-300 font-mono focus:outline-none focus:border-amber-500/50 transition resize-none leading-relaxed"
            />
            <p className="text-[10px] text-slate-500 mt-1.5 leading-normal">
              Ye keywords wale folders load hote hi block ho jayenge (800MB se bachne ke liye node_modules zaruri hai).
            </p>
          </div>

          {/* Process Engine Trigger Elements */}
          <div className="pt-4 border-t border-slate-800/60">
            {files.length > 0 && !downloadReady && (
              <button
                onClick={handleGenerateZip}
                disabled={isProcessing || filteredFilesList.length === 0}
                className="w-full flex items-center justify-center gap-2 bg-amber-500 hover:bg-amber-400 disabled:bg-slate-800 disabled:text-slate-600 text-slate-950 font-bold py-3 px-4 rounded-lg transition shadow-md text-sm"
              >
                {isProcessing ? (
                  <>
                    <RefreshCw className="h-4 w-4 animate-spin" />
                    <span>Packing Asset Buffers ({compressionProgress}%)</span>
                  </>
                ) : (
                  <>
                    <Archive className="h-4 w-4" />
                    <span>Compile Workspace Build</span>
                  </>
                ))}
              </button>
            )}

            {downloadReady && (
              <button
                onClick={triggerDownload}
                className="w-full flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-3 px-4 rounded-lg transition shadow-lg text-sm animate-pulse"
              >
                <Archive className="h-4 w-4" />
                <span>Save Package To Local Storage</span>
              </button>
            )}
          </div>
        </div>

        {/* Right Side: Manifest Tracking Table Visualization Workspace */}
        <div className="p-6 lg:col-span-2 bg-slate-950 flex flex-col justify-between min-h-[400px]">
          <div className="w-full">
            <div className="flex items-center justify-between border-b border-slate-900 pb-3 mb-3">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">Active Live Manifest</span>
              <span className="text-xs font-mono text-slate-500 bg-slate-900 px-2.5 py-1 rounded border border-slate-800">
                Displaying {Math.min(filteredFilesList.length, 150)} items
              </span>
            </div>

            {files.length === 0 ? (
              <div className="h-64 flex flex-col items-center justify-center text-slate-600 text-sm border-2 border-dashed border-slate-900 rounded-xl p-8 text-center">
                <FileCode className="h-8 w-8 mb-2 text-slate-700" />
                <span className="italic">No file directory loaded yet. Choose project folder to unlock inspection arrays.</span>
              </div>
            ) : (
              <div className="max-h-[380px] overflow-y-auto space-y-1.5 pr-2 scrollbar-thin scrollbar-thumb-slate-800 scrollbar-track-transparent">
                {filteredFilesList.slice(0, 150).map((file) => {
                  const pathString = file.webkitRelativePath || file.name;
                  return (
                    <div 
                      key={pathString} 
                      className="group flex items-center justify-between gap-4 bg-slate-900/40 hover:bg-slate-900 border border-slate-900 hover:border-slate-800 rounded-lg py-1.5 pl-3 pr-2 transition text-xs font-mono"
                    >
                      <div className="flex items-center gap-2.5 min-w-0 flex-1">
                        <FileCheck className="h-3.5 w-3.5 text-emerald-500 shrink-0" />
                        <span className="text-slate-300 truncate tracking-tight">{pathString}</span>
                      </div>
                      
                      <div className="flex items-center gap-3 shrink-0">
                        <span className="text-slate-500 text-[11px] bg-slate-950 px-2 py-0.5 rounded border border-slate-900/80 group-hover:text-amber-400 transition">
                          {formatFileSize(file.size)}
                        </span>
                        <button
                          type="button"
                          onClick={() => handleRemoveFileLive(pathString)}
                          className="p-1 text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 rounded transition"
                          title="Exclude file from compilation"
                        >
                          <X className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </div>
                  );
                })}
                
                {filteredFilesList.length === 0 && (
                  <div className="text-center py-12 text-slate-500 text-xs italic">
                    Saari files list se hatayi ja chuki hain ya blocked hain!
                  </div>
                )}

                {filteredFilesList.length > 150 && (
                  <div className="text-[11px] text-amber-500/80 bg-amber-500/5 border border-amber-500/10 rounded-lg p-2.5 mt-2 text-center">
                    ...aur <span className="font-bold font-mono">{filteredFilesList.length - 150} files</span> stack processing queue mein lined-up hain.
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Footer Aggregate Statistics Widget Component */}
          {files.length > 0 && (
            <div className="mt-6 pt-4 border-t border-slate-900 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
              <div className="text-slate-400">
                Total Loaded Assets Array: <strong className="text-slate-200 font-mono">{files.length}</strong>
              </div>
              <div className="flex items-center gap-2 text-rose-400 bg-rose-500/5 px-3 py-1.5 rounded-lg border border-rose-500/10 font-mono">
                <Trash2 className="h-3.5 w-3.5" />
                <span>Blocked / Removed Counter: <strong>{totalIgnoredCount}</strong></span>
              </div>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}










// 'use client';
// import React, { useState, useRef, useMemo } from 'react';
// import JSZip from 'jszip';
// import { saveAs } from 'file-saver';
// import { FolderUp, FileCheck, Archive, RefreshCw, Layers, Trash2, X, FileCode } from 'lucide-react';

// export default function ZipExporter() {
//   const [files, setFiles] = useState([]);
//   const [isProcessing, setIsProcessing] = useState(false);
//   const [compressionProgress, setCompressionProgress] = useState(0);
//   const [downloadReady, setDownloadReady] = useState(false);
//   const [zipBlob, setZipBlob] = useState(null);
  
//   // Custom manual manual array of files that user actively removes from layout
//   const [manuallyIgnoredPaths, setManuallyIgnoredPaths] = useState(new Set());
  
//   // Default base strict ignore config array (to stop heavy dumps parsing instantly)
//   const [ignoredInput, setIgnoredInput] = useState('node_modules, .git, dist, build, .next, .vite, .cache');
  
//   const fileInputRef = useRef(null);

//   // Helper utility function to translate native bytes count to readable scale string
//   const formatFileSize = (bytes) => {
//     if (!bytes || bytes === 0) return '0 KB';
//     const k = 1024;
//     const sizes = ['Bytes', 'KB', 'MB', 'GB'];
//     const i = Math.floor(Math.log(bytes) / Math.log(k));
//     return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
//   };

//   // Convert comma separated input values to tracking filter array
//   const baseIgnoredKeywords = useMemo(() => {
//     return ignoredInput
//       .split(',')
//       .map(item => item.trim())
//       .filter(item => item.length > 0);
//   }, [ignoredInput]);

//   // Handle direct folder selection input event hook
//   const handleFolderSelect = (e) => {
//     const selectedFiles = Array.from(e.target.files);
//     if (selectedFiles.length === 0) return;
    
//     // Reset structural state flags dynamically on a brand new upload loop
//     setFiles(selectedFiles);
//     setManuallyIgnoredPaths(new Set());
//     setDownloadReady(false);
//     setZipBlob(null);
//     setCompressionProgress(0);
//   };

//   // Main pipeline sorting filter mapping loop
//   const filteredFilesList = useMemo(() => {
//     return files.filter(file => {
//       const relativePath = file.webkitRelativePath || file.name;
      
//       // 1. Check if manually removed via UI Cancel Trigger actions
//       if (manuallyIgnoredPaths.has(relativePath)) return false;
      
//       // 2. Check keyword block conditions
//       const pathParts = relativePath.split('/');
//       const matchesBaseIgnore = pathParts.some(part => baseIgnoredKeywords.includes(part));
      
//       return !matchesBaseIgnore;
//     });
//   }, [files, manuallyIgnoredPaths, baseIgnoredKeywords]);

//   // Live total computed bundle metrics state tracking
//   const totalComputedSize = useMemo(() => {
//     return filteredFilesList.reduce((acc, file) => acc + (file.size || 0), 0);
//   }, [filteredFilesList]);

//   const totalIgnoredCount = files.length - filteredFilesList.length;

//   // Single click active removal trigger action handler updates
//   const handleRemoveFileLive = (relativePath) => {
//     setManuallyIgnoredPaths(prev => {
//       const updated = new Set(prev);
//       updated.add(relativePath);
//       return updated;
//     });
//     // Invalidate ready binaries since tracking modified manifests
//     if (downloadReady) {
//       setDownloadReady(false);
//       setZipBlob(null);
//     }
//   };

//   // Run native JSZip archive compilation pipeline
//   const handleGenerateZip = async () => {
//     if (filteredFilesList.length === 0) return;

//     setIsProcessing(true);
//     setCompressionProgress(1);
    
//     const zip = new JSZip();

//     try {
//       for (let i = 0; i < filteredFilesList.length; i++) {
//         const file = filteredFilesList[i];
//         const relativePath = file.webkitRelativePath || file.name;
        
//         // Append raw storage unit inside sandbox directory architecture
//         zip.file(relativePath, file);
        
//         const currentProgress = Math.round(((i + 1) / filteredFilesList.length) * 50);
//         setCompressionProgress(currentProgress);
//       }

//       // Generate optimized zip blob container wrapper pipeline mapping routines
//       const contentBlob = await zip.generateAsync({ 
//         type: 'blob',
//         compression: 'DEFLATE',
//         compressionOptions: { level: 6 } // Balanced level for faster browser response execution
//       }, (metadata) => {
//         setCompressionProgress(50 + Math.round(metadata.percent / 2));
//       });

//       setZipBlob(contentBlob);
//       setDownloadReady(true);
//     } catch (error) {
//       console.error("Browser zip compiler fault exception:", error);
//       alert("Compression execution failure. Your folder may exceed total browser memory buffers.");
//     } finally {
//       setIsProcessing(false);
//     }
//   };

//   const triggerDownload = () => {
//     if (!zipBlob) return;
//     saveAs(zipBlob, 'FondPeaceZipConvertedFile.zip');
//   };

//   return (
//     <div className="max-w-5xl mx-auto my-6 bg-blue-900 border border-slate-800 rounded-xl shadow-2xl overflow-hidden font-sans">
      
//       {/* Top Header Panel Section */}
//       <div className="bg-slate-950 px-6 py-4 border-b border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
//         <div className="flex items-center gap-3">
//           <div className="bg-amber-500/10 text-amber-500 p-2 rounded-lg border border-amber-500/20 shrink-0">
//             <Layers className="h-5 w-5" />
//           </div>
//           <div>
//             <h2 className="text-lg font-bold text-slate-100">FondPeace Advanced ZIP Utility</h2>
//             <p className="text-xs text-slate-400">Filter file parameters, review active file sizes, and cross-examine structure live.</p>
//           </div>
//         </div>
        
//         {files.length > 0 && (
//           <div className="bg-slate-900 px-4 py-1.5 rounded-lg border border-slate-800 flex gap-4 text-xs font-mono text-slate-400">
//             <div>Active Size: <span className="text-amber-400 font-bold">{formatFileSize(totalComputedSize)}</span></div>
//             <div className="border-l border-slate-800 pl-4">Files: <span className="text-emerald-400 font-bold">{filteredFilesList.length}</span></div>
//           </div>
//         )}
//       </div>

//       <div className="grid grid-cols-1 lg:grid-cols-3 divide-y lg:divide-y-0 lg:divide-x divide-slate-800">
        
//         {/* Left Side: Setup & Operational Actions */}
//         <div className="p-6 space-y-6 lg:col-span-1 bg-slate-900/50">
          
//           {/* Action 1: Select directory tree parameters */}
//           <div>
//             <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
//               1. Load Target System Directory
//             </label>
//             <input
//               type="file"
//               ref={fileInputRef}
//               webkitdirectory="true"
//               directory="true"
//               multiple
//               onChange={handleFolderSelect}
//               className="hidden"
//             />
//             <button
//               onClick={() => fileInputRef.current.click()}
//               className="w-full flex items-center justify-center gap-2.5 bg-slate-800 hover:bg-slate-700 active:bg-slate-700/50 border border-slate-700 text-slate-200 py-3 px-4 rounded-lg font-semibold transition cursor-pointer text-sm shadow-sm"
//             >
//               <FolderUp className="h-4 w-4 text-amber-500" />
//               <span>Browse Local Folder</span>
//             </button>
//           </div>

//           {/* Action 2: Setup dynamic string base exclusion layer arrays */}
//           <div>
//             <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
//               2. Base Directory Exclusions
//             </label>
//             <textarea
//               rows={2}
//               value={ignoredInput}
//               onChange={(e) => {
//                 setIgnoredInput(e.target.value);
//                 setDownloadReady(false);
//               }}
//               placeholder="node_modules, dist, .git..."
//               className="w-full bg-slate-950 border border-slate-800 rounded-lg p-3 text-xs text-slate-300 font-mono focus:outline-none focus:border-amber-500/50 transition resize-none leading-relaxed"
//             />
//             <p className="text-[10px] text-slate-500 mt-1.5 leading-normal">
//               Ye keywords wale folders load hote hi block ho jayenge (800MB se bachne ke liye node_modules zaruri hai).
//             </p>
//           </div>

//           {/* Process Engine Trigger Elements */}
//           <div className="pt-4 border-t border-slate-800/60">
//             {files.length > 0 && !downloadReady && (
//               <button
//                 onClick={handleGenerateZip}
//                 disabled={isProcessing || filteredFilesList.length === 0}
//                 className="w-full flex items-center justify-center gap-2 bg-amber-500 hover:bg-amber-400 disabled:bg-slate-800 disabled:text-slate-600 text-slate-950 font-bold py-3 px-4 rounded-lg transition shadow-md text-sm"
//               >
//                 {isProcessing ? (
//                   <>
//                     <RefreshCw className="h-4 w-4 animate-spin" />
//                     <span>Packing Asset Buffers ({compressionProgress}%)</span>
//                   </>
//                 ) : (
//                   <>
//                     <Archive className="h-4 w-4" />
//                     <span>Compile Workspace Build</span>
//                   </>
//                 )}
//               </button>
//             )}

//             {downloadReady && (
//               <button
//                 onClick={triggerDownload}
//                 className="w-full flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-3 px-4 rounded-lg transition shadow-lg text-sm animate-pulse"
//               >
//                 <Archive className="h-4 w-4" />
//                 <span>Save Package To Local Storage</span>
//               </button>
//             )}
//           </div>
//         </div>

//         {/* Right Side: Manifest Tracking Table Visualization Workspace */}
//         <div className="p-6 lg:col-span-2 bg-slate-950 flex flex-col justify-between min-h-[400px]">
//           <div className="w-full">
//             <div className="flex items-center justify-between border-b border-slate-900 pb-3 mb-3">
//               <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">Active Live Manifest</span>
//               <span className="text-xs font-mono text-slate-500 bg-slate-900 px-2.5 py-1 rounded border border-slate-800">
//                 Displaying {Math.min(filteredFilesList.length, 150)} items
//               </span>
//             </div>

//             {files.length === 0 ? (
//               <div className="h-64 flex flex-col items-center justify-center text-slate-600 text-sm border-2 border-dashed border-slate-900 rounded-xl p-8 text-center">
//                 <FileCode className="h-8 w-8 mb-2 text-slate-700" />
//                 <span className="italic">No file directory loaded yet. Choose project folder to unlock inspection arrays.</span>
//               </div>
//             ) : (
//               <div className="max-h-[380px] overflow-y-auto space-y-1.5 pr-2 scrollbar-thin scrollbar-thumb-slate-800 scrollbar-track-transparent">
//                 {filteredFilesList.slice(0, 150).map((file) => {
//                   const pathString = file.webkitRelativePath || file.name;
//                   return (
//                     <div 
//                       key={pathString} 
//                       className="group flex items-center justify-between gap-4 bg-slate-900/40 hover:bg-slate-900 border border-slate-900 hover:border-slate-800 rounded-lg py-1.5 pl-3 pr-2 transition text-xs font-mono"
//                     >
//                       <div className="flex items-center gap-2.5 min-w-0 flex-1">
//                         <FileCheck className="h-3.5 w-3.5 text-emerald-500 shrink-0" />
//                         <span className="text-slate-300 truncate tracking-tight">{pathString}</span>
//                       </div>
                      
//                       <div className="flex items-center gap-3 shrink-0">
//                         <span className="text-slate-500 text-[11px] bg-slate-950 px-2 py-0.5 rounded border border-slate-900/80 group-hover:text-amber-400 transition">
//                           {formatFileSize(file.size)}
//                         </span>
//                         <button
//                           type="button"
//                           onClick={() => handleRemoveFileLive(pathString)}
//                           className="p-1 text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 rounded transition"
//                           title="Exclude file from compilation"
//                         >
//                           <X className="h-3.5 w-3.5" />
//                         </button>
//                       </div>
//                     </div>
//                   );
//                 })}
                
//                 {filteredFilesList.length === 0 && (
//                   <div className="text-center py-12 text-slate-500 text-xs italic">
//                     Saari files list se hatayi ja chuki hain ya blocked hain!
//                   </div>
//                 )}

//                 {filteredFilesList.length > 150 && (
//                   <div className="text-[11px] text-amber-500/80 bg-amber-500/5 border border-amber-500/10 rounded-lg p-2.5 mt-2 text-center">
//                     ...aur <span className="font-bold font-mono">{filteredFilesList.length - 150} files</span> stack processing queue mein lined-up hain.
//                   </div>
//                 )}
//               </div>
//             )}
//           </div>

//           {/* Footer Aggregate Statistics Widget Component */}
//           {files.length > 0 && (
//             <div className="mt-6 pt-4 border-t border-slate-900 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
//               <div className="text-slate-400">
//                 Total Loaded Assets Array: <strong className="text-slate-200 font-mono">{files.length}</strong>
//               </div>
//               <div className="flex items-center gap-2 text-rose-400 bg-rose-500/5 px-3 py-1.5 rounded-lg border border-rose-500/10 font-mono">
//                 <Trash2 className="h-3.5 w-3.5" />
//                 <span>Blocked / Removed Counter: <strong>{totalIgnoredCount}</strong></span>
//               </div>
//             </div>
//           )}
//         </div>

//       </div>
//     </div>
//   );
// }









// 'use client'
// import React, { useState, useRef } from 'react';
// import JSZip from 'jszip';
// import { saveAs } from 'file-saver';
// import { FolderUp, FileCheck, FileX, Archive, RefreshCw, Layers } from 'lucide-react';

// export default function ZipExporter() {
//   const [files, setFiles] = useState([]);
//   const [isProcessing, setIsProcessing] = useState(false);
//   const [compressionProgress, setCompressionProgress] = useState(0);
//   const [downloadReady, setDownloadReady] = useState(false);
//   const [zipBlob, setZipBlob] = useState(null);
  
//   // Custom Ignore Settings (Default filters common tags)
//   const [ignoredInput, setIgnoredInput] = useState('node_modules, .git, dist, build, .env');
  
//   const fileInputRef = useRef(null);

//   // Convert comma separated string to analytical clean array list
//   const getIgnoredList = () => {
//     return ignoredInput
//       .split(',')
//       .map(item => item.trim())
//       .filter(item => item.length > 0);
//   };

//   // Handle direct recursive native folder imports from user's system layout 
//   const handleFolderSelect = (e) => {
//     const selectedFiles = Array.from(e.target.files);
//     if (selectedFiles.length === 0) return;
    
//     setFiles(selectedFiles);
//     setDownloadReady(false);
//     setZipBlob(null);
//     setCompressionProgress(0);
//   };

//   // Processing filter engine to dynamically separate metrics assets
//   const getFilteredFiles = () => {
//     const ignoredList = getIgnoredList();
//     return files.filter(file => {
//       // Extract file components structural relative context system
//       const relativePath = file.webkitRelativePath || file.name;
//       const pathParts = relativePath.split('/');
      
//       // Match rules to inspect if path matches exclusion configurations
//       return !pathParts.some(part => ignoredList.includes(part));
//     });
//   };

//   const getExcludedFilesCount = () => {
//     return files.length - getFilteredFiles().length;
//   };

//   // Generate dynamic runtime client side compression zip package
//   const handleGenerateZip = async () => {
//     const filteredFiles = getFilteredFiles();
//     if (filteredFiles.length === 0) return;

//     setIsProcessing(true);
//     setCompressionProgress(1);
    
//     const zip = new JSZip();

//     try {
//       // Loop over active filtered array and push direct buffers into zip constructor block
//       for (let i = 0; i < filteredFiles.length; i++) {
//         const file = filteredFiles[i];
//         const relativePath = file.webkitRelativePath || file.name;
        
//         // Read file contents as binary blobs natively inside client sandbox context
//         zip.file(relativePath, file);
        
//         // Calculate progress percentage linearly
//         const currentProgress = Math.round(((i + 1) / filteredFiles.length) * 100);
//         setCompressionProgress(currentProgress);
//       }

//       // Generate localized data binary outputs wrapper block
//       const contentBlob = await zip.generateAsync({ type: 'blob' }, (metadata) => {
//         if (metadata.currentFile) {
//           // Adjust state smoothly over large structures
//           setCompressionProgress(Math.round(metadata.percent));
//         }
//       });

//       setZipBlob(contentBlob);
//       setDownloadReady(true);
//     } catch (error) {
//       console.error("Browser zip compilation crashed inside dynamic execution container:", error);
//       alert("Compression failed. Clear application space memory parameters and try again.");
//     } finally {
//       setIsProcessing(false);
//     }
//   };

//   const triggerDownload = () => {
//     if (!zipBlob) return;
//     saveAs(zipBlob, 'FondPeaceZipConvertedFile.zip');
//   };

//   return (
//     <div className="max-w-4xl mx-auto my-8 p-6 bg-blue-900 border border-slate-800 rounded-xl shadow-xl">
//       <div className="flex items-center gap-3 border-b border-slate-800 pb-4 mb-6">
//         <div className="bg-amber-500/10 text-amber-500 p-2.5 rounded-lg">
//           <Layers className="h-6 w-6" />
//         </div>
//         <div>
//           <h2 className="text-xl font-bold text-slate-100">Project Workspace Backup Tool</h2>
//           <p className="text-xs text-slate-400">Pure Client-side localized compilation engine. Your source assets never upload to external servers.</p>
//         </div>
//       </div>

//       <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
//         {/* Left Interactive Control Panel Box */}
//         <div className="md:col-span-1 space-y-6">
//           <div>
//             <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
//               1. Choose Source Directory
//             </label>
//             <input
//               type="file"
//               ref={fileInputRef}
//               webkitdirectory="true"
//               directory="true"
//               multiple
//               onChange={handleFolderSelect}
//               className="hidden"
//             />
//             <button
//               onClick={() => fileInputRef.current.click()}
//               className="w-full flex items-center justify-center gap-2 bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 py-3 px-4 rounded-lg font-medium transition cursor-pointer text-sm"
//             >
//               <FolderUp className="h-4 w-4 text-amber-500" />
//               <span>Select Project Folder</span>
//             </button>
//           </div>

//           <div>
//             <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
//               2. Ignore Rules (Comma Separated)
//             </label>
//             <textarea
//               rows={3}
//               value={ignoredInput}
//               onChange={(e) => {
//                 setIgnoredInput(e.target.value);
//                 setDownloadReady(false);
//               }}
//               placeholder="e.g., node_modules, dist, .env"
//               className="w-full bg-slate-950 border border-slate-800 rounded-lg p-3 text-sm text-slate-200 placeholder-slate-700 focus:outline-none focus:border-amber-500 font-mono resize-none"
//             />
//             <span className="text-[10px] text-slate-500 mt-1 block">
//               In names ko system paths ke andar ignore kar diya jayega.
//             </span>
//           </div>

//           {files.length > 0 && !downloadReady && (
//             <button
//               onClick={handleGenerateZip}
//               disabled={isProcessing}
//               className="w-full flex items-center justify-center gap-2 bg-amber-600 hover:bg-amber-500 disabled:bg-slate-800 text-slate-950 font-bold py-3 px-4 rounded-lg transition shadow-lg text-sm"
//             >
//               {isProcessing ? (
//                 <>
//                   <RefreshCw className="h-4 w-4 animate-spin" />
//                   <span>Processing ({compressionProgress}%)</span>
//                 </>
//               ) : (
//                 <>
//                   <Archive className="h-4 w-4" />
//                   <span>Compile Filtered ZIP</span>
//                 </>
//               )}
//             </button>
//           )}

//           {downloadReady && (
//             <button
//               onClick={triggerDownload}
//               className="w-full flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-3 px-4 rounded-lg transition shadow-lg text-sm animate-pulse"
//             >
//               <Archive className="h-4 w-4" />
//               <span>Download Complete ZIP</span>
//             </button>
//           )}
//         </div>

//         {/* Right Active Visualization Panel Box */}
//         <div className="md:col-span-2 bg-slate-950 border border-slate-800 rounded-lg p-4 flex flex-col justify-between min-h-[250px]">
//           <div>
//             <div className="flex items-center justify-between border-b border-slate-900 pb-2 mb-3">
//               <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">File Sync Mapping Manifest</span>
//               <span className="text-xs font-mono text-slate-500">{getFilteredFiles().length} Active Files</span>
//             </div>

//             {files.length === 0 ? (
//               <div className="h-40 flex flex-col items-center justify-center text-slate-600 text-sm italic">
//                 No folder source linked. Select folder directory tree above to map artifacts.
//               </div>
//             ) : (
//               <div className="max-h-52 overflow-y-auto text-xs font-mono space-y-1 pr-2 scrollbar-thin scrollbar-thumb-slate-800">
//                 {getFilteredFiles().slice(0, 100).map((file, idx) => (
//                   <div key={idx} className="flex items-center gap-2 text-slate-300 py-0.5 truncate border-b border-slate-900/50">
//                     <FileCheck className="h-3 w-3 text-emerald-500 shrink-0" />
//                     <span className="truncate">{file.webkitRelativePath || file.name}</span>
//                   </div>
//                 ))}
//                 {getFilteredFiles().length > 100 && (
//                   <div className="text-[10px] text-amber-500 pt-1 tracking-wider italic">
//                     ... aur {getFilteredFiles().length - 100} mazeed files file array payload mapping systems mein active hain.
//                   </div>
//                 )}
//               </div>
//             )}
//           </div>

//           {files.length > 0 && (
//             <div className="mt-4 pt-3 border-t border-slate-900 flex items-center justify-between text-xs font-medium">
//               <div className="flex items-center gap-2 text-slate-400">
//                 <span>Total Detected: <strong className="text-slate-200">{files.length}</strong></span>
//               </div>
//               <div className="flex items-center gap-1.5 text-rose-500 bg-rose-500/5 px-2.5 py-1 rounded-md border border-rose-500/10">
//                 <FileX className="h-3.5 w-3.5" />
//                 <span>Ignored Filters: <strong>{getExcludedFilesCount()} files</strong></span>
//               </div>
//             </div>
//           )}
//         </div>

//       </div>
//     </div>
//   );
// }
