// src/lib/canvasConfig.js

export const baseCanvas = {
  width: 260,
  aspectRatio: "1 / 2.12",
  borderColor: "2px solid rgba(168, 85, 247, 0.9)",
};

export const textVariants = {
  big: "font-serif leading-none tracking-wide md:text-[36px]",
  normal: "font-serif italic text-lg",
  small: "text-[10px] font-semibold uppercase tracking-[0.45em]",
  bold: "text-4xl font-extrabold tracking-[0.3em]",
};

export const fontFamilies = [
  { label: "Homemade Apple", value: "Homemade Apple, cursive" },
  { label: "Dancing Script", value: "Dancing Script, cursive" },
  { label: "Playfair Display", value: "Playfair Display, serif" },
  { label: "League Spartan", value: "League Spartan, sans-serif" },
  { label: "Archivo Black", value: "Archivo Black, sans-serif" },
  { label: "Aileron", value: "Aileron, sans-serif" },
  { label: "Rowdies", value: "Rowdies, cursive" },
  { label: "Sacramento", value: "Sacramento, cursive" },
  { label: "Akronim", value: "Akronim, cursive" },
  { label: "Audiowide", value: "Audiowide, sans-serif" },

  // Variable fonts
  { label: "Ballet (Variable)", value: "Ballet Variable, cursive" },
  { label: "Dosis (Variable)", value: "Dosis Variable, sans-serif" },
  { label: "Montserrat (Variable)", value: "Montserrat Variable, sans-serif" },
  { label: "Oswald (Variable)", value: "Oswald Variable, sans-serif" },
  { label: "Tilt Prism (Variable)", value: "Tilt Prism Variable, cursive" },

  { label: "Bungee Outline", value: "Bungee Outline, cursive" },
  { label: "Bungee Shade", value: "Bungee Shade, cursive" },
  { label: "Butterfly Kids", value: "Butterfly Kids, cursive" },
  { label: "Cabin Sketch", value: "Cabin Sketch, cursive" },
  { label: "Chewy", value: "Chewy, cursive" },
  { label: "Codystar", value: "Codystar, cursive" },
  { label: "Creepster", value: "Creepster, cursive" },

  { label: "DotGothic16", value: "DotGothic16, sans-serif" },
  { label: "Faster One", value: "Faster One, cursive" },
  { label: "Graduate", value: "Graduate, serif" },
  { label: "Griffy", value: "Griffy, cursive" },
  { label: "Gruppo", value: "Gruppo, cursive" },
  { label: "Hanalei", value: "Hanalei, cursive" },
  { label: "Limelight", value: "Limelight, display" },
  { label: "Londrina Shadow", value: "Londrina Shadow, cursive" },
  { label: "Monoton", value: "Monoton, cursive" },
  { label: "Nosifer", value: "Nosifer, cursive" },

  { label: "Pinyon Script", value: "Pinyon Script, cursive" },
  { label: "Rampart One", value: "Rampart One, display" },
  { label: "Roboto", value: "Roboto, sans-serif" },

  { label: "Rubik Glitch", value: "Rubik Glitch, display" },
  { label: "Rubik Moonrocks", value: "Rubik Moonrocks, display" },
  { label: "Rubik Wet Paint", value: "Rubik Wet Paint, display" },

  { label: "Silkscreen", value: "Silkscreen, sans-serif" },
  { label: "Tangerine", value: "Tangerine, cursive" },

  { label: "Train One", value: "Train One, cursive" },
  { label: "Vast Shadow", value: "Vast Shadow, display" },

  // Extra fonts imported via other packages
  { label: "Loved by the King", value: "Loved by the King, cursive" },
  { label: "Lovers Quarrel", value: "Lovers Quarrel, cursive" },
];

export const cornerHandles = [
  {
    id: "top-left",
    className: "-left-2 -top-2 cursor-nwse-resize",
    interaction: "resize",
  },
  {
    id: "top-right",
    className: "-right-2 -top-2 cursor-nesw-resize",
    interaction: "resize",
  },
  {
    id: "bottom-left",
    className: "-left-2 -bottom-2 cursor-nesw-resize",
    interaction: "resize",
  },
  {
    id: "bottom-right",
    className: "-right-2 -bottom-2 cursor-nwse-resize",
    interaction: "resize",
  },
];

