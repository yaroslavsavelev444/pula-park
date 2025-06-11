import React from 'react'
import "./FooterIcon.css"
export default function FooterIcon({icon , title}) {
  return (
    <div>
      <div className="footer-icon-wrapper">
        <div className="footer-icon">
          {icon}
        </div>
      </div>
      <p>{title }</p>
    </div>
  )
}
