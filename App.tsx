/**
 * BookPublisher MD2Docx
 * Copyright (c) 2025 EricHuang
 * Licensed under the MIT License.
 * See LICENSE file in the project root for full license information.
 */

import React, { useState, useEffect } from 'react';
import MarkdownEditor from './components/MarkdownEditor';
import { AudienceView } from './components/presenter/AudienceView';
import { PresenterPage } from './components/presenter/PresenterPage';
import { MobileRemote } from './components/presenter/MobileRemote';

const App: React.FC = () => {
  const [route, setRoute] = useState(window.location.hash);

  useEffect(() => {
    const handleHashChange = () => setRoute(window.location.hash);
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  // Handle Hash Parameters (e.g. #/remote?peer=...)
  const currentPath = route.split('?')[0];

  if (currentPath === '#/audience') {
    return <AudienceView slides={[]} currentIndex={0} />;
  }

  if (currentPath === '#/presenter') {
    return <PresenterPage />;
  }

  if (currentPath === '#/remote') {
    return <MobileRemote />;
  }

  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-grow">
        <MarkdownEditor />
      </main>
    </div>
  );
};

export default App;