export const imageSideHandles = [
  {
    id: "left",
    className: "-left-2 top-1/2 -translate-y-1/2 cursor-ew-resize",
    interaction: "crop",
  },
  {
    id: "right",
    className: "-right-2 top-1/2 -translate-y-1/2 cursor-ew-resize",
    interaction: "crop",
  },
  {
    id: "top",
    className: "-top-2 left-1/2 -translate-x-1/2 cursor-ns-resize",
    interaction: "crop",
  },
  {
    id: "bottom",
    className: "-bottom-2 left-1/2 -translate-x-1/2 cursor-ns-resize",
    interaction: "crop",
  },
];

export const textSideHandles = imageSideHandles.map((h) => ({
  ...h,
  interaction: "resize",
}));

export const textHorizontalHandles = textSideHandles.filter(
  (h) => h.id === "left" || h.id === "right"
);

export const clampCropValue = (value, min = 0, max = 45) =>
  Math.min(Math.max(value, min), max);

export const getCropValues = (crop = {}) => ({
  top: crop.top ?? 0,
  right: crop.right ?? 0,
  bottom: crop.bottom ?? 0,
  left: crop.left ?? 0,
});

export const hasNumericSize = (block) => {
  if (block.type === "text") {
    return typeof block.size?.width === "number";
  }
  return (
    typeof block.size?.width === "number" &&
    typeof block.size?.height === "number"
  );
};

//**
//  * Build inline style for each block (position, size, rotation, zIndex)
//  * position.x / position.y are in px relative to canvas.
//  */
export const buildBlockStyle = (block) => {
  const style = {
    width:
      typeof block.size?.width === "number"
        ? `${block.size.width}px`
        : block.size?.width,
    height:
      block.type !== "text" && typeof block.size?.height === "number"
        ? `${block.size.height}px`
        : block.size?.height,
    opacity: block.opacity ?? 1,
    boxSizing: "border-box",
    pointerEvents: "auto",
  };

  if (typeof block.borderRadius === "number") {
    style.borderRadius = `${block.borderRadius}px`;
  }

  if (block.crop) {
    const { top = 0, right = 0, bottom = 0, left = 0 } = block.crop;
    style.clipPath = `inset(${top}% ${right}% ${bottom}% ${left}%)`;
    style.overflow = "hidden";
  }

  if (block.background || block.backgroundColor) {
    style.background = block.background ?? block.backgroundColor;
  }

  if (block.type === "text") {
    if (typeof block.padding === "number") {
      style.padding = `${block.padding}px`;
    } else if (block.background || block.backgroundColor) {
      style.padding = "6px 8px";
    }
  }

  if (typeof block.zIndex === "number") {
    style.zIndex = block.zIndex;
  }

  return style;
};


export function computeMediaFit(containerRect) {
  const LOGICAL_W = 720;
  const LOGICAL_H = 358;

  const scale = Math.min(
    containerRect.width / LOGICAL_W,
    containerRect.height / LOGICAL_H
  );

  const renderWidth = LOGICAL_W * scale;
  const renderHeight = LOGICAL_H * scale;

  return {
    sx: scale,
    sy: scale,
    renderWidth,
    renderHeight,
    offsetX: (containerRect.width - renderWidth) / 2,
    offsetY: (containerRect.height - renderHeight) / 2,
  };
}



/**
 * Convert client pointer → canvas space
 */
export function clientToCanvas(canvasRect, clientX, clientY) {
  if (!canvasRect) return null;
  return {
    x: clientX - canvasRect.left,
    y: clientY - canvasRect.top,
  };
}

/**
 * Convert canvas → client (toolbar anchoring, etc.)
 */
export function canvasToClient(canvasRect, x, y) {
  if (!canvasRect) return null;
  return {
    x: canvasRect.left + x,
    y: canvasRect.top + y,
  };
}