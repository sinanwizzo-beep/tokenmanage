import React, { createContext, useContext, useState } from 'react';

const QueueContext = createContext();

export const useQueue = () => useContext(QueueContext);

export const QueueProvider = ({ children }) => {
  const [queue, setQueue] = useState([]);
  const [ticketCount, setTicketCount] = useState(1000); 
  
  // Counters state (3 counters)
  const [counters, setCounters] = useState([
    { id: 1, name: 'Counter 1', agentName: 'Sarah M.', currentToken: null, status: 'Idle', timer: 0, pausedDuration: 0, lastStartedAt: null },
    { id: 2, name: 'Counter 2', agentName: 'James K.', currentToken: null, status: 'Idle', timer: 0, pausedDuration: 0, lastStartedAt: null },
    { id: 3, name: 'Counter 3', agentName: 'Priya R.', currentToken: null, status: 'Idle', timer: 0, pausedDuration: 0, lastStartedAt: null },
  ]);

  // Toast state
  const [toasts, setToasts] = useState([]);

  const addToast = (title, message, type = 'info', duration = 3000) => {
    const id = Date.now().toString();
    setToasts(prev => [...prev, { id, title, message, type, duration }]);
  };

  const removeToast = (id) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  // 1. Generate Token (Kiosk)
  const generateToken = (reasonCode, reasonName) => {
    const newCount = ticketCount + 1;
    setTicketCount(newCount);
    
    const tokenNumber = `${reasonCode}-${newCount}`;
    const newToken = {
      id: tokenNumber,
      reasonCode,
      reasonName,
      status: 'waiting', // waiting, called, active, paused, completed, skipped, noshow
      createdAt: new Date(),
      calledAt: null,
      startedAt: null,
      completedAt: null,
      counterId: null
    };
    
    setQueue((prev) => [...prev, newToken]);
    return newToken;
  };

  // 2. Call Next Token
  const callNext = (counterId) => {
    const waitingTokens = queue.filter(t => t.status === 'waiting');
    if (waitingTokens.length === 0) {
      addToast('Queue Empty', 'There are no waiting tokens.', 'warning');
      return null;
    }
    
    waitingTokens.sort((a, b) => a.createdAt - b.createdAt);
    const tokenToCall = waitingTokens[0];

    const now = new Date();
    
    setQueue(prev => prev.map(t => 
      t.id === tokenToCall.id ? { ...t, status: 'called', calledAt: now, counterId } : t
    ));

    setCounters(prev => prev.map(c => 
      c.id === counterId ? { 
        ...c, 
        currentToken: { ...tokenToCall, status: 'called', calledAt: now, counterId }, 
        status: 'Called',
        timer: 0,
        pausedDuration: 0,
        lastStartedAt: null
      } : c
    ));

    addToast('Token Called', `Token ${tokenToCall.id} assigned to Counter ${counterId}`, 'success');
    return tokenToCall;
  };

  // 3. Start Session
  const startConsultation = (counterId) => {
    const counter = counters.find(c => c.id === counterId);
    if (!counter || !counter.currentToken) return;
    
    const now = new Date();
    setQueue(prev => prev.map(t => 
      t.id === counter.currentToken.id ? { ...t, status: 'active', startedAt: now } : t
    ));
    
    setCounters(prev => prev.map(c => 
      c.id === counterId ? { 
        ...c, 
        currentToken: { ...c.currentToken, status: 'active', startedAt: now }, 
        status: 'Serving',
        lastStartedAt: now
      } : c
    ));
    addToast('Session Started', `Serving ${counter.currentToken.id}`, 'info');
  };

  // 4. Pause Session
  const pauseConsultation = (counterId) => {
    const counter = counters.find(c => c.id === counterId);
    if (!counter || !counter.currentToken || counter.status !== 'Serving') return;
    
    const now = new Date();
    // Calculate how long it was active since last start
    const sessionDuration = Math.floor((now - counter.lastStartedAt) / 1000);
    
    setQueue(prev => prev.map(t => 
      t.id === counter.currentToken.id ? { ...t, status: 'paused' } : t
    ));
    
    setCounters(prev => prev.map(c => 
      c.id === counterId ? { 
        ...c, 
        currentToken: { ...c.currentToken, status: 'paused' }, 
        status: 'Paused',
        timer: c.timer + sessionDuration,
        lastStartedAt: null
      } : c
    ));
    addToast('Session Paused', `Token ${counter.currentToken.id} is paused.`, 'warning');
  };

  // 5. Resume Session
  const resumeConsultation = (counterId) => {
    const counter = counters.find(c => c.id === counterId);
    if (!counter || !counter.currentToken || counter.status !== 'Paused') return;
    
    const now = new Date();
    setQueue(prev => prev.map(t => 
      t.id === counter.currentToken.id ? { ...t, status: 'active' } : t
    ));
    
    setCounters(prev => prev.map(c => 
      c.id === counterId ? { 
        ...c, 
        currentToken: { ...c.currentToken, status: 'active' }, 
        status: 'Serving',
        lastStartedAt: now
      } : c
    ));
    addToast('Session Resumed', `Serving ${counter.currentToken.id}`, 'info');
  };

  // 6. Complete Session
  const completeConsultation = (counterId) => {
    const counter = counters.find(c => c.id === counterId);
    if (!counter || !counter.currentToken) return;
    
    const now = new Date();
    setQueue(prev => prev.map(t => 
      t.id === counter.currentToken.id ? { ...t, status: 'completed', completedAt: now } : t
    ));
    
    setCounters(prev => prev.map(c => 
      c.id === counterId ? { 
        ...c, 
        currentToken: null, 
        status: 'Idle',
        timer: 0,
        pausedDuration: 0,
        lastStartedAt: null
      } : c
    ));
    addToast('Session Completed', `Token ${counter.currentToken.id} completed.`, 'success');
  };

  // 7. Skip Token
  const skipToken = (counterId) => {
    const counter = counters.find(c => c.id === counterId);
    if (!counter || !counter.currentToken) return;
    
    setQueue(prev => prev.map(t => 
      t.id === counter.currentToken.id ? { ...t, status: 'skipped' } : t
    ));
    
    setCounters(prev => prev.map(c => 
      c.id === counterId ? { 
        ...c, 
        currentToken: null, 
        status: 'Idle',
        timer: 0,
        pausedDuration: 0,
        lastStartedAt: null
      } : c
    ));
    addToast('Token Skipped', `Token ${counter.currentToken.id} was skipped.`, 'info');
  };

  // 8. Recall Skipped Token
  const recallToken = (counterId, tokenId) => {
    const tokenToRecall = queue.find(t => t.id === tokenId);
    const counter = counters.find(c => c.id === counterId);
    if (!tokenToRecall || counter.currentToken) {
      addToast('Cannot Recall', 'Counter must be idle to recall a token.', 'error');
      return;
    }
    
    const now = new Date();
    setQueue(prev => prev.map(t => 
      t.id === tokenId ? { ...t, status: 'called', calledAt: now, counterId } : t
    ));

    setCounters(prev => prev.map(c => 
      c.id === counterId ? { 
        ...c, 
        currentToken: { ...tokenToRecall, status: 'called', calledAt: now, counterId }, 
        status: 'Called',
        timer: 0,
        pausedDuration: 0,
        lastStartedAt: null
      } : c
    ));
    addToast('Token Recalled', `Token ${tokenId} assigned to Counter ${counterId}`, 'success');
  };

  // 9. Mark No Show
  const markNoShow = (counterId) => {
    const counter = counters.find(c => c.id === counterId);
    if (!counter || !counter.currentToken) return;
    
    setQueue(prev => prev.map(t => 
      t.id === counter.currentToken.id ? { ...t, status: 'noshow' } : t
    ));
    
    setCounters(prev => prev.map(c => 
      c.id === counterId ? { 
        ...c, 
        currentToken: null, 
        status: 'Idle',
        timer: 0,
        pausedDuration: 0,
        lastStartedAt: null
      } : c
    ));
    addToast('No Show', `Token ${counter.currentToken.id} marked as No Show.`, 'error');
  };

  return (
    <QueueContext.Provider value={{ 
      queue, 
      counters,
      toasts,
      generateToken,
      callNext,
      startConsultation,
      pauseConsultation,
      resumeConsultation,
      completeConsultation,
      skipToken,
      recallToken,
      markNoShow,
      addToast,
      removeToast
    }}>
      {children}
    </QueueContext.Provider>
  );
};
