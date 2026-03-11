import "./App.css";
import { Toaster } from "@/components/ui/sonner";
import { showToast } from "./lib/toast";


function App() {
  return (
    <div className="bg-background text-foreground min-h-screen flex flex-col items-center justify-center">
      <Toaster position="top-center" richColors closeButton />
      Hello World
      <a
        className="py-2 px-4 bg-primary rounded-md text-white inline-block text-sm cursor-pointer mx-2"
        onClick={() =>
          showToast.success("How are you", {
            description: "This is a toast message",
          })
        }
      >
        Show Toast
      </a>
    </div>
  );
}

export default App;
