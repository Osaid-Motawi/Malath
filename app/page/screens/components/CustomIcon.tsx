import Svg, { Circle, Rect,Path } from "react-native-svg";

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
export const HomeIcon = ({ size = 24, color = "#000" }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24">
    <Path
      d="M3 10.5L12 3l9 7.5v9a1 1 0 0 1-1 1h-5v-6H9v6H4a1 1 0 0 1-1-1v-9z"
      fill={color}
    />
  </Svg>
);
export const BedIcon = ({ size = 20, color = "#4B5563" }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24">
    
    {/* قاعدة السرير */}
    <Rect x="3" y="11" width="18" height="6" rx="2" fill={color} />
    
    {/* المخدة */}
    <Rect x="5" y="8" width="5" height="3" rx="1" fill="#9CA3AF" />
    
    {/* المرتبة */}
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
    
    {/* البانيو */}
    <Rect x="3" y="11" width="18" height="6" rx="3" fill={color} />
    
    {/* الدش */}
    <Path
      d="M16 6a2 2 0 012 2v3"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      fill="none"
    />
    
    {/* المي */}
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

    <Rect
      x="10"
      y="14"
      width="4"
      height="6"
      rx="1"
      fill={color}
    />

    <Rect
      x="7"
      y="13"
      width="2"
      height="2"
      fill={color}
    />

    <Rect
      x="15"
      y="13"
      width="2"
      height="2"
      fill={color}
    />
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