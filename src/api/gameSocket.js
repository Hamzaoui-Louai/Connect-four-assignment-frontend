const DEFAULT_SOCKET_URL = import.meta.env.VITE_GAME_SOCKET_URL || "ws://localhost:8000/ws/game";

export function createGameSocket({
  url = DEFAULT_SOCKET_URL,
  onOpen,
  onClose,
  onError,
  onMessage,
} = {}) {
  let socket = null;
  let reminderTimeout = null;

  const clearReminder = () => {
    if (reminderTimeout) {
      clearTimeout(reminderTimeout);
      reminderTimeout = null;
    }
  };

  const sendGridUpdate = ({ grid, counter, reminder = false }) => {
    if (!socket || socket.readyState !== WebSocket.OPEN) {
      return false;
    }

    const payload = {
      type: "grid_update",
      counter,
      reminder,
      grid,
    };

    socket.send(JSON.stringify(payload));
    return true;
  };

  const scheduleReminder = ({ grid, counter, delayMs = 4000, onReminderSent }) => {
    clearReminder();

    reminderTimeout = setTimeout(() => {
      const sent = sendGridUpdate({ grid, counter, reminder: true });
      if (sent && onReminderSent) {
        onReminderSent();
      }
    }, delayMs);
  };

  const connect = () => {
    if (socket && (socket.readyState === WebSocket.OPEN || socket.readyState === WebSocket.CONNECTING)) {
      return;
    }

    try {
    socket = new WebSocket(url);
    } catch (error) {
      console.error(error);
      }

    socket.onopen = () => {
      if (onOpen) {
        onOpen();
      }
    };

    socket.onclose = (event) => {
      clearReminder();
      if (onClose) {
        onClose(event);
      }
    };

    socket.onerror = (event) => {
      if (onError) {
        onError(event);
      }
    };

    socket.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        if (onMessage) {
          onMessage(data);
        }
      } catch {
        if (onError) {
          onError(new Error("Received invalid socket message payload."));
        }
      }
    };
  };

  const disconnect = () => {
    clearReminder();

    if (!socket) {
      return;
    }

    socket.onopen = null;
    socket.onclose = null;
    socket.onerror = null;
    socket.onmessage = null;

    if (socket.readyState === WebSocket.OPEN || socket.readyState === WebSocket.CONNECTING) {
      socket.close();
    }

    socket = null;
  };

  const isOpen = () => socket?.readyState === WebSocket.OPEN;

  return {
    connect,
    disconnect,
    isOpen,
    sendGridUpdate,
    scheduleReminder,
    cancelReminder: clearReminder,
  };
}
