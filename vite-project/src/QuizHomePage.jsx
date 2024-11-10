import { useNavigate } from 'react-router-dom'; // Import useNavigate
import React, { useState, useEffect } from 'react';
import './App.css'// Import styles for styling
import LoginPage from './Login'; 
const questions = [
    {
        question: "1 : What is the capital of France?",
        options: ["Berlin", "Madrid", "Paris", "Lisbon"],
        answer: "Paris"
    },
    {
        question: "2 : Which planet is known as the Red Planet?",
        options: ["Earth", "Mars", "Jupiter", "Saturn"],
        answer: "Mars"
    },
    {
        question: "3 : Who wrote 'Hamlet'?",
        options: ["Charles Dickens", "Mark Twain", "William Shakespeare", "J.K. Rowling"],
        answer: "William Shakespeare"
    }
    // Add more questions as needed
];

function QuizHomePage() {
    const [startQuiz, setStartQuiz] = useState(false);
    const navigate = useNavigate(); // Correctly defined here

    // useEffect(() => {
    //     const token = sessionStorage.getItem('token');
    //     if (!token) {
    //         alert("Please log in to start the quiz.");
    //         navigate('/login'); // Redirect to login if not authenticated
    //     }
    // }, [navigate]);

    const handleStartQuiz = () => {
        const token = sessionStorage.getItem('token'); // Check for token
        if (!token) {
            alert("Please log in to start the quiz."); // Alert if not logged in
            navigate('/login'); // Redirect to login
            return; // Exit the function
        }
        setStartQuiz(true); // Start the quiz only if logged in
    };

    const handleLogin = () => {
        navigate('/login'); // Navigate to login page
    };

    const handleRegister = () => {
        navigate('/register'); // Navigate to register page
    };

    return (
        <div className="quiz-container">
            {!startQuiz ? (
                 <>
                      <div id='btncon'>
                         <button onClick={handleLogin} id='btn'>Login</button>
                         <button onClick={handleRegister} id='btn2'>Register</button>
                    </div> 

                    <header className="quiz-header">
                        <h1>Welcome to the Quiz Challenge!</h1>
                        
                    </header>
                    <section className="quiz-instructions">
                        <h2>Instructions</h2>
                        <ul>
                            <li>This quiz consists of {questions.length} questions.</li>
                            <li>You have 15 minutes to complete the quiz.</li>
                            <li>Each question has 4 options, but only one is correct.</li>
                            <li>For each correct answer, you earn 10 points.</li>
                            <li>No negative marking for incorrect answers.</li>
                        </ul>
                    </section>
                    <button className="start-button" onClick={handleStartQuiz}>
                        Start Quiz
                    </button>
                </>
            ) : (
                <Quiz questions={questions} />
            )}
        </div>
    );
}

function Quiz({ questions }) {
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [score, setScore] = useState(0);

    const handleAnswer = (selectedOption) => {
        if (selectedOption === questions[currentQuestionIndex].answer) {
            setScore(score + 10);
        }
        const nextQuestion = currentQuestionIndex + 1;
        if (nextQuestion < questions.length) {
            setCurrentQuestionIndex(nextQuestion);
        } else {
            alert(`Quiz finished! Your final score is: ${score + (selectedOption === questions[currentQuestionIndex].answer ? 10 : 0)}`);
            // Optionally reset the quiz or redirect to a different page
            setCurrentQuestionIndex(0); // Reset index for the next attempt
            setScore(0); // Reset score for the next attempt
        }
    };

    const handlePrevious = () => {
        if (currentQuestionIndex > 0) {
            setCurrentQuestionIndex(currentQuestionIndex - 1);
        }
    };

    return (
        <div className="quiz">
            <h2>{questions[currentQuestionIndex].question}</h2>
            <ul>
                {questions[currentQuestionIndex].options.map((option, index) => (
                    <li key={index} onClick={() => handleAnswer(option)}>{option}</li>
                ))}
            </ul>
            <div className="navigation-buttons">
                <button onClick={handlePrevious} disabled={currentQuestionIndex === 0}>Previous</button>
                <button onClick={() => handleAnswer("")}>Next</button>
            </div>
        </div>
    );
}

export default QuizHomePage;


// import React, { useState, useEffect } from 'react';
// import { useNavigate } from 'react-router-dom';

// const QuizPage = () => {
//     const [isLoggedIn, setIsLoggedIn] = useState(false);
//     const navigate = useNavigate();

//     useEffect(() => {
//         // Check if the user is logged in (e.g., check session or token)
//         const token = sessionStorage.getItem('token');
//         if (!token) {
//             navigate('/login'); // Redirect to login if not authenticated
//         } else {
//             setIsLoggedIn(true);
//         }
//     }, [navigate]);

//     return (
//         <div>
//             {isLoggedIn ? (
//                 <h1>Welcome to the Quiz</h1>
//             ) : (
//                 <h1>Please log in to access the quiz.</h1>
//             )}
//         </div>
//     );
// };

// export default QuizPage;
