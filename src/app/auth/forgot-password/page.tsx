import { ForgotPasswordForm } from "@/components/forms/forgot-password-form";
import { AuthCard } from "@/components/ui/auth-card";

export default function ForgotPasswordPage() {
  return (
    <AuthCard
      title="Forgot password"
      description="Enter your email and we'll send you a password reset link"
      footer={
        <p className="text-center text-sm text-gray-600">
          Remember your password?{" "}
          <a href="/auth/login" className="font-semibold text-blue-600 hover:underline">
            Back to login
          </a>
        </p>
      }
    >
      <ForgotPasswordForm />
    </AuthCard>
  );
}