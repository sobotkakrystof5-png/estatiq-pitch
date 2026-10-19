// Rozmístění chaosu na plátně 1920×1080 v px. Plátno je pevné, takže S3 zná přesné
// polohy prvků z S2 a rozpad počítá z nich (místo měření `layoutId` přes škálované plátno).

/** Řádek výpisu: `text-row` 34 px, řádkování 1,5. */
export const EM = 34;
export const ROW_H = 51;

export const statementBox = { x: 120, y: 250, w: 930, pad: 40, head: 72 };
export const statementRows = {
  x: statementBox.x + statementBox.pad,
  y: statementBox.y + statementBox.pad + statementBox.head,
};

/** Tabulka: zelený pruh se jménem souboru, řádek písmen sloupců, sloupec čísel řádků. */
export const sheetBox = { x: 880, y: 370, head: 64, letters: 44, index: 64 };
/**
 * Hranice buněk vůči začátku řádku v em. Sedí do mezer mezi sloupci StatementRow
 * (3em · 6em · 5,4em · jméno, mezera 1,5em), takže přeletěný řádek dosedne přesně do buněk.
 */
export const sheetCells = [-0.75, 3.75, 11.25, 18.15, 26];
export const sheetRows = {
  x: sheetBox.x + sheetBox.index - sheetCells[0]! * EM,
  y: sheetBox.y + sheetBox.head + sheetBox.letters,
};
export const sheetWidth = sheetBox.index + (sheetCells.at(-1)! - sheetCells[0]!) * EM;
/** Řádků v tabulce celkem (8 z timeline + 5 ze smyčky), spodek přetéká přes okraj plátna. */
export const sheetRowCount = 13;

/** Odkud řádek do tabulky přiletí: přesně z místa stejného řádku ve výpisu. */
export const flight = { dx: statementRows.x - sheetRows.x, dy: statementRows.y - sheetRows.y };

export const bubbles = {
  rent: { x: 150, y: 770 },
  water: { x: 230, y: 892 },
};

export const counterBox = { right: 120, top: 56 };

export const props = {
  binder: { x: 520, y: 40, w: 380, ratio: '4/3', rotate: -3 },
  invoices: { x: 1010, y: 110, w: 260, ratio: '1/1.414', rotate: 5 },
  meter: { x: 640, y: 850, w: 250, ratio: '3/4', rotate: -6 },
};

/** Části chaosu, které se v S3 rozsypou, a kam se při tom posunou (px). */
export const pieces = [
  { key: 'binder', drift: [-20, -40] },
  { key: 'invoices', drift: [30, -40] },
  { key: 'counter', drift: [30, -30] },
  { key: 'panel', drift: [-40, 20] },
  { key: 'sheet', drift: [40, 20] },
  { key: 'rows', drift: [40, 30] },
  { key: 'meter', drift: [-10, 40] },
  { key: 'water', drift: [-20, 40] },
  { key: 'rent', drift: [-30, 40] },
] as const;

/** Odkud v chaosu vyjedou slova v S3: střed hlavičky výpisu, pruhu tabulky a první bubliny. */
export const anchors = {
  bank: { x: statementBox.x + statementBox.w / 2, y: statementBox.y + statementBox.pad + 28 },
  sheet: { x: sheetBox.x + sheetWidth / 2, y: sheetBox.y + sheetBox.head / 2 },
  chat: { x: bubbles.rent.x + 300, y: bubbles.rent.y + 46 },
  contracts: { x: props.binder.x + props.binder.w / 2, y: props.binder.y + (props.binder.w * 3) / 8 },
};
