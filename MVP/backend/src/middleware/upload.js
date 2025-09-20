import multer from 'multer';
const storage = multer.memoryStorage();
const upload = multer({ storage });
export default upload;

//provides middleware to handle file uploads using multer with in-memory storage. It checks for any files in teh req body/ res body, and then stores them in the set storage enginwe, like in-mem here. This is useful for handling file uploads in routes, such as uploading photos for a batch.
//also sets the headers like req.file, req.files etc. which can be used in the routes to access the uploaded files.