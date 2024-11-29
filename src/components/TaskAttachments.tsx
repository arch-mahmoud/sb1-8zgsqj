import React, { useRef, useMemo } from 'react';
import { useStore } from '../store/useStore';
import { Task } from '../types';
import { Upload, Trash2, FileText, Image as ImageIcon, Lock } from 'lucide-react';
import { clsx } from 'clsx';

interface Props {
  task: Task;
  canEdit: boolean;
}

export const TaskAttachments: React.FC<Props> = ({ task, canEdit }) => {
  const { addTaskAttachment, removeTaskAttachment, users, settings, tasks } = useStore();
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Get dependent tasks and their attachments
  const dependentTasksAttachments = useMemo(() => {
    if (!task.dependsOn?.length) return [];

    return task.dependsOn.flatMap(depId => {
      const depTask = tasks.find(t => t.id === depId);
      if (!depTask) return [];

      return depTask.attachments.map(att => ({
        ...att,
        taskTitle: depTask.title,
        taskId: depTask.id
      }));
    });
  }, [task.dependsOn, tasks]);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const file = files[0];
    try {
      await addTaskAttachment(task.id, file);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    } catch (error) {
      alert(error instanceof Error ? error.message : 'حدث خطأ أثناء رفع الملف');
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  const getFileIcon = (type: string) => {
    if (type.startsWith('image/')) {
      return <ImageIcon className="w-5 h-5" />;
    }
    return <FileText className="w-5 h-5" />;
  };

  const downloadAttachment = (attachment: typeof task.attachments[0]) => {
    const link = document.createElement('a');
    link.href = attachment.data;
    link.download = attachment.name;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-4">
      {canEdit && (
        <div>
          <input
            ref={fileInputRef}
            type="file"
            onChange={handleFileChange}
            className="hidden"
            accept="image/*,application/pdf,.doc,.docx,.xls,.xlsx"
          />
          <button
            onClick={() => fileInputRef.current?.click()}
            className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
          >
            <Upload className="w-4 h-4" />
            إضافة مرفق
          </button>
          <p className="mt-1 text-xs text-gray-500">
            يمكنك إرفاق ملفات بحجم أقصى {settings.maxFileSize / (1024 * 1024)} ميجابايت
          </p>
        </div>
      )}

      {/* Task Attachments */}
      {task.attachments.length > 0 && (
        <div>
          <h4 className="text-sm font-medium text-gray-900 mb-2">مرفقات المهمة</h4>
          <div className="space-y-2">
            {task.attachments.map((attachment) => {
              const uploader = users.find(u => u.id === attachment.uploadedBy);
              
              return (
                <div
                  key={attachment.id}
                  className="flex items-center justify-between p-2 rounded-lg border border-gray-200 bg-gray-50 hover:bg-gray-100 transition-colors cursor-pointer"
                  onClick={() => downloadAttachment(attachment)}
                >
                  <div className="flex items-center gap-3">
                    {getFileIcon(attachment.type)}
                    <div>
                      <p className="text-sm font-medium text-gray-900">
                        {attachment.name}
                      </p>
                      <p className="text-xs text-gray-500">
                        {formatFileSize(attachment.size)} • تم الرفع بواسطة {uploader?.name}
                      </p>
                    </div>
                  </div>
                  
                  {canEdit && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        removeTaskAttachment(task.id, attachment.id);
                      }}
                      className="text-red-600 hover:text-red-900"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Dependent Tasks Attachments */}
      {dependentTasksAttachments.length > 0 && (
        <div>
          <h4 className="text-sm font-medium text-gray-900 mb-2">مرفقات المهام المرتبطة</h4>
          <div className="space-y-2">
            {dependentTasksAttachments.map((attachment) => {
              const uploader = users.find(u => u.id === attachment.uploadedBy);
              const depTask = tasks.find(t => t.id === attachment.taskId);
              const isLocked = depTask && depTask.status !== 'completed';
              
              return (
                <div
                  key={`${attachment.taskId}-${attachment.id}`}
                  className={clsx(
                    "flex items-center justify-between p-2 rounded-lg border transition-colors",
                    isLocked
                      ? "border-amber-200 bg-amber-50 cursor-not-allowed"
                      : "border-gray-200 bg-gray-50 hover:bg-gray-100 cursor-pointer"
                  )}
                  onClick={() => !isLocked && downloadAttachment(attachment)}
                >
                  <div className="flex items-center gap-3">
                    {isLocked ? (
                      <Lock className="w-5 h-5 text-amber-500" />
                    ) : (
                      getFileIcon(attachment.type)
                    )}
                    <div>
                      <p className="text-sm font-medium text-gray-900">
                        {attachment.name}
                      </p>
                      <p className="text-xs text-gray-500">
                        {formatFileSize(attachment.size)} • تم الرفع بواسطة {uploader?.name}
                      </p>
                      <p className="text-xs text-gray-500">
                        من مهمة: {attachment.taskTitle}
                        {isLocked && " (معلق حتى اكتمال المهمة)"}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};