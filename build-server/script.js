const { exec } = require("child_process");
const path = require("path");
const fs = require('fs');
const { BlobServiceClient } = require('@azure/storage-blob');
const mimeTypes = require('mime-types');


const projectid = process.env.projectid
const connectionString = process.env.cstring;


const init = async () => {
    console.log("  ================== npm install && npm run build ================== ");


    const outputDirPath = path.join(__dirname, `output/${projectid}`);

    const process = exec(`cd ${outputDirPath} && npm install && npm run build`);

    process.stdout.on("data", (data) => {
        console.log(data.toString());
    });

    process.on("exit", async () => {
        console.log(" ================ Build completed successfully! ================");
        const distOrBuildFolderPath = path.join(__dirname, `output/${projectid}/build`);

        console.log("  ================ Uploading files to Azure Blob Storage... ================");
        await copyFinalDist(projectid);

        console.log("Done");
        
    });
}

const getAllFiles = (folderPath) => {
    let allFiles = [];


    const allFilesAndFolders = fs.readdirSync(folderPath);

    allFilesAndFolders.forEach((file) => {
        const fullFilePath = path.join(folderPath, file);
        if (fs.statSync(fullFilePath).isDirectory()) {
            allFiles = allFiles.concat(getAllFiles(fullFilePath));
        } else {
            allFiles.push(fullFilePath);
        }
    });
    return allFiles;
};


const uploadFile = async (fileName, localFilePath) => {
    
    const blobServiceClient = BlobServiceClient.fromConnectionString(
        connectionString
    );
    
    const containerClient = blobServiceClient.getContainerClient("vercel");
    const blockBlobClient = containerClient.getBlockBlobClient(fileName);
    const contentType = mimeTypes.lookup(localFilePath);
    const options = contentType ? { blobHTTPHeaders: { blobContentType: contentType } } : undefined;
    const fileContent = fs.readFileSync(localFilePath);
    const uploadBlobResponse = await blockBlobClient.upload(fileContent, fileContent.length, options);
}

const copyFinalDist = async (id) => {
    const buildPath = path.join(__dirname, `output/${id}/build`);
    const distPath = path.join(__dirname, `output/${id}/dist`);
    let folderPath;

    if (fs.existsSync(buildPath)) {
        folderPath = buildPath;
    } else if (fs.existsSync(distPath)) {
        folderPath = distPath;
    }
    const allFiles = getAllFiles(folderPath);
    await Promise.all(allFiles.map(async (file) => {
        await uploadFile(`dist/${id}/` + file.slice(folderPath.length + 1), file);
    }));
    
    console.log("All files uploaded successfully");
};



init();
