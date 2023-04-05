import { existsSync, readFileSync, writeFileSync } from 'fs';
import { join } from 'path';
import { Product } from './utils';

export let data: { products: Product[] } = {
  products: [],
};

const dataFile = join(__dirname, 'data.json');

export function saveData() {
  writeFileSync(dataFile, JSON.stringify(data));
}

export function loadData() {
  if (existsSync(dataFile)) {
    data = JSON.parse(readFileSync(dataFile, 'utf-8'));
  }
}
