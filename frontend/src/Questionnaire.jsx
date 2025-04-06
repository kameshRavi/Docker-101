import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
const API_URL = import.meta.env.VITE_API_URL;

const difficultyClass = (difficulty) => {
  switch (difficulty) {
    case 'easy':
      return 'text-green-600';
    case 'medium':
      return 'text-yellow-600';
    case 'hard':
      return 'text-red-600';
    default:
      return '';
  }
}
export default function Questionnaire() {
  const user = JSON.parse(localStorage.getItem('user'));
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState({});
  const [score, setScore] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate('/');
    }
    fetch(`${API_URL}/api/questions`, {
      headers: {
        'x-user-email': user.email
      }
    })
      .then(res => res.json())
      .then(setQuestions);
  }, []);

  const handleSubmit = async () => {
    const res = await fetch(`${API_URL}/api/submit`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'x-user-email': user.email },
      body: JSON.stringify({ answers })
    });
    const data = await res.json();
    setScore(data);
  };


  if (score) {
    return (
      <div className="p-4 text-center">
        <h1 className="text-3xl font-bold mb-4">{`Hey ${user.userName} Thank you for completing the questionnaire!`}</h1>
        <h2 className="text-2xl font-bold">Score: {score.score} / {score.total}</h2>
        <div className="flex gap-2 justify-center text-center mt-4">
        <button
          className="bg-red-200 px-4 py-2 rounded"
          onClick={() => {
            localStorage.removeItem('user');
            navigate('/');
          }}
        >
          Logout
        </button>
        <button
          className="bg-amber-400 px-4 py-2 rounded"
          onClick={() => {
            setScore(null);
            setAnswers({});
          }}
        >
          Try again
        </button>
      </div>
      </div>
    );
  }

  return (
    <div className="p-4">
      <h1 className="text-3xl font-bold mb-4">{`Hello ${user.userName}, please answer the following questions:`}</h1>
      {questions.map(q => (
        <div key={q.id} className="mb-4">
          <p className="font-semibold">{q.question}</p>
          <p className='text-sm'>Difficulty: <span className={`capitalize ${difficultyClass(q.difficulty)}`}>{q.difficulty}</span></p>
          {q.options.map(opt => (
            <label key={opt} className="block">
              <input
                type="radio"
                name={q.id}
                value={opt}
                checked={answers[q.id] === opt}
                onChange={() => setAnswers({ ...answers, [q.id]: opt })}
              />
              {' '}{opt}
            </label>
          ))}
        </div>
      ))}
      <button onClick={handleSubmit} className="bg-purple-600 text-white px-4 py-2 rounded">Submit</button>
    </div>
  );
}