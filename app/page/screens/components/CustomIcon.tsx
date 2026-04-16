import React from 'react';
import { Text } from 'react-native';
import Svg, { Circle, Path, Rect } from "react-native-svg";


export const SearchIcon = ({ size = 22, color = "#000" }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Circle cx="11" cy="11" r="7" stroke={color} strokeWidth="2" />
    <Path d="M20 20l-3-3" stroke={color} strokeWidth="2" strokeLinecap="round" />
  </Svg>
);

export const CloseIcon = ({ size = 22, color = "#000" }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path d="M18 6L6 18M6 6l12 12" stroke={color} strokeWidth="2" strokeLinecap="round" />
  </Svg>
);

export const DeerIcon = ({ size = 28 }) => (
  <Text style={{ fontSize: size }}>🦌</Text>
);

export const HomeIcon = ({ size = 24, color = "#000" }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24">
    <Path
      d="M3 10.5L12 3l9 7.5v9a1 1 0 0 1-1 1h-5v-6H9v6H4a1 1 0 0 1-1-1v-9z"
      fill={color}
    />
  </Svg>
);


export const HeartIcon = ({ filled }: { filled: boolean }) => (
  <Svg width="20" height="20" viewBox="0 0 24 24">
    <Path
      d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"
      fill={filled ? "#e11d48" : "none"}
      stroke={filled ? "#e11d48" : "#fff"}
      strokeWidth="1.8"
    />
  </Svg>
);

export const WhiteHeartIcon = ({ size = 50 }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24">
    <Path
      d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"
      fill="#ffffff"
      stroke="#050404"
      strokeWidth="1"
    />
  </Svg>
);

export const PersonIcon = () => (
  <Svg width="15" height="15" viewBox="0 0 24 24">
    <Circle cx="12" cy="7" r="4" fill="#000000" />
    <Path d="M4 21v-1a8 8 0 0116 0v1" fill="#000000" />
  </Svg>
);

export const StarIcon = ({ size = 20, color = "#F59E0B" }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24">
    <Path
      d="M12 3l2.9 6 6.6.6-5 4.3 1.5 6.5L12 17l-6 3.4 1.5-6.5-5-4.3 6.6-.6L12 3z"
      fill={color}
    />
  </Svg>
);

export const EyeIcon = ({ size = 20, color = "#4B5563" }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24">
    <Path
      d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"
      stroke={color}
      strokeWidth="2"
      fill="none"
    />
    <Circle cx="12" cy="12" r="3" stroke={color} strokeWidth="2" fill="none" />
  </Svg>
);

export const EyeOffIcon = ({ size = 20, color = "#4B5563" }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24">
    <Path
      d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19m-6.72-1.07a3 3 0 11-4.24-4.24"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      fill="none"
    />
    <Path d="M1 1l22 22" stroke={color} strokeWidth="2" strokeLinecap="round" />
  </Svg>
);

export const LogoutIcon = ({ size = 20, color = "#EF4444" }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24">
    <Path
      d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      fill="none"
    />
    <Path
      d="M16 17l5-5-5-5M21 12H9"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      fill="none"
    />
  </Svg>
);


export const LocationIcon = ({ size = 20, color = "#4B5563" }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24">
    <Path
      d="M12 21s7-5.33 7-11a7 7 0 10-14 0c0 5.67 7 11 7 11z"
      stroke={color}
      strokeWidth="2"
      fill="none"
    />
    <Circle cx="12" cy="10" r="2.5" fill={color} />
  </Svg>
);

export const BedIcon = ({ size = 20, color = "#4B5563" }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24">
    <Rect x="3" y="11" width="18" height="6" rx="2" fill={color} />
    <Rect x="5" y="8" width="5" height="3" rx="1" fill="#9CA3AF" />
    <Rect x="10" y="9" width="9" height="2" rx="1" fill="#9CA3AF" />
  </Svg>
);

export const ChairIcon = () => (
  <Svg width="20" height="20" viewBox="0 0 24 24">
    <Rect x="6" y="10" width="12" height="8" fill="#4B5563" />
    <Rect x="8" y="6" width="8" height="4" fill="#9CA3AF" />
    <Rect x="5" y="18" width="2" height="4" fill="#4B5563" />
    <Rect x="17" y="18" width="2" height="4" fill="#4B5563" />
  </Svg>
);

export const BathIcon = ({ size = 20, color = "#4B5563" }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24">
    <Rect x="3" y="11" width="18" height="6" rx="3" fill={color} />
    <Path
      d="M16 6a2 2 0 012 2v3"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      fill="none"
    />
    <Circle cx="18" cy="11" r="1" fill="#9CA3AF" />
    <Circle cx="20" cy="12" r="1" fill="#9CA3AF" />
  </Svg>
);

export const WifiIcon = () => (
  <Svg width="20" height="20" viewBox="0 0 24 24">
    <Path
      d="M12 18c.55 0 1 .45 1 1s-.45 1-1 1-1-.45-1-1 .45-1 1-1zm0-2c-2.21 0-4 1.79-4 4h2c0-1.1.9-2 2-2s2 .9 2 2h2c0-2.21-1.79-4-4-4zm0-4c-4.42 0-8 3.58-8 8h2c0-3.31 2.69-6 6-6s6 2.69 6 6h2c0-4.42-3.58-8-8-8zm0-4C6.48 8 2.73 10.11 1 13h2c1.39-2.5 4.16-4 7-4s5.61 1.5 7 4h2c-1.73-2.89-5.48-5-10-5z"
      fill="#4B5563"
    />
  </Svg>
);

