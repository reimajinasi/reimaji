import { test, expect } from '@playwright/test'

test('landing menampilkan section utama', async ({ page }) => {
  await page.goto('/')
  await expect(page.getByRole('heading', { name: 'Berita Terbaru' })).toBeVisible()
  await expect(page.getByRole('heading', { name: 'Review Produk & Unggulan' })).toBeVisible()
  await expect(page.getByRole('heading', { name: 'Riset Terbaru' })).toBeVisible()
})
