import React from 'react';

interface  RACIconProps {
  size?: number;
  className?: string;
}

export const RACIcon: React.FC<RACIconProps> = ({ 
  size = 24, 
  className = "" 
}) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <path d="M0 250v250h500V0H0zm233-94.5V295h-31v93h31v93h-62v-93h-31v-93H78v186H16V16h217zm248 0V295h-62V140h-93v155h-62V47h31V16h186zm0 201.5v31H326v31h155v62H264V326h217z"/>
      <path d="M78 140v93h93V47H78zm279-77.5V78h93V47h-93z"/>
    </svg>
  );
};