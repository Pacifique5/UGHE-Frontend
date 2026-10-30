import { HomePage } from "@/components/HomePage";
import { getHomepage } from "@/lib/api";

export default async function Page() {
  try {
    const data = await getHomepage();
    return <HomePage data={data} />;
  } catch (error) {
    const message = error instanceof Error ? error.message : "The content API is not reachable.";
    return (
      <main className="empty-state">
        <h1>UGHE Test Web App</h1>
        <p>{message}</p>
      </main>
    );
  }
}
