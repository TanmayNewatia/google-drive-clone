import { FileIcon, MoreVertical } from "lucide-react";
import FileContextMenu from "./file-context-menu";

export interface File {
  id: string;
  name: string;
  type: "file" | "folder";
  icon: string;
  modified: string;
  size?: string;
  owner?: string;
}

export const FileCard = ({
  file,
  selectedFile,
  onFileClick,
  onFileAction,
}: {
  file: File;
  selectedFile: string | null;
  onFileClick: (id: string) => void;
  onFileAction?: (action: string, file: File) => void;
}) => {
  const handleFileAction = (action: string, fileData: File) => {
    onFileAction?.(action, fileData);
  };

  return (
    <div
      key={file.id}
      onClick={() => onFileClick(file.id)}
      className={`group cursor-pointer transition-all rounded-lg overflow-hidden ${
        selectedFile === file.id ? "ring-2 ring-[#4a90e2]" : ""
      }`}
    >
      <div className="bg-[#303134] rounded-lg p-2 h-48 flex flex-col justify-between hover:bg-[#3c4043] transition-colors gap-2">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            <FileIcon size={16} />
            <h3 className="font-medium text-white text-sm truncate">
              {file.name}
            </h3>
          </div>

          <FileContextMenu
            file={file}
            onAction={handleFileAction}
            trigger={
              <button
                className="p-2 hover:bg-[#4a5051] rounded transition-all"
                onClick={(e) => {
                  e.stopPropagation(); // Prevent triggering file selection
                }}
              >
                <MoreVertical size={20} className="text-[#9aa0a6]" />
              </button>
            }
          />
        </div>
        <div className="bg-white rounded-xl h-full w-full"></div>
      </div>
    </div>
  );
};
