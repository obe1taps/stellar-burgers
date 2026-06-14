import { fetchIngredients, ingredientsReducer } from '../ingredientsSlice';
import { TIngredient } from '../../../utils/types';

const mockIngredients: TIngredient[] = [
  {
    _id: '1',
    name: 'Булка',
    type: 'bun',
    proteins: 10,
    fat: 20,
    carbohydrates: 30,
    calories: 40,
    price: 100,
    image: 'image',
    image_large: 'image_large',
    image_mobile: 'image_mobile'
  }
];

describe('ingredientsSlice reducer', () => {
  test('возвращает initialState при UNKNOWN action и undefined state', () => {
    const state = ingredientsReducer(undefined, { type: 'UNKNOWN' });

    expect(state).toEqual({
      ingredients: [],
      isLoading: false,
      error: null
    });
  });

  test('обрабатывает fetchIngredients.pending', () => {
    const state = ingredientsReducer(undefined, fetchIngredients.pending(''));

    expect(state).toEqual({
      ingredients: [],
      isLoading: true,
      error: null
    });
  });

  test('обрабатывает fetchIngredients.fulfilled', () => {
    const state = ingredientsReducer(
      undefined,
      fetchIngredients.fulfilled(mockIngredients, '')
    );

    expect(state).toEqual({
      ingredients: mockIngredients,
      isLoading: false,
      error: null
    });
  });

  test('обрабатывает fetchIngredients.rejected', () => {
    const error = new Error('Ошибка сервера');

    const state = ingredientsReducer(
      undefined,
      fetchIngredients.rejected(error, '')
    );

    expect(state).toEqual({
      ingredients: [],
      isLoading: false,
      error: 'Ошибка сервера'
    });
  });
});
