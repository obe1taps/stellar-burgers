import {
  addIngredient,
  clearConstructor,
  constructorReducer,
  moveIngredientDown,
  moveIngredientUp,
  removeIngredient
} from '../constructorSlice';
import { TConstructorIngredient, TIngredient } from '../../../utils/types';

const bun: TIngredient = {
  _id: 'bun-1',
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
};

const main: TIngredient = {
  _id: 'main-1',
  name: 'Начинка 1',
  type: 'main',
  proteins: 10,
  fat: 20,
  carbohydrates: 30,
  calories: 40,
  price: 200,
  image: 'image',
  image_large: 'image_large',
  image_mobile: 'image_mobile'
};

const sauce: TIngredient = {
  _id: 'sauce-1',
  name: 'Соус',
  type: 'sauce',
  proteins: 10,
  fat: 20,
  carbohydrates: 30,
  calories: 40,
  price: 50,
  image: 'image',
  image_large: 'image_large',
  image_mobile: 'image_mobile'
};

describe('constructorSlice reducer', () => {
  test('возвращает initialState при UNKNOWN action и undefined state', () => {
    const state = constructorReducer(undefined, { type: 'UNKNOWN' });

    expect(state).toEqual({
      bun: null,
      ingredients: []
    });
  });

  test('добавляет булку в bun', () => {
    const state = constructorReducer(undefined, addIngredient(bun));

    expect(state.bun).toMatchObject(bun);
    expect(state.ingredients).toEqual([]);
  });

  test('добавляет начинку в ingredients', () => {
    const state = constructorReducer(undefined, addIngredient(main));

    expect(state.bun).toBeNull();
    expect(state.ingredients).toHaveLength(1);
    expect(state.ingredients[0]).toMatchObject(main);
    expect(state.ingredients[0].id).toBeDefined();
  });

  test('удаляет ингредиент', () => {
    const ingredient: TConstructorIngredient = {
      ...main,
      id: 'ingredient-1'
    };

    const initialState = {
      bun: null,
      ingredients: [ingredient]
    };

    const state = constructorReducer(
      initialState,
      removeIngredient('ingredient-1')
    );

    expect(state.ingredients).toEqual([]);
  });

  test('перемещает ингредиент вверх', () => {
    const first: TConstructorIngredient = {
      ...main,
      id: '1'
    };

    const second: TConstructorIngredient = {
      ...sauce,
      id: '2'
    };

    const initialState = {
      bun: null,
      ingredients: [first, second]
    };

    const state = constructorReducer(initialState, moveIngredientUp(1));

    expect(state.ingredients[0].id).toBe('2');
    expect(state.ingredients[1].id).toBe('1');
  });

  test('перемещает ингредиент вниз', () => {
    const first: TConstructorIngredient = {
      ...main,
      id: '1'
    };

    const second: TConstructorIngredient = {
      ...sauce,
      id: '2'
    };

    const initialState = {
      bun: null,
      ingredients: [first, second]
    };

    const state = constructorReducer(initialState, moveIngredientDown(0));

    expect(state.ingredients[0].id).toBe('2');
    expect(state.ingredients[1].id).toBe('1');
  });

  test('очищает конструктор', () => {
    const initialState = {
      bun,
      ingredients: [
        {
          ...main,
          id: '1'
        }
      ]
    };

    const state = constructorReducer(initialState, clearConstructor());

    expect(state).toEqual({
      bun: null,
      ingredients: []
    });
  });
});
