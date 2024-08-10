export interface Position {
  x: number;
  y: number;
}

export interface PositionWithRotation extends Position {
  rotation: number;
}

export interface PosRotWithFlipped extends PositionWithRotation {
  flipped: boolean;
}