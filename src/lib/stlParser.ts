import {
  materialDensitiesGramsPerCm3,
  type MaterialType,
} from "@/lib/materials";

type Vector3 = {
  x: number;
  y: number;
  z: number;
};

export type StlAnalysis = {
  fileName: string;
  fileSizeBytes: number;
  triangleCount: number;
  volumeMm3: number;
  surfaceAreaMm2: number;
  estimatedWeightGrams: number;
  materialDensityGramsPerCm3: number;
};

export async function analyzeStlFile(
  file: File,
  materialType: MaterialType,
): Promise<StlAnalysis> {
  if (!isStlFile(file)) {
    throw new Error("Please upload a .stl file.");
  }

  const buffer = await file.arrayBuffer();
  const { triangles, volumeMm3, surfaceAreaMm2 } = parseStlGeometry(buffer);
  const density = materialDensitiesGramsPerCm3[materialType];
  const estimatedWeightGrams = (volumeMm3 / 1000) * density;

  if (!Number.isFinite(volumeMm3) || volumeMm3 <= 0 || triangles <= 0) {
    throw new Error(
      "This STL could not be measured. Check that the file contains a closed mesh.",
    );
  }

  return {
    fileName: file.name,
    fileSizeBytes: file.size,
    triangleCount: triangles,
    volumeMm3,
    surfaceAreaMm2,
    estimatedWeightGrams,
    materialDensityGramsPerCm3: density,
  };
}

export function isStlFile(file: File) {
  return file.name.toLowerCase().endsWith(".stl");
}

function parseStlGeometry(buffer: ArrayBuffer) {
  if (looksLikeBinaryStl(buffer)) {
    return parseBinaryStlGeometry(buffer);
  }

  return parseAsciiStlGeometry(buffer);
}

function looksLikeBinaryStl(buffer: ArrayBuffer) {
  if (buffer.byteLength < 84) {
    return false;
  }

  const view = new DataView(buffer);
  const triangleCount = view.getUint32(80, true);
  return 84 + triangleCount * 50 === buffer.byteLength;
}

function parseBinaryStlGeometry(buffer: ArrayBuffer) {
  const view = new DataView(buffer);
  const triangleCount = view.getUint32(80, true);
  let signedVolume = 0;
  let surfaceAreaMm2 = 0;

  for (let index = 0; index < triangleCount; index += 1) {
    const vertexOffset = 84 + index * 50 + 12;
    const a = readVector(view, vertexOffset);
    const b = readVector(view, vertexOffset + 12);
    const c = readVector(view, vertexOffset + 24);
    signedVolume += signedTetrahedronVolume(a, b, c);
    surfaceAreaMm2 += triangleArea(a, b, c);
  }

  return {
    triangles: triangleCount,
    volumeMm3: Math.abs(signedVolume),
    surfaceAreaMm2,
  };
}

function parseAsciiStlGeometry(buffer: ArrayBuffer) {
  const text = new TextDecoder("utf-8", { fatal: false }).decode(buffer);
  const vertexMatches = text.matchAll(
    /vertex\s+([+-]?(?:\d+\.?\d*|\.\d+)(?:e[+-]?\d+)?)\s+([+-]?(?:\d+\.?\d*|\.\d+)(?:e[+-]?\d+)?)\s+([+-]?(?:\d+\.?\d*|\.\d+)(?:e[+-]?\d+)?)/gi,
  );
  const vertices = Array.from(vertexMatches, (match) => ({
    x: Number(match[1]),
    y: Number(match[2]),
    z: Number(match[3]),
  }));
  let signedVolume = 0;
  let surfaceAreaMm2 = 0;
  let triangles = 0;

  for (let index = 0; index + 2 < vertices.length; index += 3) {
    const a = vertices[index];
    const b = vertices[index + 1];
    const c = vertices[index + 2];
    signedVolume += signedTetrahedronVolume(
      a,
      b,
      c,
    );
    surfaceAreaMm2 += triangleArea(a, b, c);
    triangles += 1;
  }

  return {
    triangles,
    volumeMm3: Math.abs(signedVolume),
    surfaceAreaMm2,
  };
}

function readVector(view: DataView, offset: number): Vector3 {
  return {
    x: view.getFloat32(offset, true),
    y: view.getFloat32(offset + 4, true),
    z: view.getFloat32(offset + 8, true),
  };
}

function signedTetrahedronVolume(a: Vector3, b: Vector3, c: Vector3) {
  return (
    (a.x * (b.y * c.z - b.z * c.y) -
      a.y * (b.x * c.z - b.z * c.x) +
      a.z * (b.x * c.y - b.y * c.x)) /
    6
  );
}

function triangleArea(a: Vector3, b: Vector3, c: Vector3) {
  const ab = {
    x: b.x - a.x,
    y: b.y - a.y,
    z: b.z - a.z,
  };
  const ac = {
    x: c.x - a.x,
    y: c.y - a.y,
    z: c.z - a.z,
  };
  const cross = {
    x: ab.y * ac.z - ab.z * ac.y,
    y: ab.z * ac.x - ab.x * ac.z,
    z: ab.x * ac.y - ab.y * ac.x,
  };

  return Math.hypot(cross.x, cross.y, cross.z) / 2;
}
