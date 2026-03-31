import { useEffect } from "react";
import { signOut } from "aws-amplify/auth";

const LogoutPage = () => {
    useEffect(() => {
        const cleanup = async () => {
            try {
                await signOut();
            } catch (_) {
                // ignore
            } finally {
                localStorage.clear();
                sessionStorage.clear();
                window.location.replace("/login");
            }
        };
        cleanup();
    }, []);

    return null;
};

export default LogoutPage;
