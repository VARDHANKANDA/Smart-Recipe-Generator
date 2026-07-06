import { lazy, Suspense } from "react";
import { createBrowserRouter } from "react-router-dom";
import { AppLayout } from "./components/layout/AppLayout";
import { PageLoader } from "./components/ui/PageLoader";

const Landing = lazy(() => import("./pages/Landing"));
const Login = lazy(() => import("./pages/Login"));
const Register = lazy(() => import("./pages/Register"));
const ForgotPassword = lazy(() => import("./pages/ForgotPassword"));
const Dashboard = lazy(() => import("./pages/Dashboard"));
const Search = lazy(() => import("./pages/Search"));
const RecipeDetails = lazy(() => import("./pages/RecipeDetails"));
const Generator = lazy(() => import("./pages/Generator"));
const Pantry = lazy(() => import("./pages/Pantry"));
const MealPlanner = lazy(() => import("./pages/MealPlanner"));
const ShoppingList = lazy(() => import("./pages/ShoppingList"));
const Profile = lazy(() => import("./pages/Profile"));
const Admin = lazy(() => import("./pages/Admin"));

const withSuspense = (page: JSX.Element) => <Suspense fallback={<PageLoader />}>{page}</Suspense>;

export const router = createBrowserRouter([
  { path: "/", element: withSuspense(<Landing />) },
  { path: "/login", element: withSuspense(<Login />) },
  { path: "/register", element: withSuspense(<Register />) },
  { path: "/forgot-password", element: withSuspense(<ForgotPassword />) },
  {
    element: <AppLayout />,
    children: [
      { path: "/dashboard", element: withSuspense(<Dashboard />) },
      { path: "/search", element: withSuspense(<Search />) },
      { path: "/recipes/:id", element: withSuspense(<RecipeDetails />) },
      { path: "/generator", element: withSuspense(<Generator />) },
      { path: "/pantry", element: withSuspense(<Pantry />) },
      { path: "/planner", element: withSuspense(<MealPlanner />) },
      { path: "/shopping-list", element: withSuspense(<ShoppingList />) },
      { path: "/profile", element: withSuspense(<Profile />) },
      { path: "/admin", element: withSuspense(<Admin />) }
    ]
  }
]);

