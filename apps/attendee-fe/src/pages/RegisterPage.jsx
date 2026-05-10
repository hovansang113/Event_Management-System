import { RegisterForm } from "../../../../packages/shared-ui/src";
import { useNavigate } from "react-router-dom";

export default function RegisterPage() {
    const navigate = useNavigate();
    return (
        <RegisterForm role="attendee" onSuccess={() => navigate("/login")}/>
    )
}