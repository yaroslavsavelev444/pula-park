import * as Switch from "@radix-ui/react-switch";
import { useState } from "react";
import "./Toggle.css";

export default function Toggle({ checked, onChange, disabled = false, placeholder }) {
  const [isChecked, setIsChecked] = useState(checked || false);

  const handleChange = (value) => {
    setIsChecked(value);
    if (onChange) onChange(value);
  };

  return (
    <div className="toggle-wrapper">
    <p>{placeholder}</p>
    <Switch.Root
      className="toggle-root"
      checked={isChecked}
      onCheckedChange={handleChange}
      disabled={disabled}
    >
      <Switch.Thumb className="toggle-thumb" />
    </Switch.Root>
    </div>
    
  );
}
