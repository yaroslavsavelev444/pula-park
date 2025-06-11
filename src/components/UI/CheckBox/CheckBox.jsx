import { Check } from "lucide-react";
import { useState } from "react";
import "./CheckBox.css";

export function Checkbox({ checked: controlledChecked, onChange, label, disabled = false, className = "" }) {
  const [checked, setChecked] = useState(controlledChecked ?? false);

  const handleClick = () => {
    if (disabled) return;
    const newChecked = !checked;
    setChecked(newChecked);
    onChange?.(newChecked);
  };

  return (
    <label className={`checkbox-label ${disabled ? "disabled" : ""} ${className}`}>
      <div className={`checkbox-box ${checked ? "checked" : ""}`} onClick={handleClick}>
        {checked && <Check size={16} color="white" />}
      </div>
      {label && <span className="checkbox-text">{label}</span>}
    </label>
  );
}