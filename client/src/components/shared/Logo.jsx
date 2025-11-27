import { Link } from 'react-router-dom';

export function KekkonIcon({ size = 45, id = 'kekkon' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 45 45" fill="none">
      <defs>
        <linearGradient id={`grad-${id}`} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#f59e0b" />
          <stop offset="100%" stopColor="#d97706" />
        </linearGradient>
      </defs>
      <circle cx="22.5" cy="26" r="13" stroke={`url(#grad-${id})`} strokeWidth="2.5" fill="none"/>
      <path d="M 17 13 L 22.5 8 L 28 13 L 26 16 L 19 16 Z" fill={`url(#grad-${id})`}/>
    </svg>
  );
}

export function KekkonLogo({ showText = true, size = 'md', linkTo = '/', className = '' }) {
  const sizes = {
    sm: { icon: 32, text: 'text-lg' },
    md: { icon: 40, text: 'text-xl' },
    lg: { icon: 48, text: 'text-2xl' },
  };
  
  const { icon, text } = sizes[size] || sizes.md;
  
  const content = (
    <div className={`flex items-center gap-2 ${className}`}>
      <KekkonIcon size={icon} />
      {showText && (
        <span className={`font-bold text-amber-700 ${text}`}>KEKKON</span>
      )}
    </div>
  );
  
  if (linkTo) {
    return <Link to={linkTo} className="flex items-center">{content}</Link>;
  }
  
  return content;
}

export default KekkonLogo;
