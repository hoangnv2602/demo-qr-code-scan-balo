'use client';

import React, { useState } from 'react';
import { Scanner } from '@yudiel/react-qr-scanner';

export default function Home() {
  
  const [stringQR, setStringQR] = useState('');
  const [name, setName] = useState('');
  const [gender, setGender] = useState('');
  const [dob, setDob] = useState('');
  const [age, setAge] = useState<number | null>(null);
  const [status, setStatus] = useState('');

  const [isPaused, setIsPaused] = useState(false);

  const handleScan = (result: any) => {
    if (!result) return;
    const raw = result[0]?.rawValue;
    setStringQR(raw);
    console.log('Scanned QR Code:', raw);
    // Tách chuỗi theo dấu |
    const parts = raw.split('|');
    if (parts.length >= 3) {
      setName(parts[2]);
      setDob(parts[3]);
      setGender(parts[4]);

      const dobRaw = parts[3];
      
      if (dobRaw.length === 8) {
        const day = dobRaw.substring(0, 2);
        const month = dobRaw.substring(2, 4);
        const year = dobRaw.substring(4, 8);
        const formattedDob = `${day}/${month}/${year}`;
        setDob(formattedDob);

        // Tính tuổi
        const birthDate = new Date(`${year}-${month}-${day}`);
        const today = new Date();
        let calculatedAge = today.getFullYear() - birthDate.getFullYear();
        const m = today.getMonth() - birthDate.getMonth();
        if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
          calculatedAge--;
        }
        setAge(calculatedAge);

        if (calculatedAge > 18) {
          setStatus('Trên 18 tuổi');
        } else if (calculatedAge === 18) {
          setStatus('Đủ 18 tuổi');
        } else {
          setStatus('Chưa đủ 18 tuổi');
        }
      }
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '20px' }}>
      <h2 style={{ marginTop: '20px' }}>Kiểm tra thông tin customer</h2>
      <Scanner
        onScan={handleScan}
        paused={isPaused}
      />
      <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', alignSelf: 'flex-start', gap: '0' }}>
        <span>Họ tên: {name}</span>
        <br />
        <span>Giới tính: {gender}</span>
        <br />
        <span>Ngày sinh: {dob}</span>
        <br />
        <span>Tuổi: {age}</span>
        <br/>
        <span style={{ fontWeight: 'bold', color: age !== null && age < 18 ? 'red' : 'green' }}>Trạng thái: {status}</span>
      </div>
    </div>
  );
}
