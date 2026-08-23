import { Navigate, Route, Routes, useLocation } from "react-router-dom";
import { useApp } from "./context/AppContext";
import { AppLayout } from "./layouts/AppLayout";
import {
  About,
  Contact,
  Faq,
  Home,
  Login,
  Register,
} from "./pages/PublicPages";
import {
  Knowledge,
  KnowledgeDetail,
  Learn,
  Lesson,
  Module,
} from "./pages/LearningPages";
import {
  Coding,
  CodingDetail,
  Practice,
  PracticeSession,
  ProjectDetail,
  Projects,
  Quiz,
  Quizzes,
} from "./pages/ActivityPages";
import {
  Achievements,
  Bookmarks,
  Dashboard,
  Profile,
  Progress,
  SearchPage,
  Settings,
} from "./pages/AccountPages";
import {
  BossBattles,
  InterviewMode,
  Missions,
  Onboarding,
  Playground,
  Revision,
} from "./pages/LearningModesPages";
function Protected() {
  const { state, authReady } = useApp(),
    loc = useLocation();
  if (!authReady)
    return (
      <main className="grid min-h-screen place-items-center">
        <p className="text-sm text-slate-500">Loading your PythonPro account…</p>
      </main>
    );
  return state.user ? (
    <AppLayout />
  ) : (
    <Navigate to="/login" state={{ from: loc }} replace />
  );
}
const NotFound = () => (
  <main className="grid min-h-screen place-items-center text-center">
    <div>
      <p className="text-7xl font-black text-indigo-600">404</p>
      <h1 className="mt-3 text-2xl font-bold">Page not found</h1>
      <a className="btn-primary mt-5" href="/">
        Return home
      </a>
    </div>
  </main>
);
export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/about" element={<About />} />
      <Route path="/faq" element={<Faq />} />
      <Route path="/contact" element={<Contact />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route element={<Protected />}>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/onboarding" element={<Onboarding />} />
        <Route path="/learn" element={<Learn />} />
        <Route path="/learn/:module" element={<Module />} />
        <Route path="/learn/:module/:id" element={<Lesson />} />
        <Route path="/missions" element={<Missions />} />
        <Route path="/boss-battles" element={<BossBattles />} />
        <Route path="/revision" element={<Revision />} />
        <Route path="/playground" element={<Playground />} />
        <Route path="/interview" element={<InterviewMode />} />
        <Route path="/practice" element={<Practice />} />
        <Route path="/practice/:topic" element={<PracticeSession />} />
        <Route path="/coding" element={<Coding />} />
        <Route path="/coding/:id" element={<CodingDetail />} />
        <Route path="/quizzes" element={<Quizzes />} />
        <Route path="/quizzes/:id" element={<Quiz />} />
        <Route path="/projects" element={<Projects />} />
        <Route path="/projects/:id" element={<ProjectDetail />} />
        <Route path="/knowledge" element={<Knowledge />} />
        <Route path="/knowledge/:topic" element={<KnowledgeDetail />} />
        <Route path="/progress" element={<Progress />} />
        <Route path="/achievements" element={<Achievements />} />
        <Route path="/bookmarks" element={<Bookmarks />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="/search" element={<SearchPage />} />
      </Route>
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}
