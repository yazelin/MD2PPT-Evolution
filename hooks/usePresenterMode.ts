/**
 * MD2PPT-Evolution
 * Copyright (c) 2026 EricHuang
 * Licensed under the MIT License.
 */

import { useCallback, useRef } from 'react';
import { PresentationSyncService } from '../services/PresentationSyncService';

/**
 * 檢查是否在 iframe 中運行
 */
const isInIframe = (): boolean => {
  try {
    return window.self !== window.top;
  } catch (e) {
    // 如果存取 window.top 失敗（跨域），則確定在 iframe 中
    return true;
  }
};

export const usePresenterMode = () => {
  const syncServiceRef = useRef<PresentationSyncService | null>(null);

  const startPresentation = useCallback(() => {
    const baseUrl = window.location.href.split('#')[0];

    // 如果在 iframe 中，在新視窗開啟完整編輯器讓用戶操作 Present
    if (isInIframe()) {
      // 內容已存在 localStorage (draft_content)，新視窗會自動載入
      const newWindow = window.open(baseUrl, '_blank', 'width=1400,height=900,menubar=no,toolbar=no');
      if (newWindow) {
        // 通知用戶在新視窗操作
        console.log('[MD2PPT] 在 iframe 中偵測到，已在新視窗開啟。請在新視窗中使用 Present 功能。');
      }
      return;
    }

    // 正常模式：在獨立視窗中運行
    // 1. Initialize Sync Service
    if (!syncServiceRef.current) {
        syncServiceRef.current = new PresentationSyncService();
    }

    // 2. Determine the URL for the audience view
    const audienceUrl = `${baseUrl}#/audience`;

    // 3. Open the new window
    window.open(audienceUrl, 'AudienceWindow', 'width=1280,height=720,menubar=no,toolbar=no');

    // 4. Navigate the CURRENT window to /presenter
    window.location.hash = '#/presenter';
  }, []);

  return {
    startPresentation
  };
};
