// app/api/upload-image/route.js
import formidable from 'formidable';

export const config = {
  api: {
    bodyParser: false, // Disable the default body parser to handle file uploads
  },
};

export async function POST(req) {
  const form = new formidable.IncomingForm();

  return new Promise((resolve, reject) => {
    form.parse(req, (err, fields, files) => {
      if (err) {
        return resolve(new Response('Failed to upload file', { status: 500 }));
      }

      const uploadedFile = files.file[0];
      console.log(uploadedFile); // Process the file, e.g., save it to the server or cloud storage

      return resolve(new Response(JSON.stringify({ message: 'File uploaded successfully!' }), { status: 200 }));
    });
  });
}
