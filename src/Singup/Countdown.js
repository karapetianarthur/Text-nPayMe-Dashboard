import React from 'react';
import Countdown from "react-countdown";

const Completionist = () => <button className={"send-again"} onClick={(event => {
    event.preventDefault();
})}>Send again</button>;

// Renderer callback with condition
const renderer = ({ hours, minutes, seconds, completed }) => {
    if (completed) {
        // Render a complete state
        return <Completionist />;
    } else {
        return (
            <span>
                {minutes > 9 ? minutes : `0${minutes}`}:{seconds > 9 ? seconds : `0${seconds}` }
            </span>
        );
    }
};

const CountDown = () => {
    return (
        <Countdown date={Date.now() + 120000} renderer={renderer} />
    )
}

export default React.memo(CountDown)
