import * as validator from 'validator';

export class MatrixRequestEntity {
  rotated: number[][];
  Q: number[][];
  R: number[][];

  constructor(data: any) {
    this.rotated = this.validateMatrix(data.rotated, 'rotated');
    this.Q = this.validateMatrix(data.Q, 'Q');
    this.R = this.validateMatrix(data.R, 'R');
  }

  private validateMatrix(matrix: any, name: string): number[][] {
    if (!Array.isArray(matrix)) {
      throw new Error(`${name} debe ser una matriz`);
    }

    if (matrix.length === 0) {
      throw new Error(`${name} no puede estar vacía`);
    }

    const sanitized: number[][] = [];
    for (const row of matrix) {
      if (!Array.isArray(row)) {
        throw new Error(`${name} debe contener filas válidas`);
      }

      const sanitizedRow: number[] = [];
      for (const value of row) {
        if (typeof value !== 'number' || isNaN(value)) {
          throw new Error(`${name} debe contener solo números válidos`);
        }
        sanitizedRow.push(value);
      }
      sanitized.push(sanitizedRow);
    }

    return sanitized;
  }
}
