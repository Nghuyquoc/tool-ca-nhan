import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AppLayout } from './layouts/AppLayout';
import { DashboardPage } from './pages/DashboardPage';
import { NotesPage } from './pages/NotesPage';
import { TodoPage } from './pages/TodoPage';
import { AlarmPage } from './pages/AlarmPage';
import { CalendarPage } from './pages/CalendarPage';
import { NewsPage } from './pages/NewsPage';
import { SavedPage } from './pages/SavedPage';
import { SettingsPage } from './pages/SettingsPage';

export function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<AppLayout />}>
          <Route index element={<DashboardPage />} />
          <Route path="notes" element={<NotesPage />} />
          <Route path="todo" element={<TodoPage />} />
          <Route path="alarm" element={<AlarmPage />} />
          <Route path="calendar" element={<CalendarPage />} />
          <Route path="news" element={<NewsPage />} />
          <Route path="saved" element={<SavedPage />} />
          <Route path="settings" element={<SettingsPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
