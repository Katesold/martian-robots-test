export enum Orientation {
  N = "N",
  E = "E",
  S = "S",
  W = "W",
}

const { N, E, S, W } = Orientation;

export function isOrientation(value: string | undefined): value is Orientation {
  return value !== undefined && Object.values<string>(Orientation).includes(value);
}

const leftOrientation: Record<Orientation, Orientation> = { [N]: W, [W]: S, [S]: E, [E]: N };
const rightOrientation: Record<Orientation, Orientation> = { [N]: E, [E]: S, [S]: W, [W]: N };

export function getLeftOrientation(orientation: Orientation): Orientation {
  return leftOrientation[orientation];
}

export function getRightOrientation(orientation: Orientation): Orientation {
  return rightOrientation[orientation];
}
