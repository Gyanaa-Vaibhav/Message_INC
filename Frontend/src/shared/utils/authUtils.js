export async function verifyOrRefreshToken(fetchUrl) {
    const accessToken = localStorage.getItem('accessToken');

    // Initial API call
    let response = await fetch(fetchUrl, {
        headers: {
            Authorization: `Bearer ${accessToken || ''}`,
        },
    });

    // If the token is invalid or expired
    if (!response.ok) {
        console.log('Token expired or unauthorized. Refreshing token...');

        // Attempt to refresh the token
        // TODO CHANGE BACK THE REFRESH TOKEN'S URL
        const refreshResponse = await fetch('http://62.72.59.39:6969/refreshToken', {
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
