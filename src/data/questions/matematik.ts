import { Question } from '../../types';

const questions: Question[] = [];

// Grade 1 (25q)
for (let i = 1; i <= 25; i++) {
  let q: string, ans: string, topic: string;
  if (i <= 7) {
    topic = 'mat_g1_sayilar';
    q = `${i} sayısından sonra hangi sayı gelir?`;
    ans = (i + 1).toString();
  } else if (i <= 14) {
    topic = 'mat_g1_toplama';
    const a = Math.floor(Math.random() * 5) + 1;
    const b = Math.floor(Math.random() * 5) + 1;
    q = `${a} + ${b} = ?`;
    ans = (a + b).toString();
  } else if (i <= 20) {
    topic = 'mat_g1_cikarma';
    const a = Math.floor(Math.random() * 5) + 5;
    const b = Math.floor(Math.random() * 5) + 1;
    q = `${a} - ${b} = ?`;
    ans = (a - b).toString();
  } else {
    topic = 'mat_g1_sekiller';
    const shapes = ['Üçgenin kaç köşesi vardır?', 'Karenin kaç kenarı vardır?', 'Dikdörtgenin kaç köşesi vardır?'];
    const answers = ['3', '4', '4'];
    const idx = i % 3;
    q = shapes[idx];
    ans = answers[idx];
  }
  questions.push({
    id: `mat_g1_${i}`,
    topicId: topic,
    subjectKey: 'matematik',
    grade: 1,
    type: 'numeric',
    question: q,
    correctAnswer: ans,
    difficulty: 1,
  });
}

// Grade 2 (25q)
for (let i = 1; i <= 25; i++) {
  let q: string, ans: string, topic: string;
  if (i <= 7) {
    topic = 'mat_g2_sayilar';
    const n = 10 + i * 3;
    q = `${n} sayısından önce hangi sayı gelir?`;
    ans = (n - 1).toString();
  } else if (i <= 14) {
    topic = 'mat_g2_toplama_cikarma';
    const a = 20 + i;
    const b = 10 + i;
    q = `${a} + ${b} = ?`;
    ans = (a + b).toString();
  } else if (i <= 20) {
    topic = 'mat_g2_carpma_giris';
    const a = Math.floor(Math.random() * 5) + 1;
    q = `${a} tane 2 kaç eder?`;
    ans = (a * 2).toString();
  } else {
    topic = 'mat_g2_olcme';
    q = '1 metre kaç santimetredir?';
    ans = '100';
  }
  questions.push({
    id: `mat_g2_${i}`,
    topicId: topic,
    subjectKey: 'matematik',
    grade: 2,
    type: 'numeric',
    question: q,
    correctAnswer: ans,
    difficulty: 1,
  });
}

// Grade 3 (25q)
for (let i = 1; i <= 25; i++) {
  const isMC = i > 15;
  let q: string, ans: string, topic: string, opts: string[] | undefined;
  if (i <= 7) {
    topic = 'mat_g3_carpma';
    const a = 3 + (i % 5);
    const b = 4 + (i % 4);
    q = `${a} x ${b} = ?`;
    ans = (a * b).toString();
  } else if (i <= 14) {
    topic = 'mat_g3_bolme';
    const b = 2 + (i % 3);
    const a = b * (3 + (i % 4));
    q = `${a} ÷ ${b} = ?`;
    ans = (a / b).toString();
  } else if (i <= 20) {
    topic = 'mat_g3_kesirler';
    q = 'Bir bütünün yarısı kaç parçadır?';
    ans = '2';
  } else {
    topic = 'mat_g3_geometri';
    q = 'Küpün kaç yüzü vardır?';
    ans = '6';
  }

  if (isMC) {
    const correctVal = parseInt(ans);
    opts = [ans, (correctVal + 2).toString(), (correctVal - 1).toString(), (correctVal + 5).toString()].sort();
    ans = opts.indexOf(ans).toString();
  }

  questions.push({
    id: `mat_g3_${i}`,
    topicId: topic,
    subjectKey: 'matematik',
    grade: 3,
    type: isMC ? 'multiple_choice' : 'numeric',
    question: q,
    correctAnswer: ans,
    options: opts,
    difficulty: 2,
  });
}

// Grade 4 (25q)
for (let i = 1; i <= 25; i++) {
  const isMC = i > 10;
  let q: string, ans: string, topic: string, opts: string[] | undefined;
  if (i <= 7) {
    topic = 'mat_g4_islem';
    q = '125 + 75 - 50 = ?';
    ans = '150';
  } else if (i <= 14) {
    topic = 'mat_g4_kesirler';
    q = '4/8 kesri aşağıdakilerden hangisine eşittir?';
    ans = 'Yarım';
  } else if (i <= 20) {
    topic = 'mat_g4_ondalik';
    q = '0,5 + 0,5 = ?';
    ans = '1';
  } else {
    topic = 'mat_g4_alan';
    q = 'Kenarı 5 cm olan karenin alanı kaç cm² dir?';
    ans = '25';
  }

  if (isMC) {
    opts = [ans, '10', '20', '30'];
    if (topic === 'mat_g4_kesirler') opts = ['Çeyrek', 'Yarım', 'Bütün', 'Üçte bir'];
    ans = opts.indexOf(ans).toString();
  }

  questions.push({
    id: `mat_g4_${i}`,
    topicId: topic,
    subjectKey: 'matematik',
    grade: 4,
    type: isMC ? 'multiple_choice' : 'numeric',
    question: q,
    correctAnswer: ans,
    options: opts,
    difficulty: 3,
  });
}

export default questions;
