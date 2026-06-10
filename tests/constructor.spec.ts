import { test, expect } from '@playwright/test';

test.describe('Конструктор бургера', () => {
  test.beforeEach(async ({ page }) => {
    await page.routeFromHAR('./tests/hars/burger-api.har', {
      url: '**/api/**',
      update: false
    });
  });

  test('отображает моковые ингредиенты', async ({ page }) => {
    await page.goto('/');

    await expect(page.getByText('Соберите бургер')).toBeVisible();
    await expect(page.getByText('Краторная булка N-200i')).toBeVisible();
    await expect(
      page.getByText('Биокотлета из марсианской Магнолии')
    ).toBeVisible();
  });

  test('добавляет булку и начинку в конструктор', async ({ page }) => {
    await page.goto('/');

    await page
      .locator('li')
      .filter({ hasText: 'Краторная булка N-200i' })
      .getByRole('button', { name: 'Добавить' })
      .click();

    await page
      .locator('li')
      .filter({ hasText: 'Биокотлета из марсианской Магнолии' })
      .getByRole('button', { name: 'Добавить' })
      .click();

    const constructor = page
      .locator('section')
      .filter({ hasText: 'Оформить заказ' });

    await expect(page.getByText('Краторная булка N-200i (верх)')).toBeVisible();
    await expect(page.getByText('Краторная булка N-200i (низ)')).toBeVisible();
    await expect(
      constructor.getByText('Биокотлета из марсианской Магнолии')
    ).toBeVisible();
    await expect(constructor.getByText('2934')).toBeVisible();
  });

  test('открывает модальное окно с данными выбранного ингредиента и закрывает по крестику', async ({
    page
  }) => {
    await page.goto('/');

    await page.getByText('Краторная булка N-200i').click();

    await expect(page.getByTestId('modal')).toBeVisible();
    await expect(page.getByText('Детали ингредиента')).toBeVisible();
    await expect(
      page.getByRole('heading', { name: 'Краторная булка N-200i' })
    ).toBeVisible();

    await page.getByTestId('modal-close-button').click();

    await expect(page.getByTestId('modal')).not.toBeVisible();
  });

  test('закрывает модальное окно ингредиента по оверлею', async ({ page }) => {
    await page.goto('/');

    await page.getByText('Краторная булка N-200i').click();

    await expect(page.getByTestId('modal')).toBeVisible();

    await page
      .getByTestId('modal-overlay')
      .click({ position: { x: 10, y: 10 } });

    await expect(page.getByTestId('modal')).not.toBeVisible();
  });

  test('создаёт заказ и очищает конструктор', async ({ page, context }) => {
    await context.addCookies([
      {
        name: 'accessToken',
        value: 'Bearer test-access-token',
        domain: 'localhost',
        path: '/'
      }
    ]);

    await page.addInitScript(() => {
      window.localStorage.setItem('refreshToken', 'test-refresh-token');
    });

    await page.goto('/');

    await page
      .locator('li')
      .filter({ hasText: 'Краторная булка N-200i' })
      .getByRole('button', { name: 'Добавить' })
      .click();

    await page
      .locator('li')
      .filter({ hasText: 'Биокотлета из марсианской Магнолии' })
      .getByRole('button', { name: 'Добавить' })
      .click();

    await page.getByRole('button', { name: 'Оформить заказ' }).click();

    await expect(page.getByTestId('modal')).toBeVisible();
    await expect(page.getByText('12345')).toBeVisible();

    await page.getByTestId('modal-close-button').click();

    await expect(page.getByTestId('modal')).not.toBeVisible();

    await expect(page.getByText('Выберите булки').first()).toBeVisible();
    await expect(page.getByText('Выберите начинку')).toBeVisible();

    await page.evaluate(() => {
      window.localStorage.clear();
    });

    await context.clearCookies();
  });
});
