import { LoginForm } from "@/components/LoginForm";
import { getHomepage } from "@/lib/api";

export default async function LoginPage() {
  try {
    const data = await getHomepage();
    return <LoginForm data={data} />;
  } catch {
    return <LoginForm data={null} />;
  }
}
