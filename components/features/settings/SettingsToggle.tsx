import React from "react";
import type { ProgressState } from "@/types/subnet";

type SettingsToggleProps = {
  progress: ProgressState;
  setProgress: React.Dispatch<React.SetStateAction<ProgressState>>;
};

function SettingsToggleComponent({ progress, setProgress }: SettingsToggleProps) {
  const update = (key: keyof ProgressState["settings"], value: boolean) =>
    setProgress((current) => ({
      ...current,
      settings: { ...current.settings, [key]: value },
    }));

  return (
    <>
      <Setting
        label="Sound effects"
        checked={progress.settings.sound}
        onChange={(checked) => update("sound", checked)}
      />
      <Setting
        label="Keyboard shortcuts"
        checked={progress.settings.keyboardShortcuts}
        onChange={(checked) => update("keyboardShortcuts", checked)}
      />
    </>
  );
}

function Setting({
  label,
  checked,
  onChange,
}: {
  label: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
}) {
  return (
    <label className="setting">
      <span>{label}</span>
      <div className="toggle-switch">
        <input
          type="checkbox"
          checked={checked}
          onChange={(event) => onChange(event.target.checked)}
          aria-label={label}
        />
        <span className="toggle-slider"></span>
      </div>
    </label>
  );
}

export const SettingsToggle = React.memo(SettingsToggleComponent);
