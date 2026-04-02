import { Navigate } from "react-router";
import { authClient } from "@/lib/auth-client";

export default function ProtectedRoute({ children }: any) {
  const { data: session, isPending } = authClient.useSession();

  if (isPending) return <div>Loading...</div>;

  if (!session) {
    return <Navigate to="/login" replace />;
  }

  return children;
}
