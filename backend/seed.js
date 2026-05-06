import admin from 'firebase-admin';
import dotenv from 'dotenv';
dotenv.config();

admin.initializeApp({
  credential: admin.credential.cert({
    projectId: process.env.FIREBASE_PROJECT_ID,
    clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
    privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
  }),
});

const db = admin.firestore();

const questions = [
  // Science - Easy
  { text: "What is the chemical symbol for water?", category: "Science", difficulty: "Easy", options: [{ text: "H2O", isCorrect: true }, { text: "CO2", isCorrect: false }, { text: "O2", isCorrect: false }, { text: "NaCl", isCorrect: false }] },
  { text: "How many planets are in our solar system?", category: "Science", difficulty: "Easy", options: [{ text: "7", isCorrect: false }, { text: "8", isCorrect: true }, { text: "9", isCorrect: false }, { text: "10", isCorrect: false }] },
  { text: "What gas do plants absorb from the atmosphere?", category: "Science", difficulty: "Easy", options: [{ text: "Oxygen", isCorrect: false }, { text: "Nitrogen", isCorrect: false }, { text: "Carbon Dioxide", isCorrect: true }, { text: "Hydrogen", isCorrect: false }] },
  { text: "What is the closest star to Earth?", category: "Science", difficulty: "Easy", options: [{ text: "Alpha Centauri", isCorrect: false }, { text: "Sirius", isCorrect: false }, { text: "The Sun", isCorrect: true }, { text: "Betelgeuse", isCorrect: false }] },

  // Science - Medium
  { text: "What is the powerhouse of the cell?", category: "Science", difficulty: "Medium", options: [{ text: "Nucleus", isCorrect: false }, { text: "Mitochondria", isCorrect: true }, { text: "Ribosome", isCorrect: false }, { text: "Golgi apparatus", isCorrect: false }] },
  { text: "What is the atomic number of Carbon?", category: "Science", difficulty: "Medium", options: [{ text: "6", isCorrect: true }, { text: "8", isCorrect: false }, { text: "12", isCorrect: false }, { text: "4", isCorrect: false }] },
  { text: "Which planet has the most moons?", category: "Science", difficulty: "Medium", options: [{ text: "Jupiter", isCorrect: false }, { text: "Uranus", isCorrect: false }, { text: "Neptune", isCorrect: false }, { text: "Saturn", isCorrect: true }] },

  // Science - Hard
  { text: "What is the speed of light in a vacuum (approximately)?", category: "Science", difficulty: "Hard", options: [{ text: "3 × 10⁸ m/s", isCorrect: true }, { text: "3 × 10⁶ m/s", isCorrect: false }, { text: "3 × 10¹⁰ m/s", isCorrect: false }, { text: "3 × 10⁴ m/s", isCorrect: false }] },
  { text: "What particle has no electric charge and is found in the nucleus?", category: "Science", difficulty: "Hard", options: [{ text: "Proton", isCorrect: false }, { text: "Electron", isCorrect: false }, { text: "Neutron", isCorrect: true }, { text: "Photon", isCorrect: false }] },

  // History - Easy
  { text: "Who was the first President of the United States?", category: "History", difficulty: "Easy", options: [{ text: "Abraham Lincoln", isCorrect: false }, { text: "Thomas Jefferson", isCorrect: false }, { text: "George Washington", isCorrect: true }, { text: "John Adams", isCorrect: false }] },
  { text: "In which year did World War II end?", category: "History", difficulty: "Easy", options: [{ text: "1943", isCorrect: false }, { text: "1944", isCorrect: false }, { text: "1945", isCorrect: true }, { text: "1946", isCorrect: false }] },
  { text: "Which ancient wonder was located in Alexandria?", category: "History", difficulty: "Easy", options: [{ text: "The Colossus", isCorrect: false }, { text: "The Great Lighthouse", isCorrect: true }, { text: "The Hanging Gardens", isCorrect: false }, { text: "The Statue of Zeus", isCorrect: false }] },

  // History - Medium
  { text: "Who painted the Sistine Chapel ceiling?", category: "History", difficulty: "Medium", options: [{ text: "Leonardo da Vinci", isCorrect: false }, { text: "Raphael", isCorrect: false }, { text: "Michelangelo", isCorrect: true }, { text: "Donatello", isCorrect: false }] },
  { text: "The French Revolution began in which year?", category: "History", difficulty: "Medium", options: [{ text: "1776", isCorrect: false }, { text: "1789", isCorrect: true }, { text: "1804", isCorrect: false }, { text: "1815", isCorrect: false }] },
  { text: "Which empire was ruled by Genghis Khan?", category: "History", difficulty: "Medium", options: [{ text: "Ottoman Empire", isCorrect: false }, { text: "Roman Empire", isCorrect: false }, { text: "Mongol Empire", isCorrect: true }, { text: "Persian Empire", isCorrect: false }] },

  // History - Hard
  { text: "The Treaty of Westphalia (1648) ended which war?", category: "History", difficulty: "Hard", options: [{ text: "The Hundred Years' War", isCorrect: false }, { text: "The Thirty Years' War", isCorrect: true }, { text: "The Seven Years' War", isCorrect: false }, { text: "The War of Spanish Succession", isCorrect: false }] },

  // Technology - Easy
  { text: "What does 'CPU' stand for?", category: "Technology", difficulty: "Easy", options: [{ text: "Central Processing Unit", isCorrect: true }, { text: "Computer Personal Unit", isCorrect: false }, { text: "Central Program Utility", isCorrect: false }, { text: "Core Processing Unit", isCorrect: false }] },
  { text: "Which company created the iPhone?", category: "Technology", difficulty: "Easy", options: [{ text: "Samsung", isCorrect: false }, { text: "Google", isCorrect: false }, { text: "Apple", isCorrect: true }, { text: "Microsoft", isCorrect: false }] },
  { text: "What does 'HTML' stand for?", category: "Technology", difficulty: "Easy", options: [{ text: "Hyper Text Markup Language", isCorrect: true }, { text: "High Transfer Markup Language", isCorrect: false }, { text: "Hyper Transfer Mode Language", isCorrect: false }, { text: "Home Tool Markup Language", isCorrect: false }] },

  // Technology - Medium
  { text: "Which programming language is known for its snake logo?", category: "Technology", difficulty: "Medium", options: [{ text: "Java", isCorrect: false }, { text: "Ruby", isCorrect: false }, { text: "Python", isCorrect: true }, { text: "Perl", isCorrect: false }] },
  { text: "What does 'API' stand for?", category: "Technology", difficulty: "Medium", options: [{ text: "Application Programming Interface", isCorrect: true }, { text: "Automated Program Interaction", isCorrect: false }, { text: "Applied Protocol Integration", isCorrect: false }, { text: "Application Process Interface", isCorrect: false }] },
  { text: "Which data structure operates on LIFO principle?", category: "Technology", difficulty: "Medium", options: [{ text: "Queue", isCorrect: false }, { text: "Stack", isCorrect: true }, { text: "Linked List", isCorrect: false }, { text: "Tree", isCorrect: false }] },

  // Technology - Hard
  { text: "What is the time complexity of binary search?", category: "Technology", difficulty: "Hard", options: [{ text: "O(n)", isCorrect: false }, { text: "O(n²)", isCorrect: false }, { text: "O(log n)", isCorrect: true }, { text: "O(1)", isCorrect: false }] },
  { text: "Which sorting algorithm has the best average case performance?", category: "Technology", difficulty: "Hard", options: [{ text: "Bubble Sort", isCorrect: false }, { text: "Insertion Sort", isCorrect: false }, { text: "Merge Sort", isCorrect: true }, { text: "Selection Sort", isCorrect: false }] },

  // Geography - Easy
  { text: "What is the capital of France?", category: "Geography", difficulty: "Easy", options: [{ text: "London", isCorrect: false }, { text: "Berlin", isCorrect: false }, { text: "Paris", isCorrect: true }, { text: "Madrid", isCorrect: false }] },
  { text: "Which is the largest ocean on Earth?", category: "Geography", difficulty: "Easy", options: [{ text: "Atlantic Ocean", isCorrect: false }, { text: "Indian Ocean", isCorrect: false }, { text: "Arctic Ocean", isCorrect: false }, { text: "Pacific Ocean", isCorrect: true }] },
  { text: "Which country has the most natural lakes?", category: "Geography", difficulty: "Easy", options: [{ text: "Russia", isCorrect: false }, { text: "Canada", isCorrect: true }, { text: "Brazil", isCorrect: false }, { text: "USA", isCorrect: false }] },

  // Geography - Medium
  { text: "What is the longest river in the world?", category: "Geography", difficulty: "Medium", options: [{ text: "Amazon", isCorrect: false }, { text: "Yangtze", isCorrect: false }, { text: "Nile", isCorrect: true }, { text: "Mississippi", isCorrect: false }] },
  { text: "Which country has the largest land area?", category: "Geography", difficulty: "Medium", options: [{ text: "China", isCorrect: false }, { text: "Canada", isCorrect: false }, { text: "USA", isCorrect: false }, { text: "Russia", isCorrect: true }] },
  { text: "The Sahara Desert is located on which continent?", category: "Geography", difficulty: "Medium", options: [{ text: "Asia", isCorrect: false }, { text: "Africa", isCorrect: true }, { text: "Australia", isCorrect: false }, { text: "South America", isCorrect: false }] },

  // Geography - Hard
  { text: "What is the capital of Kazakhstan?", category: "Geography", difficulty: "Hard", options: [{ text: "Almaty", isCorrect: false }, { text: "Bishkek", isCorrect: false }, { text: "Astana", isCorrect: true }, { text: "Tashkent", isCorrect: false }] },
  { text: "Which strait separates Europe from Africa?", category: "Geography", difficulty: "Hard", options: [{ text: "Strait of Dover", isCorrect: false }, { text: "Strait of Gibraltar", isCorrect: true }, { text: "Bosphorus Strait", isCorrect: false }, { text: "Strait of Hormuz", isCorrect: false }] },

  // Mathematics - Easy
  { text: "What is 12 × 12?", category: "Mathematics", difficulty: "Easy", options: [{ text: "124", isCorrect: false }, { text: "144", isCorrect: true }, { text: "134", isCorrect: false }, { text: "154", isCorrect: false }] },
  { text: "What is the value of π (pi) to 2 decimal places?", category: "Mathematics", difficulty: "Easy", options: [{ text: "3.12", isCorrect: false }, { text: "3.41", isCorrect: false }, { text: "3.14", isCorrect: true }, { text: "3.16", isCorrect: false }] },
  { text: "What is the square root of 144?", category: "Mathematics", difficulty: "Easy", options: [{ text: "11", isCorrect: false }, { text: "12", isCorrect: true }, { text: "13", isCorrect: false }, { text: "14", isCorrect: false }] },

  // Mathematics - Medium
  { text: "What is the sum of angles in a triangle?", category: "Mathematics", difficulty: "Medium", options: [{ text: "90°", isCorrect: false }, { text: "180°", isCorrect: true }, { text: "270°", isCorrect: false }, { text: "360°", isCorrect: false }] },
  { text: "What is 15% of 200?", category: "Mathematics", difficulty: "Medium", options: [{ text: "25", isCorrect: false }, { text: "30", isCorrect: true }, { text: "35", isCorrect: false }, { text: "40", isCorrect: false }] },
  { text: "What is the next prime number after 7?", category: "Mathematics", difficulty: "Medium", options: [{ text: "8", isCorrect: false }, { text: "9", isCorrect: false }, { text: "10", isCorrect: false }, { text: "11", isCorrect: true }] },

  // Mathematics - Hard
  { text: "What is the derivative of sin(x)?", category: "Mathematics", difficulty: "Hard", options: [{ text: "-cos(x)", isCorrect: false }, { text: "cos(x)", isCorrect: true }, { text: "tan(x)", isCorrect: false }, { text: "-sin(x)", isCorrect: false }] },
  { text: "How many sides does a dodecagon have?", category: "Mathematics", difficulty: "Hard", options: [{ text: "10", isCorrect: false }, { text: "11", isCorrect: false }, { text: "12", isCorrect: true }, { text: "14", isCorrect: false }] },

  // General - Easy
  { text: "How many colors are in a rainbow?", category: "General", difficulty: "Easy", options: [{ text: "5", isCorrect: false }, { text: "6", isCorrect: false }, { text: "7", isCorrect: true }, { text: "8", isCorrect: false }] },
  { text: "Which animal is known as the King of the Jungle?", category: "General", difficulty: "Easy", options: [{ text: "Tiger", isCorrect: false }, { text: "Lion", isCorrect: true }, { text: "Elephant", isCorrect: false }, { text: "Gorilla", isCorrect: false }] },
  { text: "How many legs does a spider have?", category: "General", difficulty: "Easy", options: [{ text: "6", isCorrect: false }, { text: "8", isCorrect: true }, { text: "10", isCorrect: false }, { text: "12", isCorrect: false }] },

  // General - Medium
  { text: "What is the most spoken language in the world?", category: "General", difficulty: "Medium", options: [{ text: "English", isCorrect: false }, { text: "Spanish", isCorrect: false }, { text: "Mandarin Chinese", isCorrect: true }, { text: "Hindi", isCorrect: false }] },
  { text: "In which sport would you perform a 'slam dunk'?", category: "General", difficulty: "Medium", options: [{ text: "Volleyball", isCorrect: false }, { text: "Basketball", isCorrect: true }, { text: "Tennis", isCorrect: false }, { text: "Football", isCorrect: false }] },
  { text: "Which element has the symbol 'Au'?", category: "General", difficulty: "Medium", options: [{ text: "Silver", isCorrect: false }, { text: "Aluminum", isCorrect: false }, { text: "Gold", isCorrect: true }, { text: "Copper", isCorrect: false }] },

  // General - Hard
  { text: "Who wrote 'One Hundred Years of Solitude'?", category: "General", difficulty: "Hard", options: [{ text: "Pablo Neruda", isCorrect: false }, { text: "Jorge Luis Borges", isCorrect: false }, { text: "Gabriel García Márquez", isCorrect: true }, { text: "Mario Vargas Llosa", isCorrect: false }] },
  { text: "What is the rarest blood type?", category: "General", difficulty: "Hard", options: [{ text: "AB-", isCorrect: false }, { text: "O-", isCorrect: false }, { text: "B-", isCorrect: false }, { text: "AB-", isCorrect: true }] },
];

async function seed() {
  console.log(`Seeding ${questions.length} questions...`);
  const batch = db.batch();
  questions.forEach(q => {
    const ref = db.collection('questions').doc();
    batch.set(ref, { ...q, createdAt: admin.firestore.FieldValue.serverTimestamp() });
  });
  await batch.commit();
  console.log(`✓ Done! ${questions.length} questions added to Firestore.`);
  process.exit(0);
}

seed().catch(err => { console.error('Seed failed:', err); process.exit(1); });
