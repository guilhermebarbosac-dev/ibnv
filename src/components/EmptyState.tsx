import React from 'react';
import { Link } from 'react-router-dom';

interface EmptyStateProps {
  title: string;
  message: string;
  icon?: React.ElementType;
  buttonText?: string;
  buttonLink?: string;
}

export function EmptyState({
  title,
  message,
  icon,
  buttonText,
  buttonLink
}: EmptyStateProps) {
  return (
    <div className="empty-state">
      {icon && React.createElement(icon, { className: "empty-state-icon" })}
      <h3 className="text-xl font-semibold mb-2">{title}</h3>
      <p className="empty-state-text">{message}</p>
      {buttonText && buttonLink && (
        <Link to={buttonLink} className="empty-state-button">
          {buttonText}
        </Link>
      )}
    </div>
  );
}