import HomePage from "./components/HomePage";

/**
 * Server entry — keeps metadata/layout on the server and mounts a single
 * client island for the interactive page. Theme lives on <html class="dark">
 * so static markup can still theme via CSS without prop drilling.
 */
export default function Page() {
  return <HomePage />;
}
