export async function getUser(){
    const url = import.meta.env.VITE_SERVER_IP ? import.meta.env.VITE_SERVER_IP+'/current_user' : '/current_user';

    try {
        const response = await fetch(url, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
            },
        });

        if (response.ok) {
            const data = await response.json();
            return data.username; // Return the username directly
        } else {
            console.error("Failed to fetch user:", response.statusText);
            window.location.pathname = "/login";
            return null; // Return null if fetch fails
        }
    } catch (error) {
        console.error("Error fetching user:", error);
        return null; // Return null on error
    }
}