export const materialTypes = ["PLA", "PETG", "ABS", "TPU", "Resin"] as const;

export type MaterialType = (typeof materialTypes)[number];

export const materialDensitiesGramsPerCm3: Record<MaterialType, number> = {
  PLA: 1.24,
  PETG: 1.27,
  ABS: 1.04,
  TPU: 1.21,
  Resin: 1.1,
};

export type MaterialDensitySettings = {
  plaDensity: number;
  petgDensity: number;
  absDensity: number;
  tpuDensity: number;
  resinDensity: number;
};

export const defaultMaterialDensitySettings: MaterialDensitySettings = {
  plaDensity: materialDensitiesGramsPerCm3.PLA,
  petgDensity: materialDensitiesGramsPerCm3.PETG,
  absDensity: materialDensitiesGramsPerCm3.ABS,
  tpuDensity: materialDensitiesGramsPerCm3.TPU,
  resinDensity: materialDensitiesGramsPerCm3.Resin,
};

export function getMaterialDensity(
  materialType: MaterialType,
  settings: MaterialDensitySettings,
) {
  const densityByMaterial: Record<MaterialType, number> = {
    PLA: settings.plaDensity,
    PETG: settings.petgDensity,
    ABS: settings.absDensity,
    TPU: settings.tpuDensity,
    Resin: settings.resinDensity,
  };

  return densityByMaterial[materialType] || materialDensitiesGramsPerCm3[materialType];
}
