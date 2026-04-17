import userService from "../../services/userService";
import { useState } from "react";

export const useDeleteAccount = () => {
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

            await userService.deleteAccount({ password });
        } catch (err) {
            setError("Error deleting account. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    return {
        password,
        setPassword,
        isLoading,
        error,
        handleDelete
    };
}

export function DeleteAccountSection() {

    const { password, setPassword, isLoading, error, handleDelete } = useDeleteAccount();

    return (
        <div className="border border-danger rounded p-3">
            <h3 className="text-danger h5 mb-3">Danger Zone</h3>
            <p className="text-muted small mb-3">Once you delete your account, there is no going back. Please be certain.</p>
            
            <div className="mb-3">
                <label className="form-label small fw-bold">Confirm Password</label>
                <input
                    type="password"
                    className={`form-control ${error ? 'is-invalid' : ''}`}
                    placeholder="Enter your password to confirm"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    disabled={isLoading}
                />
                {error && <div className="invalid-feedback">{error}</div>}
            </div>

            <button 
                className="btn btn-danger w-100" 
                onClick={handleDelete}
                disabled={isLoading}
            >
                {isLoading ? (
                    <>
                        <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                        Deleting...
                    </>
                ) : "Permanently Delete Account"}
            </button>
        </div>
    );
}