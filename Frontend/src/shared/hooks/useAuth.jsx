import { useState, useEffect } from 'react';
import { verifyOrRefreshToken } from "../index.js";

export const useAuthFetch = () => {
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchData() {
            const result = await verifyOrRefreshToken(`http://62.72.59.39:6969${window.location.pathname}`);
            setLoading(false);
        }

        fetchData();
    }, []);

    return {loading};
};
