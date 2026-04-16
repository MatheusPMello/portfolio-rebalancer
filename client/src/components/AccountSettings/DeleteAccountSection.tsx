import userService from "../../services/userService";
import { getUser } from "../../services/authService";
import { useState } from "react";

export const useDeletAccount = () => {
    const [password, setPassword] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleDelete = async () => {
        if (!password) {
            setError("Password is required.");
            return;
        }

        try {
            setIsLoading(true);
            setError(null);

            await userService.deleteAccount(password);
        } catch (err) {
            setError("Error deleting account. Please try again.");
        } finally {
            setIsLoading(false);
        }
    }

    <div>
        <h3>Delete Account</h3>
        <p>Are you sure you want to delete your account?</p>
        <input type="password" placeholder="Password"></input>
        <button onClick={deleteAccount}>Delete Account</button>
    </div>