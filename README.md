# Vercel/Netlify Clone 🌐

### Overview

This project aims to provide a simplified version of Vercel or Netlify, allowing users to submit their GitHub repository URLs for React projects along with the desired domain. The system will then hit an API server, which will spin up a Docker container from the image already uploaded to Azure Container Repository. The Docker container will clone the repository, perform npm install, and npm run build. Finally, the built files will be pushed to a storage bucket in Azure.

### How It Works

1. User Submission: Users submit their GitHub repository URLs for React projects along with the desired domain via the provided interface.
2. API Server: Upon submission, the system hits the API server with the provided information.
3. Docker Container: The API server spins up a Docker container from the image already uploaded to Azure Container Repository.
4. Cloning Repository: The Docker container clones the specified GitHub repository.
5. Building: The Docker container performs npm install and npm run build to generate the build files.
6. Storage: Finally, the built files are pushed to a storage bucket in Azure.
7. Reverse proxy server: Now when the user will hit the server with "subdomain.deployfor.me", then the reverse proxy server will serve the respective build/static files from the storage bucket.

### Architecture

<img width="1165" alt="Screenshot 2024-02-15 at 9 20 06 AM" src="https://github.com/Patel-Muhammad/vercel-clone/assets/96219910/3053d709-2c41-4667-be27-8d03d0e0794e">
