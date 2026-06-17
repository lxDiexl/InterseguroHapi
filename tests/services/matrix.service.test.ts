import { MatrixService } from '../../src/services/matrix.service';
import { MatrixRequestEntity } from '../../src/entities/matrix-request.entity';
import { Context } from '../../src/middleware/context';

describe('MatrixService', () => {
  let matrixService: MatrixService;
  let ctx: Context;

  beforeEach(() => {
    matrixService = new MatrixService();
    ctx = {
      applicationId: 'test-app',
      transactionId: 'test-transaction-123'
    };
  });

  describe('analyzeMatrices', () => {
    it('debe calcular estadísticas correctamente para matrices válidas', async () => {
      const request = new MatrixRequestEntity({
        rotated: [[1, 2], [3, 4]],
        Q: [[1, 0], [0, 1]],
        R: [[2, 0], [0, 3]]
      });

      const result = await matrixService.analyzeMatrices(ctx, request);

      expect(result.QMatrix).toEqual([[1, 0], [0, 1]]);
      expect(result.RMatrix).toEqual([[2, 0], [0, 3]]);
      expect(result.RotatedMatrix).toEqual([[1, 2], [3, 4]]);
      expect(result.QStats.isDiagonal).toBe(true);
      expect(result.RStats.isDiagonal).toBe(true);
    });

    it('debe detectar matrices no diagonales', async () => {
      const request = new MatrixRequestEntity({
        rotated: [[1, 2], [3, 4]],
        Q: [[1, 2], [3, 4]],
        R: [[1, 2], [3, 4]]
      });

      const result = await matrixService.analyzeMatrices(ctx, request);

      expect(result.QStats.isDiagonal).toBe(false);
      expect(result.RStats.isDiagonal).toBe(false);
    });

    it('debe calcular correctamente max, min, sum y average', async () => {
      const request = new MatrixRequestEntity({
        rotated: [[1, 2], [3, 4]],
        Q: [[1, 2], [3, 4]],
        R: [[5, 6], [7, 8]]
      });

      const result = await matrixService.analyzeMatrices(ctx, request);

      expect(result.QStats.max).toBe(4);
      expect(result.QStats.min).toBe(1);
      expect(result.QStats.sum).toBe(10);
      expect(result.QStats.average).toBe(2.5);

      expect(result.RStats.max).toBe(8);
      expect(result.RStats.min).toBe(5);
      expect(result.RStats.sum).toBe(26);
      expect(result.RStats.average).toBe(6.5);
    });
  });
});
