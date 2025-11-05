// Update logic for multer middleware to store files in memory instead of local disk storage
import multer from "multer";

// No local file storage — store file in memory (RAM)
const storage = multer.memoryStorage();

export const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, 
});


// import fs from 'fs'
// import multer from 'multer'
// import path from 'path'

// // Ensure the destination folder exists to avoid error
// const tempDir = path.resolve('./public/temp')
// if (!fs.existsSync(tempDir)) {
//   fs.mkdirSync(tempDir, { recursive: true })
// }

// const storage = multer.diskStorage({
//   destination: function (req, file, cb) {
//     cb(null, tempDir) // Absolute path to the temp folder
//   },
//   filename: function (req, file, cb) {
//           cb(null, file.originalname)
//   }
// })

// // Export helper to upload array of files with field name param
// export const uploadArray = (fieldName, maxCount = 20) => multer({ storage }).array(fieldName, maxCount)

// // Also export a single file upload helper if needed
// export const uploadSingle = (fieldName) => multer({ storage }).single(fieldName)


// updated
// import multer from "multer";

// const storage = multer.diskStorage({
//     destination: function (req, file, cb) {
//       cb(null, "./public/temp")
//     },
//     filename: function (req, file, cb) {
      
//       cb(null, file.originalname)
//     }
//   })
  
// export const upload = multer({ 
//     storage,
// })

