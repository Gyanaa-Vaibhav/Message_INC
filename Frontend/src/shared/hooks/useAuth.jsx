import { useState, useEffect } from 'react';
import { verifyOrRefreshToken } from "../index.js";

export const useAuthFetch = () => {
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchData() {
            const result = await verifyOrRefreshToken(`${window.location.pathname}`);
            setLoading(false);
        }

        fetchData();
    }, []);

    return {loading};
};
