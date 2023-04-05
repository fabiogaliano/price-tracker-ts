import axios from 'axios';
import { load } from 'cheerio';
import { data, saveData } from './db';
import { notify } from 'node-notifier';

async function fetchPrice(url: string, selector: string): Promise<number> {
  const response = await axios.get(url);
  const $ = load(response.data);
  const priceText = $(selector).text().trim();
  const price = parseFloat(priceText.replace(/[^0-9\.]/g, '')).toFixed(2);
  return Number(price);
}

type CurrentPrice = { price: number; date: string };
export interface Product {
  index: number;
  name: string;
  url: string;
  selector: string;
  state: CurrentPrice;
  history: CurrentPrice[];
}

export async function checkPrice(product: Product) {
  const fetchedPrice = await fetchPrice(product.url, product.selector);
  if (product.state.price === null || fetchedPrice !== product.state.price) {
    // see the difference in %
    const percentage =
      ((fetchedPrice - product.state.price) / product.state.price) * 100;
    const roundedPercentage = Math.round(percentage);

    // push old state to history
    const i = product.index;
    data.products[i].history.push(product.state);

    // update new state
    data.products[i].state = {
      price: fetchedPrice,
      date: new Date().toISOString(),
    };

    // save data
    saveData();

    notify({
      title: 'Price Tracker',
      message: 'something',
    });
  }
}

export async function addProduct(name, url, selector) {
  const price = await fetchPrice(url, selector);

  const product: Product = {
    index: data.products.length,
    name: name,
    url: url,
    selector: selector,
    state: {
      price,
      date: new Date().toISOString(),
    },
    history: [],
  };

  data.products.push(product); // local data
  saveData(); // persist in storage
  // output
  console.log(`${product.name}: $${product.state.price}`);
}

export function listProducts() {
  data.products.forEach((product, index) => {
    console.log(`[${index}] ${product.name}: $${product.state.price}`);
  });
}

export function deleteProduct(index) {
  const product = data.products[index];
  if (product) {
    data.products.splice(index, 1);
    saveData();
    console.log(`Deleted product: ${product.name}`);
  } else {
    console.error(`Product not found: ${index}`);
  }
}
