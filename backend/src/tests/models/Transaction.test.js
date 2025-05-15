const mongoose = require('mongoose');
const Transaction = require('../../models/Transaction');
const User = require('../../models/User');

describe('Transaction Model Test', () => {
  let user;

  beforeAll(async () => {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/budget-buddy-test', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    // Create a test user
    user = await User.create({
      email: 'test@example.com',
      password: 'password123',
      name: 'Test User',
    });
  });

  afterAll(async () => {
    await mongoose.connection.dropDatabase();
    await mongoose.connection.close();
  });

  it('should create & save transaction successfully', async () => {
    const validTransaction = new Transaction({
      amount: 100,
      type: 'income',
      category: 'Salary',
      description: 'Monthly salary',
      user: user._id,
    });

    const savedTransaction = await validTransaction.save();
    expect(savedTransaction._id).toBeDefined();
    expect(savedTransaction.amount).toBe(100);
    expect(savedTransaction.type).toBe('income');
    expect(savedTransaction.category).toBe('Salary');
    expect(savedTransaction.description).toBe('Monthly salary');
    expect(savedTransaction.user.toString()).toBe(user._id.toString());
  });

  it('should fail to save transaction without required fields', async () => {
    const transactionWithoutRequiredField = new Transaction({});
    let err;

    try {
      await transactionWithoutRequiredField.save();
    } catch (error) {
      err = error;
    }

    expect(err).toBeDefined();
    expect(err.errors.amount).toBeDefined();
    expect(err.errors.type).toBeDefined();
    expect(err.errors.category).toBeDefined();
    expect(err.errors.description).toBeDefined();
    expect(err.errors.user).toBeDefined();
  });

  it('should fail to save transaction with invalid type', async () => {
    const transactionWithInvalidType = new Transaction({
      amount: 100,
      type: 'invalid',
      category: 'Salary',
      description: 'Monthly salary',
      user: user._id,
    });

    let err;
    try {
      await transactionWithInvalidType.save();
    } catch (error) {
      err = error;
    }

    expect(err).toBeDefined();
    expect(err.errors.type).toBeDefined();
  });
}); 