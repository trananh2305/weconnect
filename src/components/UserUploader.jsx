import {
  useDeletedPhotoMutation,
  useUploadPhotoMutation,

} from "@services/userApi";
import Button from "./Button";
import { useCallback } from "react";
import { useDropzone } from "react-dropzone";

const UserUploader = ({ title, footNote, currentImage, isCover = false }) => {

  const [uploadPhoto, { isLoading: isUpdating }] = useUploadPhotoMutation();

  const [deletedPhoto, { isLoading: isDeleting }] = useDeletedPhotoMutation();

  const onDrop = useCallback((acceptedFiles) => {
    // Do something with the files
    const formData = new FormData();
    formData.append("isCover", isCover);
    formData.append("image", acceptedFiles[0]);

    uploadPhoto(formData);
  }, []);
  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    multiple: false,
    maxFiles: 1,
    accept: ".jpg,.jpeg,.png",
  });

  return (
    <div>
      <p className="mb-2 font-semibold">{title}</p>
      <div className="flex gap-4 items-center">
        <img
          src={currentImage ?? "https://placehold.co/100x100"}
          alt=""
          className="size-24 rounded object-contain"
        />
        <div>
          <div>
            <div {...getRootProps({})}>
              <input {...getInputProps()} />
              <Button variant="contained" isLoading={isUpdating}>
                Upload new photo
              </Button>
            </div>
          </div>

          <Button isLoading={isDeleting} onClick={() => deletedPhoto(isCover)}>
            Reset
          </Button>
          <p className="text-sm text-dark-400 mt-4">{footNote}</p>
        </div>
      </div>
    </div>
  );
};

export default UserUploader;
