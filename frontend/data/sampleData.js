export const users = [
  { _id: 'u1', name: 'Student User', email: 'student@skillportal.com', password: 'student123', role: 'student' },
  { _id: 'u2', name: 'Admin User', email: 'admin@skillportal.com', password: 'admin123', role: 'admin' },
];

export const categories = [
  { _id: 'c1', name: 'JavaScript' },
  { _id: 'c2', name: 'React' },
  { _id: 'c3', name: 'SHL' },
  { _id: 'c4', name: 'Aptitude' },
  { _id: 'c5', name: 'Logical' },
  { _id: 'c6', name: 'Coding' },
];

export const tests = [
  {
    _id: 't1',
    title: 'JS Basics',
    category: 'c1',
    duration: 15,
    questionCount: 3,
    type: 'mcq',
    difficulty: 'easy',
    description: 'Core JavaScript fundamentals for warm-up practice.',
    questions: ['q1', 'q2', 'q3'],
  },
  {
    _id: 't2',
    title: 'React Intro',
    category: 'c2',
    duration: 20,
    questionCount: 3,
    type: 'mcq',
    difficulty: 'easy',
    description: 'Basic React concepts, hooks, and component behavior.',
    questions: ['q4', 'q5', 'q6'],
  },
  {
    _id: 't3',
    title: 'SHL Numerical Reasoning',
    category: 'c3',
    duration: 20,
    questionCount: 3,
    type: 'mcq',
    difficulty: 'medium',
    description: 'Numerical reasoning questions inspired by SHL-style assessments.',
    questions: ['q7', 'q8', 'q9'],
  },
  {
    _id: 't4',
    title: 'Aptitude Test',
    category: 'c4',
    duration: 25,
    questionCount: 3,
    type: 'mcq',
    difficulty: 'medium',
    description: 'Classic aptitude problems covering series, ratios, and averages.',
    questions: ['q10', 'q11', 'q12'],
  },
  {
    _id: 't5',
    title: 'Logical Reasoning Test',
    category: 'c5',
    duration: 20,
    questionCount: 3,
    type: 'mcq',
    difficulty: 'hard',
    description: 'Logical deduction and verbal reasoning practice.',
    questions: ['q13', 'q14', 'q15'],
  },
  {
    _id: 't6',
    title: 'Coding Challenge (MCQ)',
    category: 'c6',
    duration: 30,
    questionCount: 3,
    type: 'mcq',
    difficulty: 'medium',
    description: 'Programming language and debugging fundamentals with options.',
    questions: ['q16', 'q17', 'q18'],
  },
];

