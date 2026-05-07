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
  { text: "What is the boiling point of water in Celsius?", category: "Science", difficulty: "Easy", options: [{ text: "90°C", isCorrect: false }, { text: "100°C", isCorrect: true }, { text: "110°C", isCorrect: false }, { text: "120°C", isCorrect: false }] },
  { text: "What force keeps us on the ground?", category: "Science", difficulty: "Easy", options: [{ text: "Magnetism", isCorrect: false }, { text: "Friction", isCorrect: false }, { text: "Gravity", isCorrect: true }, { text: "Tension", isCorrect: false }] },
  { text: "How many bones are in the adult human body?", category: "Science", difficulty: "Easy", options: [{ text: "186", isCorrect: false }, { text: "206", isCorrect: true }, { text: "226", isCorrect: false }, { text: "246", isCorrect: false }] },
  { text: "What organ pumps blood through the body?", category: "Science", difficulty: "Easy", options: [{ text: "Lungs", isCorrect: false }, { text: "Liver", isCorrect: false }, { text: "Kidney", isCorrect: false }, { text: "Heart", isCorrect: true }] },
  { text: "Which planet is known as the Red Planet?", category: "Science", difficulty: "Easy", options: [{ text: "Venus", isCorrect: false }, { text: "Jupiter", isCorrect: false }, { text: "Mars", isCorrect: true }, { text: "Saturn", isCorrect: false }] },
  { text: "What is the most abundant gas in Earth's atmosphere?", category: "Science", difficulty: "Easy", options: [{ text: "Oxygen", isCorrect: false }, { text: "Carbon Dioxide", isCorrect: false }, { text: "Nitrogen", isCorrect: true }, { text: "Hydrogen", isCorrect: false }] },

  // Science - Medium
  { text: "What is the chemical formula for table salt?", category: "Science", difficulty: "Medium", options: [{ text: "KCl", isCorrect: false }, { text: "NaCl", isCorrect: true }, { text: "CaCl2", isCorrect: false }, { text: "MgSO4", isCorrect: false }] },
  { text: "Which blood type is the universal donor?", category: "Science", difficulty: "Medium", options: [{ text: "AB+", isCorrect: false }, { text: "A-", isCorrect: false }, { text: "O-", isCorrect: true }, { text: "B+", isCorrect: false }] },
  { text: "What is the unit of electrical resistance?", category: "Science", difficulty: "Medium", options: [{ text: "Volt", isCorrect: false }, { text: "Ampere", isCorrect: false }, { text: "Watt", isCorrect: false }, { text: "Ohm", isCorrect: true }] },
  { text: "How many chambers does the human heart have?", category: "Science", difficulty: "Medium", options: [{ text: "2", isCorrect: false }, { text: "3", isCorrect: false }, { text: "4", isCorrect: true }, { text: "5", isCorrect: false }] },
  { text: "What is the process by which plants make food?", category: "Science", difficulty: "Medium", options: [{ text: "Respiration", isCorrect: false }, { text: "Photosynthesis", isCorrect: true }, { text: "Fermentation", isCorrect: false }, { text: "Transpiration", isCorrect: false }] },
  { text: "Which organ produces insulin?", category: "Science", difficulty: "Medium", options: [{ text: "Liver", isCorrect: false }, { text: "Kidney", isCorrect: false }, { text: "Pancreas", isCorrect: true }, { text: "Stomach", isCorrect: false }] },
  { text: "What is the chemical symbol for gold?", category: "Science", difficulty: "Medium", options: [{ text: "Go", isCorrect: false }, { text: "Gd", isCorrect: false }, { text: "Au", isCorrect: true }, { text: "Ag", isCorrect: false }] },

  // Science - Hard
  { text: "What is Avogadro's number approximately equal to?", category: "Science", difficulty: "Hard", options: [{ text: "6.022 × 10²³", isCorrect: true }, { text: "3.14 × 10²³", isCorrect: false }, { text: "9.11 × 10²³", isCorrect: false }, { text: "1.67 × 10²³", isCorrect: false }] },
  { text: "What type of bond involves the sharing of electron pairs?", category: "Science", difficulty: "Hard", options: [{ text: "Ionic bond", isCorrect: false }, { text: "Covalent bond", isCorrect: true }, { text: "Hydrogen bond", isCorrect: false }, { text: "Metallic bond", isCorrect: false }] },
  { text: "Which part of the cell contains the genetic material?", category: "Science", difficulty: "Hard", options: [{ text: "Mitochondria", isCorrect: false }, { text: "Ribosome", isCorrect: false }, { text: "Nucleus", isCorrect: true }, { text: "Golgi body", isCorrect: false }] },
  { text: "What is the half-life concept used to measure?", category: "Science", difficulty: "Hard", options: [{ text: "Speed of light", isCorrect: false }, { text: "Rate of radioactive decay", isCorrect: true }, { text: "Chemical reaction rate", isCorrect: false }, { text: "Gravitational pull", isCorrect: false }] },
  { text: "DNA replication occurs during which phase of the cell cycle?", category: "Science", difficulty: "Hard", options: [{ text: "G1 phase", isCorrect: false }, { text: "S phase", isCorrect: true }, { text: "G2 phase", isCorrect: false }, { text: "M phase", isCorrect: false }] },
  { text: "What is the name of the process where a solid turns directly into gas?", category: "Science", difficulty: "Hard", options: [{ text: "Evaporation", isCorrect: false }, { text: "Condensation", isCorrect: false }, { text: "Sublimation", isCorrect: true }, { text: "Deposition", isCorrect: false }] },

  // History - Easy
  { text: "Which country gifted the Statue of Liberty to the USA?", category: "History", difficulty: "Easy", options: [{ text: "England", isCorrect: false }, { text: "France", isCorrect: true }, { text: "Germany", isCorrect: false }, { text: "Italy", isCorrect: false }] },
  { text: "What was the name of the ship that sank in 1912?", category: "History", difficulty: "Easy", options: [{ text: "Lusitania", isCorrect: false }, { text: "Britannic", isCorrect: false }, { text: "Titanic", isCorrect: true }, { text: "Olympic", isCorrect: false }] },
  { text: "Who was the first man to walk on the Moon?", category: "History", difficulty: "Easy", options: [{ text: "Buzz Aldrin", isCorrect: false }, { text: "Yuri Gagarin", isCorrect: false }, { text: "Neil Armstrong", isCorrect: true }, { text: "John Glenn", isCorrect: false }] },
  { text: "The Great Wall of China was built primarily to protect against whom?", category: "History", difficulty: "Easy", options: [{ text: "Japanese invaders", isCorrect: false }, { text: "Northern nomadic tribes", isCorrect: true }, { text: "Persian armies", isCorrect: false }, { text: "Roman legions", isCorrect: false }] },
  { text: "In which year did World War I begin?", category: "History", difficulty: "Easy", options: [{ text: "1912", isCorrect: false }, { text: "1914", isCorrect: true }, { text: "1916", isCorrect: false }, { text: "1918", isCorrect: false }] },
  { text: "Who wrote the Declaration of Independence?", category: "History", difficulty: "Easy", options: [{ text: "George Washington", isCorrect: false }, { text: "Benjamin Franklin", isCorrect: false }, { text: "Thomas Jefferson", isCorrect: true }, { text: "John Adams", isCorrect: false }] },

  // History - Medium
  { text: "Which empire was known as the 'Empire on which the sun never sets'?", category: "History", difficulty: "Medium", options: [{ text: "Roman Empire", isCorrect: false }, { text: "Ottoman Empire", isCorrect: false }, { text: "British Empire", isCorrect: true }, { text: "Spanish Empire", isCorrect: false }] },
  { text: "The Berlin Wall fell in which year?", category: "History", difficulty: "Medium", options: [{ text: "1987", isCorrect: false }, { text: "1989", isCorrect: true }, { text: "1991", isCorrect: false }, { text: "1993", isCorrect: false }] },
  { text: "Who was the Egyptian queen who had relationships with Julius Caesar and Mark Antony?", category: "History", difficulty: "Medium", options: [{ text: "Nefertiti", isCorrect: false }, { text: "Hatshepsut", isCorrect: false }, { text: "Cleopatra", isCorrect: true }, { text: "Isis", isCorrect: false }] },
  { text: "Which war was fought between the North and South of the United States?", category: "History", difficulty: "Medium", options: [{ text: "Revolutionary War", isCorrect: false }, { text: "Civil War", isCorrect: true }, { text: "War of 1812", isCorrect: false }, { text: "Mexican-American War", isCorrect: false }] },
  { text: "Who was the first Emperor of China?", category: "History", difficulty: "Medium", options: [{ text: "Kublai Khan", isCorrect: false }, { text: "Emperor Wu", isCorrect: false }, { text: "Qin Shi Huang", isCorrect: true }, { text: "Sun Yat-sen", isCorrect: false }] },
  { text: "In which year did the Russian Revolution take place?", category: "History", difficulty: "Medium", options: [{ text: "1905", isCorrect: false }, { text: "1917", isCorrect: true }, { text: "1921", isCorrect: false }, { text: "1924", isCorrect: false }] },

  // History - Hard
  { text: "The Peloponnesian War was fought between which two city-states?", category: "History", difficulty: "Hard", options: [{ text: "Athens and Corinth", isCorrect: false }, { text: "Sparta and Thebes", isCorrect: false }, { text: "Athens and Sparta", isCorrect: true }, { text: "Corinth and Thebes", isCorrect: false }] },
  { text: "Who was the last Tsar of Russia?", category: "History", difficulty: "Hard", options: [{ text: "Alexander III", isCorrect: false }, { text: "Nicholas I", isCorrect: false }, { text: "Nicholas II", isCorrect: true }, { text: "Alexander II", isCorrect: false }] },
  { text: "The Magna Carta was signed in which year?", category: "History", difficulty: "Hard", options: [{ text: "1066", isCorrect: false }, { text: "1215", isCorrect: true }, { text: "1348", isCorrect: false }, { text: "1492", isCorrect: false }] },
  { text: "Which African country was never colonized by a European power?", category: "History", difficulty: "Hard", options: [{ text: "Nigeria", isCorrect: false }, { text: "Kenya", isCorrect: false }, { text: "Ethiopia", isCorrect: true }, { text: "Ghana", isCorrect: false }] },
  { text: "The Opium Wars were fought between China and which country?", category: "History", difficulty: "Hard", options: [{ text: "France", isCorrect: false }, { text: "USA", isCorrect: false }, { text: "Britain", isCorrect: true }, { text: "Russia", isCorrect: false }] },
  { text: "Who commanded the Allied forces on D-Day in 1944?", category: "History", difficulty: "Hard", options: [{ text: "General Patton", isCorrect: false }, { text: "General MacArthur", isCorrect: false }, { text: "General Eisenhower", isCorrect: true }, { text: "General Montgomery", isCorrect: false }] },

  // Technology - Easy
  { text: "What does 'RAM' stand for?", category: "Technology", difficulty: "Easy", options: [{ text: "Random Access Memory", isCorrect: true }, { text: "Read Access Module", isCorrect: false }, { text: "Rapid Action Memory", isCorrect: false }, { text: "Real-time Access Memory", isCorrect: false }] },
  { text: "What is the most popular search engine?", category: "Technology", difficulty: "Easy", options: [{ text: "Bing", isCorrect: false }, { text: "Yahoo", isCorrect: false }, { text: "Google", isCorrect: true }, { text: "DuckDuckGo", isCorrect: false }] },
  { text: "What does 'USB' stand for?", category: "Technology", difficulty: "Easy", options: [{ text: "Universal Serial Bus", isCorrect: true }, { text: "Unified System Bridge", isCorrect: false }, { text: "Universal Sync Board", isCorrect: false }, { text: "United Serial Bridge", isCorrect: false }] },
  { text: "Which company makes the Android operating system?", category: "Technology", difficulty: "Easy", options: [{ text: "Apple", isCorrect: false }, { text: "Microsoft", isCorrect: false }, { text: "Google", isCorrect: true }, { text: "Samsung", isCorrect: false }] },
  { text: "What does 'URL' stand for?", category: "Technology", difficulty: "Easy", options: [{ text: "Uniform Resource Locator", isCorrect: true }, { text: "Universal Reference Link", isCorrect: false }, { text: "Unified Resource Library", isCorrect: false }, { text: "Universal Routing Label", isCorrect: false }] },
  { text: "Which symbol is used for email addresses?", category: "Technology", difficulty: "Easy", options: [{ text: "#", isCorrect: false }, { text: "@", isCorrect: true }, { text: "$", isCorrect: false }, { text: "%", isCorrect: false }] },

  // Technology - Medium
  { text: "What does 'CSS' stand for?", category: "Technology", difficulty: "Medium", options: [{ text: "Creative Style Sheets", isCorrect: false }, { text: "Cascading Style Sheets", isCorrect: true }, { text: "Computer Styling System", isCorrect: false }, { text: "Custom Style Syntax", isCorrect: false }] },
  { text: "Which protocol is used to send emails?", category: "Technology", difficulty: "Medium", options: [{ text: "FTP", isCorrect: false }, { text: "HTTP", isCorrect: false }, { text: "SMTP", isCorrect: true }, { text: "SSH", isCorrect: false }] },
  { text: "What is the default port for HTTPS?", category: "Technology", difficulty: "Medium", options: [{ text: "80", isCorrect: false }, { text: "443", isCorrect: true }, { text: "8080", isCorrect: false }, { text: "22", isCorrect: false }] },
  { text: "In programming, what is a 'loop'?", category: "Technology", difficulty: "Medium", options: [{ text: "A type of variable", isCorrect: false }, { text: "A code block that repeats", isCorrect: true }, { text: "A function call", isCorrect: false }, { text: "A data structure", isCorrect: false }] },
  { text: "Which of these is NOT a JavaScript framework?", category: "Technology", difficulty: "Medium", options: [{ text: "React", isCorrect: false }, { text: "Vue", isCorrect: false }, { text: "Django", isCorrect: true }, { text: "Angular", isCorrect: false }] },
  { text: "What does 'SQL' stand for?", category: "Technology", difficulty: "Medium", options: [{ text: "Simple Query Language", isCorrect: false }, { text: "Structured Query Language", isCorrect: true }, { text: "Standard Question Logic", isCorrect: false }, { text: "Sequential Queue Language", isCorrect: false }] },

  // Technology - Hard
  { text: "What is the CAP theorem in distributed systems?", category: "Technology", difficulty: "Hard", options: [{ text: "Consistency, Availability, Partition tolerance", isCorrect: true }, { text: "Caching, Accuracy, Performance", isCorrect: false }, { text: "Concurrency, Atomicity, Persistence", isCorrect: false }, { text: "Clustering, Availability, Processing", isCorrect: false }] },
  { text: "Which algorithm is used in Bitcoin's proof-of-work?", category: "Technology", difficulty: "Hard", options: [{ text: "MD5", isCorrect: false }, { text: "SHA-256", isCorrect: true }, { text: "AES-128", isCorrect: false }, { text: "RSA-2048", isCorrect: false }] },
  { text: "What does ACID stand for in database transactions?", category: "Technology", difficulty: "Hard", options: [{ text: "Atomicity, Consistency, Isolation, Durability", isCorrect: true }, { text: "Access, Control, Integrity, Data", isCorrect: false }, { text: "Availability, Concurrency, Integration, Distribution", isCorrect: false }, { text: "Accuracy, Completeness, Integrity, Delivery", isCorrect: false }] },
  { text: "What is 'Big O notation' used to describe?", category: "Technology", difficulty: "Hard", options: [{ text: "Database schema size", isCorrect: false }, { text: "Algorithm time/space complexity", isCorrect: true }, { text: "Network bandwidth", isCorrect: false }, { text: "Memory allocation", isCorrect: false }] },
  { text: "Which design pattern separates object construction from representation?", category: "Technology", difficulty: "Hard", options: [{ text: "Singleton", isCorrect: false }, { text: "Observer", isCorrect: false }, { text: "Builder", isCorrect: true }, { text: "Facade", isCorrect: false }] },
  { text: "What is a 'race condition' in concurrent programming?", category: "Technology", difficulty: "Hard", options: [{ text: "When two threads compete for CPU time", isCorrect: false }, { text: "When output depends on non-deterministic execution order", isCorrect: true }, { text: "When a program runs faster than expected", isCorrect: false }, { text: "When memory is freed too early", isCorrect: false }] },

  // Geography - Easy
  { text: "What is the longest river in South America?", category: "Geography", difficulty: "Easy", options: [{ text: "Nile", isCorrect: false }, { text: "Mississippi", isCorrect: false }, { text: "Amazon", isCorrect: true }, { text: "Congo", isCorrect: false }] },
  { text: "How many continents are there on Earth?", category: "Geography", difficulty: "Easy", options: [{ text: "5", isCorrect: false }, { text: "6", isCorrect: false }, { text: "7", isCorrect: true }, { text: "8", isCorrect: false }] },
  { text: "Which is the smallest country in the world?", category: "Geography", difficulty: "Easy", options: [{ text: "Monaco", isCorrect: false }, { text: "San Marino", isCorrect: false }, { text: "Vatican City", isCorrect: true }, { text: "Liechtenstein", isCorrect: false }] },
  { text: "What is the capital of Japan?", category: "Geography", difficulty: "Easy", options: [{ text: "Osaka", isCorrect: false }, { text: "Kyoto", isCorrect: false }, { text: "Tokyo", isCorrect: true }, { text: "Hiroshima", isCorrect: false }] },
  { text: "Which ocean is the smallest?", category: "Geography", difficulty: "Easy", options: [{ text: "Indian Ocean", isCorrect: false }, { text: "Southern Ocean", isCorrect: false }, { text: "Atlantic Ocean", isCorrect: false }, { text: "Arctic Ocean", isCorrect: true }] },
  { text: "Which mountain is the tallest in the world?", category: "Geography", difficulty: "Easy", options: [{ text: "K2", isCorrect: false }, { text: "Kangchenjunga", isCorrect: false }, { text: "Mount Everest", isCorrect: true }, { text: "Lhotse", isCorrect: false }] },

  // Geography - Medium
  { text: "Which country has the most official languages?", category: "Geography", difficulty: "Medium", options: [{ text: "India", isCorrect: false }, { text: "Switzerland", isCorrect: false }, { text: "Zimbabwe", isCorrect: false }, { text: "Bolivia", isCorrect: true }] },
  { text: "Through how many countries does the Amazon River flow?", category: "Geography", difficulty: "Medium", options: [{ text: "4", isCorrect: false }, { text: "7", isCorrect: false }, { text: "9", isCorrect: true }, { text: "12", isCorrect: false }] },
  { text: "What is the capital of Australia?", category: "Geography", difficulty: "Medium", options: [{ text: "Sydney", isCorrect: false }, { text: "Melbourne", isCorrect: false }, { text: "Canberra", isCorrect: true }, { text: "Brisbane", isCorrect: false }] },
  { text: "Which country has the most time zones?", category: "Geography", difficulty: "Medium", options: [{ text: "Russia", isCorrect: false }, { text: "USA", isCorrect: false }, { text: "France", isCorrect: true }, { text: "China", isCorrect: false }] },
  { text: "The Andes mountain range runs through which continent?", category: "Geography", difficulty: "Medium", options: [{ text: "North America", isCorrect: false }, { text: "Africa", isCorrect: false }, { text: "South America", isCorrect: true }, { text: "Asia", isCorrect: false }] },
  { text: "What is the largest desert in the world?", category: "Geography", difficulty: "Medium", options: [{ text: "Sahara", isCorrect: false }, { text: "Gobi", isCorrect: false }, { text: "Arabian", isCorrect: false }, { text: "Antarctic", isCorrect: true }] },

  // Geography - Hard
  { text: "Which country is home to the most UNESCO World Heritage Sites?", category: "Geography", difficulty: "Hard", options: [{ text: "France", isCorrect: false }, { text: "China", isCorrect: false }, { text: "Italy", isCorrect: true }, { text: "Spain", isCorrect: false }] },
  { text: "Lake Baikal in Russia contains approximately what fraction of the world's fresh surface water?", category: "Geography", difficulty: "Hard", options: [{ text: "1/10", isCorrect: false }, { text: "1/5", isCorrect: true }, { text: "1/3", isCorrect: false }, { text: "1/2", isCorrect: false }] },
  { text: "Which river forms most of the border between Zambia and Zimbabwe?", category: "Geography", difficulty: "Hard", options: [{ text: "Congo", isCorrect: false }, { text: "Limpopo", isCorrect: false }, { text: "Zambezi", isCorrect: true }, { text: "Niger", isCorrect: false }] },
  { text: "The Mariana Trench is located in which ocean?", category: "Geography", difficulty: "Hard", options: [{ text: "Atlantic Ocean", isCorrect: false }, { text: "Indian Ocean", isCorrect: false }, { text: "Pacific Ocean", isCorrect: true }, { text: "Arctic Ocean", isCorrect: false }] },
  { text: "What is the name of the tectonic plate that most of India sits on?", category: "Geography", difficulty: "Hard", options: [{ text: "Eurasian Plate", isCorrect: false }, { text: "Indo-Australian Plate", isCorrect: true }, { text: "African Plate", isCorrect: false }, { text: "Arabian Plate", isCorrect: false }] },
  { text: "Which country has the longest coastline in the world?", category: "Geography", difficulty: "Hard", options: [{ text: "Russia", isCorrect: false }, { text: "Australia", isCorrect: false }, { text: "Canada", isCorrect: true }, { text: "Norway", isCorrect: false }] },

  // Mathematics - Easy
  { text: "What is 25% of 80?", category: "Mathematics", difficulty: "Easy", options: [{ text: "15", isCorrect: false }, { text: "20", isCorrect: true }, { text: "25", isCorrect: false }, { text: "30", isCorrect: false }] },
  { text: "What is the perimeter of a square with side length 5?", category: "Mathematics", difficulty: "Easy", options: [{ text: "10", isCorrect: false }, { text: "15", isCorrect: false }, { text: "20", isCorrect: true }, { text: "25", isCorrect: false }] },
  { text: "What is 7 × 8?", category: "Mathematics", difficulty: "Easy", options: [{ text: "54", isCorrect: false }, { text: "56", isCorrect: true }, { text: "58", isCorrect: false }, { text: "60", isCorrect: false }] },
  { text: "What is the square root of 81?", category: "Mathematics", difficulty: "Easy", options: [{ text: "7", isCorrect: false }, { text: "8", isCorrect: false }, { text: "9", isCorrect: true }, { text: "10", isCorrect: false }] },
  { text: "What is 100 divided by 4?", category: "Mathematics", difficulty: "Easy", options: [{ text: "20", isCorrect: false }, { text: "25", isCorrect: true }, { text: "30", isCorrect: false }, { text: "40", isCorrect: false }] },
  { text: "What is 2 to the power of 10?", category: "Mathematics", difficulty: "Easy", options: [{ text: "512", isCorrect: false }, { text: "1024", isCorrect: true }, { text: "2048", isCorrect: false }, { text: "256", isCorrect: false }] },

  // Mathematics - Medium
  { text: "What is the area of a circle with radius 7? (use π ≈ 3.14)", category: "Mathematics", difficulty: "Medium", options: [{ text: "153.86", isCorrect: true }, { text: "43.96", isCorrect: false }, { text: "49", isCorrect: false }, { text: "21.98", isCorrect: false }] },
  { text: "If x² = 49, what is x?", category: "Mathematics", difficulty: "Medium", options: [{ text: "6", isCorrect: false }, { text: "±7", isCorrect: true }, { text: "7", isCorrect: false }, { text: "±6", isCorrect: false }] },
  { text: "What is the median of: 3, 7, 2, 9, 5?", category: "Mathematics", difficulty: "Medium", options: [{ text: "7", isCorrect: false }, { text: "5", isCorrect: true }, { text: "3", isCorrect: false }, { text: "9", isCorrect: false }] },
  { text: "What is the LCM of 4 and 6?", category: "Mathematics", difficulty: "Medium", options: [{ text: "8", isCorrect: false }, { text: "10", isCorrect: false }, { text: "12", isCorrect: true }, { text: "24", isCorrect: false }] },
  { text: "A triangle has sides 3, 4, and 5. What type of triangle is it?", category: "Mathematics", difficulty: "Medium", options: [{ text: "Equilateral", isCorrect: false }, { text: "Isosceles", isCorrect: false }, { text: "Right-angled", isCorrect: true }, { text: "Obtuse", isCorrect: false }] },
  { text: "What is 3! (3 factorial)?", category: "Mathematics", difficulty: "Medium", options: [{ text: "3", isCorrect: false }, { text: "6", isCorrect: true }, { text: "9", isCorrect: false }, { text: "12", isCorrect: false }] },

  // Mathematics - Hard
  { text: "What is the integral of cos(x)?", category: "Mathematics", difficulty: "Hard", options: [{ text: "-sin(x) + C", isCorrect: false }, { text: "sin(x) + C", isCorrect: true }, { text: "tan(x) + C", isCorrect: false }, { text: "-cos(x) + C", isCorrect: false }] },
  { text: "What is Euler's identity?", category: "Mathematics", difficulty: "Hard", options: [{ text: "e^iπ + 1 = 0", isCorrect: true }, { text: "e^π + i = 0", isCorrect: false }, { text: "e^i + π = 1", isCorrect: false }, { text: "π^e - i = 0", isCorrect: false }] },
  { text: "How many prime numbers are less than 20?", category: "Mathematics", difficulty: "Hard", options: [{ text: "6", isCorrect: false }, { text: "7", isCorrect: false }, { text: "8", isCorrect: true }, { text: "9", isCorrect: false }] },
  { text: "What is the value of log₂(64)?", category: "Mathematics", difficulty: "Hard", options: [{ text: "5", isCorrect: false }, { text: "6", isCorrect: true }, { text: "7", isCorrect: false }, { text: "8", isCorrect: false }] },
  { text: "If f(x) = x² + 3x, what is f'(x)?", category: "Mathematics", difficulty: "Hard", options: [{ text: "2x", isCorrect: false }, { text: "x + 3", isCorrect: false }, { text: "2x + 3", isCorrect: true }, { text: "3x + 2", isCorrect: false }] },
  { text: "In a geometric series with first term 2 and ratio 3, what is the 5th term?", category: "Mathematics", difficulty: "Hard", options: [{ text: "162", isCorrect: true }, { text: "81", isCorrect: false }, { text: "243", isCorrect: false }, { text: "54", isCorrect: false }] },

  // General - Easy
  { text: "How many days are in a leap year?", category: "General", difficulty: "Easy", options: [{ text: "364", isCorrect: false }, { text: "365", isCorrect: false }, { text: "366", isCorrect: true }, { text: "367", isCorrect: false }] },
  { text: "What is the largest planet in our solar system?", category: "General", difficulty: "Easy", options: [{ text: "Saturn", isCorrect: false }, { text: "Neptune", isCorrect: false }, { text: "Jupiter", isCorrect: true }, { text: "Uranus", isCorrect: false }] },
  { text: "Which bird is known for its ability to mimic sounds?", category: "General", difficulty: "Easy", options: [{ text: "Eagle", isCorrect: false }, { text: "Parrot", isCorrect: true }, { text: "Penguin", isCorrect: false }, { text: "Owl", isCorrect: false }] },
  { text: "How many hours are in a day?", category: "General", difficulty: "Easy", options: [{ text: "12", isCorrect: false }, { text: "20", isCorrect: false }, { text: "24", isCorrect: true }, { text: "48", isCorrect: false }] },
  { text: "What is the currency of the United Kingdom?", category: "General", difficulty: "Easy", options: [{ text: "Euro", isCorrect: false }, { text: "Dollar", isCorrect: false }, { text: "Pound", isCorrect: true }, { text: "Franc", isCorrect: false }] },
  { text: "Which fruit is known as the 'king of fruits'?", category: "General", difficulty: "Easy", options: [{ text: "Mango", isCorrect: true }, { text: "Durian", isCorrect: false }, { text: "Pineapple", isCorrect: false }, { text: "Jackfruit", isCorrect: false }] },

  // General - Medium
  { text: "What is the hardest natural substance on Earth?", category: "General", difficulty: "Medium", options: [{ text: "Quartz", isCorrect: false }, { text: "Diamond", isCorrect: true }, { text: "Titanium", isCorrect: false }, { text: "Tungsten", isCorrect: false }] },
  { text: "Who painted the Mona Lisa?", category: "General", difficulty: "Medium", options: [{ text: "Michelangelo", isCorrect: false }, { text: "Raphael", isCorrect: false }, { text: "Leonardo da Vinci", isCorrect: true }, { text: "Donatello", isCorrect: false }] },
  { text: "How many strings does a standard guitar have?", category: "General", difficulty: "Medium", options: [{ text: "4", isCorrect: false }, { text: "5", isCorrect: false }, { text: "6", isCorrect: true }, { text: "7", isCorrect: false }] },
  { text: "Which country is the largest producer of coffee?", category: "General", difficulty: "Medium", options: [{ text: "Colombia", isCorrect: false }, { text: "Ethiopia", isCorrect: false }, { text: "Brazil", isCorrect: true }, { text: "Vietnam", isCorrect: false }] },
  { text: "Which planet has rings around it?", category: "General", difficulty: "Medium", options: [{ text: "Only Saturn", isCorrect: false }, { text: "Saturn and Jupiter", isCorrect: false }, { text: "Saturn, Jupiter, Uranus, and Neptune", isCorrect: true }, { text: "Only Jupiter", isCorrect: false }] },
  { text: "What is the national animal of Australia?", category: "General", difficulty: "Medium", options: [{ text: "Koala", isCorrect: false }, { text: "Kangaroo", isCorrect: true }, { text: "Wombat", isCorrect: false }, { text: "Platypus", isCorrect: false }] },

  // General - Hard
  { text: "In which year was the first iPhone released?", category: "General", difficulty: "Hard", options: [{ text: "2005", isCorrect: false }, { text: "2006", isCorrect: false }, { text: "2007", isCorrect: true }, { text: "2008", isCorrect: false }] },
  { text: "What is the chemical formula for glucose?", category: "General", difficulty: "Hard", options: [{ text: "C6H12O6", isCorrect: true }, { text: "C12H22O11", isCorrect: false }, { text: "C6H6O6", isCorrect: false }, { text: "C2H5OH", isCorrect: false }] },
  { text: "Who developed the theory of general relativity?", category: "General", difficulty: "Hard", options: [{ text: "Isaac Newton", isCorrect: false }, { text: "Niels Bohr", isCorrect: false }, { text: "Albert Einstein", isCorrect: true }, { text: "Max Planck", isCorrect: false }] },
  { text: "How many elements are in the periodic table (as of 2024)?", category: "General", difficulty: "Hard", options: [{ text: "108", isCorrect: false }, { text: "112", isCorrect: false }, { text: "118", isCorrect: true }, { text: "120", isCorrect: false }] },
  { text: "The Fibonacci sequence starts with 0, 1 — what is the 10th number in the sequence?", category: "General", difficulty: "Hard", options: [{ text: "21", isCorrect: false }, { text: "34", isCorrect: true }, { text: "55", isCorrect: false }, { text: "13", isCorrect: false }] },
  { text: "Which Nobel Prize did Marie Curie win twice?", category: "General", difficulty: "Hard", options: [{ text: "Physics and Chemistry", isCorrect: true }, { text: "Chemistry and Medicine", isCorrect: false }, { text: "Physics and Medicine", isCorrect: false }, { text: "Peace and Chemistry", isCorrect: false }] },
];

async function seed() {
  console.log(`Seeding ${questions.length} additional questions...`);
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
