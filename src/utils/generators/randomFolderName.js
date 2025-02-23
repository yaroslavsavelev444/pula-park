const generateRandomFolderName = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let folderName = '';
    for (let i = 0; i < 6; i++) {
      const randomIndex = Math.floor(Math.random() * chars.length);
      folderName += chars[randomIndex];
    }
    return folderName;
  };

  export { generateRandomFolderName };