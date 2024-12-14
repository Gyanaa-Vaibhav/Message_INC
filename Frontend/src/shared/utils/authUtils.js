export async function verifyOrRefreshToken(fetchUrl) {
    const accessToken = localStorage.getItem('accessToken');
    const url = import.meta.env.VITE_SERVER_IP ? import.meta.env.VITE_SERVER_IP+fetchUrl : fetchUrl;

    // Initial API call
    let response = await fetch(url, {
        headers: {
            Authorization: `Bearer ${accessToken || ''}`,
        },
    });

    // If the token is invalid or expired
    if (!response.ok) {
        console.log('Token expired or unauthorized. Refreshing token...');
        const refreshUrl = import.meta.env.VITE_SERVER_IP ? import.meta.env.VITE_SERVER_IP+'/refreshToken' : '/refreshToken';

        // Attempt to refresh the token
        const refreshResponse = await fetch(refreshUrl, {
            method: 'POST',
            credentials: 'include',
        });

        if (refreshResponse.ok) {
            const refreshData = await refreshResponse.json();
            localStorage.setItem('accessToken', refreshData.accessToken);

            // Retry the original request with the new token
            response = await fetch(fetchUrl, {
                headers: {
                    Authorization: `Bearer ${refreshData.accessToken}`,
                },
            });
        } else {
            console.error('Failed to refresh token');
            window.location.href='/login'; // Optionally handle redirect to login
            return null;
        }
    }

    if (response.ok) {
        return accessToken;
    } else {
        console.error('Failed to fetch data even after token refresh');
        window.location.href = '/login'; // Redirect to login
        return null;
    }
}
