import { execFileSync } from "node:child_process";
import { test, expect, type Page } from "@playwright/test";

const npmCommand = process.platform === "win32" ? "npm.cmd" : "npm";

test.describe.configure({ mode: "serial" });

const openOffersAsLouis = async (page: Page): Promise<void> => {
  await page.goto("/");
  await page.getByRole("button", { name: "Louis Claes", exact: true }).click();
  await page.getByRole("link", { name: "Offres", exact: true }).click();
  await expect(page.getByRole("heading", { name: "Offres de stage", exact: true })).toBeVisible();
};

test.beforeAll(() => {
  execFileSync(npmCommand, ["run", "db:init"], {
    cwd: process.cwd(),
    stdio: "pipe",
    shell: true,
  });
});

test("Scénario 1 — la recherche trouve une offre quelle que soit la casse", async ({ page }) => {
  await openOffersAsLouis(page);

  await page
    .getByRole("searchbox", { name: "Rechercher par titre", exact: true })
    .fill("InTeRnE");

  await expect(page.getByText("1 offre", { exact: true })).toBeVisible();
  const table = page.getByRole("table");
  await expect(table).toBeVisible();
  await expect(table).toContainText("Assistant conversationnel interne");
  await expect(table).not.toContainText("Tableau de bord de qualité des données");
  await expect(table).not.toContainText("Application React de gestion de flotte");
  await expect(table.getByRole("row")).toHaveCount(2);
});

test("Scénario 2 — la recherche sans correspondance affiche le message attendu", async ({ page }) => {
  await openOffersAsLouis(page);

  await page
    .getByRole("searchbox", { name: "Rechercher par titre", exact: true })
    .fill("fjdikf");

  await expect(
    page.getByText("Aucune offre ne correspond à votre recherche.", { exact: true }),
  ).toBeVisible();
  await expect(page.getByRole("table")).toHaveCount(0);
});
