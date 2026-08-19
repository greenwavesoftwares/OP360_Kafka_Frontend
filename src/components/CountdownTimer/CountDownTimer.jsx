import React, { useEffect, useState } from "react";
import { ProgressBar } from 'primereact/progressbar';
import PropTypes from "prop-types";

/**
 * A countdown timer component that counts down from the given duration.
 *
 * @param {number} duration - The duration in seconds
 * @returns {ReactElement} A div containing the remaining time in minutes and seconds
 */
export default function CountDownTimer({ duration }) {
    const [intervalRemaining, setIntervalRemaining] = useState(duration);

    useEffect(() => {
        const interval = setInterval(() => {
            setIntervalRemaining((prev) => {
                if (prev <= 0) {
                    clearInterval(interval);
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);

        return () => clearInterval(interval);
    }, []);

    const percentage = (intervalRemaining / duration) * 100; // Calculate the percentage

    const renderTime = (remainingTime) => (
        <div style={{ textAlign: "center", marginTop: "1rem" }}>
            <div className="value">
                {Math.floor(remainingTime / 60)}:
                {remainingTime % 60 < 10 ? "0" : ""}
                {remainingTime % 60}
            </div>
        </div>
    );

    return (
        <div >
            
            {intervalRemaining > 0 && renderTime(intervalRemaining)}
        </div>
    );
}
