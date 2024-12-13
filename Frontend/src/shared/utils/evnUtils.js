/**
 * Fetches the value of an environment variable by key.
 * @param {string} key - The key of the environment variable (e.g., 'VITE_API_URL').
 * @param {any} defaultValue - The default value to use if the environment variable is not defined.
 * @returns {string} - The value of the environment variable or the default value.
 */

const getEnvVariable = (key, defaultValue = undefined) => {
    const value = import.meta.env[key];

    if (value === undefined) {
        if (defaultValue !== undefined) {
            console.warn(`Environment variable ${key} is not defined. Using default value: ${defaultValue}`);
            return defaultValue;
        } else {
            throw new Error(`Environment variable ${key} is not defined and no default value was provided.`);
        }
    }

    return value;
};

export default getEnvVariable;