export const questions = [
  { _id: 'q1', testId: 't1', type: 'mcq', questionText: 'What is var scope?', difficulty: 'easy', options: ['Global', 'Local', 'Block', 'Function'], correctAnswer: 'Function' },
  { _id: 'q2', testId: 't1', type: 'mcq', questionText: 'Which method converts JSON to object?', difficulty: 'easy', options: ['JSON.parse', 'JSON.stringify', 'JSON.toObj', 'JSON.fromObject'], correctAnswer: 'JSON.parse' },
  { _id: 'q3', testId: 't1', type: 'mcq', questionText: 'Which is a primitive?', difficulty: 'easy', options: ['Object', 'Array', 'Number', 'Function'], correctAnswer: 'Number' },

  { _id: 'q4', testId: 't2', type: 'mcq', questionText: 'What is JSX?', difficulty: 'easy', options: ['A template', 'A syntax extension', 'A library', 'A runtime'], correctAnswer: 'A syntax extension' },
  { _id: 'q5', testId: 't2', type: 'mcq', questionText: 'useState returns?', difficulty: 'easy', options: ['Array', 'Object', 'Function', 'Promise'], correctAnswer: 'Array' },
  { _id: 'q6', testId: 't2', type: 'mcq', questionText: 'useEffect runs on?', difficulty: 'easy', options: ['Every render', 'Mount and deps change', 'Never', 'Only once'], correctAnswer: 'Mount and deps change' },

  // SHL
  { _id: 'q7', testId: 't3', type: 'mcq', questionText: 'If 5x + 10 = 35, what is x?', difficulty: 'medium', options: ['3', '5', '7', '25'], correctAnswer: '5' },
  { _id: 'q8', testId: 't3', type: 'mcq', questionText: 'A shop sells 3 items for $15. What is cost per item?', difficulty: 'medium', options: ['$3', '$4', '$5', '$6'], correctAnswer: '$5' },
  { _id: 'q9', testId: 't3', type: 'mcq', questionText: 'If a train travels 60km in 1.5 hours, speed is?', difficulty: 'medium', options: ['30 km/h', '40 km/h', '50 km/h', '60 km/h'], correctAnswer: '40 km/h' },

  // Aptitude
  { _id: 'q10', testId: 't4', type: 'mcq', questionText: 'What is the next number: 2, 4, 8, 16, ?', difficulty: 'medium', options: ['18', '20', '32', '24'], correctAnswer: '32' },
  { _id: 'q11', testId: 't4', type: 'mcq', questionText: 'If ratio a:b = 2:3 and b:c = 3:4, a:c = ?', difficulty: 'medium', options: ['2:4', '2:3', '6:12', '2:4'], correctAnswer: '2:4' },
  { _id: 'q12', testId: 't4', type: 'mcq', questionText: 'Average of 10, 20, 30 is?', difficulty: 'medium', options: ['15', '20', '25', '30'], correctAnswer: '20' },

  // Logical
  { _id: 'q13', testId: 't5', type: 'mcq', questionText: 'Find odd one out: Apple, Banana, Carrot, Grape', difficulty: 'hard', options: ['Apple', 'Banana', 'Carrot', 'Grape'], correctAnswer: 'Carrot' },
  { _id: 'q14', testId: 't5', type: 'mcq', questionText: 'If ALL = 3 and BALL = 7, what is CALL?', difficulty: 'hard', options: ['6', '7', '8', '9'], correctAnswer: '8' },
  { _id: 'q15', testId: 't5', type: 'mcq', questionText: 'Syllogism: All A are B. Some B are C. Is some A are C?', difficulty: 'hard', options: ['Yes', 'No', 'Cannot say'], correctAnswer: 'Cannot say' },

  // Coding (MCQ)
  { _id: 'q16', testId: 't6', type: 'mcq', questionText: 'What does console.log(typeof []) print in JS?', difficulty: 'medium', options: ['array', 'object', 'list', 'undefined'], correctAnswer: 'object' },
  { _id: 'q17', testId: 't6', type: 'mcq', questionText: 'Which is immutable in JS?', difficulty: 'medium', options: ['Object', 'Array', 'String', 'Date'], correctAnswer: 'String' },
  { _id: 'q18', testId: 't6', type: 'mcq', questionText: 'What is result of 2 + "2" in JS?', difficulty: 'medium', options: ['4', '22', 'NaN', 'undefined'], correctAnswer: '22' },
];

export const results = [
  {
    _id: 'r1',
    user: 'u1',
    testId: { _id: 't1', title: 'JS Basics', categoryId: { _id: 'c1', name: 'JavaScript' } },
    score: 67,
    totalQuestions: 3,
    correctAnswers: 2,
    accuracy: 67,
    timeTaken: 420,
    violations: 0,
    createdAt: new Date().toISOString(),
    answers: [
      { questionId: { _id: 'q1', questionText: 'What is var scope?' }, selectedAnswer: 'Function', isCorrect: true },
      { questionId: { _id: 'q2', questionText: 'Which method converts JSON to object?' }, selectedAnswer: 'JSON.parse', isCorrect: true },
      { questionId: { _id: 'q3', questionText: 'Which is a primitive?' }, selectedAnswer: 'Array', isCorrect: false },
    ],
  },
  {
    _id: 'r2',
    user: 'u1',
    testId: { _id: 't3', title: 'SHL Numerical Reasoning', categoryId: { _id: 'c3', name: 'SHL' } },
    score: 100,
    totalQuestions: 3,
    correctAnswers: 3,
    accuracy: 100,
    timeTaken: 510,
    violations: 0,
    createdAt: new Date().toISOString(),
    answers: [
      { questionId: { _id: 'q7', questionText: 'If 5x + 10 = 35, what is x?' }, selectedAnswer: '5', isCorrect: true },
      { questionId: { _id: 'q8', questionText: 'A shop sells 3 items for $15. What is cost per item?' }, selectedAnswer: '$5', isCorrect: true },
      { questionId: { _id: 'q9', questionText: 'If a train travels 60km in 1.5 hours, speed is?' }, selectedAnswer: '40 km/h', isCorrect: true },
    ],
  },
];
