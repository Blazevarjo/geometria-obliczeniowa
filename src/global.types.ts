export interface Point {
  x: number;
  y: number;
}

export interface Segment {
  start: Point;
  end: Point;
}

export type Intersection = IntersectionPoint | IntersectionSegment;

export interface IntersectionPoint extends Point {
  type: "point";
}

export interface IntersectionSegment {
  type: "segment";
  start: Point;
  end: Point;
}
