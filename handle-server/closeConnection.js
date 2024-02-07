function closeConnection(database) {
  setTimeout(() => {
    try {
      database.close();
    } catch {}
  }, 10000);
}
exports.closeConnection = closeConnection;
