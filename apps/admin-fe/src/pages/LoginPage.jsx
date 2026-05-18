import { LoginForm } from "@eventnextday/shared-ui";
import { useNavigate } from "react-router-dom";

export default function LoginPage() {
    const navigate = useNavigate();
    return (
        <LoginForm role="admin" showRegisterLink={false} onSuccess={() => navigate("/admin/dashboard")}/>
    )
}