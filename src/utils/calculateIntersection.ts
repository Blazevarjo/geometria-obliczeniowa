import {
  Intersection,
  IntersectionSegment,
  Point,
  Segment,
} from "../global.types";

export function calculateIntersection(
  segment1: Segment,
  segment2: Segment
): Intersection | null {
  const { start: p, end: q } = segment1;
  const { start: r, end: s } = segment2;

  const denominator = (q.y - p.y) * (s.x - r.x) - (q.x - p.x) * (s.y - r.y);

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

  const ua =
    ((s.x - r.x) * (p.y - r.y) - (s.y - r.y) * (p.x - r.x)) / denominator;
  const ub =
    ((q.x - p.x) * (p.y - r.y) - (q.y - p.y) * (p.x - r.x)) / denominator;

  if (ua >= 0 && ua <= 1 && ub >= 0 && ub <= 1) {
    // Oblicz punkt przecięcia
    const intersectionX = p.x + ua * (q.x - p.x);
    const intersectionY = p.y + ua * (q.y - p.y);
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
  const { start: p, end: q } = segment;
  return (
    point.x >= Math.min(p.x, q.x) &&
    point.x <= Math.max(p.x, q.x) &&
    point.y >= Math.min(p.y, q.y) &&
    point.y <= Math.max(p.y, q.y) &&
    getOrientation(p, q, point) === 0
  );
}

function calculateOverlap(
  segment1: Segment,
  segment2: Segment
): IntersectionSegment {
  const overlapStartX = Math.max(segment1.start.x, segment2.start.x);
  const overlapStartY = Math.max(segment1.start.y, segment2.start.y);
  const overlapEndX = Math.min(segment1.end.x, segment2.end.x);
  const overlapEndY = Math.min(segment1.end.y, segment2.end.y);

  return {
    start: { x: overlapStartX, y: overlapStartY },
    end: { x: overlapEndX, y: overlapEndY },
    type: "segment",
  };
}
