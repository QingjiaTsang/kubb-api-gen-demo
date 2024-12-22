import db from './index';
import { tasks } from './schema';

async function seed() {
  const sampleTasks = [
    { name: 'Buy groceries', done: false },
    { name: 'Finish project report', done: true },
    { name: 'Call mom', done: false },
    { name: 'Go to the gym', done: true },
    { name: 'Read a book', done: false },
    { name: 'Plan weekend trip', done: false },
    { name: 'Update resume', done: true },
    { name: 'Pay bills', done: false },
    { name: 'Clean the house', done: true },
    { name: 'Learn a new recipe', done: false },
  ];

  console.log('Seeding database...');

  for (const task of sampleTasks) {
    await db.insert(tasks).values(task);
  }

  console.log('Seeding completed successfully!');
}

seed().catch(error => {
  console.error('Error seeding database:', error);
  process.exit(1);
});