export const KitchenIcon = () => (
  <Svg width="20" height="20" viewBox="0 0 24 24">
    <Rect x="3" y="10" width="18" height="8" fill="#4B5563" />
    <Rect x="5" y="12" width="4" height="4" fill="#9CA3AF" />
    <Rect x="15" y="12" width="4" height="4" fill="#9CA3AF" />
  </Svg>
);

export const ACIcon = () => (
  <Svg width="20" height="20" viewBox="0 0 24 24">
    <Circle cx="12" cy="12" r="6" stroke="#4B5563" strokeWidth="2" fill="none" />
    <Path d="M12 6v6l4 2" stroke="#4B5563" strokeWidth="2" />
  </Svg>
);

export const ParkingIcon = () => (
  <Svg width="20" height="20" viewBox="0 0 24 24">
    <Rect x="3" y="3" width="18" height="18" rx="3" stroke="#4B5563" strokeWidth="2" fill="none" />
    <Path
      d="M9 17V7h4a3 3 0 010 6H9"
      stroke="#4B5563"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      fill="none"
    />
  </Svg>
);

export const PoolIcon = () => (
  <Svg width="20" height="20" viewBox="0 0 24 24">
    <Path
      d="M2 16c2 0 2-2 4-2s2 2 4 2 2-2 4-2 2 2 4 2 2-2 4-2"
      stroke="#4B5563"
      strokeWidth="2"
      fill="none"
      strokeLinecap="round"
    />
    <Path
      d="M2 20c2 0 2-2 4-2s2 2 4 2 2-2 4-2 2 2 4 2 2-2 4-2"
      stroke="#4B5563"
      strokeWidth="2"
      fill="none"
      strokeLinecap="round"
    />
  </Svg>
);

export const FacilitiesIcon = ({ size = 24, color = "#4B5563" }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24">
    <Rect x="3" y="3" width="18" height="18" rx="4" stroke={color} strokeWidth="2" fill="none" />
    <Path d="M7 12h10M12 7v10" stroke={color} strokeWidth="2" strokeLinecap="round" />
  </Svg>
);

export const ChaletIcon = ({ size = 24, color = "#000" }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24">
    <Path
      d="M3 11L12 4l9 7"
      stroke={color}
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      fill="none"
    />
    <Rect
      x="5"
      y="11"
      width="14"
      height="9"
      rx="2"
      stroke={color}
      strokeWidth={2}
      fill="none"
    />
    <Rect x="10" y="14" width="4" height="6" rx="1" fill={color} />
    <Rect x="7" y="13" width="2" height="2" fill={color} />
    <Rect x="15" y="13" width="2" height="2" fill={color} />
  </Svg>
);
export const BookingStepsIcon = ({ size = 22, color = "#6A0DAD" }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Rect
      x="4"
      y="5"
      width="16"
      height="15"
      rx="2"
      stroke={color}
      strokeWidth="2"
    />
    <Path
      d="M8 3v4M16 3v4M4 9h16"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
    />
    <Path
      d="M8 13h3M8 16h5"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
    />
  </Svg>
);

export const AddChaletIcon = ({ size = 22, color = "#6A0DAD" }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path
      d="M3 11L12 4l9 7"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Rect
      x="5"
      y="11"
      width="14"
      height="9"
      rx="2"
      stroke={color}
      strokeWidth="2"
    />
    <Path
      d="M12 13v4M10 15h4"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
    />
  </Svg>
);
export const EmailIcon = ({ size = 18, color = "#9CA3AF" }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24">
    <Path
      d="M4 4h16a2 2 0 012 2v12a2 2 0 01-2 2H4a2 2 0 01-2-2V6a2 2 0 012-2z"
      stroke={color} strokeWidth="2" fill="none"
    />
    <Path d="M22 6l-10 7L2 6" stroke={color} strokeWidth="2" fill="none" />
  </Svg>
);

export const LockIcon = ({ size = 18, color = "#9CA3AF" }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24">
    <Rect x="3" y="11" width="18" height="11" rx="2" stroke={color} strokeWidth="2" fill="none" />
    <Path d="M7 11V7a5 5 0 0110 0v4" stroke={color} strokeWidth="2" fill="none" strokeLinecap="round" />
  </Svg>
);

export const UserIcon = ({ size = 18, color = "#9CA3AF" }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24">
    <Path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" stroke={color} strokeWidth="2" fill="none" strokeLinecap="round" />
    <Circle cx="12" cy="7" r="4" stroke={color} strokeWidth="2" fill="none" />
  </Svg>
);
export const LogoIcon = () => (
  <Svg width="60" height="60" viewBox="0 0 24 24">
    <Circle cx="12" cy="12" r="12" fill="#fff" />
    <Path d="M12 3C7 3 3 7 3 12s4 9 9 9 9-4 9-9-4-9-9-9zm0 4l5 8H7l5-8z" fill="#2C6FBF" />
  </Svg>
);
