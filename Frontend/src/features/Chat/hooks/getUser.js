import {useEffect, useState} from "react";

export async function getUser(){
    try {
        // TODO CHANGED TO /current_user
        const response = await fetch("/current_user", {
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