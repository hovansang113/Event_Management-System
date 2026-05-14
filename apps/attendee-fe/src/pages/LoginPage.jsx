import { LoginForm } from "../../../../packages/shared-ui/src";
import { useNavigate } from "react-router-dom";

export default function LoginPage() {
    const navigate = useNavigate();
    return (
        <LoginForm role="attendee" onSuccess={() => navigate("/home")}/>
    )
}