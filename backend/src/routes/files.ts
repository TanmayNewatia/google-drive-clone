import express, { Request, Response } from "express";
import multer, { FileFilterCallback } from "multer";
import path from "path";
import fs from "fs";
import { fileDb, File } from "../db/db";

// Extend Express Request to include multer file
interface MulterRequest extends Request {
  file?: Express.Multer.File;
}

const router = express.Router();

// Multer configuration for file uploads
const storage = multer.diskStorage({
  destination: (
    req: Request,
    file: Express.Multer.File,
    cb: (error: Error | null, destination: string) => void
  ) => {
    const uploadDir = "./uploads";
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: (
    req: Request,
    file: Express.Multer.File,
    cb: (error: Error | null, filename: string) => void
  ) => {
    // Generate unique filename with timestamp
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const extension = path.extname(file.originalname);
    cb(null, `file-${uniqueSuffix}${extension}`);
  },
});

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 100 * 1024 * 1024, // 100MB limit
  },
  fileFilter: (
    req: Request,
    file: Express.Multer.File,
    cb: FileFilterCallback
  ) => {
    // Add file type validation if needed
    cb(null, true);
  },
});

// Middleware to check if user is authenticated
const requireAuth = (req: Request, res: Response, next: any) => {
  if (!req.user) {
    return res.status(401).json({ error: "Authentication required" });
  }
  next();
};

// GET /files - Get all files for authenticated user
router.get("/", requireAuth, async (req: Request, res: Response) => {
  try {
    const userId = (req.user as any).id;
    const files = await fileDb.getFilesByOwner(userId);
    res.json({ files });
  } catch (error) {
    console.error("Error fetching files:", error);
    res.status(500).json({ error: "Failed to fetch files" });
  }
});

// POST /files/upload - Upload a new file
router.post(
  "/upload",
  requireAuth,
  upload.single("file"),
  async (req: MulterRequest, res: Response) => {
    try {
      if (!req.file) {
        return res.status(400).json({ error: "No file uploaded" });
      }

      const userId = (req.user as any).id;
      const currentTime = new Date().toISOString();

      const fileData: Omit<File, "id"> = {
        filename: req.file.filename,
        original_name: req.file.originalname,
        file_path: req.file.path,
        file_size: req.file.size,
        mime_type: req.file.mimetype,
        owner_id: userId,
        created_at: currentTime,
        modified_at: currentTime,
        uploaded_at: currentTime,
        is_deleted: 0,
      };

      const fileId = await fileDb.createFile(fileData);
      const createdFile = await fileDb.getFileById(fileId);

      res.status(201).json({
        message: "File uploaded successfully",
        file: createdFile,
      });
    } catch (error) {
      console.error("Error uploading file:", error);
      // Clean up uploaded file if database operation fails
      if (req.file && fs.existsSync(req.file.path)) {
        fs.unlinkSync(req.file.path);
      }
      res.status(500).json({ error: "Failed to upload file" });
    }
  }
);

// PUT /files/:id/rename - Rename a file
router.put("/:id/rename", requireAuth, async (req: Request, res: Response) => {
  try {
    const fileId = parseInt(req.params.id);
    const { newName } = req.body;

    if (!newName || typeof newName !== "string") {
      return res.status(400).json({ error: "New filename is required" });
    }

    // Check if file exists and belongs to user
    const file = await fileDb.getFileById(fileId);
    if (!file) {
      return res.status(404).json({ error: "File not found" });
    }

    const userId = (req.user as any).id;
    if (file.owner_id !== userId) {
      return res.status(403).json({ error: "Unauthorized access to file" });
    }

    if (file.is_deleted) {
      return res.status(404).json({ error: "File not found" });
    }

    await fileDb.renameFile(fileId, newName);
    const updatedFile = await fileDb.getFileById(fileId);

    res.json({
      message: "File renamed successfully",
      file: updatedFile,
    });
  } catch (error) {
    console.error("Error renaming file:", error);
    res.status(500).json({ error: "Failed to rename file" });
  }
});

// DELETE /files/:id - Delete a file (soft delete)
router.delete("/:id", requireAuth, async (req: Request, res: Response) => {
  try {
    const fileId = parseInt(req.params.id);

    // Check if file exists and belongs to user
    const file = await fileDb.getFileById(fileId);
    if (!file) {
      return res.status(404).json({ error: "File not found" });
    }

    const userId = (req.user as any).id;
    if (file.owner_id !== userId) {
      return res.status(403).json({ error: "Unauthorized access to file" });
    }

    if (file.is_deleted) {
      return res.status(404).json({ error: "File not found" });
    }

    await fileDb.deleteFile(fileId);

    res.json({ message: "File deleted successfully" });
  } catch (error) {
    console.error("Error deleting file:", error);
    res.status(500).json({ error: "Failed to delete file" });
  }
});

// GET /files/search - Search files by name
router.get("/search", requireAuth, async (req: Request, res: Response) => {
  try {
    const { q: query } = req.query;

    if (!query || typeof query !== "string") {
      return res.status(400).json({ error: "Search query is required" });
    }

    const userId = (req.user as any).id;
    const files = await fileDb.searchFiles(query, userId);

    res.json({ files, query });
  } catch (error) {
    console.error("Error searching files:", error);
    res.status(500).json({ error: "Failed to search files" });
  }
});

// GET /files/:id/download - Download a file
router.get(
  "/:id/download",
  requireAuth,
  async (req: Request, res: Response) => {
    try {
      const fileId = parseInt(req.params.id);

      // Check if file exists and belongs to user
      const file = await fileDb.getFileById(fileId);
      if (!file) {
        return res.status(404).json({ error: "File not found" });
      }

      const userId = (req.user as any).id;
      if (file.owner_id !== userId) {
        return res.status(403).json({ error: "Unauthorized access to file" });
      }

      if (file.is_deleted) {
        return res.status(404).json({ error: "File not found" });
      }

      // Check if file exists on disk
      if (!fs.existsSync(file.file_path)) {
        return res.status(404).json({ error: "File not found on disk" });
      }

      // Set appropriate headers for file download
      res.setHeader(
        "Content-Disposition",
        `attachment; filename="${file.original_name}"`
      );
      res.setHeader("Content-Type", file.mime_type);

      // Stream the file
      const fileStream = fs.createReadStream(file.file_path);
      fileStream.pipe(res);
    } catch (error) {
      console.error("Error downloading file:", error);
      res.status(500).json({ error: "Failed to download file" });
    }
  }
);

// GET /files/:id - Get file metadata
router.get("/:id", requireAuth, async (req: Request, res: Response) => {
  try {
    const fileId = parseInt(req.params.id);

    const file = await fileDb.getFileById(fileId);
    if (!file) {
      return res.status(404).json({ error: "File not found" });
    }

    const userId = (req.user as any).id;
    if (file.owner_id !== userId) {
      return res.status(403).json({ error: "Unauthorized access to file" });
    }

    if (file.is_deleted) {
      return res.status(404).json({ error: "File not found" });
    }

    res.json({ file });
  } catch (error) {
    console.error("Error fetching file:", error);
    res.status(500).json({ error: "Failed to fetch file" });
  }
});

export default router;
