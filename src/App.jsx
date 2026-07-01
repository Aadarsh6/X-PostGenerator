import { RouterProvider } from "react-router-dom";
import useLenis from "./utils/lenis";

function App({ router }) {
  useLenis();

  return <RouterProvider router={router} />;
}

export default App;