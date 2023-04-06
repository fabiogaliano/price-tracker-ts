import { existsSync, readFileSync, writeFileSync } from 'fs';
import { join } from 'path';
import { Product } from './utils';

let data: { products: Product[] } = {
  products: [],
};

const dataFile = join(__dirname, 'data.json');

function saveData() {
  writeFileSync(dataFile, JSON.stringify(data));
}

function loadData() {
  if (existsSync(dataFile)) {
    data = JSON.parse(readFileSync(dataFile, 'utf-8'));
  }
}

module.exports = {
  data,
  saveData,
  loadData,
};