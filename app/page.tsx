"use client";

import { useEffect, useRef, useState } from "react";

// ZXing được load từ CDN như trong code gốc
// <script src="https://unpkg.com/@zxing/library@latest"></script>
// Khi chạy trong Next.js, bạn có thể thêm script này vào _document.tsx hoặc _app.tsx
// và dùng window.ZXing trong component.

declare global {
  interface Window {
    ZXing: any;
  }
}

export default function ZXingDemo() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const resultRef = useRef<HTMLPreElement>(null);
  const [devices, setDevices] = useState<MediaDeviceInfo[]>([]);
  const [selectedDeviceId, setSelectedDeviceId] = useState<string | undefined>();

  useEffect(() => {
    if (!window.ZXing) return;
    const codeReader = new window.ZXing.BrowserQRCodeReader();
    console.log("ZXing code reader initialized");

    codeReader.getVideoInputDevices().then((videoInputDevices: MediaDeviceInfo[]) => {
      setDevices(videoInputDevices);
      if (videoInputDevices.length > 0) {
        setSelectedDeviceId(videoInputDevices[0].deviceId);
      }
    }).catch((err: any) => console.error(err));
  }, []);

  const decodeOnce = () => {
    if (!window.ZXing || !selectedDeviceId) return;
    const codeReader = new window.ZXing.BrowserQRCodeReader();
    codeReader.decodeFromInputVideoDevice(selectedDeviceId, videoRef.current)
      .then((result: any) => {
        console.log(result);
        if (resultRef.current) resultRef.current.textContent = result.text;
      })
      .catch((err: any) => {
        console.error(err);
        if (resultRef.current) resultRef.current.textContent = String(err);
      });
  };

  const decodeContinuously = () => {
    if (!window.ZXing || !selectedDeviceId) return;
    const codeReader = new window.ZXing.BrowserQRCodeReader();
    codeReader.decodeFromInputVideoDeviceContinuously(
      selectedDeviceId,
      videoRef.current,
      (result: any, err: any) => {
        if (result) {
          console.log("Found QR code!", result);
          if (resultRef.current) resultRef.current.textContent = result.text;
        }
        if (err) {
          if (err instanceof window.ZXing.NotFoundException) {
            console.log("No QR code found.");
          }
          if (err instanceof window.ZXing.ChecksumException) {
            console.log("Checksum error.");
          }
          if (err instanceof window.ZXing.FormatException) {
            console.log("Format error.");
          }
        }
      }
    );
  };

  const reset = () => {
    if (!window.ZXing) return;
    const codeReader = new window.ZXing.BrowserQRCodeReader();
    codeReader.reset();
    if (resultRef.current) resultRef.current.textContent = "";
    console.log("Reset.");
  };

  return (
    <main style={{ paddingTop: "2em" }}>
      <section>
        <h1>Scan QR Code from Video Camera</h1>

        <div>
          <button onClick={decodeOnce}>Start Once</button>
          <button onClick={decodeContinuously}>Start Continuously</button>
          <button onClick={reset}>Reset</button>
        </div>

        <div>
          <video ref={videoRef} width={300} height={200} style={{ border: "1px solid gray" }} />
        </div>

        {devices.length > 1 && (
          <div>
            <label htmlFor="sourceSelect">Change video source:</label>
            <select
              id="sourceSelect"
              value={selectedDeviceId}
              onChange={(e) => setSelectedDeviceId(e.target.value)}
              style={{ maxWidth: "400px" }}
            >
              {devices.map((d) => (
                <option key={d.deviceId} value={d.deviceId}>
                  {d.label || d.deviceId}
                </option>
              ))}
            </select>
          </div>
        )}

        <div>
          <label>Result:</label>
          <pre ref={resultRef}></pre>
        </div>
      </section>
    </main>
  );
}
