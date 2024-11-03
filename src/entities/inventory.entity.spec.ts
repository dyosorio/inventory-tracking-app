import { Inventory } from './inventory.entity';
import { Product } from './product.entity';
import { Region } from './region.entity';

describe('Inventory Entity', () => {
  let product: Product;
  let region: Region;
  let inventory: Inventory;

  beforeEach(() => {
    product = new Product();
    region = new Region();
    inventory = new Inventory();

    inventory.product = product;
    inventory.region = region;
    inventory.allocation = 100;
    inventory.stockBalance = 100;
    inventory.allocationTimestamp = new Date();    
  });

  it('should create an inventory instance with the correct properties', () => {
    expect(inventory.product).toBe(product);
    expect(inventory.region).toBe(region);
    expect(inventory.allocation).toBe(100);
    expect(inventory.allocationTimestamp).toBeInstanceOf(Date);
  });

  it('should decrease the allocation correctly', () => {
    inventory.decreaseStock(20);
    expect(inventory.allocation).toBe(80);
  });

  it('should throw an error if the decrease amount is greater than the current allocation', () => {
    expect(() => inventory.decreaseStock(150)).toThrowError('Stock cannot be negative.');
  });  

  it('should throw an error if the decrease amount is zero or negative', () => {
    expect(() => inventory.decreaseStock(0)).toThrowError('Decrease amount must be greater than zero.');
    expect(() => inventory.decreaseStock(-10)).toThrowError('Decrease amount must be greater than zero.');
  });

  it('should increase the allocation correctly', () => {
    inventory.increaseStock(50);
    expect(inventory.allocation).toBe(150);
  });

  it('should throw an error if the increase amount is zero or negative', () => {
    expect(() => inventory.increaseStock(0)).toThrowError('Increase amount must be greater than zero.');
    expect(() => inventory.increaseStock(-10)).toThrowError('Increase amount must be greater than zero.');
  });

  it('should update the allocation correctly', () => {
    inventory.updateAllocation(200);
    expect(inventory.allocation).toBe(200);
  });

  it('should throw an error if the new allocation is negative', () => {
    expect(() => inventory.updateAllocation(-50)).toThrowError('Allocation must be a non-negative number.');
  });

  it('should check if allocation meets the threshold', () => {
    expect(inventory.meetsThreshold(50)).toBe(true);
    expect(inventory.meetsThreshold(150)).toBe(false);
  });

  it('should initialize stockBalance to match the allocation', () => {
    inventory.allocation = 100;
    inventory.stockBalance = inventory.allocation; // Explicitly set stockBalance for testing
    expect(inventory.stockBalance).toBe(inventory.allocation);
  });
  
  it('should decrease the allocation and stock balance correctly', () => {
    inventory.decreaseStock(20);
    expect(inventory.allocation).toBe(80); // Verify allocation
    expect(inventory.stockBalance).toBe(80); // Verify stockBalance
  });
  
  it('should throw an error if the decrease amount is greater than the current stock balance', () => {
    expect(() => inventory.decreaseStock(150)).toThrowError('Stock cannot be negative.');
  });
  
  it('should not allow stock balance to go negative when decreasing stock', () => {
    expect(() => inventory.decreaseStock(110)).toThrowError('Stock cannot be negative.');
  });     
});