import { test, expect } from '@playwright/test'

test('home page menampilkan Reimaji dan Selamat datang', async ({ page }) => {
  await page.goto('/')
  await expect(page.getByRole('heading', { name: 'Reimaji' })).toBeVisible()
  await expect(page.getByText('Selamat datang')).toBeVisible()
})
