import { getInitials } from "@/lib/format";
import styles from "./avatar.module.css";

const TONES = ["purple", "blue", "pink", "orange", "green"] as const;

function toneFor(name: string) {
  const hash = [...name].reduce((total, char) => total + char.charCodeAt(0), 0);
  return TONES[hash % TONES.length];
}

interface AvatarProps {
  name: string;
  size?: "sm" | "md" | "lg";
  variant?: "soft" | "solid";
}

export function Avatar({ name, size = "md", variant = "soft" }: AvatarProps) {
  const toneClass = variant === "solid" ? styles.solid : styles[toneFor(name)];

  return (
    <span className={`${styles.avatar} ${styles[size]} ${toneClass}`} aria-hidden>
      {getInitials(name)}
    </span>
  );
}
