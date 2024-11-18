import { useState, useRef, useEffect } from 'react';

function ImageEditor() {
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [activeTab, setActiveTab] = useState('adjust');
  const canvasRef = useRef(null);
  const imageRef = useRef(null);

  const [adjustments, setAdjustments] = useState({
    brightness: 100,
    contrast: 100,
    saturation: 100,
    blur: 0,
    grayscale: 0,
    sepia: 0,
    invert: 0,
  });

  const [crop, setCrop] = useState({
    active: false,
    x: 0,
    y: 0,
    width: 0,
    height: 0
  });

  useEffect(() => {
    if (image) {
      const url = URL.createObjectURL(image);
      setPreview(url);
      return () => URL.revokeObjectURL(url);
    }
  }, [image]);

  useEffect(() => {
    if (preview) {
      applyFilters();
    }
  }, [adjustments, preview]);

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith('image/')) {
      setImage(file);
      resetAdjustments();
    }
  };

  const resetAdjustments = () => {
    setAdjustments({
      brightness: 100,
      contrast: 100,
      saturation: 100,
      blur: 0,
      grayscale: 0,
      sepia: 0,
      invert: 0,
    });
  };

  const applyFilters = () => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const img = imageRef.current;

    if (img && img.complete) {
      canvas.width = img.naturalWidth;
      canvas.height = img.naturalHeight;

      ctx.filter = `
        brightness(${adjustments.brightness}%)
        contrast(${adjustments.contrast}%)
        saturate(${adjustments.saturation}%)
        blur(${adjustments.blur}px)
        grayscale(${adjustments.grayscale}%)
        sepia(${adjustments.sepia}%)
        invert(${adjustments.invert}%)
      `;

      ctx.drawImage(img, 0, 0);
    }
  };

  const downloadImage = () => {
    const canvas = canvasRef.current;
    const link = document.createElement('a');
    link.download = 'edited-image.png';
    link.href = canvas.toDataURL('image/png');
    link.click();
  };

  const handleCrop = () => {
    if (!crop.active) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const img = imageRef.current;

    const tempCanvas = document.createElement('canvas');
    const tempCtx = tempCanvas.getContext('2d');

    tempCanvas.width = crop.width;
    tempCanvas.height = crop.height;

    tempCtx.drawImage(
      canvas,
      crop.x, crop.y, crop.width, crop.height,
      0, 0, crop.width, crop.height
    );

    canvas.width = crop.width;
    canvas.height = crop.height;
    ctx.drawImage(tempCanvas, 0, 0);

    setCrop({ active: false, x: 0, y: 0, width: 0, height: 0 });
  };

  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
          <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">
            Image Editor
          </h2>

          {/* Image Upload */}
          {!image && (
            <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-12 text-center">
              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
                id="image-upload"
              />
              <label
                htmlFor="image-upload"
                className="cursor-pointer inline-flex items-center px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
              >
                Upload Image
              </label>
            </div>
          )}

          {image && (
            <>
              {/* Tabs */}
              <div className="flex space-x-4 mb-6">
                {['adjust', 'filters', 'crop'].map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`px-4 py-2 rounded-md capitalize ${
                      activeTab === tab
                        ? 'bg-blue-500 text-white'
                        : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
                    }`}
                  >
                    {tab}
                  </button>
                ))}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Controls */}
                <div className="space-y-4">
                  {activeTab === 'adjust' && (
                    <>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                          Brightness: {adjustments.brightness}%
                        </label>
                        <input
                          type="range"
                          min="0"
                          max="200"
                          value={adjustments.brightness}
                          onChange={(e) => setAdjustments({ ...adjustments, brightness: e.target.value })}
                          className="w-full"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                          Contrast: {adjustments.contrast}%
                        </label>
                        <input
                          type="range"
                          min="0"
                          max="200"
                          value={adjustments.contrast}
                          onChange={(e) => setAdjustments({ ...adjustments, contrast: e.target.value })}
                          className="w-full"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                          Saturation: {adjustments.saturation}%
                        </label>
                        <input
                          type="range"
                          min="0"
                          max="200"
                          value={adjustments.saturation}
                          onChange={(e) => setAdjustments({ ...adjustments, saturation: e.target.value })}
                          className="w-full"
                        />
                      </div>
                    </>
                  )}

                  {activeTab === 'filters' && (
                    <>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                          Blur: {adjustments.blur}px
                        </label>
                        <input
                          type="range"
                          min="0"
                          max="10"
                          value={adjustments.blur}
                          onChange={(e) => setAdjustments({ ...adjustments, blur: e.target.value })}
                          className="w-full"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                          Grayscale: {adjustments.grayscale}%
                        </label>
                        <input
                          type="range"
                          min="0"
                          max="100"
                          value={adjustments.grayscale}
                          onChange={(e) => setAdjustments({ ...adjustments, grayscale: e.target.value })}
                          className="w-full"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                          Sepia: {adjustments.sepia}%
                        </label>
                        <input
                          type="range"
                          min="0"
                          max="100"
                          value={adjustments.sepia}
                          onChange={(e) => setAdjustments({ ...adjustments, sepia: e.target.value })}
                          className="w-full"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                          Invert: {adjustments.invert}%
                        </label>
                        <input
                          type="range"
                          min="0"
                          max="100"
                          value={adjustments.invert}
                          onChange={(e) => setAdjustments({ ...adjustments, invert: e.target.value })}
                          className="w-full"
                        />
                      </div>
                    </>
                  )}

                  {activeTab === 'crop' && (
                    <div className="space-y-4">
                      <button
                        onClick={() => setCrop({ ...crop, active: !crop.active })}
                        className="w-full px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
                      >
                        {crop.active ? 'Apply Crop' : 'Start Crop'}
                      </button>
                    </div>
                  )}

                  <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                    <button
                      onClick={resetAdjustments}
                      className="w-full px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 transition-colors mb-2"
                    >
                      Reset
                    </button>
                    <button
                      onClick={downloadImage}
                      className="w-full px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 transition-colors"
                    >
                      Download
                    </button>
                  </div>
                </div>

                {/* Image Preview */}
                <div className="md:col-span-2 relative">
                  <img
                    ref={imageRef}
                    src={preview}
                    alt="Original"
                    className="hidden"
                    onLoad={() => applyFilters()}
                  />
                  <canvas
                    ref={canvasRef}
                    className="w-full h-auto rounded-lg"
                  />
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default ImageEditor; 