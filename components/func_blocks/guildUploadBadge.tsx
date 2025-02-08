import { useState } from 'react';
import { CloudUpload, Trash2 } from 'lucide-react';
import { buttonVariants } from '../ui/button';

export default function GuildUploadBadge({url}: any) {
  const [selectedFile, setSelectedFile] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');

  const handleFileChange = (event: any) => {
    setErrorMessage(''); // Сбрасываем сообщение об ошибке при каждом новом выборе файла
    const file = event.target.files[0];

    // Проверяем тип файла
    if (!file.type.startsWith('image/')) {
      setErrorMessage('Файл должен быть изображением');
      return;
    }

    // Проверяем размер файла (в байтах)
    const maxSize = 2 * 1024 * 1024; // 2 МБ
    if (file.size > maxSize) {
      setErrorMessage('Размер файла не должен превышать 2 МБ');
      return;
    }

    setSelectedFile(file);
  };

  const handleRemoveFile = () => {
    setSelectedFile(null);
    setErrorMessage(''); // Сбрасываем сообщение об ошибке при удалении файла
  };

  const handleSubmit = (event: any) => {
    event.preventDefault();

    if (!selectedFile) {
      alert('Пожалуйста, выберите файл');
      return;
    }

    if (errorMessage) { // Если есть сообщение об ошибке, не отправляем форму
      alert(errorMessage);
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
        if (data.message === 'Success') {
          alert('Файл успешно загружен!');
          setSelectedFile(null);
        } else {
          alert('Ошибка загрузки файла: ' + data.message);
        }
      })
      .catch(error => {
        alert('Ошибка загрузки файла: ' + error);
      });
  };

  return (
    <form onSubmit={handleSubmit}>
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
      {errorMessage && <p className="text-red-500 mt-2">{errorMessage}</p>} {/* Выводим сообщение об ошибке */}
    </form>
  );
}