import { Context } from '../middleware/context';
import { getLogger } from '../utils/logger';
import { MatrixRequestEntity } from '../entities/matrix-request.entity';
import { MatrixResponseEntity } from '../entities/matrix-response.entity';
import { MatrixStatsEntity } from '../entities/matrix-stats.entity';

export class MatrixService {
  /**
   * Analiza las matrices Q y R y genera estadísticas
   * @param ctx - Contexto de trazabilidad
   * @param request - Datos de la matriz
   * @returns Respuesta con estadísticas
   */
  async analyzeMatrices(
    ctx: Context,
    request: MatrixRequestEntity
  ): Promise<MatrixResponseEntity> {
    getLogger(ctx).debug('Iniciando análisis de matrices');

    const statsQ = this.calculateMatrixStats(ctx, request.Q, 'Q');
    const statsR = this.calculateMatrixStats(ctx, request.R, 'R');

    getLogger(ctx).info('Análisis de matrices completado', {
      qDiagonal: statsQ.isDiagonal,
      rDiagonal: statsR.isDiagonal
    });

    return new MatrixResponseEntity(
      request.rotated,
      statsQ,
      statsR,
      request.Q,
      request.R
    );
  }

  /**
   * Calcula estadísticas de una matriz
   * @param ctx - Contexto de trazabilidad
   * @param matrix - Matriz a analizar
   * @param name - Nombre de la matriz para logs
   * @returns Estadísticas calculadas
   */
  private calculateMatrixStats(
    ctx: Context,
    matrix: number[][],
    name: string
  ): MatrixStatsEntity {
    getLogger(ctx).debug(`Calculando estadísticas para matriz ${name}`);

    let max = Number.NEGATIVE_INFINITY;
    let min = Number.POSITIVE_INFINITY;
    let sum = 0;
    let count = 0;

    for (const row of matrix) {
      for (const value of row) {
        max = Math.max(max, value);
        min = Math.min(min, value);
        sum += value;
        count++;
      }
    }

    const average = sum / count;
    const isDiagonal = this.isDiagonalMatrix(matrix);

    getLogger(ctx).debug(`Estadísticas de ${name} calculadas`, {
      max,
      min,
      sum,
      average,
      isDiagonal
    });

    return new MatrixStatsEntity(average, isDiagonal, max, min, sum);
  }

  /**
   * Verifica si una matriz es diagonal
   * @param matrix - Matriz a verificar
   * @returns true si es diagonal, false en caso contrario
   */
  private isDiagonalMatrix(matrix: number[][]): boolean {
    for (let i = 0; i < matrix.length; i++) {
      for (let j = 0; j < matrix[i].length; j++) {
        if (i !== j && Math.abs(matrix[i][j]) > 1e-10) {
          return false;
        }
      }
    }
    return true;
  }
}
