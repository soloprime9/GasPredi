'use client'
import React, { useState, useRef, useEffect } from 'react';
import JSZip from 'jszip';
import { jsPDF } from 'jspdf';
import PptxGenJS from 'pptxgenjs';

const API_BASE = 'https://api.framesnap.app';

export default function FrameExtractor() {
  const [frames, setFrames] = useState([]);
  const [selectedFrames, setSelectedFrames] = useState(new Set());
  const [extractionMode, setExtractionMode] = useState('url');
  const [currentPanel, setCurrentPanel] = useState('source');
  const [urlValue, setUrlValue] = useState('');
  const [localFile, setLocalFile] = useState(null);
  const [videoName, setVideoName] = useState('video');
  const [cancelled, setCancelled] = useState(false);
  const [apiOnline, setApiOnline] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const [intervalValue, setIntervalValue] = useState('1');
  const [qualityValue, setQualityValue] = useState('high');
  const [progTitle, setProgTitle] = useState('Extracting frames…');
  const [progNote, setProgNote] = useState('Connecting to server…');
  const [progPercent, setProgPercent] = useState(0);
  const [progCount, setProgCount] = useState(0);
  const [toastShow, setToastShow] = useState(false);
  const [toastIcon, setToastIcon] = useState('⏳');
  const [toastMsg, setToastMsg] = useState('Processing…');
  
  const evtSourceRef = useRef(null);
  const localVideoRef = useRef(null);
  const localFileInputRef = useRef(null);
  const toastTimerRef = useRef(null);

  // Check API status on mount
  useEffect(() => {
    checkAPI();
  }, []);

  const checkAPI = async () => {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 4000);
      const r = await fetch(API_BASE + '/health', { signal: controller.signal });
      clearTimeout(timeoutId);
      if (r.ok) {
        setApiOnline(true);
      }
    } catch {
      setApiOnline(false);
    }
  };

  const showToast = (icon, msg) => {
    setToastIcon(icon);
    setToastMsg(msg);
    setToastShow(true);
    clearTimeout(toastTimerRef.current);
    toastTimerRef.current = setTimeout(() => setToastShow(false), 3500);
  };

  const formatTime = (seconds) => {
    const s = Math.round(seconds);
    const m = Math.floor(s / 60);
    const sec = s % 60;
    return `${String(m).padStart(2, '0')}:${String(sec).padStart(2, '0')}`;
  };

  const addFrame = (frameData) => {
    setFrames(prev => [...prev, frameData]);
    if (frames.length === 0) {
      setCurrentPanel('frames');
    }
    setProgCount(prev => prev + 1);
  };

  const toggleSelect = (idx) => {
    setSelectedFrames(prev => {
      const newSet = new Set(prev);
      if (newSet.has(idx)) {
        newSet.delete(idx);
      } else {
        newSet.add(idx);
      }
      return newSet;
    });
  };

  const selectAll = () => {
    const newSet = new Set(frames.map((_, i) => i));
    setSelectedFrames(newSet);
  };

  const selectNone = () => {
    setSelectedFrames(new Set());
  };

  const resetToInput = () => {
    setFrames([]);
    setSelectedFrames(new Set());
    setCurrentPanel('source');
    setCancelled(false);
  };

  const downloadSingleFrame = (idx) => {
    const f = frames[idx];
    if (!f) return;
    const a = document.createElement('a');
    a.href = f.dataURL;
    a.download = `${videoName}_frame_${String(idx + 1).padStart(4, '0')}_${formatTime(f.timestamp).replace(':', 'm')}s.jpg`;
    a.click();
  };

  const getSelectedFrames = () => {
    return Array.from(selectedFrames)
      .sort((a, b) => a - b)
      .map(i => frames[i]);
  };

  const startURLExtraction = async (url) => {
    setFrames([]);
    setSelectedFrames(new Set());
    setCancelled(false);
    const interval = parseInt(intervalValue) || 1;

    setCurrentPanel('progress');
    setProgTitle('Connecting to server…');
    setProgNote('Fetching video info from URL…');
    setProgPercent(5);
    setProgCount(0);

    try {
      const params = new URLSearchParams({
        url,
        interval,
        quality: qualityValue
      });
      const eventSource = new EventSource(`${API_BASE}/extract?${params}`);
      evtSourceRef.current = eventSource;

      eventSource.addEventListener('info', (e) => {
        const d = JSON.parse(e.data);
        setVideoName(d.title || 'video');
        setProgTitle(`Extracting: ${d.title || 'video'}`);
        setProgNote(`Duration: ${d.duration || '?'}s · Est. ~${d.total_frames || '?'} frames`);
      });

      eventSource.addEventListener('frame', (e) => {
        if (cancelled) return;
        const d = JSON.parse(e.data);
        addFrame({
          dataURL: d.image,
          timestamp: d.timestamp,
          index: d.index
        });
        const pct = d.progress || 0;
        setProgPercent(Math.max(10, pct));
      });

      eventSource.addEventListener('done', () => {
        eventSource.close();
        evtSourceRef.current = null;
        if (!cancelled) finishExtraction();
      });

      eventSource.addEventListener('error', () => {
        eventSource.close();
        evtSourceRef.current = null;
        if (cancelled) return;
        if (frames.length > 0) {
          finishExtraction();
        } else {
          alert('Extraction failed. Check the URL or try a different video.');
          setCurrentPanel('source');
        }
      });
    } catch (err) {
      alert('Could not connect to server: ' + err.message);
      setCurrentPanel('source');
    }
  };

  const startLocalExtraction = () => {
    if (!localFile) {
      alert('Please select a local video file.');
      return;
    }

    setFrames([]);
    setSelectedFrames(new Set());
    setCancelled(false);
    const interval = parseInt(intervalValue) || 1;

    setCurrentPanel('progress');
    setProgTitle('Loading local video…');
    setProgNote('Processing on your device — nothing uploaded.');
    setProgPercent(5);
    setProgCount(0);

    const objectURL = URL.createObjectURL(localFile);
    const videoEl = document.createElement('video');
    videoEl.src = objectURL;
    videoEl.preload = 'metadata';
    videoEl.muted = true;
    localVideoRef.current = videoEl;

    videoEl.addEventListener('loadedmetadata', () => {
      const duration = videoEl.duration;
      const totalFrames = Math.floor(duration / interval);
      setProgNote(`Duration: ${Math.round(duration)}s · ~${totalFrames} frames`);
      captureFramesLocally(videoEl, duration, interval, objectURL);
    });

    videoEl.addEventListener('error', () => {
      alert('Could not read this video file.');
      URL.revokeObjectURL(objectURL);
      setCurrentPanel('source');
    });
  };

  const captureFramesLocally = async (video, duration, interval, objectURL) => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    let currentTime = 0;
    let idx = 0;

    const seekAndCapture = async () => {
      if (cancelled || currentTime > duration) {
        URL.revokeObjectURL(objectURL);
        if (!cancelled) finishExtraction();
        return;
      }

      video.currentTime = currentTime;
      await new Promise(res => {
        const onSeeked = () => {
          video.removeEventListener('seeked', onSeeked);
          res();
        };
        video.addEventListener('seeked', onSeeked);
      });

      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      ctx.drawImage(video, 0, 0);
      const dataURL = canvas.toDataURL('image/jpeg', 0.92);

      addFrame({ dataURL, timestamp: currentTime, index: idx });
      setProgPercent(Math.min(98, (currentTime / duration) * 100));

      currentTime += interval;
      idx++;

      await new Promise(r => setTimeout(r, 0));
      seekAndCapture();
    };

    seekAndCapture();
  };

  const finishExtraction = () => {
    setProgPercent(100);
    setProgTitle(`Done — ${frames.length} frames extracted`);
    setTimeout(() => setCurrentPanel('frames'), 400);
  };

  const handleExtractClick = () => {
    if (extractionMode === 'url') {
      const url = urlValue.trim();
      if (!url) {
        alert('Please enter a video URL.');
        return;
      }
      startURLExtraction(url);
    } else {
      startLocalExtraction();
    }
  };

  const handleCancel = () => {
    setCancelled(true);
    if (evtSourceRef.current) {
      evtSourceRef.current.close();
      evtSourceRef.current = null;
    }
    if (localVideoRef.current) {
      localVideoRef.current.pause();
      localVideoRef.current.src = '';
    }
    resetToInput();
  };

  const handleLocalFileDrop = (e) => {
    e.preventDefault();
    setDragActive(false);
    const f = e.dataTransfer.files[0];
    if (f && f.type.startsWith('video/')) {
      setLocalFile(f);
      setVideoName(f.name.replace(/\.[^.]+$/, ''));
    }
  };

  const handleLocalFileInput = (e) => {
    const f = e.target.files?.[0];
    if (f) {
      setLocalFile(f);
      setVideoName(f.name.replace(/\.[^.]+$/, ''));
    }
  };

  const exportPPTX = async () => {
    const sel = getSelectedFrames();
    if (!sel.length) return;
    showToast('⏳', `Building PPTX — ${sel.length} slides…`);
    await new Promise(r => setTimeout(r, 50));

    const pptx = new PptxGenJS();
    pptx.layout = 'LAYOUT_WIDE';

    const titleSlide = pptx.addSlide();
    titleSlide.background = { color: '080c14' };
    titleSlide.addText(videoName, {
      x: 0.5,
      y: 2.5,
      w: '90%',
      h: 1.2,
      fontSize: 32,
      bold: true,
      color: 'e8eef8',
      align: 'center'
    });
    titleSlide.addText(`${sel.length} frames extracted by FrameSnap`, {
      x: 0.5,
      y: 3.8,
      w: '90%',
      h: 0.5,
      fontSize: 14,
      color: '6b7fa3',
      align: 'center'
    });

    sel.forEach(frame => {
      const slide = pptx.addSlide();
      slide.background = { color: '080c14' };
      const b64 = frame.dataURL.split(',')[1];
      slide.addImage({
        data: 'image/jpeg;base64,' + b64,
        x: 0,
        y: 0,
        w: '100%',
        h: '100%',
        sizing: { type: 'contain' }
      });
      slide.addText(formatTime(frame.timestamp), {
        x: 0.1,
        y: 6.9,
        w: 1.5,
        h: 0.3,
        fontSize: 9,
        color: 'ffffff',
        fill: { color: '00000088' },
        align: 'center',
        valign: 'middle'
      });
    });

    await pptx.writeFile({ fileName: `${videoName}_frames.pptx` });
    showToast('✅', 'PPTX downloaded!');
  };

  const exportPDF = async () => {
    const sel = getSelectedFrames();
    if (!sel.length) return;
    showToast('⏳', `Building PDF — ${sel.length} pages…`);
    await new Promise(r => setTimeout(r, 50));

    const pdf = new jsPDF({
      orientation: 'landscape',
      unit: 'px',
      format: [1280, 720]
    });

    sel.forEach((frame, i) => {
      if (i > 0) pdf.addPage([1280, 720], 'landscape');
      pdf.addImage(frame.dataURL, 'JPEG', 0, 0, 1280, 720);
      pdf.setFontSize(11);
      pdf.setTextColor(180, 180, 180);
      pdf.text(formatTime(frame.timestamp), 16, 710);
    });

    pdf.save(`${videoName}_frames.pdf`);
    showToast('✅', 'PDF downloaded!');
  };

  const exportZIP = async () => {
    const sel = getSelectedFrames();
    if (!sel.length) return;
    showToast('⏳', `Packing ZIP — ${sel.length} images…`);
    await new Promise(r => setTimeout(r, 50));

    const zip = new JSZip();
    const folder = zip.folder(videoName + '_frames');

    sel.forEach((frame, i) => {
      const b64 = frame.dataURL.split(',')[1];
      const name = `frame_${String(i + 1).padStart(4, '0')}_${formatTime(frame.timestamp).replace(':', 'm')}s.jpg`;
      folder.file(name, b64, { base64: true });
    });

    const blob = await zip.generateAsync({
      type: 'blob',
      compression: 'DEFLATE',
      compressionOptions: { level: 6 }
    });

    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${videoName}_frames.zip`;
    a.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
    showToast('✅', 'ZIP downloaded!');
  };

  const selectedCount = selectedFrames.size;
  const isExportDisabled = selectedCount === 0;

  return (
    <div style={styles.body}>
      <style>{globalStyles}</style>

      {/* HEADER */}
      <header style={styles.header}>
        <nav style={styles.nav}>
          <a href="/" style={styles.logo}>
            <div style={styles.logoMark}>🎬</div>
            FrameSnap
          </a>
          <nav style={styles.breadcrumb}>
            <a href="/">Home</a>
            <span style={{ opacity: 0.3 }}>›</span>
            <span>Frame Extractor</span>
          </nav>
        </nav>
      </header>

      <main>
        {/* PAGE HERO */}
        <section style={styles.pageHero}>
          <div style={styles.chip}>
            <span style={styles.chipDot}></span>
            Instant · No upload needed for local files
          </div>
          <h1 style={styles.h1}>
            Video Frame Extractor<br />
            <em style={styles.em}>Free, HD, Any Format</em>
          </h1>
          <p style={styles.heroP}>
            Extract HD frames from YouTube, Vimeo, local MP4/MKV/AVI files. Live preview as frames extract. Select what you want. Export as PPTX, PDF, or ZIP.
          </p>
          <div style={styles.featurePills}>
            <span style={styles.fpill}>
              <span style={{ ...styles.fdot, background: 'var(--green)' }}></span>
              YouTube + 1000 sites
            </span>
            <span style={styles.fpill}>
              <span style={{ ...styles.fdot, background: 'var(--green)' }}></span>
              Local files (no upload)
            </span>
            <span style={styles.fpill}>
              <span style={{ ...styles.fdot, background: 'var(--accent)' }}></span>
              Live preview grid
            </span>
            <span style={styles.fpill}>
              <span style={{ ...styles.fdot, background: 'var(--accent)' }}></span>
              PPTX · PDF · ZIP
            </span>
            <span style={styles.fpill}>
              <span style={{ ...styles.fdot, background: 'var(--purple)' }}></span>
              No account · No watermark
            </span>
          </div>
        </section>

        <div style={styles.toolOuter}>
          {/* AD SLOT */}
          <div style={styles.adSlot}>Advertisement</div>

          {/* SOURCE PANEL */}
          {currentPanel === 'source' && (
            <div style={styles.sourcePanel}>
              <div style={styles.panelLabel}>1 — Video Source</div>

              <div style={styles.sourceTabs}>
                <button
                  style={{
                    ...styles.stab,
                    ...(extractionMode === 'url' && styles.stabActive)
                  }}
                  onClick={() => setExtractionMode('url')}
                >
                  🔗 URL (YouTube, Vimeo, etc.)
                </button>
                <button
                  style={{
                    ...styles.stab,
                    ...(extractionMode === 'local' && styles.stabActive)
                  }}
                  onClick={() => setExtractionMode('local')}
                >
                  📁 Local File
                </button>
              </div>

              {/* URL INPUT */}
              {extractionMode === 'url' && (
                <div id="urlSection">
                  <div style={styles.urlRow}>
                    <input
                      style={styles.urlInput}
                      type="url"
                      placeholder="Paste YouTube, Vimeo, or any public video URL…"
                      value={urlValue}
                      onChange={(e) => setUrlValue(e.target.value)}
                      autoComplete="off"
                    />
                  </div>
                  <p style={styles.apiNote}>
                    ⚡ Frames extracted server-side and streamed live to your browser
                  </p>
                </div>
              )}

              {/* LOCAL FILE DROP */}
              {extractionMode === 'local' && (
                <div
                  style={{
                    ...styles.dropZone,
                    ...(dragActive && styles.dragOver)
                  }}
                  onDragOver={(e) => {
                    e.preventDefault();
                    setDragActive(true);
                  }}
                  onDragLeave={() => setDragActive(false)}
                  onDrop={handleLocalFileDrop}
                >
                  <div style={styles.dropZoneIcon}>📁</div>
                  <div style={{ fontSize: '0.92rem', fontWeight: 600 }}>
                    Drop your video file here
                  </div>
                  <p>MP4 · MKV · AVI · MOV · WebM</p>
                  <button
                    style={styles.btnBrowse}
                    onClick={() => localFileInputRef.current?.click()}
                  >
                    Browse File
                  </button>
                  {localFile && (
                    <div style={styles.dropFileName}>
                      📎 {localFile.name}
                    </div>
                  )}
                  <input
                    ref={localFileInputRef}
                    type="file"
                    accept="video/mp4,video/x-matroska,video/avi,video/quicktime,video/webm"
                    onChange={handleLocalFileInput}
                    style={{ display: 'none' }}
                  />
                </div>
              )}

              <div style={styles.configRow}>
                <div style={styles.configGroup}>
                  <label htmlFor="intervalInput">Extract every</label>
                  <input
                    id="intervalInput"
                    style={styles.spinInput}
                    type="number"
                    min="1"
                    max="60"
                    value={intervalValue}
                    onChange={(e) => setIntervalValue(e.target.value)}
                  />
                  <label>second(s)</label>
                </div>
                <div style={styles.configGroup}>
                  <label>Quality:</label>
                  <select
                    style={styles.qualitySel}
                    value={qualityValue}
                    onChange={(e) => setQualityValue(e.target.value)}
                  >
                    <option value="high">High (original)</option>
                    <option value="medium">Medium (720p)</option>
                    <option value="low">Low (480p)</option>
                  </select>
                </div>
              </div>

              <button
                style={styles.btnExtract}
                onClick={handleExtractClick}
              >
                ⚡ Extract Frames
              </button>
              <p style={styles.apiStatusNote}>
                API:{' '}
                <code style={styles.apiCode}>https://api.framesnap.app</code>{' '}
                —{' '}
                <span
                  style={{
                    color: apiOnline ? 'var(--green)' : 'var(--gold)'
                  }}
                >
                  {apiOnline ? '✅ Online' : '⚠️ Offline — local mode only'}
                </span>
              </p>
            </div>
          )}

          {/* PROGRESS PANEL */}
          {currentPanel === 'progress' && (
            <div style={styles.progressPanel}>
              <div style={styles.spinnerRow}>
                <div style={styles.spinner}></div>
                <div>
                  <div style={styles.progTitle}>{progTitle}</div>
                  <div style={styles.progNote}>{progNote}</div>
                </div>
              </div>
              <div style={styles.progBarOuter}>
                <div
                  style={{
                    ...styles.progBarFill,
                    width: `${progPercent}%`
                  }}
                ></div>
              </div>
              <div style={styles.progTop}>
                <span style={styles.progCount}>
                  {progCount} frame{progCount !== 1 ? 's' : ''} extracted
                </span>
                <button
                  style={styles.cancelBtnStyle}
                  onClick={handleCancel}
                >
                  ✕ Cancel
                </button>
              </div>
            </div>
          )}

          {/* FRAMES PANEL */}
          {currentPanel === 'frames' && (
            <div>
              <div style={styles.exportBar}>
                <span style={styles.exportBarLabel}>Export selected:</span>
                <div style={styles.exportBtns}>
                  <button
                    style={{
                      ...styles.btnExport,
                      ...styles.btnPptx,
                      opacity: isExportDisabled ? 0.35 : 1,
                      cursor: isExportDisabled ? 'not-allowed' : 'pointer'
                    }}
                    disabled={isExportDisabled}
                    onClick={exportPPTX}
                  >
                    📊 PPTX
                  </button>
                  <button
                    style={{
                      ...styles.btnExport,
                      ...styles.btnPdf,
                      opacity: isExportDisabled ? 0.35 : 1,
                      cursor: isExportDisabled ? 'not-allowed' : 'pointer'
                    }}
                    disabled={isExportDisabled}
                    onClick={exportPDF}
                  >
                    📄 PDF
                  </button>
                  <button
                    style={{
                      ...styles.btnExport,
                      ...styles.btnZip,
                      opacity: isExportDisabled ? 0.35 : 1,
                      cursor: isExportDisabled ? 'not-allowed' : 'pointer'
                    }}
                    disabled={isExportDisabled}
                    onClick={exportZIP}
                  >
                    🗜️ ZIP
                  </button>
                </div>
                <span style={styles.selNote}>
                  {selectedCount} frame{selectedCount !== 1 ? 's' : ''} selected
                </span>
              </div>

              <div style={styles.framesToolbar}>
                <div style={styles.framesToolbarLeft}>
                  <span style={styles.framesCount}>
                    {frames.length} frame{frames.length !== 1 ? 's' : ''}
                  </span>
                  <span style={styles.framesSub}>
                    from "{videoName}"
                  </span>
                  <button
                    style={styles.btnSelAll}
                    onClick={selectAll}
                  >
                    Select All
                  </button>
                  <button
                    style={styles.btnSelNone}
                    onClick={selectNone}
                  >
                    Deselect All
                  </button>
                </div>
                <button
                  style={styles.btnNew}
                  onClick={resetToInput}
                >
                  ↩ New Extraction
                </button>
              </div>

              <div style={styles.framesGrid}>
                {frames.map((frame, idx) => (
                  <FrameThumb
                    key={idx}
                    frame={frame}
                    index={idx}
                    isSelected={selectedFrames.has(idx)}
                    onToggleSelect={() => toggleSelect(idx)}
                    onDownload={() => downloadSingleFrame(idx)}
                    formatTime={formatTime}
                  />
                ))}
              </div>

              <div style={styles.adSlot}>Advertisement</div>
            </div>
          )}

          {/* TOAST */}
          {toastShow && (
            <div style={styles.toast}>
              <span>{toastIcon}</span>
              <span>{toastMsg}</span>
            </div>
          )}
        </div>

        {/* INFO SECTIONS */}
        <InfoSection />
        <FAQSection />
        <SEOSection />
      </main>

      {/* FOOTER */}
      <Footer />
    </div>
  );
}

function FrameThumb({ frame, index, isSelected, onToggleSelect, onDownload, formatTime }) {
  return (
    <div
      style={{
        ...styles.frameThumb,
        ...(isSelected && styles.frameThumbSelected)
      }}
      onClick={onToggleSelect}
    >
      <img
        src={frame.dataURL}
        alt={`Frame at ${formatTime(frame.timestamp)}`}
        loading="lazy"
        style={styles.frameThumbImg}
      />
      <div style={styles.frameOverlay}></div>
      <div style={styles.frameCheck}>✓</div>
      <div style={styles.frameTime}>{formatTime(frame.timestamp)}</div>
      <button
        style={styles.frameDl}
        title="Download this frame"
        onClick={(e) => {
          e.stopPropagation();
          onDownload();
        }}
      >
        ⬇
      </button>
    </div>
  );
}

function InfoSection() {
  const capabilities = [
    { icon: '🌐', title: 'Any URL source', desc: 'YouTube, Vimeo, Twitter, Facebook, Instagram, Dailymotion, and 1000+ sites powered by yt-dlp.' },
    { icon: '📁', title: 'Local files (no upload)', desc: 'MP4, MKV, AVI, MOV, WebM — processed entirely in your browser using the HTML5 video API. Nothing leaves your device.' },
    { icon: '⚡', title: 'Live preview', desc: 'Frames stream to the preview grid in real-time as they are extracted. No waiting for a ZIP to finish.' },
    { icon: '✅', title: 'Select frames', desc: 'Click to select or deselect individual frames. Use Select All / Deselect All. Only selected frames are included in exports.' },
    { icon: '📊', title: 'PPTX export', desc: 'One frame per slide, widescreen 16:9, ready to present in Microsoft PowerPoint or Google Slides.' },
    { icon: '📄', title: 'PDF export', desc: 'All selected frames as a single PDF. Works on every device. No software required to view.' },
    { icon: '🗜️', title: 'ZIP of HD images', desc: 'Download all selected frames as individual JPG files packed in a ZIP archive. Max quality.' },
    { icon: '🖼️', title: 'Single frame download', desc: 'Hover any frame and click the download button to save just that one image immediately.' }
  ];

  return (
    <section style={styles.infoSection}>
      <div style={styles.infoInner}>
        <div style={styles.secEy}>Capabilities</div>
        <h2 style={styles.secH2}>Everything the tool does</h2>
        <div style={styles.cards3}>
          {capabilities.map((cap, i) => (
            <div key={i} style={styles.icard}>
              <div style={styles.icardIco}>{cap.icon}</div>
              <h3 style={styles.icardH3}>{cap.title}</h3>
              <p style={styles.icardP}>{cap.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function FAQSection() {
  const [openIndex, setOpenIndex] = useState(null);

  const faqs = [
    {
      q: 'Can I extract frames from a YouTube video?',
      a: 'Yes. Paste any public YouTube URL. The server uses yt-dlp to fetch the video stream, extracts frames at your chosen interval, and streams them live to your preview grid. Private or age-restricted videos are not supported.'
    },
    {
      q: 'Is my local video file uploaded to the server?',
      a: 'No. Local files are processed entirely in your browser using the HTML5 video API and Canvas. Frames are drawn from the video on your device. Nothing is transmitted to any server.'
    },
    {
      q: 'How do I get the best quality frames?',
      a: 'Select "High" quality in the settings. For URL-based videos, the server fetches the best available stream. For local files, frames are captured at the original video resolution.'
    },
    {
      q: 'Is there a maximum video length or frame limit?',
      a: 'No hard limit. For very long videos, use a larger interval (e.g. every 5 or 10 seconds) to keep the number of frames manageable. Server-side extraction for very long videos may take a few minutes.'
    }
  ];

  return (
    <section style={styles.infoSection}>
      <div style={styles.infoInner}>
        <div style={styles.secEy}>FAQ</div>
        <h2 style={styles.secH2}>Common questions</h2>
        <div style={styles.faqWrap}>
          {faqs.map((faq, i) => (
            <FAQItem
              key={i}
              question={faq.q}
              answer={faq.a}
              isOpen={openIndex === i}
              onToggle={() => setOpenIndex(openIndex === i ? null : i)}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

function FAQItem({ question, answer, isOpen, onToggle }) {
  return (
    <div style={styles.faqItem}>
      <button
        style={styles.faqBtn}
        onClick={onToggle}
        aria-expanded={isOpen}
      >
        {question}
        <span style={{ ...styles.fqIc, ...(isOpen && styles.fqIcOpen) }}>+</span>
      </button>
      {isOpen && (
        <div style={styles.faqAns}>{answer}</div>
      )}
    </div>
  );
}

function SEOSection() {
  return (
    <section style={styles.seoSection}>
      <div style={styles.seoInner}>
        <h2>Free video frame extractor — no account, no watermark</h2>
        <p>
          FrameSnap is the fastest free video frame extractor online. Unlike other tools that only support local files, FrameSnap also supports YouTube and 1000+ online video sites. Paste a URL, choose your interval, and frames appear in your browser in real-time.
        </p>
        <h2>How to convert video to PowerPoint (PPTX) free</h2>
        <p>
          Extracting frames from a video to create a PowerPoint presentation is a common need for educators, content creators, and business professionals. With FrameSnap, the process takes three steps: paste your video URL (or upload a file), choose your interval, and click Export → PPTX. Each frame becomes one slide in a widescreen 16:9 presentation.
        </p>
        <h2>Extract frames from YouTube video</h2>
        <p>
          FrameSnap supports frame extraction directly from YouTube. Paste the YouTube video URL, set the interval (e.g. every 2 seconds), and click Extract. Frames appear in the preview grid as they are captured. You can then select specific frames and export in any format.
        </p>
        <h2>Video to images — supported export formats</h2>
        <ul style={styles.seoList}>
          <li><strong>PPTX</strong> — PowerPoint presentation, one frame per slide, widescreen 16:9</li>
          <li><strong>PDF</strong> — All selected frames in a single, shareable PDF</li>
          <li><strong>ZIP</strong> — All selected frames as individual high-resolution JPG files</li>
          <li><strong>Individual JPG/PNG</strong> — Download any single frame with one click</li>
        </ul>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer style={styles.footer}>
      <div style={styles.footerInner}>
        <span>© 2025 FrameSnap</span>
        <nav style={styles.footerLinks}>
          <a href="/">← Home</a>
          <a href="/tools/video-downloader/">Video Downloader</a>
          <a href="/privacy/">Privacy</a>
          <a href="/sitemap.xml">Sitemap</a>
        </nav>
      </div>
    </footer>
  );
}

const globalStyles = `
  :root {
    --bg: #080c14;
    --bg2: #0d1220;
    --bg3: #121828;
    --bg4: #1a2236;
    --bg5: #0f1623;
    --border: #1e2d48;
    --border2: #253550;
    --text: #e8eef8;
    --muted: #6b7fa3;
    --muted2: #3d5070;
    --accent: #4f9eff;
    --accent2: #7bb8ff;
    --accent3: #2563eb;
    --gold: #f59e0b;
    --green: #10b981;
    --red: #ef4444;
    --purple: #a78bfa;
  }

  * {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
  }

  html {
    scroll-behavior: smooth;
  }

  body {
    background: var(--bg);
    color: var(--text);
    font-family: 'Instrument Sans', sans-serif;
    line-height: 1.6;
    overflow-x: hidden;
  }

  a {
    color: inherit;
    text-decoration: none;
  }

  button {
    cursor: pointer;
    font-family: 'Instrument Sans', sans-serif;
  }

  @keyframes blink {
    0%, 100% { opacity: 1; }
    50% { opacity: 0.2; }
  }

  @keyframes spin {
    to { transform: rotate(360deg); }
  }

  @keyframes fadeUp {
    from { opacity: 0; transform: translateY(18px); }
    to { opacity: 1; transform: translateY(0); }
  }

  @keyframes frameIn {
    from { opacity: 0; transform: scale(0.92); }
    to { opacity: 1; transform: scale(1); }
  }
`;

const styles = {
  body: {
    background: 'var(--bg)',
    color: 'var(--text)',
    fontFamily: "'Instrument Sans', sans-serif",
    minHeight: '100vh'
  },
  header: {
    position: 'sticky',
    top: 0,
    zIndex: 500,
    background: 'rgba(8, 12, 20, 0.92)',
    backdropFilter: 'blur(20px)',
    borderBottom: '1px solid var(--border)'
  },
  nav: {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '13px 24px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  logo: {
    display: 'flex',
    alignItems: 'center',
    gap: '9px',
    fontFamily: "'Bricolage Grotesque', sans-serif",
    fontSize: '1.1rem',
    fontWeight: 800,
    letterSpacing: '-0.02em'
  },
  logoMark: {
    width: '30px',
    height: '30px',
    background: 'var(--accent3)',
    borderRadius: '7px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '0.9rem'
  },
  breadcrumb: {
    fontSize: '0.8rem',
    color: 'var(--muted)',
    display: 'flex',
    alignItems: 'center',
    gap: '5px'
  },
  pageHero: {
    position: 'relative',
    zIndex: 1,
    padding: '52px 24px 40px',
    textAlign: 'center'
  },
  chip: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '6px',
    background: 'rgba(16, 185, 129, 0.08)',
    border: '1px solid rgba(16, 185, 129, 0.2)',
    color: 'var(--green)',
    fontSize: '0.7rem',
    fontWeight: 700,
    letterSpacing: '0.08em',
    textTransform: 'uppercase',
    padding: '4px 12px',
    borderRadius: '100px',
    marginBottom: '18px'
  },
  chipDot: {
    width: '5px',
    height: '5px',
    background: 'var(--green)',
    borderRadius: '50%',
    display: 'inline-block',
    animation: 'blink 2s infinite'
  },
  h1: {
    fontFamily: "'Bricolage Grotesque', sans-serif",
    fontSize: 'clamp(2rem, 5.5vw, 3.6rem)',
    fontWeight: 800,
    letterSpacing: '-0.04em',
    lineHeight: 1.05,
    marginBottom: '14px'
  },
  em: {
    fontStyle: 'normal',
    background: 'linear-gradient(135deg, var(--accent), var(--purple))',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    backgroundClip: 'text'
  },
  heroP: {
    fontSize: '1rem',
    color: 'var(--muted)',
    maxWidth: '520px',
    margin: '0 auto 28px',
    lineHeight: 1.7
  },
  featurePills: {
    display: 'flex',
    justifyContent: 'center',
    flexWrap: 'wrap',
    gap: '7px',
    marginBottom: '44px'
  },
  fpill: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '5px',
    background: 'var(--bg2)',
    border: '1px solid var(--border)',
    fontSize: '0.74rem',
    color: 'var(--muted)',
    padding: '4px 11px',
    borderRadius: '100px'
  },
  fdot: {
    width: '5px',
    height: '5px',
    borderRadius: '50%'
  },
  toolOuter: {
    position: 'relative',
    zIndex: 1,
    maxWidth: '1100px',
    margin: '0 auto',
    padding: '0 20px 100px'
  },
  adSlot: {
    background: 'var(--bg2)',
    border: '1px dashed var(--border)',
    borderRadius: '12px',
    padding: '18px',
    textAlign: 'center',
    color: 'var(--muted2)',
    fontSize: '0.76rem',
    minHeight: '90px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: '20px'
  },
  sourcePanel: {
    background: 'var(--bg2)',
    border: '1px solid var(--border)',
    borderRadius: '14px',
    padding: '24px',
    marginBottom: '16px'
  },
  panelLabel: {
    fontSize: '0.7rem',
    fontWeight: 700,
    letterSpacing: '0.1em',
    textTransform: 'uppercase',
    color: 'var(--muted2)',
    marginBottom: '14px'
  },
  sourceTabs: {
    display: 'flex',
    gap: '8px',
    marginBottom: '18px'
  },
  stab: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    background: 'var(--bg3)',
    border: '1px solid var(--border)',
    color: 'var(--muted)',
    fontSize: '0.82rem',
    fontWeight: 500,
    padding: '8px 16px',
    borderRadius: '8px',
    transition: 'all 0.2s',
    cursor: 'pointer'
  },
  stabActive: {
    background: 'rgba(37, 99, 235, 0.15)',
    borderColor: 'var(--accent3)',
    color: 'var(--text)'
  },
  urlRow: {
    display: 'flex',
    gap: '10px'
  },
  urlInput: {
    flex: 1,
    background: 'var(--bg3)',
    border: '1px solid var(--border)',
    borderRadius: '8px',
    color: 'var(--text)',
    fontFamily: "'Instrument Sans', sans-serif",
    fontSize: '0.9rem',
    padding: '11px 15px',
    outline: 'none',
    transition: 'border-color 0.2s'
  },
  apiNote: {
    fontSize: '0.76rem',
    color: 'var(--muted2)',
    marginTop: '8px'
  },
  configRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '20px',
    flexWrap: 'wrap',
    marginTop: '16px',
    paddingTop: '16px',
    borderTop: '1px solid var(--border)'
  },
  configGroup: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px'
  },
  spinInput: {
    background: 'var(--bg3)',
    border: '1px solid var(--border)',
    borderRadius: '8px',
    color: 'var(--text)',
    fontFamily: "'Bricolage Grotesque', sans-serif",
    fontSize: '0.95rem',
    fontWeight: 700,
    padding: '8px 12px',
    width: '72px',
    textAlign: 'center',
    outline: 'none'
  },
  qualitySel: {
    background: 'var(--bg3)',
    border: '1px solid var(--border)',
    borderRadius: '8px',
    color: 'var(--text)',
    fontFamily: "'Instrument Sans', sans-serif",
    fontSize: '0.85rem',
    padding: '8px 12px',
    outline: 'none'
  },
  btnExtract: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '8px',
    background: 'var(--accent3)',
    color: '#fff',
    fontFamily: "'Bricolage Grotesque', sans-serif",
    fontSize: '0.95rem',
    fontWeight: 700,
    border: 'none',
    borderRadius: '12px',
    padding: '13px 28px',
    transition: 'all 0.2s',
    letterSpacing: '-0.01em',
    marginTop: '16px',
    cursor: 'pointer'
  },
  dropZone: {
    background: 'var(--bg3)',
    border: '2px dashed var(--border)',
    borderRadius: '12px',
    padding: '36px 24px',
    textAlign: 'center',
    cursor: 'pointer',
    transition: 'all 0.2s',
    marginBottom: '16px'
  },
  dragOver: {
    borderColor: 'var(--accent3)',
    background: 'rgba(37, 99, 235, 0.04)'
  },
  dropZoneIcon: {
    fontSize: '2.2rem',
    marginBottom: '8px'
  },
  dropFileName: {
    fontSize: '0.82rem',
    color: 'var(--green)',
    marginTop: '8px',
    fontWeight: 600
  },
  btnBrowse: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '6px',
    background: 'var(--bg2)',
    border: '1px solid var(--border2)',
    color: 'var(--text)',
    fontSize: '0.85rem',
    fontWeight: 600,
    borderRadius: '8px',
    padding: '9px 18px',
    marginTop: '12px',
    transition: 'all 0.2s',
    cursor: 'pointer'
  },
  progressPanel: {
    background: 'var(--bg2)',
    border: '1px solid var(--border)',
    borderRadius: '14px',
    padding: '28px',
    marginBottom: '16px'
  },
  spinnerRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    marginBottom: '10px'
  },
  spinner: {
    width: '20px',
    height: '20px',
    border: '2px solid var(--border2)',
    borderTopColor: 'var(--accent)',
    borderRadius: '50%',
    animation: 'spin 0.7s linear infinite',
    flexShrink: 0
  },
  progTitle: {
    fontFamily: "'Bricolage Grotesque', sans-serif",
    fontSize: '1rem',
    fontWeight: 700
  },
  progNote: {
    fontSize: '0.8rem',
    color: 'var(--muted)'
  },
  progBarOuter: {
    background: 'var(--bg3)',
    borderRadius: '100px',
    height: '6px',
    overflow: 'hidden',
    marginBottom: '10px'
  },
  progBarFill: {
    height: '100%',
    background: 'linear-gradient(90deg, var(--accent3), var(--accent))',
    borderRadius: '100px',
    transition: 'width 0.4s'
  },
  progTop: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '10px'
  },
  progCount: {
    fontSize: '0.85rem',
    color: 'var(--muted)'
  },
  cancelBtnStyle: {
    background: 'none',
    border: 'none',
    color: 'var(--red)',
    fontSize: '0.8rem',
    fontWeight: 600,
    cursor: 'pointer'
  },
  exportBar: {
    background: 'var(--bg2)',
    border: '1px solid var(--border)',
    borderRadius: '14px',
    padding: '20px 24px',
    display: 'flex',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: '14px',
    marginBottom: '24px'
  },
  exportBarLabel: {
    fontSize: '0.82rem',
    color: 'var(--muted)',
    fontWeight: 500,
    flexShrink: 0
  },
  exportBtns: {
    display: 'flex',
    gap: '8px',
    flexWrap: 'wrap'
  },
  btnExport: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '6px',
    fontSize: '0.84rem',
    fontWeight: 700,
    borderRadius: '8px',
    padding: '10px 18px',
    border: 'none',
    transition: 'all 0.2s',
    fontFamily: "'Bricolage Grotesque', sans-serif",
    cursor: 'pointer'
  },
  btnPptx: {
    background: 'rgba(245, 158, 11, 0.12)',
    color: 'var(--gold)',
    border: '1px solid rgba(245, 158, 11, 0.25)'
  },
  btnPdf: {
    background: 'rgba(239, 68, 68, 0.1)',
    color: '#fca5a5',
    border: '1px solid rgba(239, 68, 68, 0.2)'
  },
  btnZip: {
    background: 'rgba(16, 185, 129, 0.1)',
    color: 'var(--green)',
    border: '1px solid rgba(16, 185, 129, 0.2)'
  },
  selNote: {
    fontSize: '0.78rem',
    color: 'var(--muted2)',
    marginLeft: 'auto'
  },
  framesToolbar: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
    gap: '12px',
    marginBottom: '16px'
  },
  framesToolbarLeft: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    flexWrap: 'wrap'
  },
  framesCount: {
    fontFamily: "'Bricolage Grotesque', sans-serif",
    fontSize: '1.1rem',
    fontWeight: 700
  },
  framesSub: {
    fontSize: '0.82rem',
    color: 'var(--muted)'
  },
  btnSelAll: {
    background: 'var(--bg3)',
    border: '1px solid var(--border)',
    color: 'var(--muted)',
    fontSize: '0.78rem',
    fontWeight: 600,
    borderRadius: '8px',
    padding: '6px 12px',
    transition: 'all 0.2s',
    cursor: 'pointer'
  },
  btnSelNone: {
    background: 'var(--bg3)',
    border: '1px solid var(--border)',
    color: 'var(--muted)',
    fontSize: '0.78rem',
    fontWeight: 600,
    borderRadius: '8px',
    padding: '6px 12px',
    transition: 'all 0.2s',
    cursor: 'pointer'
  },
  btnNew: {
    background: 'var(--bg3)',
    border: '1px solid var(--border)',
    color: 'var(--muted)',
    fontSize: '0.78rem',
    fontWeight: 600,
    borderRadius: '8px',
    padding: '6px 12px',
    transition: 'all 0.2s',
    cursor: 'pointer'
  },
  framesGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))',
    gap: '10px',
    marginBottom: '24px'
  },
  frameThumb: {
    position: 'relative',
    borderRadius: '8px',
    overflow: 'hidden',
    cursor: 'pointer',
    border: '2px solid var(--border)',
    transition: 'all 0.2s',
    background: 'var(--bg3)',
    aspectRatio: '16/9'
  },
  frameThumbSelected: {
    borderColor: 'var(--accent)',
    boxShadow: '0 0 0 3px rgba(79, 158, 255, 0.25)'
  },
  frameThumbImg: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
    display: 'block'
  },
  frameOverlay: {
    position: 'absolute',
    inset: 0,
    background: 'rgba(0, 0, 0, 0)',
    transition: 'background 0.2s'
  },
  frameCheck: {
    position: 'absolute',
    top: '7px',
    left: '7px',
    width: '22px',
    height: '22px',
    borderRadius: '50%',
    background: 'rgba(0, 0, 0, 0.6)',
    border: '2px solid rgba(255, 255, 255, 0.4)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '0.7rem',
    color: '#fff',
    transition: 'all 0.2s'
  },
  frameTime: {
    position: 'absolute',
    bottom: '6px',
    right: '6px',
    background: 'rgba(0, 0, 0, 0.75)',
    color: '#fff',
    fontSize: '0.64rem',
    fontWeight: 600,
    padding: '2px 6px',
    borderRadius: '4px'
  },
  frameDl: {
    position: 'absolute',
    top: '7px',
    right: '7px',
    width: '26px',
    height: '26px',
    borderRadius: '50%',
    background: 'rgba(0, 0, 0, 0.65)',
    border: 'none',
    color: '#fff',
    fontSize: '0.75rem',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    opacity: 0,
    transition: 'opacity 0.2s',
    cursor: 'pointer'
  },
  toast: {
    position: 'fixed',
    bottom: '28px',
    right: '28px',
    background: 'var(--bg2)',
    border: '1px solid var(--border2)',
    borderRadius: '12px',
    padding: '14px 20px',
    fontSize: '0.85rem',
    color: 'var(--text)',
    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.5)',
    zIndex: 1000,
    display: 'flex',
    alignItems: 'center',
    gap: '10px'
  },
  infoSection: {
    position: 'relative',
    zIndex: 1,
    padding: '60px 24px',
    borderTop: '1px solid var(--border)'
  },
  infoInner: {
    maxWidth: '1100px',
    margin: '0 auto'
  },
  secEy: {
    fontSize: '0.7rem',
    fontWeight: 700,
    letterSpacing: '0.12em',
    textTransform: 'uppercase',
    color: 'var(--accent)',
    marginBottom: '9px'
  },
  secH2: {
    fontFamily: "'Bricolage Grotesque', sans-serif",
    fontSize: 'clamp(1.5rem, 3.5vw, 2.2rem)',
    fontWeight: 800,
    letterSpacing: '-0.03em',
    marginBottom: '32px'
  },
  cards3: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
    gap: '12px'
  },
  icard: {
    background: 'var(--bg2)',
    border: '1px solid var(--border)',
    borderRadius: '14px',
    padding: '20px'
  },
  icardIco: {
    fontSize: '1.6rem',
    marginBottom: '10px'
  },
  icardH3: {
    fontFamily: "'Bricolage Grotesque', sans-serif",
    fontSize: '0.95rem',
    fontWeight: 700,
    marginBottom: '6px'
  },
  icardP: {
    fontSize: '0.8rem',
    color: 'var(--muted)',
    lineHeight: 1.6
  },
  faqWrap: {
    maxWidth: '800px'
  },
  faqItem: {
    borderBottom: '1px solid var(--border)'
  },
  faqBtn: {
    width: '100%',
    background: 'none',
    border: 'none',
    color: 'var(--text)',
    fontFamily: "'Instrument Sans', sans-serif",
    fontSize: '0.93rem',
    fontWeight: 500,
    textAlign: 'left',
    padding: '16px 0',
    cursor: 'pointer',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: '14px'
  },
  fqIc: {
    width: '21px',
    height: '21px',
    borderRadius: '50%',
    background: 'var(--bg3)',
    border: '1px solid var(--border)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '0.78rem',
    flexShrink: 0,
    transition: 'all 0.3s'
  },
  fqIcOpen: {
    transform: 'rotate(45deg)',
    background: 'var(--accent3)',
    borderColor: 'var(--accent3)',
    color: '#fff'
  },
  faqAns: {
    fontSize: '0.86rem',
    color: 'var(--muted)',
    lineHeight: 1.7,
    paddingBottom: '16px'
  },
  seoSection: {
    position: 'relative',
    zIndex: 1,
    padding: '60px 24px',
    borderTop: '1px solid var(--border)'
  },
  seoInner: {
    maxWidth: '740px',
    margin: '0 auto'
  },
  seoList: {
    margin: '0 0 10px 18px'
  },
  footer: {
    position: 'relative',
    zIndex: 1,
    borderTop: '1px solid var(--border)',
    padding: '36px 24px'
  },
  footerInner: {
    maxWidth: '1200px',
    margin: '0 auto',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: '12px',
    fontSize: '0.78rem',
    color: 'var(--muted2)'
  },
  footerLinks: {
    display: 'flex',
    gap: '14px',
    flexWrap: 'wrap'
  },
  apiStatusNote: {
    fontSize: '0.74rem',
    color: 'var(--muted2)',
    marginTop: '10px'
  },
  apiCode: {
    background: 'var(--bg3)',
    padding: '2px 6px',
    borderRadius: '4px',
    color: 'var(--accent2)'
  }
};
