import { MatrixStatsEntity } from './matrix-stats.entity';

export class MatrixResponseEntity {
  RotatedMatrix: number[][];
  QStats: MatrixStatsEntity;
  RStats: MatrixStatsEntity;
  QMatrix: number[][];
  RMatrix: number[][];

  constructor(
    rotatedMatrix: number[][],
    qStats: MatrixStatsEntity,
    rStats: MatrixStatsEntity,
    qMatrix: number[][],
    rMatrix: number[][]
  ) {
    this.RotatedMatrix = rotatedMatrix;
    this.QStats = qStats;
    this.RStats = rStats;
    this.QMatrix = qMatrix;
    this.RMatrix = rMatrix;
  }
}
