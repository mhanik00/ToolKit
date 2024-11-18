import { useState, useRef } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

function PDFTool() {
  const [file, setFile] = useState(null);
  const [numPages, setNumPages] = useState(null);
  const [pageNumber, setPageNumber] = useState(1);
  const [scale, setScale] = useState(1.0);
  const [rotation, setRotation] = useState(0);
  const fileInputRef = useRef(null);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile && selectedFile.type === 'application/pdf') {
      setFile(URL.createObjectURL(selectedFile));
      setPageNumber(1);
      setScale(1.0);
      setRotation(0);
    }
  };

  const onDocumentLoadSuccess = ({ numPages }) => {
    setNumPages(numPages);
  };

  const changePage = (offset) => {
    setPageNumber(prevPageNumber => {
      const newPageNumber = prevPageNumber + offset;
      return Math.min(Math.max(1, newPageNumber), numPages);
    });
  };

  const zoomIn = () => {
    setScale(prevScale => Math.min(prevScale + 0.1, 2.0));
  };

  const zoomOut = () => {
    setScale(prevScale => Math.max(prevScale - 0.1, 0.5));
  };

  const rotate = () => {
    setRotation(prevRotation => (prevRotation + 90) % 360);
  };

  const resetView = () => {
    setScale(1.0);
    setRotation(0);
  };

  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
          <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">
            PDF Viewer
          </h2>

          {/* File Upload */}
          <div className="mb-6">
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              accept="application/pdf"
              className="hidden"
              id="pdf-upload"
            />
            <label
              htmlFor="pdf-upload"
              className="inline-flex items-center px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors cursor-pointer"
            >
              Choose PDF File
            </label>
          </div>

          {file && (
            <>
              {/* Controls */}
              <div className="mb-6 flex flex-wrap gap-4">
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => changePage(-1)}
                    disabled={pageNumber <= 1}
                    className="px-3 py-1 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-md disabled:opacity-50"
                  >
                    Previous
                  </button>
                  <span className="text-gray-700 dark:text-gray-300">
                    Page {pageNumber} of {numPages}
                  </span>
                  <button
                    onClick={() => changePage(1)}
                    disabled={pageNumber >= numPages}
                    className="px-3 py-1 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-md disabled:opacity-50"
                  >
                    Next
                  </button>
                </div>

                <div className="flex items-center space-x-2">
                  <button
                    onClick={zoomOut}
                    className="px-3 py-1 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-md"
                  >
                    Zoom Out
                  </button>
                  <span className="text-gray-700 dark:text-gray-300">
                    {Math.round(scale * 100)}%
                  </span>
                  <button
                    onClick={zoomIn}
                    className="px-3 py-1 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-md"
                  >
                    Zoom In
                  </button>
                </div>

                <button
                  onClick={rotate}
                  className="px-3 py-1 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-md"
                >
                  Rotate
                </button>

                <button
                  onClick={resetView}
                  className="px-3 py-1 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-md"
                >
                  Reset View
                </button>
              </div>

              {/* PDF Viewer */}
              <div className="flex justify-center border border-gray-300 dark:border-gray-600 rounded-lg overflow-auto">
                <Document
                  file={file}
                  onLoadSuccess={onDocumentLoadSuccess}
                  className="max-w-full"
                >
                  <Page
                    pageNumber={pageNumber}
                    scale={scale}
                    rotate={rotation}
                    className="max-w-full"
                    renderTextLayer={false}
                    renderAnnotationLayer={false}
                  />
                </Document>
              </div>

              {/* Page Thumbnails */}
              <div className="mt-6 flex overflow-x-auto space-x-4 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                {Array.from(new Array(numPages), (el, index) => (
                  <button
                    key={`thumb-${index + 1}`}
                    onClick={() => setPageNumber(index + 1)}
                    className={`flex-shrink-0 ${
                      pageNumber === index + 1
                        ? 'ring-2 ring-blue-500'
                        : ''
                    }`}
                  >
                    <Document file={file}>
                      <Page
                        pageNumber={index + 1}
                        scale={0.2}
                        className="border border-gray-300 dark:border-gray-600"
                        renderTextLayer={false}
                        renderAnnotationLayer={false}
                      />
                    </Document>
                  </button>
                ))}
              </div>
            </>
          )}

          {/* Instructions */}
          {!file && (
            <div className="text-center text-gray-600 dark:text-gray-400">
              <p>Upload a PDF file to view and manipulate it.</p>
              <p className="mt-2 text-sm">Supported operations:</p>
              <ul className="mt-1 text-sm">
                <li>• Page navigation</li>
                <li>• Zoom in/out</li>
                <li>• Rotation</li>
                <li>• Thumbnail preview</li>
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default PDFTool; 