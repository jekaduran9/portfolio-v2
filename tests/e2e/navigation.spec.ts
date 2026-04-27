import { test, expect } from '@playwright/test';

test.describe('Header navigation', () => {
  test('ES: navigates to About and Contact', async ({ page }) => {
    await page.goto('/portfolio-v2/');

    await page.getByRole('link', { name: 'Sobre mí' }).click();
    await expect(page).toHaveURL(/\/portfolio-v2\/about\/?$/);

    await page.getByRole('link', { name: 'Contacto' }).click();
    await expect(page).toHaveURL(/\/portfolio-v2\/contact\/?$/);
  });

  test('EN: navigates to About and Contact', async ({ page }) => {
    await page.goto('/portfolio-v2/en/');

    await page.getByRole('link', { name: 'About' }).click();
    await expect(page).toHaveURL(/\/portfolio-v2\/en\/about\/?$/);

    await page.getByRole('link', { name: 'Contact' }).click();
    await expect(page).toHaveURL(/\/portfolio-v2\/en\/contact\/?$/);
  });
});
