import { MatrixRequestEntity } from '../../src/entities/matrix-request.entity';

describe('MatrixRequestEntity', () => {
  it('debe crear una entidad válida con datos correctos', () => {
    const data = {
      rotated: [[1, 2], [3, 4]],
      Q: [[1, 0], [0, 1]],
      R: [[2, 0], [0, 3]]
    };

    const entity = new MatrixRequestEntity(data);

    expect(entity.rotated).toEqual([[1, 2], [3, 4]]);
    expect(entity.Q).toEqual([[1, 0], [0, 1]]);
    expect(entity.R).toEqual([[2, 0], [0, 3]]);
  });

  it('debe lanzar error si una matriz no es un array', () => {
    const data = {
      rotated: 'not-an-array',
      Q: [[1, 0]],
      R: [[2, 0]]
    };

    expect(() => new MatrixRequestEntity(data)).toThrow(
      'rotated debe ser una matriz'
    );
  });

  it('debe lanzar error si una matriz está vacía', () => {
    const data = {
      rotated: [],
      Q: [[1, 0]],
      R: [[2, 0]]
    };

    expect(() => new MatrixRequestEntity(data)).toThrow(
      'rotated no puede estar vacía'
    );
  });

  it('debe lanzar error si una fila no es un array', () => {
    const data = {
      rotated: [[1, 2]],
      Q: ['not-an-array'],
      R: [[2, 0]]
    };

    expect(() => new MatrixRequestEntity(data)).toThrow(
      'Q debe contener filas válidas'
    );
  });

  it('debe lanzar error si un valor no es numérico', () => {
    const data = {
      rotated: [[1, 2]],
      Q: [[1, 0]],
      R: [[2, 'invalid']]
    };

    expect(() => new MatrixRequestEntity(data)).toThrow(
      'R debe contener solo números válidos'
    );
  });
});
