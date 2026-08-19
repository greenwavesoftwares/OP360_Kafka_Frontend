/**
 * Returns the expiration time of a JWT token in milliseconds, or null if the token is invalid.
 * @param {string} token - The JWT token to check.
 * @returns {number} The expiration time in milliseconds, or null if the token is invalid.
 */
const getTokenExpirationTime = (token) => {
  if (!token) return null;
  const payload = JSON.parse(atob(token.split(".")[1])); // Decode JWT payload
  return payload.exp * 1000; // Expiration time in milliseconds
};

/**
 * Checks if the token has expired or is about to expire i.e before 2 minutes.
 * @returns {boolean} true if the token has expired or is about to expire (less than 2 minutes remaining), false otherwise
 */
const hastokenExpired = () => {
  const token = localStorage.getItem("token"); // Or from any other storage you're using for the token
  const expirationTime = getTokenExpirationTime(token);

  if (expirationTime) {
    const currentTime = Date.now();
    const timeRemaining = expirationTime - currentTime;
    const hoursRemaining = Math.floor(timeRemaining / 3600000); // Divide by 3600000 to get hours
    const minutesRemaining = Math.floor((timeRemaining % 3600000) / 60000); // Remainder divided by 60000 to get minutes

    // Optionally, format it nicely
    const formattedTimeRemaining = `${hoursRemaining} hours ${minutesRemaining} minutes`;

    console.log(`Time remaining: ${formattedTimeRemaining}`);
    if(timeRemaining <= 120000)
        return true;

    return false;
  }
};

export { getTokenExpirationTime, hastokenExpired };
