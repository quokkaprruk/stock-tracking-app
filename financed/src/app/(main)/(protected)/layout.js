import RouteGuard from "@/components/routeGuard";
export default function Layout({ children }) {
  return <RouteGuard>{children}</RouteGuard>;
}
