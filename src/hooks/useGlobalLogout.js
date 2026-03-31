import {useEffect} from "react";
import {getCurrentUser} from "aws-amplify/auth";

/**
 * Custom Hook to listen for global logout events across different tabs/subdomains.
 */
export const useGlobalLogout = () => {
    useEffect(() => {
        const checkAuthStatus = async () => {
            try {
                await getCurrentUser();
            } catch (err) {
                console.warn("Global logout detected! Redirecting...");
                localStorage.clear();
                sessionStorage.clear();
                window.location.href = "/auth";
            }
        };

        window.addEventListener("focus", checkAuthStatus);
        
        const handleStorageChange = (e) => {
            if (e.key === "logout-event") {
                window.location.reload();
            }
        };
        window.addEventListener('storage', handleStorageChange);

        const interval = setInterval(checkAuthStatus, 10000);

        return () => {
            window.removeEventListener("focus", checkAuthStatus);
            window.removeEventListener("storage", handleStorageChange);
            clearInterval(interval);
        };
    }, []);
};
