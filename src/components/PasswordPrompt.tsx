import { useState, FormEvent } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { X } from "lucide-react";

interface PasswordPromptProps {
  onSuccess: () => void;
  onCancel: () => void;
}

export const PasswordPrompt = ({
  onSuccess,
  onCancel,
}: PasswordPromptProps) => {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    // Get password from localStorage, default to "chanoly2024"
    const adminPassword =
      localStorage.getItem("adminPassword") || "chanoly2024";

    if (password === adminPassword) {
      onSuccess();
    } else {
      setError("Incorrect password. Please try again.");
      setPassword("");
    }
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[3000] flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl w-full max-w-md overflow-hidden">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-2xl font-bold text-gray-900">🔐 Admin Access</h2>
          <button
            onClick={onCancel}
            className="text-gray-500 hover:text-gray-700 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Enter Admin Password:
            </label>
            <Input
              type="password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                setError("");
              }}
              placeholder="Password required"
              autoFocus
              required
              className="bg-gray-50 text-gray-900 border-gray-300"
            />
            {error && (
              <div className="mt-2 text-sm text-red-600 text-center">
                {error}
              </div>
            )}
          </div>
          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={onCancel}
              className="flex-1 bg-gray-100 text-gray-700 hover:bg-gray-200 border-gray-300"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="flex-1 bg-green-600 hover:bg-green-700 text-white"
            >
              Access Admin
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};
