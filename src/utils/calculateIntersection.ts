import { Intersection, Point, Segment } from "../global.types";

export function calculateIntersection(
  segment1: Segment,
  segment2: Segment
): Intersection | null {
  const {
    start: { x: x1, y: y1 },
    end: { x: x2, y: y2 },
  } = segment1;
  const {
    start: { x: x3, y: y3 },
    end: { x: x4, y: y4 },
  } = segment2;

  const denominator = (y4 - y3) * (x2 - x1) - (x4 - x3) * (y2 - y1);

  if (denominator === 0) {
    // Odcinki są równoległe lub leżą na tej samej linii
    if (areCollinear(segment1, segment2)) {
      // Sprawdź, czy odcinki mają punkt wspólny
      if (doSegmentsOverlap(segment1, segment2)) {
        // Oblicz odcinek wspólny
        return calculateOverlap(segment1, segment2);
      }
      // Odcinki są równoległe i nie mają punktu wspólnego
      return null;
    }
    // Odcinki są równoległe i nie leżą na tej samej linii
    return null;
  }

  const ua = ((x4 - x3) * (y1 - y3) - (y4 - y3) * (x1 - x3)) / denominator;
  const ub = ((x2 - x1) * (y1 - y3) - (y2 - y1) * (x1 - x3)) / denominator;

  if (ua >= 0 && ua <= 1 && ub >= 0 && ub <= 1) {
    // Punkt przecięcia znajduje się wewnątrz obu odcinków.
    const intersectionX = x1 + ua * (x2 - x1);
    const intersectionY = y1 + ua * (y2 - y1);
    return { x: intersectionX, y: intersectionY, type: "point" };
  }

  // Odcinki nie przecinają się
  return null;
}

function areCollinear(segment1: Segment, segment2: Segment) {
  const { start: p, end: q } = segment1;
  const { start: r, end: s } = segment2;

  const orientation1 = getOrientation(p, q, r);
  const orientation2 = getOrientation(p, q, s);
  const orientation3 = getOrientation(r, s, p);
  const orientation4 = getOrientation(r, s, q);

  return (
    (orientation1 === 0 &&
      orientation2 === 0 &&
      orientation3 === 0 &&
      orientation4 === 0) ||
    (orientation1 !== orientation2 && orientation3 !== orientation4)
  );
}

function getOrientation(p: Point, q: Point, r: Point) {
  const value = (q.y - p.y) * (r.x - q.x) - (q.x - p.x) * (r.y - q.y);

  if (value === 0) {
    return 0; // Punkty są współliniowe
  }

  return value > 0 ? 1 : -1; // Zwraca 1 dla kierunku zgodnego z ruchem wskazówek zegara, -1 dla przeciwnego kierunku
}

function doSegmentsOverlap(segment1: Segment, segment2: Segment) {
  return (
    isPointOnSegment(segment1.start, segment2) ||
    isPointOnSegment(segment1.end, segment2) ||
    isPointOnSegment(segment2.start, segment1) ||
    isPointOnSegment(segment2.end, segment1)
  );
}

function isPointOnSegment(point: Point, segment: Segment) {
  const { start, end } = segment;
  const { x: x1, y: y1 } = start;
  const { x: x2, y: y2 } = end;

  return (
    point.x >= Math.min(x1, x2) &&
    point.x <= Math.max(x1, x2) &&
    point.y >= Math.min(y1, y2) &&
    point.y <= Math.max(y1, y2) &&
    getOrientation(start, end, point) === 0
  );
}

function calculateOverlap(segment1: Segment, segment2: Segment): Intersection {
  const {
    start: { x: x1, y: y1 },
    end: { x: x2, y: y2 },
  } = segment1;
  const {
    start: { x: x3, y: y3 },
    end: { x: x4, y: y4 },
  } = segment2;

  const overlapStartX = Math.max(x1, x3);
  const overlapStartY = Math.max(y1, y3);
  const overlapEndX = Math.min(x2, x4);
  const overlapEndY = Math.min(y2, y4);
  if (overlapStartX === overlapEndX && overlapStartY === overlapEndY) {
    // Jeśli tak, zwróć pojedynczy punkt
    return { x: overlapStartX, y: overlapStartY, type: "point" };
  }
  return {
    start: { x: overlapStartX, y: overlapStartY },
    end: { x: overlapEndX, y: overlapEndY },
    type: "segment",
  };
}
