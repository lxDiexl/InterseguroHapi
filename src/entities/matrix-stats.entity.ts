export class MatrixStatsEntity {
  average: number;
  isDiagonal: boolean;
  max: number;
  min: number;
  sum: number;

  constructor(
    average: number,
    isDiagonal: boolean,
    max: number,
    min: number,
    sum: number
  ) {
    this.average = average;
    this.isDiagonal = isDiagonal;
    this.max = max;
    this.min = min;
    this.sum = sum;
  }
}
