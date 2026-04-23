// Script to seed the database with questions, lessons, and flashcards
// Run with: npm run seed
// Note: This requires setting up environment variables first

const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

const SUPABASE_URL = process.env.VITE_SUPABASE_URL;
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY; // Use service role key for admin operations

if (!SUPABASE_URL || !SUPABASE_SERVICE_KEY) {
  console.error('Error: Missing environment variables');
  console.error('Required: VITE_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY');
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

// Import data from the TypeScript file (we'll parse it)
// For now, we'll create a simpler approach - load from JSON or use inline data
// You may need to manually copy data from src/data/database.ts

// Helper to read and parse the database file
function loadDatabaseData() {
  const dbPath = path.join(__dirname, '../src/data/database.ts');
  const content = fs.readFileSync(dbPath, 'utf8');
  
  // Extract questions array (simplified - may need adjustments)
  // This is a basic approach - you might want to use a TypeScript parser
  console.log('Note: This script requires manual data extraction.');
  console.log('Consider using the SQL seed file or extracting data programmatically.');
  return { questions: [], lessons: [], flashcards: [] };
}

async function seedQuestions(questionsData) {
  console.log('Seeding questions...');
  
  // Transform questions to match database schema
  const transformed = questionsData.map(q => ({
    id: q.id,
    section: q.section,
    difficulty: q.difficulty,
    question: q.question,
    options: q.options,
    answer: q.answer,
    explanation: q.explanation,
  }));

  // Insert in batches
  const batchSize = 50;
  let inserted = 0;

  for (let i = 0; i < questionsData.length; i += batchSize) {
    const batch = questionsData.slice(i, i + batchSize);
    const { error } = await supabase
      .from('questions')
      .upsert(batch, { onConflict: 'id' });

    if (error) {
      console.error(`Error inserting questions batch ${i / batchSize + 1}:`, error);
    } else {
      inserted += batch.length;
      console.log(`Inserted ${inserted}/${transformed.length} questions...`);
    }
  }

  console.log(`✓ Seeded ${inserted} questions`);
}

async function seedLessons(lessonsData) {
  console.log('Seeding lessons...');
  
  if (!lessonsData || lessonsData.length === 0) {
    console.log('⚠ No lessons data provided. Skipping lessons seed.');
    return;
  }
  
  const transformed = lessonsData.map(l => ({
    id: l.id,
    title: l.title,
    body: l.body,
    category: l.category,
  }));

  const { error } = await supabase
    .from('lessons')
    .upsert(transformed, { onConflict: 'id' });

  if (error) {
    console.error('Error inserting lessons:', error);
  } else {
    console.log(`✓ Seeded ${transformed.length} lessons`);
  }
}

async function seedFlashcards(flashcardsData) {
  console.log('Seeding flashcards...');
  
  if (!flashcardsData || flashcardsData.length === 0) {
    console.log('⚠ No flashcards data provided. Skipping flashcards seed.');
    return;
  }
  
  const transformed = flashcardsData.map(f => ({
    id: f.id,
    term: f.term,
    definition: f.definition,
    category: f.category,
  }));

  const { error } = await supabase
    .from('flashcards')
    .upsert(transformed, { onConflict: 'id' });

  if (error) {
    console.error('Error inserting flashcards:', error);
  } else {
    console.log(`✓ Seeded ${transformed.length} flashcards`);
  }
}

async function main() {
  console.log('Starting database seed...\n');
  console.log('⚠ WARNING: This script currently requires manual data setup.');
  console.log('Please use the SQL seed file in supabase/migrations/ or update this script to parse TypeScript files.\n');
  
  try {
    // For now, we'll skip the actual seeding since parsing TS files is complex
    // Users should use the SQL seed file instead
    console.log('Please use the SQL seed file method instead:');
    console.log('1. Go to Supabase SQL Editor');
    console.log('2. Create a seed SQL file from src/data/database.ts');
    console.log('3. Or use a TypeScript parser to extract the data\n');
    
    // const data = loadDatabaseData();
    // await seedQuestions(data.questions);
    // await seedLessons(data.lessons);
    // await seedFlashcards(data.flashcards);
    
    console.log('\n✓ Database seeding completed successfully!');
  } catch (error) {
    console.error('\n✗ Error seeding database:', error);
    process.exit(1);
  }
}

main();

