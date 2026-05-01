import { users, categories, tests, questions, results } from '../data/sampleData';

// In-memory stores (cloned)
const db = {
  users: JSON.parse(JSON.stringify(users)),
  categories: JSON.parse(JSON.stringify(categories)),
  tests: JSON.parse(JSON.stringify(tests)),
  questions: JSON.parse(JSON.stringify(questions)),
  results: JSON.parse(JSON.stringify(results)),
};

function delay(ms = 200) {
  return new Promise((res) => setTimeout(res, ms));
}

function makeResponse(data) {
  return { data };
}

const mockApi = {
  get: async (url) => {
    await delay();
    // simple routing
    if (url === '/categories' || url === '/api/categories') return makeResponse(db.categories);
    if (url.startsWith('/tests/') || url.startsWith('/api/tests/')) {
      const id = url.split('/').pop();
      const list = db.tests.filter((t) => t.category === id);
      return makeResponse(list);
    }
    if (url.startsWith('/tests') || url === '/api/tests') return makeResponse(db.tests);
    if (url.startsWith('/test/') || url.startsWith('/api/test/')) {
      const id = url.split('/').pop();
      const t = db.tests.find((x) => x._id === id);
      if (!t) return makeResponse(null);
      const qs = t.questions.map((qid) => db.questions.find((q) => q._id === qid));
      // Return shape expected by frontend: { test, questions }
      return makeResponse({ test: t, questions: qs });
    }
    if (url.startsWith('/results/') || url.startsWith('/api/results/')) {
      const userId = url.split('/').pop();
      const res = db.results.filter((r) => r.user === userId);
      return makeResponse(res);
    }
    if (url.startsWith('/analytics/') || url.startsWith('/api/analytics/')) {
      const userId = url.split('/').pop();
      const userResults = db.results.filter((r) => r.user === userId);
      if (userResults.length === 0) {
        return makeResponse({
          totalTests: 0,
          avgScore: 0,
          avgAccuracy: 0,
          categoryPerformance: [],
          trend: [],
          strengths: [],
          weaknesses: [],
        });
      }

      const totals = userResults.reduce(
        (acc, result) => {
          acc.score += result.score || 0;
          acc.accuracy += result.accuracy || 0;
          return acc;
        },
        { score: 0, accuracy: 0 },
      );

      const categoryMap = new Map();
      userResults.forEach((result) => {
        const categoryName = result.testId?.categoryId?.name || 'General';
        const bucket = categoryMap.get(categoryName) || { category: categoryName, score: 0, accuracy: 0, count: 0 };
        bucket.score += result.score || 0;
        bucket.accuracy += result.accuracy || 0;
        bucket.count += 1;
        categoryMap.set(categoryName, bucket);
      });

      const categoryPerformance = Array.from(categoryMap.values()).map((bucket) => ({
        category: bucket.category,
        avgScore: Math.round(bucket.score / bucket.count),
        avgAccuracy: Math.round(bucket.accuracy / bucket.count),
      }));

      const trend = userResults
        .slice()
        .sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt))
        .map((result, index) => ({
          test: result.testId?.title || `Test ${index + 1}`,
          score: result.score || 0,
          accuracy: result.accuracy || 0,
        }));

      const strongest = categoryPerformance.filter((item) => item.avgAccuracy >= 70).map((item) => item.category);
      const weakest = categoryPerformance.filter((item) => item.avgAccuracy < 70).map((item) => item.category);

      return makeResponse({
        totalTests: userResults.length,
        avgScore: Math.round(totals.score / userResults.length),
        avgAccuracy: Math.round(totals.accuracy / userResults.length),
        categoryPerformance,
        trend,
        strengths: strongest,
        weaknesses: weakest,
      });
    }
    if (url.startsWith('/result/') || url.startsWith('/api/result/')) {
      const id = url.split('/').pop();
      const r = db.results.find((x) => x._id === id);
      return makeResponse(r || null);
    }
    if (url.startsWith('/admin/tests') || url.startsWith('/api/admin/tests')) return makeResponse(db.tests);
    if (url.startsWith('/admin/questions') || url.startsWith('/api/admin/questions')) {
      const parts = url.split('/');
      const testId = parts[parts.length - 1];
      const t = db.tests.find((x) => x._id === testId);
      if (!t) return makeResponse([]);
      const qs = t.questions.map((qid) => db.questions.find((q) => q._id === qid));
      return makeResponse(qs);
    }

    return makeResponse(null);
  },

  post: async (url, payload) => {
    await delay();
    if (url === '/auth/login' || url === '/api/auth/login') {
      const { email, password } = payload;
      const user = db.users.find((u) => u.email === email && u.password === password);
      if (!user) return Promise.reject({ response: { status: 401, data: { message: 'Invalid credentials' } } });
      const token = 'mocked-jwt-token';
      return makeResponse({ token, user: { _id: user._id, name: user.name, email: user.email, role: user.role || 'student' } });
    }

    if (url === '/auth/register' || url === '/api/auth/register') {
      const { name, email, password } = payload;
      if (db.users.find((u) => u.email === email)) return Promise.reject({ response: { status: 400, data: { message: 'User exists' } } });
      const newUser = { _id: `u${db.users.length + 1}`, name, email, password, role: 'student' };
      db.users.push(newUser);
      const token = 'mocked-jwt-token';
      return makeResponse({ token, user: { _id: newUser._id, name: newUser.name, email: newUser.email, role: newUser.role } });
    }

    if (url === '/test/submit' || url === '/api/test/submit') {
      const { userId, testId, answers } = payload;
      const t = db.tests.find((x) => x._id === testId);
      if (!t) return makeResponse(null);
      const qs = t.questions.map((qid) => db.questions.find((q) => q._id === qid)).filter(Boolean);
      let correctAnswers = 0;
      const detailedAnswers = qs.map((q, i) => {
        const submitted = answers[i] || {};
        const selectedAnswer = submitted.selectedAnswer ?? submitted.code ?? '';
        const isCorrect = selectedAnswer === q.correctAnswer;
        if (isCorrect) correctAnswers += 1;
        return {
          questionId: { _id: q._id, questionText: q.questionText },
          selectedAnswer,
          isCorrect,
        };
      });
      const totalQuestions = qs.length;
      const accuracy = totalQuestions > 0 ? Math.round((correctAnswers / totalQuestions) * 100) : 0;
      const category = db.categories.find((c) => c._id === t.category);
      const result = {
        _id: `r${db.results.length + 1}`,
        user: userId,
        testId: {
          _id: t._id,
          title: t.title,
          categoryId: category ? { _id: category._id, name: category.name } : null,
        },
        score: accuracy,
        totalQuestions,
        correctAnswers,
        accuracy,
        timeTaken: payload.timeTaken || 0,
        violations: payload.violations || 0,
        createdAt: new Date().toISOString(),
        answers: detailedAnswers,
      };
      db.results.push(result);
      return makeResponse(result);
    }

    // admin create category/test/question
    if (url === '/admin/category' || url === '/api/admin/category') {
      const id = `c${db.categories.length + 1}`;
      const obj = { _id: id, ...payload };
      db.categories.push(obj);
      return makeResponse(obj);
    }
    if (url === '/admin/test' || url === '/api/admin/test') {
      const id = `t${db.tests.length + 1}`;
      const obj = { _id: id, ...payload };
      db.tests.push(obj);
      return makeResponse(obj);
    }
    if (url === '/admin/question' || url === '/api/admin/question') {
      const id = `q${db.questions.length + 1}`;
      const obj = { _id: id, ...payload };
      db.questions.push(obj);
      return makeResponse(obj);
    }

    return makeResponse(null);
  },
};

export default mockApi;
