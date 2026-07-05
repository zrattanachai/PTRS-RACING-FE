import ReconnectingWebSocket from 'reconnecting-websocket';

// const createWebSocket = (url, onMessage, onError, onClose) => {
const createWebSocket = (url, onMessage, onError) => {
  const rws = new ReconnectingWebSocket(url);

  rws.onopen = () => {
    console.log('WebSocket connected:', url);
  };

  rws.onclose = () => {
    console.log('WebSocket disconnected:', url);
    // if (onClose) onClose(url);  // Call onClose when the WebSocket disconnects
  };

  rws.onerror = (error) => {
    console.error('WebSocket error:', error);
    if (onError) onError(error);
  };

  rws.onmessage = (message) => {
    if (onMessage) onMessage(message);
  };

  return rws;
};

// const manageWebSocketConnections = (urls, onMessage, onError, onClose) => {
const manageWebSocketConnections = (urls, onMessage, onError) => {
  const connections = urls.map((url) =>
    // createWebSocket(url, (message) => onMessage(url, message), onError, onClose)
    createWebSocket(url, (message) => onMessage(url, message), onError)
  );

  return () => {
    connections.forEach((conn) => conn.close());
  };
};

export { createWebSocket, manageWebSocketConnections };
