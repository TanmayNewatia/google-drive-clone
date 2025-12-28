import { Download } from "lucide-react";
import FileContextMenu from "./file-context-menu";
import { FileData } from "@/lib/file-api";
import { useDownloadUrl } from "@/hooks/use-file-queries";
import { formatFileSize } from "@/lib/config";
import { FileAPI } from "@/lib/file-api";

export const FileCard = ({
  file,
  selectedFile,
  onFileClick,
}: {
  file: FileData;
  selectedFile: string | null;
  onFileClick: (id: string) => void;
}) => {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const downloadUrl = useDownloadUrl(file.id);

  const handleDownload = (e: React.MouseEvent) => {
    e.stopPropagation();
    window.open(downloadUrl, "_blank");
  };

  return (
    <div
      className={`relative group cursor-pointer p-4 border border-[#3c4043] rounded-lg bg-[#2d2e30] hover:bg-[#35363a] transition-colors ${
        selectedFile === file.id.toString() ? "ring-2 ring-[#4a90e2]" : ""
      }`}
      onClick={() => onFileClick(file.id.toString())}
    >
      <div className="flex items-center justify-between mb-3">
        <div className="text-2xl">{FileAPI.getFileIcon(file.mime_type)}</div>
        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            onClick={handleDownload}
            className="p-1 hover:bg-[#4a5051] rounded transition-colors"
            title="Download"
          >
            <Download size={16} className="text-[#9aa0a6]" />
          </button>
          <FileContextMenu file={file} />
        </div>
      </div>

      <div className="space-y-1">
        <p
          className="text-[#e8eaed] text-sm font-medium truncate"
          title={file.filename}
        >
          {file.filename}
        </p>
        <div className="flex items-center justify-between text-xs text-[#9aa0a6]">
          <span>{formatDate(file.modified_at)}</span>
          <span>{formatFileSize(file.file_size)}</span>
        </div>
        <p className="text-xs text-[#9aa0a6] truncate">Owned by you</p>
      </div>
    </div>
  );
};
