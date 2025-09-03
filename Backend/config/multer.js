import multer from "multer";

const storage = multer.memoryStorage(); // keeps files in memory buffer
const upload = multer({ storage });

export default upload;
