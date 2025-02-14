import { useState } from 'react';
import { CloudUpload, Trash2 } from 'lucide-react';
import { buttonVariants } from '../ui/button';
import ErrorMessage from "@/components/ui/notify-alert";

export default function GuildUploadBadge({url}: any) {
  const [selectedFile, setSelectedFile] = useState(null);
  const [notifyMessage, setNotifyMessage] = useState('');
  const [notifyType, setNotifyType] = useState('error');

  const handleFileChange = (event: any) => {
    setNotifyMessage(''); // Сбрасываем сообщение об ошибке при каждом новом выборе файла
    const file = event.target.files[0];

    // Проверяем тип файла
    if (!file.type.startsWith('image/')) {
      setNotifyMessage('Произошла ошибка при загрузке эмблемы: файл должен быть изображением');
      return;
    }

    // Проверяем размер файла (в байтах)
    const maxSize = 2 * 1024 * 1024; // 2 МБ
    if (file.size > maxSize) {
      setNotifyMessage('Произошла ошибка при загрузке эмблемы: вес файла не должен превышать 2 мб');
      return;
    }

    setSelectedFile(file);
  };

  const handleRemoveFile = () => {
    setSelectedFile(null);
    setNotifyMessage('');
  };

  const handleSubmit = (event: any) => {
    event.preventDefault();

    if (!selectedFile) {
      setNotifyMessage('Произошла ошибка при загрузке эмблемы: выберите файл');
      return;
    }

    const formData = new FormData();
    formData.append('file', selectedFile);

    fetch(`/api/v1/guilds/${url}/badge`, {
      method: 'POST',
      body: formData,
    })
      .then(response => response.json())
      .then(data => {
        if ( data.success ) {
          setNotifyMessage('Файл эмблемы успешно загружен');
          setNotifyType('success');
          setSelectedFile(null);
        } else {
          setNotifyMessage('Произошла ошибка при загрузке эмблемы: выберите файл');
          console.error(data)
        }
      })
      .catch(error => {
        setNotifyMessage('Произошла ошибка при загрузке эмблемы: выберите файл');
        console.error(error)
      });
  };

  const handleClose = () => {
    setNotifyMessage('');
  }

  return (
    <form onSubmit={handleSubmit}>
      { notifyMessage && <ErrorMessage message={notifyMessage} onClose={handleClose} type={notifyType} />}
      {selectedFile && <p className="mt-2">Выбранный файл: {selectedFile["name"]}</p>}
      <div className="flex gap-2">
        {selectedFile ? (
            <>
              <button type="submit" className={buttonVariants({ variant: 'accent' })}>
                Загрузить
              </button>
              <button
                type="button"
                className={buttonVariants({ variant: 'destructive' })}
                onClick={handleRemoveFile}
              >
                <Trash2 className="mr-2" /> Удалить
              </button>
            </>
        ) : (
          <>
            <label htmlFor="fileInput" className={buttonVariants({ variant: 'accent' })}>
              <CloudUpload className="mr-2" /> Выбрать файл
            </label>
            <input
              type="file"
              id="fileInput"
              className="hidden"
              onChange={handleFileChange}
            />
          </>
        )}
      </div>
    </form>
  );
}