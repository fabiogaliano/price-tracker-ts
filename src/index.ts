import { program } from 'commander';
import { addProduct, checkPrice, deleteProduct, listProducts } from './utils';
import { data, loadData } from './db';

loadData();

data.products.forEach((product) => {
  checkPrice(product);
  setInterval(() => checkPrice(product), 12 * 60 * 60 * 1000); // Check price every 12 hours
});

// Configure CLI commands
program
  .command('add <name> <url> <selector>')
  .description('Add a product to track')
  .action(addProduct);

program
  .command('list')
  .description('List all tracked products')
  .action(listProducts);

program
  .command('delete <index>')
  .description('Delete a tracked product')
  .action(deleteProduct);

program.parse(process.argv);

if (program.args.length === 0) {
  program.help();
}
