'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { OrbitControls as OrbitControlsImpl } from 'three/examples/jsm/controls/OrbitControls.js';
import { useStore } from '@/store/useStore';
import { Crown } from 'lucide-react';

function Controls() {
  const { camera, gl } = useThree();
  const controls = useMemo(() => {
    const c = new OrbitControlsImpl(camera, gl.domElement);
    c.enableZoom = false;
    return c;
  }, [camera, gl]);

  useFrame(() => controls.update());

  useEffect(() => () => controls.dispose(), [controls]);

  return <primitive object={controls} />;
}

function Avatar3D() {
  return (
    <mesh>
      <boxGeometry args={[2, 2, 2]} />
      <meshStandardMaterial color="#ec4899" />
    </mesh>
  );
}

export default function AvatarDisplay() {
  const { settings, updateSettings } = useStore();
  const [imagePreview, setImagePreview] = useState<string | null>(settings.avatarPhoto || null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        setImagePreview(result);
        updateSettings({ avatarPhoto: result });
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="relative flex flex-col items-center">
      <div className="bg-white rounded-full p-4 shadow-xl">
        {settings.isPremium ? (
          <div className="w-64 h-64">
            <Canvas camera={{ position: [0, 0, 5], fov: 50 }}>
              <ambientLight intensity={0.5} />
              <pointLight position={[10, 10, 10]} />
              <Avatar3D />
              <Controls />
            </Canvas>
          </div>
        ) : imagePreview ? (
          <div className="relative w-64 h-64 rounded-full overflow-hidden shadow-2xl border-4 border-white">
            <img
              src={imagePreview}
              alt="Partner"
              className="w-full h-full object-cover"
            />
          </div>
        ) : (
          <div className="w-64 h-64 rounded-full bg-gradient-to-br from-pink-200 to-purple-200 flex items-center justify-center">
            <div className="text-center">
              <div className="text-6xl mb-2">💕</div>
              <button
                onClick={() => fileInputRef.current?.click()}
                className="text-sm text-gray-600 hover:text-gray-800 underline"
              >
                Загрузить фото
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
              />
            </div>
          </div>
        )}
      </div>

      <p className="mt-3 text-lg font-semibold text-gray-800">
        {settings.partnerName || 'Партнер'}
      </p>
      
      {!settings.isPremium && (
        <div className="absolute -top-2 -right-2 bg-gradient-to-r from-yellow-400 to-yellow-500 rounded-full p-2 shadow-lg cursor-pointer group">
          <Crown size={20} className="text-white" />
          <div className="absolute top-full right-0 mt-2 min-w-[200px] max-w-[280px] bg-gray-900 text-white text-xs rounded-lg p-3 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
            Премиум: Разблокируйте 3D аватар
          </div>
        </div>
      )}
    </div>
  );
}
