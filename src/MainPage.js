import React, { useState, useEffect } from 'react';

const MainPage = () => {
    // API data
    const [apiData, setApiData] = useState([]);

    // Show various screens
    const [showFirstScreen, setShowFirstScreen] = useState(true);
    const [showQuestionsScreen, setShowQuestionsScreen] = useState(false);
    const [showResultsScreen, setShowResultsScreen] = useState(false);

    // Keeps track questions and answers
    const [questionNumber, setQuestionNumber] = useState(0);
    const [userAnswers, setUserAnswers] = useState({});

    // Loading for when obtaining new questions
    const [isLoading, setIsLoading] = useState(false);

    // Checking whether to fetch data when restarting the game
    const [gameCompletedOnce, setGameCompleteOnce] = useState(false);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const response = await fetch('https://opentdb.com/api.php?amount=10&difficulty=hard&type=boolean');
            const { results } = await response.json();
            setApiData(results);
        } catch (e) {
            console.log('Error with API', e);
        }
    }

    const onClickBegin = async () => {
        // If restarting the game, fetch new data
        // Otherwise if it's the first game, start quiz
        if (gameCompletedOnce) {
            setShowFirstScreen(false);
            setIsLoading(true);
            await fetchData();
            setIsLoading(false);
            setShowQuestionsScreen(true);
        } else {
            setShowFirstScreen(false);
            setShowQuestionsScreen(true);
        }

    }

    const firstScreen = () => {
        return (
            <div>
                <h1>Welcome to the Trivia Challenge!</h1>
                <h2>You will be presented with 10 True or False questions.</h2>
                <h3>Can you score 100%?</h3>
                <button onClick={onClickBegin} className="btn">BEGIN</button>
            </div>
        )
    }

    const onClickTrue = () => {
        const answer = apiData[questionNumber].correct_answer;
        let addUserAnswer = userAnswers;

        if (answer === "True") {
            addUserAnswer[questionNumber] = "correct";
        } else {
            addUserAnswer[questionNumber] = "incorrect";
        }

        setUserAnswers(addUserAnswer);
        setQuestionNumber(questionNumber + 1)

        if (questionNumber === 9) {
            setShowQuestionsScreen(false);
            setShowResultsScreen(true);
        }
    }

    const onClickFalse = () => {
        const answer = apiData[questionNumber].correct_answer
        let addUserAnswer = userAnswers;

        if (answer === "False") {
            addUserAnswer[questionNumber] = "correct";
        } else {
            addUserAnswer[questionNumber] = "incorrect";
        }

        setUserAnswers(addUserAnswer);
        setQuestionNumber(questionNumber + 1)

        if (questionNumber === 9) {
            setShowQuestionsScreen(false);
            setShowResultsScreen(true);
        }
    }

    const questionsScreen = () => {
        return (
            <div>
                <h1>{apiData[questionNumber].category}</h1>
                <div id="question-container">
                    <span>{apiData[questionNumber].question}</span>
                </div>
                <div id="question-count">
                    <span>{questionNumber + 1} of 10</span>
                </div>
                <div id="question-buttons">
                    <button className="btn" onClick={() => onClickTrue(questionNumber)}>True</button>
                    <button className="btn" onClick={() => onClickFalse(questionNumber)}>False</button>
                </div>
            </div>
        )
    }

    const onClickPlayAgain = () => {
        setQuestionNumber(0);
        setGameCompleteOnce(true);
        setShowFirstScreen(true);
        setShowResultsScreen(false);

    }

    const resultsScreen = () => {
        let correctCount = 0;
        for (const answer in userAnswers) {
            if (userAnswers[answer] === 'correct') {
                correctCount++;
            }
        }

        return (
            <div>
                <h1>You scored</h1>
                <h2>{correctCount} / 10</h2>
                <ol>
                    {apiData.map((item, i) => {
                        return (<div>
                            <p>{item.question}</p>
                            <span style={userAnswers[i] === "correct" ? { color: 'green' } : { color: 'red' }}>{userAnswers[i]}</span>
                        </div>)
                    })}
                </ol>
                <button onClick={() => onClickPlayAgain()} className="btn">PLAY AGAIN?</button>
            </div>
        )
    }

    const renderLoading = () => {
        return (
            <div id="loading">
                <span>Loading...</span>
            </div>
        )
    }
    
    return (
        <div id="container">
            {isLoading && renderLoading()}
            {showFirstScreen && firstScreen()}
            {showQuestionsScreen && questionsScreen()}
            {showResultsScreen && resultsScreen()}
        </div>
    )
}


export default MainPage;